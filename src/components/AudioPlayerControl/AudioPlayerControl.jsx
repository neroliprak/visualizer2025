import { useRef, useEffect, useState } from "react";
import s from "./AudioPlayerControler.module.scss";
import useStore from "../../utils/store";
import audioController from "../../utils/AudioController";
import { getSeconds } from "../../utils/getSeconds";

// Contrôle du lecteur globale de l'audio
const AudioPlayerControl = () => {
  // Récup des différents états de la track
  const {
    isPlaying,
    setIsPlaying,
    currentSrc,
    setCurrentSrc,
    tracks,
    currentTrackIndex,
    setCurrentTrackIndex,
  } = useStore();

  const audioRef = useRef(null);
  const [volume, setVolume] = useState(0.1);
  const [isLooping, setIsLooping] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Jouer une track à partir d'un index
  const playTrackAtIndex = (index) => {
    const track = tracks[index];
    if (!track) return;

    audioController.stop();
    audioController.play(track.preview);
    setCurrentSrc(track.preview);
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  // Jouer la track précédente
  const playPrevious = () => {
    if (currentTrackIndex > 0) {
      playTrackAtIndex(currentTrackIndex - 1);
    }
  };

  // Jouer la track suivante
  const playNext = () => {
    if (currentTrackIndex < tracks.length - 1) {
      playTrackAtIndex(currentTrackIndex + 1);
    }
  };

  // Formater le temps sous forme de mm:ss
  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Play / Pause
  const togglePlayPause = () => {
    if (!currentSrc) return;

    if (isPlaying) {
      audioController.stop();
      setIsPlaying(false);
    } else {
      audioController.resume();
      setIsPlaying(true);
    }
  };

  // Changement et ajustement du volume
  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    audioController.setVolume(value);
  };

  // Répéter la track
  const toggleLoop = () => {
    const newLoop = !isLooping;
    setIsLooping(newLoop);
    audioController.setLoop(newLoop);
  };

  // Lecture audio si track sélectionné
  useEffect(() => {
    if (currentSrc) {
      audioController.play(currentSrc);
      setIsPlaying(true);
    }
  }, [currentSrc]);

  // Mise à jour de la durée + temps actuel
  useEffect(() => {
    const audio = audioController.audio;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    if (audio) {
      audio.addEventListener("timeupdate", updateTime);
      audio.addEventListener("loadedmetadata", updateDuration);
    }

    // clean
    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", updateTime);
        audio.removeEventListener("loadedmetadata", updateDuration);
      }
    };
  }, []);

  return (
    <div className={s.audio}>
      <audio ref={audioRef} />
      <div>
        <div className={s.controls}>
          <div className={s.volumeControl}>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
          <div className={s.buttonGroup}>
            <button
              onClick={toggleLoop}
              className={isLooping ? s.active : "noactive"}
            >
              <img src="/images/repeat.svg" alt="Suivant" className={s.icon} />
            </button>
            <button onClick={playPrevious} className={s.buttonCircle}>
              <img
                src="/images/arrow-left-circle.svg"
                alt="Précédent"
                className={s.icon}
              />
            </button>
            <button onClick={() => audioController.seekBackward(5)}>
              <img
                src="/images/chevrons-left.svg"
                alt="Précédent"
                className={s.icon}
              />
            </button>
            <button onClick={togglePlayPause}>
              {isPlaying ? (
                <img src="/images/pause.svg" alt="Pause" className={s.icon} />
              ) : (
                <img src="/images/play.svg" alt="Play" className={s.icon} />
              )}
            </button>
            <button onClick={() => audioController.seekForward(5)}>
              <img
                src="/images/chevrons-right.svg"
                alt="Suivant"
                className={s.icon}
              />
            </button>
            <button onClick={playNext} className={s.buttonCircle}>
              <img
                src="/images/arrow-right-circle.svg"
                alt="Suivant"
                className={s.icon}
              />
            </button>
          </div>
        </div>
      </div>

      <div className={s.inputRange}>
        <div className={s.timeDisplay}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={currentTime}
          onChange={(e) => {
            const time = parseFloat(e.target.value);
            audioController.seekTo(time);
            setCurrentTime(time);
          }}
        />
      </div>
    </div>
  );
};

export default AudioPlayerControl;
