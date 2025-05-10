import React from "react";
import useStore from "../../utils/store";
import { getSeconds } from "../../utils/getSeconds";
import s from "./TrackInfo.module.scss";

const TrackInfo = () => {
  // Récupération de la track sélectionnée du store
  const { tracks, currentTrackIndex } = useStore();

  if (currentTrackIndex === null) return null;

  // Récupérer les informations de la track actuel à partir de l'index de la track joué
  const currentTrack = tracks[currentTrackIndex];
  if (!currentTrack) return null;

  return (
    <div className={s.trackInfos}>
      <div className={s.trackInfo}>
        <div className={s.cover}>
          {currentTrack.album?.cover && (
            <img src={currentTrack.album.cover} alt="Cover album" />
          )}

          <div>
            {currentTrack.artist?.picture && (
              <div className={s.artist}>
                <img
                  src={currentTrack.artist.picture}
                  alt="Artiste"
                  className="imgPicture"
                />
                <p>{currentTrack.artist.name}</p>
              </div>
            )}

            {currentTrack.title && <h2>{currentTrack.title}</h2>}

            {currentTrack.album?.title && (
              <p>Album : {currentTrack.album.title}</p>
            )}
          </div>
        </div>

        {currentTrack.rank && <p>Classement : {currentTrack.rank}</p>}
        {currentTrack.duration && (
          <p>Durée : {getSeconds(currentTrack.duration)}</p>
        )}
        {currentTrack.link && (
          <p>
            <a href={currentTrack.link} target="_blank" rel="noreferrer">
              Sur Deezer
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default TrackInfo;
