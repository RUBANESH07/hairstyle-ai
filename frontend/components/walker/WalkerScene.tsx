"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { RUN_END, styleAt } from "./styles";

/* ───────────────────────── helpers ───────────────────────── */
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);

/* ─────────── Hair (procedural placeholders, head-local units) ───────────
   Head sphere radius 1, scaled by HEAD_SCALE. Swap any of these for a
   useGLTF("/models/x.glb") scene later; <HairGroup/> animates any child. */
const HEAD_SCALE: [number, number, number] = [0.84, 1.05, 0.92];
const grown = (g: number): [number, number, number] => [HEAD_SCALE[0] * g, HEAD_SCALE[1] * g, HEAD_SCALE[2] * g];

function useHairMaterial(color: string) {
  return useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.45,
        sheen: 1,
        sheenColor: new THREE.Color("#D4AF37"),
        sheenRoughness: 0.4,
        clearcoat: 0.2,
        transparent: true,
        side: THREE.DoubleSide,
      }),
    [color]
  );
}

function Cap({ mat, length = 1.5, grow = 1.07, tilt = -0.38 }: { mat: THREE.Material; length?: number; grow?: number; tilt?: number }) {
  return (
    <mesh material={mat} scale={grown(grow)} rotation={[tilt, 0, 0]}>
      <sphereGeometry args={[1, 48, 32, 0, Math.PI * 2, 0, length]} />
    </mesh>
  );
}

function QuiffHair({ mat }: { mat: THREE.Material }) {
  const spikes = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => {
        const a = (i / 26) * Math.PI * 2;
        const r = 0.35 + ((i * 37) % 10) / 40;
        return { x: Math.cos(a) * r * 0.8, z: Math.sin(a) * r * 0.8 - 0.05, tilt: Math.cos(a) * 0.5, s: 0.8 + ((i * 53) % 10) / 25 };
      }),
    []
  );
  return (
    <group>
      <Cap mat={mat} length={1.45} grow={1.08} tilt={-0.45} />
      <mesh material={mat} position={[0, 1.0, 0.45]} rotation={[0.7, 0, 0]} scale={[0.62, 0.3, 0.5]}>
        <sphereGeometry args={[1, 32, 24]} />
      </mesh>
      {spikes.map((s, i) => (
        <mesh key={i} material={mat} position={[s.x, 1.02 + s.s * 0.1, s.z]} rotation={[0.3, 0, -s.tilt]} scale={s.s}>
          <coneGeometry args={[0.1, 0.38, 6]} />
        </mesh>
      ))}
    </group>
  );
}

function SidePartHair({ mat }: { mat: THREE.Material }) {
  return (
    <group>
      <Cap mat={mat} length={1.5} grow={1.08} tilt={-0.4} />
      <mesh material={mat} position={[-0.12, 0.98, 0.15]} rotation={[0.25, 0, 0.12]} scale={[0.78, 0.26, 0.85]}>
        <sphereGeometry args={[1, 32, 24]} />
      </mesh>
      {/* parting line */}
      <mesh position={[0.3, 1.1, 0.1]} rotation={[0.35, 0, 0.1]} scale={[0.025, 0.02, 0.8]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.5} />
      </mesh>
    </group>
  );
}

function CurlyHair({ mat }: { mat: THREE.Material }) {
  const curls = useMemo(() => {
    const out: { p: THREE.Vector3; r: number }[] = [];
    const N = 180;
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 1.1; // top cap only
      const rad = Math.sqrt(Math.max(0, 1 - y * y));
      const a = i * 2.399963;
      const x = Math.cos(a) * rad;
      const z = Math.sin(a) * rad;
      if (z > 0.3 && y < 0.8) continue; // keep forehead clear
      out.push({
        p: new THREE.Vector3(x * 0.84 * 1.12, y * 1.05 * 1.1 - 0.02, z * 0.92 * 1.12),
        r: 0.17 + ((i * 29) % 7) / 80,
      });
    }
    return out;
  }, []);
  return (
    <group>
      <Cap mat={mat} length={1.35} grow={1.06} tilt={-0.4} />
      {curls.map((c, i) => (
        <mesh key={i} material={mat} position={c.p} scale={c.r / 0.17}>
          <icosahedronGeometry args={[0.17, 1]} />
        </mesh>
      ))}
    </group>
  );
}

/* Fades + scales one hairstyle in/out */
function HairGroup({ active, color, children }: { active: boolean; color: string; children: (mat: THREE.Material) => React.ReactNode }) {
  const mat = useHairMaterial(color);
  const group = useRef<THREE.Group>(null);
  const w = useRef(0);
  useFrame((_, dt) => {
    w.current += ((active ? 1 : 0) - w.current) * Math.min(1, dt * 7);
    const e = smooth(clamp(w.current));
    if (group.current) {
      group.current.visible = w.current > 0.01;
      group.current.scale.setScalar(0.6 + 0.4 * e);
    }
    mat.opacity = e;
  });
  return <group ref={group}>{children(mat)}</group>;
}

/* ───────────────────────── the man ───────────────────────── */
const SKIN = "#d9a58b";

function Limb({ len, r, color, children, flip = false }: { len: number; r: number; color: string; children?: React.ReactNode; flip?: boolean }) {
  return (
    <group>
      <mesh position={[0, -len / 2, 0]} scale={[1, 1, flip ? 1 : 1]}>
        <capsuleGeometry args={[r, len - r * 1.6, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {children}
    </group>
  );
}

type Refs = Record<string, THREE.Group | null>;

function Man({ progress }: { progress: MutableRefObject<number> }) {
  const refs = useRef<Refs>({});
  const set = (k: string) => (g: THREE.Group | null) => { refs.current[k] = g; };
  const [idx, setIdx] = useState(0);
  const lastIdx = useRef(0);
  const skin = useMemo(() => new THREE.MeshStandardMaterial({ color: SKIN, roughness: 0.7 }), []);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: "#1b1b1b", roughness: 0.4 }), []);

  useFrame(({ camera, size }) => {
    const p = progress.current;
    const r = refs.current;

    /* hairstyle changes while he runs; final style stays for the close-up */
    const i = styleAt(p);
    if (i !== lastIdx.current) { lastIdx.current = i; setIdx(i); }

    /* travel */
    const t = clamp(p / RUN_END);
    const ez = 1 - Math.pow(1 - t, 1.5);
    const z = lerp(-20, 1.0, ez);
    const moving = smooth(clamp((RUN_END - p) / 0.05));
    const phase = z * 3.6;

    const root = r.root;
    if (root) {
      root.position.z = z;
      root.position.y = Math.abs(Math.sin(phase)) * 0.07 * moving;
      root.rotation.x = 0.14 * moving;
    }

    const A = 0.95 * moving; // stride amplitude
    const swing = (ph: number) => Math.sin(ph);
    const kneeBend = (ph: number) => (0.55 + 0.55 * Math.sin(ph + 1.2)) * moving;
    if (r.lHip) r.lHip.rotation.x = -swing(phase) * A;
    if (r.rHip) r.rHip.rotation.x = -swing(phase + Math.PI) * A;
    if (r.lKnee) r.lKnee.rotation.x = kneeBend(phase);
    if (r.rKnee) r.rKnee.rotation.x = kneeBend(phase + Math.PI);
    if (r.lSh) r.lSh.rotation.x = swing(phase) * A * 0.9;
    if (r.rSh) r.rSh.rotation.x = swing(phase + Math.PI) * A * 0.9;
    if (r.lEl) r.lEl.rotation.x = -(0.25 + 0.95 * moving);
    if (r.rEl) r.rEl.rotation.x = -(0.25 + 0.95 * moving);

    /* close-up: head turns left, right, back to front so the hair is seen all round */
    const f = smooth(clamp((p - RUN_END) / (1 - RUN_END)));
    if (r.head) {
      const u = clamp((p - RUN_END - 0.04) / (1 - RUN_END - 0.04));
      r.head.rotation.y = Math.sin(u * Math.PI * 2) * 0.55 * (1 - Math.pow(u, 6));
    }

    /* camera: wide tracking shot → dolly to the face */
    const wide = size.width / size.height > 1.2;
    const camZ = lerp(5.6, 1.95, f);
    const camY = lerp(1.35, 1.64, f);
    const lookY = lerp(1.0, 1.62, f);
    const dist = camZ - 1.0;
    const shift = wide ? lerp(0.22, 0.1, f) * dist : 0;
    camera.position.set(-shift, camY, camZ);
    camera.lookAt(-shift, lookY, camZ - 5);
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = lerp(34, 27, f);
    cam.updateProjectionMatrix();
  });

  const top = "#ececec";
  const pants = "#4a4a4a";

  return (
    <group ref={set("root")}>
      {/* hips */}
      <group position={[0, 0.95, 0]}>
        <mesh>
          <boxGeometry args={[0.34, 0.16, 0.2]} />
          <meshStandardMaterial color={pants} roughness={0.8} />
        </mesh>
        {/* belt (gold) */}
        <mesh position={[0, 0.09, 0]}>
          <boxGeometry args={[0.35, 0.03, 0.21]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.7} roughness={0.3} />
        </mesh>

        {([-1, 1] as const).map((s) => (
          <group key={s} ref={set(s === -1 ? "lHip" : "rHip")} position={[s * 0.09, -0.02, 0]}>
            <Limb len={0.46} r={0.075} color={pants}>
              <group ref={set(s === -1 ? "lKnee" : "rKnee")} position={[0, -0.44, 0]}>
                <Limb len={0.46} r={0.062} color={pants}>
                  {/* sneaker */}
                  <mesh position={[0, -0.47, 0.06]}>
                    <boxGeometry args={[0.11, 0.07, 0.26]} />
                    <meshStandardMaterial color="#f5f5f5" roughness={0.5} />
                  </mesh>
                  <mesh position={[0, -0.51, 0.06]}>
                    <boxGeometry args={[0.115, 0.025, 0.27]} />
                    <meshStandardMaterial color="#D4AF37" metalness={0.6} roughness={0.35} />
                  </mesh>
                </Limb>
              </group>
            </Limb>
          </group>
        ))}
      </group>

      {/* torso */}
      <group position={[0, 1.2, 0]}>
        <mesh scale={[1, 1, 0.62]}>
          <capsuleGeometry args={[0.18, 0.3, 8, 24]} />
          <meshStandardMaterial color={top} roughness={0.75} />
        </mesh>
        {/* gold chest stripe */}
        <mesh position={[0, 0.02, 0.113]} scale={[1, 1, 1]}>
          <boxGeometry args={[0.28, 0.02, 0.01]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.6} roughness={0.35} />
        </mesh>

        {([-1, 1] as const).map((s) => (
          <group key={s} ref={set(s === -1 ? "lSh" : "rSh")} position={[s * 0.235, 0.2, 0]}>
            <Limb len={0.32} r={0.055} color={top}>
              <group ref={set(s === -1 ? "lEl" : "rEl")} position={[0, -0.3, 0]}>
                <Limb len={0.3} r={0.045} color={SKIN}>
                  <mesh position={[0, -0.3, 0]} material={skin}>
                    <sphereGeometry args={[0.05, 16, 16]} />
                  </mesh>
                </Limb>
              </group>
            </Limb>
          </group>
        ))}

        {/* neck */}
        <mesh position={[0, 0.34, 0]} material={skin}>
          <cylinderGeometry args={[0.055, 0.065, 0.14, 20]} />
        </mesh>
      </group>

      {/* head + hair */}
      <group ref={set("head")} position={[0, 1.6, 0]} scale={0.118}>
        <mesh material={skin} scale={HEAD_SCALE}>
          <sphereGeometry args={[1, 64, 48]} />
        </mesh>
        {[-1, 1].map((s) => (
          <group key={s}>
            <mesh material={dark} position={[s * 0.3, 0.12, 0.84]} scale={[1, 0.7, 0.6]}>
              <sphereGeometry args={[0.075, 16, 16]} />
            </mesh>
            <mesh material={dark} position={[s * 0.3, 0.3, 0.84]} rotation={[0, 0, s * -0.12]} scale={[1.7, 0.35, 0.5]}>
              <boxGeometry args={[0.16, 0.06, 0.06]} />
            </mesh>
            <mesh material={skin} position={[s * 0.84, -0.02, 0]} scale={[0.5, 1, 0.8]}>
              <sphereGeometry args={[0.17, 16, 16]} />
            </mesh>
          </group>
        ))}
        <mesh material={skin} position={[0, -0.12, 0.94]} scale={[0.7, 1, 1]}>
          <coneGeometry args={[0.1, 0.32, 16]} />
        </mesh>
        <mesh material={dark} position={[0, -0.5, 0.86]} scale={[1.7, 0.45, 0.6]}>
          <sphereGeometry args={[0.08, 16, 12]} />
        </mesh>

        <HairGroup active={idx === 0} color="#3b2416">{(m) => <QuiffHair mat={m} />}</HairGroup>
        <HairGroup active={idx === 1} color="#161616">{(m) => <SidePartHair mat={m} />}</HairGroup>
        <HairGroup active={idx === 2} color="#7a4b24">{(m) => <CurlyHair mat={m} />}</HairGroup>
      </group>
    </group>
  );
}

/* Gold-edged runway */
function Runway() {
  const dashes = useMemo(() => Array.from({ length: 24 }, (_, i) => -i * 2.2 + 2), []);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -18]}>
        <planeGeometry args={[3.2, 46]} />
        <meshStandardMaterial color="#060606" roughness={1} metalness={0} />
      </mesh>
      {[-1.6, 1.6].map((x) => (
        <mesh key={x} position={[x, 0.006, -18]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.05, 46]} />
          <meshStandardMaterial color="#D4AF37" emissive="#D4AF37" emissiveIntensity={0.9} />
        </mesh>
      ))}
      {dashes.map((z) => (
        <mesh key={z} position={[0, 0.006, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.04, 0.8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.35} />
        </mesh>
      ))}
    </group>
  );
}

export default function WalkerScene({ progress }: { progress: MutableRefObject<number> }) {
  const [visible, setVisible] = useState(true);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} style={{ width: "100%", height: "100%" }}>
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 2]}
        camera={{ position: [0, 1.35, 5.6], fov: 34, near: 0.05, far: 80 }}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#0A0A0A"]} />
        <fog attach="fog" args={["#0A0A0A", 8, 30]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[2.5, 5, 6]} angle={0.55} penumbra={0.8} intensity={90} color="#fff7e6" />
        <directionalLight position={[-3, 3, -4]} intensity={2.4} color="#D4AF37" />
        <pointLight position={[0, 1.6, 3.5]} intensity={4} color="#ffffff" />
        <Suspense fallback={null}>
          <Runway />
          <Man progress={progress} />
          <Environment preset="studio" environmentIntensity={0.25} />
        </Suspense>
      </Canvas>
    </div>
  );
}
