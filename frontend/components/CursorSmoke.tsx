"use client";

import { useEffect, useRef } from "react";

/**
 * Real-time GPU fluid/dye simulation reactive to cursor movement.
 * Pipeline per frame: splat -> curl -> vorticity -> divergence ->
 * pressure (jacobi) -> gradient subtract -> advection -> display.
 * Dye dissipates over ~2s of inactivity, so a splat trail appears
 * on movement and fades back out on its own.
 */

const BASE_VERTEX_SHADER = `#version 300 es
precision highp float;
in vec2 aPosition;
out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;
uniform vec2 texelSize;
void main () {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const CLEAR_SHADER = `#version 300 es
precision mediump float;
in vec2 vUv;
uniform sampler2D uTexture;
uniform float value;
out vec4 fragColor;
void main () { fragColor = value * texture(uTexture, vUv); }`;

const SPLAT_SHADER = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 point;
uniform float radius;
out vec4 fragColor;
void main () {
  vec2 p = vUv - point.xy;
  p.x *= aspectRatio;
  vec3 splat = exp(-dot(p, p) / radius) * color;
  vec3 base = texture(uTarget, vUv).xyz;
  fragColor = vec4(base + splat, 1.0);
}`;

const ADVECTION_SHADER = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float dissipation;
out vec4 fragColor;
void main () {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
  vec4 result = texture(uSource, coord);
  float decay = 1.0 + dissipation * dt;
  fragColor = result / decay;
}`;

const DIVERGENCE_SHADER = `#version 300 es
precision mediump float;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
uniform sampler2D uVelocity;
out vec4 fragColor;
void main () {
  float L = texture(uVelocity, vL).x;
  float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y;
  float B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) { L = -C.x; }
  if (vR.x > 1.0) { R = -C.x; }
  if (vT.y > 1.0) { T = -C.y; }
  if (vB.y < 0.0) { B = -C.y; }
  float div = 0.5 * (R - L + T - B);
  fragColor = vec4(div, 0.0, 0.0, 1.0);
}`;

const CURL_SHADER = `#version 300 es
precision mediump float;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
uniform sampler2D uVelocity;
out vec4 fragColor;
void main () {
  float L = texture(uVelocity, vL).y;
  float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x;
  float B = texture(uVelocity, vB).x;
  float vorticity = R - L - T + B;
  fragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
}`;

const VORTICITY_SHADER = `#version 300 es
precision highp float;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;
out vec4 fragColor;
void main () {
  float L = texture(uCurl, vL).x;
  float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x;
  float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;
  vec2 vel = texture(uVelocity, vUv).xy;
  fragColor = vec4(vel + force * dt, 0.0, 1.0);
}`;

const PRESSURE_SHADER = `#version 300 es
precision mediump float;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
out vec4 fragColor;
void main () {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  float divergence = texture(uDivergence, vUv).x;
  float pressure = (L + R + B + T - divergence) * 0.25;
  fragColor = vec4(pressure, 0.0, 0.0, 1.0);
}`;

const GRADIENT_SUBTRACT_SHADER = `#version 300 es
precision mediump float;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
out vec4 fragColor;
void main () {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  vec2 velocity = texture(uVelocity, vUv).xy;
  velocity -= vec2(R - L, T - B);
  fragColor = vec4(velocity, 0.0, 1.0);
}`;

const DISPLAY_SHADER = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uTexture;
out vec4 fragColor;
void main () {
  vec3 c = texture(uTexture, vUv).rgb;
  float a = clamp(max(c.r, max(c.g, c.b)), 0.0, 1.0);
  fragColor = vec4(c, a);
}`;




const CONFIG = {
  SIM_RESOLUTION: 256,
  DYE_RESOLUTION: 1024,       // Higher resolution = sharper smoke

  DENSITY_DISSIPATION: 0.8,   // Smoke stays visible longer
  VELOCITY_DISSIPATION: 0.3,

  PRESSURE: 0.8,
  PRESSURE_ITERATIONS: 30,

  CURL: 20,

  SPLAT_RADIUS: 0.30,         // Larger smoke
  SPLAT_FORCE: 3000,          // Smooth movement
};

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  let r = 0, g = 0, b = 0;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return [r, g, b];
}

export default function CursorSmoke() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) return; // no WebGL2 support: silently skip the effect

    const floatExt = gl.getExtension("EXT_color_buffer_float");
    if (!floatExt) return;
    gl.getExtension("OES_texture_float_linear");

    gl.clearColor(0, 0, 0, 0);

    let width = 0;
    let height = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas!.width = Math.floor(window.innerWidth * dpr);
      height = canvas!.height = Math.floor(window.innerHeight * dpr);
      gl!.viewport(0, 0, width, height);
    }
    resize();
    window.addEventListener("resize", resize);

    function compileShader(type: number, source: string): WebGLShader {
      const shader = gl!.createShader(type)!;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error(gl!.getShaderInfoLog(shader));
      }
      return shader;
    }

    function createProgram(fsSource: string) {
      const program = gl!.createProgram()!;
      gl!.attachShader(program, compileShader(gl!.VERTEX_SHADER, BASE_VERTEX_SHADER));
      gl!.attachShader(program, compileShader(gl!.FRAGMENT_SHADER, fsSource));
      gl!.linkProgram(program);
      if (!gl!.getProgramParameter(program, gl!.LINK_STATUS)) {
        console.error(gl!.getProgramInfoLog(program));
      }
      const uniforms: Record<string, WebGLUniformLocation | null> = {};
      const count = gl!.getProgramParameter(program, gl!.ACTIVE_UNIFORMS);
      for (let i = 0; i < count; i++) {
        const info = gl!.getActiveUniform(program, i)!;
        uniforms[info.name] = gl!.getUniformLocation(program, info.name);
      }
      return { program, uniforms };
    }

    const clearProgram = createProgram(CLEAR_SHADER);
    const splatProgram = createProgram(SPLAT_SHADER);
    const advectionProgram = createProgram(ADVECTION_SHADER);
    const divergenceProgram = createProgram(DIVERGENCE_SHADER);
    const curlProgram = createProgram(CURL_SHADER);
    const vorticityProgram = createProgram(VORTICITY_SHADER);
    const pressureProgram = createProgram(PRESSURE_SHADER);
    const gradientSubtractProgram = createProgram(GRADIENT_SUBTRACT_SHADER);
    const displayProgram = createProgram(DISPLAY_SHADER);

    // Full-screen quad
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    type FBO = {
      texture: WebGLTexture;
      fbo: WebGLFramebuffer;
      width: number;
      height: number;
      texelSizeX: number;
      texelSizeY: number;
      attach: (id: number) => number;
    };

    function createFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number): FBO {
      gl!.activeTexture(gl!.TEXTURE0);
      const texture = gl!.createTexture()!;
      gl!.bindTexture(gl!.TEXTURE_2D, texture);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, param);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, param);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

      const fbo = gl!.createFramebuffer()!;
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
      gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, texture, 0);
      gl!.viewport(0, 0, w, h);
      gl!.clear(gl!.COLOR_BUFFER_BIT);

      return {
        texture,
        fbo,
        width: w,
        height: h,
        texelSizeX: 1 / w,
        texelSizeY: 1 / h,
        attach(id: number) {
          gl!.activeTexture(gl!.TEXTURE0 + id);
          gl!.bindTexture(gl!.TEXTURE_2D, texture);
          return id;
        },
      };
    }

    function createDoubleFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
      let fbo1 = createFBO(w, h, internalFormat, format, type, param);
      let fbo2 = createFBO(w, h, internalFormat, format, type, param);
      return {
        width: w,
        height: h,
        texelSizeX: fbo1.texelSizeX,
        texelSizeY: fbo1.texelSizeY,
        get read() {
          return fbo1;
        },
        set read(v: FBO) {
          fbo1 = v;
        },
        get write() {
          return fbo2;
        },
        set write(v: FBO) {
          fbo2 = v;
        },
        swap() {
          const t = fbo1;
          fbo1 = fbo2;
          fbo2 = t;
        },
      };
    }

    function getResolution(resolution: number) {
      let aspect = width / height;
      if (aspect < 1) aspect = 1 / aspect;
      const min = Math.round(resolution);
      const max = Math.round(resolution * aspect);
      return width > height ? { width: max, height: min } : { width: min, height: max };
    }

    const simRes = getResolution(CONFIG.SIM_RESOLUTION);
    const dyeRes = getResolution(CONFIG.DYE_RESOLUTION);

    let dye = createDoubleFBO(dyeRes.width, dyeRes.height, gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT, gl.LINEAR);
    let velocity = createDoubleFBO(simRes.width, simRes.height, gl.RG16F, gl.RG, gl.HALF_FLOAT, gl.LINEAR);
    const divergence = createFBO(simRes.width, simRes.height, gl.R16F, gl.RED, gl.HALF_FLOAT, gl.NEAREST);
    const curlFBO = createFBO(simRes.width, simRes.height, gl.R16F, gl.RED, gl.HALF_FLOAT, gl.NEAREST);
    let pressure = createDoubleFBO(simRes.width, simRes.height, gl.R16F, gl.RED, gl.HALF_FLOAT, gl.NEAREST);

    function blit(target: FBO | null) {
      if (target == null) {
        gl!.viewport(0, 0, width, height);
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
      } else {
        gl!.viewport(0, 0, target.width, target.height);
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, target.fbo);
      }
      gl!.drawElements(gl!.TRIANGLES, 6, gl!.UNSIGNED_SHORT, 0);
    }

    function correctRadius(radius: number) {
      const aspect = width / height;
      return aspect > 1 ? radius * aspect : radius;
    }

    function splat(x: number, y: number, dx: number, dy: number, color: [number, number, number]) {
      gl!.useProgram(splatProgram.program);
      gl!.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
      gl!.uniform1f(splatProgram.uniforms.aspectRatio, width / height);
      gl!.uniform2f(splatProgram.uniforms.point, x, y);
      gl!.uniform3f(splatProgram.uniforms.color, dx, dy, 0);
      gl!.uniform1f(splatProgram.uniforms.radius, correctRadius(CONFIG.SPLAT_RADIUS / 100));
      blit(velocity.write);
      velocity.swap();

      gl!.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
      gl!.uniform3f(splatProgram.uniforms.color, color[0], color[1], color[2]);
      blit(dye.write);
      dye.swap();
    }

    function step(dt: number) {
      gl!.disable(gl!.BLEND);

      gl!.useProgram(curlProgram.program);
      gl!.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(curlFBO);

      gl!.useProgram(vorticityProgram.program);
      gl!.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl!.uniform1i(vorticityProgram.uniforms.uCurl, curlFBO.attach(1));
      gl!.uniform1f(vorticityProgram.uniforms.curl, CONFIG.CURL);
      gl!.uniform1f(vorticityProgram.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      gl!.useProgram(divergenceProgram.program);
      gl!.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      gl!.useProgram(clearProgram.program);
      gl!.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
      gl!.uniform1f(clearProgram.uniforms.value, CONFIG.PRESSURE);
      blit(pressure.write);
      pressure.swap();

      gl!.useProgram(pressureProgram.program);
      gl!.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < CONFIG.PRESSURE_ITERATIONS; i++) {
        gl!.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      gl!.useProgram(gradientSubtractProgram.program);
      gl!.uniform2f(gradientSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0));
      gl!.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      gl!.useProgram(advectionProgram.program);
      gl!.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl!.uniform1i(advectionProgram.uniforms.uSource, velocity.read.attach(0));
      gl!.uniform1f(advectionProgram.uniforms.dt, dt);
      gl!.uniform1f(advectionProgram.uniforms.dissipation, CONFIG.VELOCITY_DISSIPATION);
      blit(velocity.write);
      velocity.swap();

      gl!.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
      gl!.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
      gl!.uniform1f(advectionProgram.uniforms.dissipation, CONFIG.DENSITY_DISSIPATION);
      blit(dye.write);
      dye.swap();
    }

    function render() {
      gl!.blendFunc(gl!.ONE, gl!.ONE_MINUS_SRC_ALPHA);
      gl!.enable(gl!.BLEND);
      gl!.useProgram(displayProgram.program);
      gl!.uniform1i(displayProgram.uniforms.uTexture, dye.read.attach(0));
      blit(null);
    }

    let lastUpdateTime = Date.now();
    function calcDeltaTime() {
      const now = Date.now();
      let dt = (now - lastUpdateTime) / 1000;
      dt = Math.min(dt, 0.016666 * 3);
      lastUpdateTime = now;
      return dt;
    }

    let animationFrameId: number;
    function update() {
      const dt = calcDeltaTime();
      step(dt);
      render();
      animationFrameId = requestAnimationFrame(update);
    }
    animationFrameId = requestAnimationFrame(update);

    // Random ambient splats — no cursor tracking, just a soft pulse every ~2-4s
    let hue = Math.random();
    let scheduledId: ReturnType<typeof setTimeout>;

    function triggerRandomSplat() {
      const count = 3 + Math.floor(Math.random() * 3); // 1 to 3 splats at once

      for (let i = 0; i < count; i++) {
        const x = Math.random();
        const y = Math.random();
        const angle = Math.random() * Math.PI * 2;

        hue = (hue + 0.15 + Math.random() * 0.2) % 1;
        const [r, g, b] = hsvToRgb(hue, 0.85, 1);
        const intensity = 0.25;

        splat(
          x,
          y,
          Math.cos(angle) * CONFIG.SPLAT_FORCE,
          Math.sin(angle) * CONFIG.SPLAT_FORCE,
          [r * intensity, g * intensity, b * intensity]
        );
      }

      scheduledId = setTimeout(triggerRandomSplat, 2000 + Math.random() * 2000);
    }

    scheduledId = setTimeout(triggerRandomSplat, 1000 + Math.random() * 1000);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(scheduledId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fluid-canvas" aria-hidden="true" />;
}
