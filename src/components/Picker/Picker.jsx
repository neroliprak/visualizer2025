import { useState } from "react";
import scene from "../../webgl/Scene";
import s from "./Picker.module.scss";
import ColorPicker from "../ColorPicker/ColorPicker";

// Les objets 3D
const VISUALIZERS = [
  {
    name: "Line",
    index: 0,
  },
  {
    name: "Board",
    index: 1,
  },
  {
    name: "Logo Iut",
    index: 2,
  },
  {
    name: "Cover",
    index: 3,
  },
  {
    name: "Trumpet",
    index: 4,
  },
];

const Picker = () => {
  const [current, setCurrent] = useState(4);

  // Met l'objet 3D sélectionné
  const pickVisualizer = (index) => {
    setCurrent(index);
    scene.pickVisualizer(index);
  };

  // Comportement de la couleur de l'objet trompette
  const handleColorChange = (color) => {
    if (scene.trumpet) {
      if (color === 0xff0000) {
        scene.trumpet.setColors(scene.trumpet.colorsRed);
        scene.trumpet.changeMatcap("/textures/red-matcap.png");
      } else if (color === 0x0000ff) {
        scene.trumpet.setColors(scene.trumpet.colorsBlue);
        scene.trumpet.changeMatcap("/textures/blue-matcap.png");
      } else if (color === 0xffffff) {
        scene.trumpet.setColors(scene.trumpet.colorsRainbow);
        scene.trumpet.changeMatcap("/textures/rainbow-matcap.png");
      }
    }
  };

  return (
    <>
      <div className={s.picker}>
        {VISUALIZERS.map((visualizer) => (
          <span
            key={visualizer.name}
            className={`${current === visualizer.index ? s.current : ""}`}
            onClick={() => pickVisualizer(visualizer.index)}
          >
            {visualizer.name}
          </span>
        ))}
      </div>
      {current === 4 && <ColorPicker onColorChange={handleColorChange} />}
    </>
  );
};

export default Picker;
