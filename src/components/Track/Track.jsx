import { useEffect } from "react";
import audioController from "../../utils/AudioController";
import scene from "../../webgl/Scene";
import s from "./Track.module.scss";
import useStore from "../../utils/store"; // Importer useStore pour accéder au store
import { getSeconds } from "../../utils/getSeconds";

// Une track de musique au sein de la tracklist
const Track = ({
  title,
  cover,
  src,
  duration,
  index,
  isSelected,
  isHovered,
  onClick,
}) => {
  const { setCurrentSrc, setCurrentTrackIndex } = useStore(); // Ajouter setCurrentTrackIndex ici

  // Lance la track cliqué "click souris"
  const handleClick = () => {
    audioController.stop();
    audioController.play(src);
    scene.cover.setCover(cover);
    setCurrentSrc(src); // Met à jour la source audio
    setCurrentTrackIndex(index); // Met à jour l'index de la piste courante
    onClick();
  };

  // Lance la track cliqué "ENTER"
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && (isSelected || isHovered)) {
      e.preventDefault();
      handleClick();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isSelected, isHovered]);

  return (
    <div
      className={`${s.track} 
                  ${isSelected ? s.selected : ""} 
                  ${isHovered ? s.hovered : ""}`}
      onClick={handleClick}
      tabIndex={0}
    >
      <span className={s.order}>{index + 1}</span>
      <div className={s.title}>
        <img src={cover} alt="" className={s.cover} />
        <div className={s.details}>
          <span className={s.trackName}>{title}</span>
        </div>
      </div>
      <span className={s.duration}>{getSeconds(duration)}</span>
    </div>
  );
};

export default Track;
