from typing import TypedDict


class Hairstyle(TypedDict):
    name: str
    description: str


HAIRSTYLES: dict[str, dict[str, list[Hairstyle]]] = {
    "female": {
        "Oval": [
            {"name": "Layered Lob", "description": "A long bob with layers that frame the face beautifully and add movement."},
            {"name": "Soft Waves", "description": "Loose, flowing waves that enhance natural texture and suit any occasion."},
            {"name": "Side Part", "description": "A sleek side part that creates an elegant, timeless look."},
            {"name": "Pixie Cut", "description": "A short, chic cut that highlights facial features with confidence."},
        ],
        "Round": [
            {"name": "Long Layers", "description": "Long layers that fall past the chin to elongate the face visually."},
            {"name": "Side Swept Bangs", "description": "Diagonal bangs that create the illusion of a more oval face shape."},
            {"name": "High Volume Top", "description": "Styles with volume at the crown to add height and elongate."},
            {"name": "Angular Bob", "description": "An angular cut with longer front pieces that slim the face."},
        ],
        "Square": [
            {"name": "Soft Curls", "description": "Loose curls that soften the jawline and add romantic texture."},
            {"name": "Side Part Long", "description": "Long hair with a deep side part to break the symmetry of the jaw."},
            {"name": "Textured Crop", "description": "A cropped cut with soft texture to balance strong features."},
            {"name": "Wavy Lob", "description": "A wavy long bob that adds softness to angular features."},
        ],
        "Heart": [
            {"name": "Chin Bob", "description": "A bob that ends at the chin to add width and balance the narrow chin."},
            {"name": "Soft Bangs", "description": "Light fringe that minimizes the forehead width visually."},
            {"name": "Layered Shag", "description": "A shaggy layered style with volume near the jaw for balance."},
            {"name": "Side Part Waves", "description": "Wavy hair with a side part that draws attention away from the forehead."},
        ],
        "Diamond": [
            {"name": "Full Fringe", "description": "Straight-across bangs that widen the appearance of a narrow forehead."},
            {"name": "Chin Bob", "description": "A clean bob at chin level that broadens the lower face."},
            {"name": "Textured Layers", "description": "Layers with texture that add volume around the temples."},
            {"name": "Side Swept", "description": "Hair swept to one side that widens the narrower forehead area."},
        ],
        "Oblong": [
            {"name": "Curtain Bangs", "description": "Soft bangs parted in the center that visually shorten a longer face."},
            {"name": "Shoulder Waves", "description": "Waves ending at the shoulder that add width and break the length."},
            {"name": "Blunt Bob", "description": "A straight-edged bob that creates a horizontal line to balance length."},
            {"name": "Volume Sides", "description": "Styles with side volume that make the face appear wider and shorter."},
        ],
    },
    "male": {
        "Oval": [
            {"name": "Textured Quiff", "description": "Swept-up textured front with short sides — versatile and stylish."},
            {"name": "Side Part", "description": "A classic comb-over side part that works for both casual and formal looks."},
            {"name": "Slick Back", "description": "Hair combed straight back for a sleek, polished appearance."},
            {"name": "Messy Waves", "description": "Effortless tousled waves for a relaxed, natural look."},
        ],
        "Round": [
            {"name": "Pompadour", "description": "High volume on top with tapered sides to elongate the face."},
            {"name": "Quiff", "description": "A voluminous front with short back and sides to add height."},
            {"name": "Faux Hawk", "description": "A strip of height down the center that elongates a round face."},
            {"name": "Undercut", "description": "Shaved or short sides with longer top to create vertical height."},
        ],
        "Square": [
            {"name": "Crew Cut", "description": "Short and neat with a slight taper — complements strong jawlines."},
            {"name": "Buzz Cut", "description": "Uniform short cut that lets the jaw structure shine."},
            {"name": "Textured Crop", "description": "Short crop with textured fringe that softens a strong brow."},
            {"name": "Side Part", "description": "A clean part with length on top to balance the angular jaw."},
        ],
        "Heart": [
            {"name": "Medium Length Waves", "description": "Waves that add width near the jaw to balance the wider forehead."},
            {"name": "Side Swept Fringe", "description": "Fringe swept to the side to minimize forehead width."},
            {"name": "Textured Layers", "description": "Layered texture with volume near the nape for balance."},
            {"name": "Curtain Hair", "description": "Center-parted hair that frames and balances the face naturally."},
        ],
        "Diamond": [
            {"name": "Bro Flow", "description": "Medium-length flowing hair with natural texture at the temples."},
            {"name": "Fringe Forward", "description": "Hair styled forward to add width to the narrow forehead."},
            {"name": "Textured Side Part", "description": "Textured sweep to one side that widens the forehead visually."},
            {"name": "Short Crop", "description": "A close crop with slightly longer fringe for framing the face."},
        ],
        "Oblong": [
            {"name": "Short Back & Sides", "description": "Short sides with medium top volume to reduce face length."},
            {"name": "Fringe", "description": "Forward-styled fringe that visually breaks the length of the face."},
            {"name": "Side Part Medium", "description": "Medium length with a clean part to add horizontal width."},
            {"name": "Textured Quiff", "description": "Textured quiff kept low to avoid adding extra height."},
        ],
    },
}


def get_recommendations(face_shape: str, gender: str) -> list[Hairstyle]:
    gender_key = gender.lower() if gender.lower() in HAIRSTYLES else "female"
    shape_map = HAIRSTYLES[gender_key]
    return shape_map.get(face_shape, shape_map["Oval"])
