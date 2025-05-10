import React, { useState, useEffect } from "react";
import s from "./ColorPicker.module.scss";

const ColorPicker = ({ onColorChange }) => {
  const [activeButton, setActiveButton] = useState(null);
  const [hoverButton, setHoverButton] = useState(null);

  const changeColor = (color, button) => {
    onColorChange(color);
    setActiveButton(button);
  };

  const handleMouseEnter = (button) => {
    setHoverButton(button);
  };

  const handleMouseLeave = () => {
    setHoverButton(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key.toLowerCase()) {
        case "k":
          changeColor(0xff0000, "rouge"); // Rouge
          break;
        case "l":
          changeColor(0x0000ff, "bleu"); // Bleu
          break;
        case "m":
          changeColor(0xffffff, "rainbow"); // Rainbow (blanc)
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={s.colorPicker}>
      <div>
        <button
          style={{
            backgroundColor:
              activeButton === "rouge"
                ? "#FF4F4F"
                : hoverButton === "rouge"
                ? "#FF9999"
                : "transparent",
            color: "white",
          }}
          onClick={() => changeColor(0xff0000, "rouge")}
          onMouseEnter={() => handleMouseEnter("rouge")}
          onMouseLeave={handleMouseLeave}
        >
          Rouge
        </button>
        <button
          style={{
            backgroundColor:
              activeButton === "bleu"
                ? "#4F81FF"
                : hoverButton === "bleu"
                ? "#A3C8FF"
                : "transparent",
            color: "white",
          }}
          onClick={() => changeColor(0x0000ff, "bleu")}
          onMouseEnter={() => handleMouseEnter("bleu")}
          onMouseLeave={handleMouseLeave}
        >
          Bleu
        </button>
        <button
          style={{
            backgroundColor:
              activeButton === "rainbow"
                ? "#c5c5c5"
                : hoverButton === "rainbow"
                ? "#e0e0e0"
                : "transparent",
            color: "white",
          }}
          onClick={() => changeColor(0xffffff, "rainbow")}
          onMouseEnter={() => handleMouseEnter("rainbow")}
          onMouseLeave={handleMouseLeave}
        >
          Rainbow
        </button>
      </div>
      <p>Appuyez sur K / L / M pour changer la couleur</p>
    </div>
  );
};

export default ColorPicker;
