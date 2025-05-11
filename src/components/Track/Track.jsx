import { useEffect, useState } from "react";
import audioController from "../../utils/AudioController";
import scene from "../../webgl/Scene";
import s from "./Track.module.scss";
import useStore from "../../utils/store";
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
  const { setCurrentSrc, setCurrentTrackIndex, likedTracks, setLikedTracks } =
    useStore();

  // Regarde les morceau liké (src)
  const isLiked = likedTracks.find((likedTrack) => likedTrack.src === src);

  // Like / Pas like
  const toggleLike = () => {
    let updatedLikes;
    if (isLiked) {
      updatedLikes = likedTracks.filter((likedTrack) => likedTrack.src !== src);
    } else {
      updatedLikes = [...likedTracks, { title, cover, src, duration }];
    }
    setLikedTracks(updatedLikes);
  };

  // Lance la track cliqué "click souris"
  const handleClick = () => {
    audioController.stop();
    audioController.play(src);
    scene.cover.setCover(cover);
    setCurrentSrc(src);
    setCurrentTrackIndex(index);
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
      <button
        className={`${s.likeButton} ${isLiked ? s.liked : ""}`}
        onClick={toggleLike}
      >
        <img src="/images/heart.svg" alt="Like" />
      </button>
    </div>
  );
};

export default Track;
