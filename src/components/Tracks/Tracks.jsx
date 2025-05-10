import { useEffect, useState } from "react";
import Track from "../Track/Track";
import useStore from "../../utils/store";
import { fetchMetadata } from "../../utils/utils";
import TRACKS from "../../utils/TRACKS";
import fetchJsonp from "fetch-jsonp";
import s from "./Tracks.module.scss";
import audioController from "../../utils/AudioController";

const Tracks = () => {
  const [showTracks, setShowTracks] = useState(false);
  const { tracks, setTracks } = useStore();
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(null);
  const [hoveredTrackIndex, setHoveredTrackIndex] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  // Détecte les flèches du haut et bas pour se déplacer dans la tracklsit (précédent / suivant)
  useEffect(() => {
    const handleArrowKeys = (e) => {
      if (e.key === "ArrowDown") {
        setHoveredTrackIndex((prevIndex) => {
          const nextIndex =
            prevIndex === null ? 0 : Math.min(tracks.length - 1, prevIndex + 1);
          return nextIndex;
        });
      } else if (e.key === "ArrowUp") {
        setHoveredTrackIndex((prevIndex) => {
          const prevIndexUpdated =
            prevIndex === null ? 0 : Math.max(0, prevIndex - 1);
          return prevIndexUpdated;
        });
      }
    };

    window.addEventListener("keydown", handleArrowKeys);

    return () => {
      window.removeEventListener("keydown", handleArrowKeys);
    };
  }, [tracks]);

  // Détercte la touche entrée et sélectionne la track sélectionné par les flèches
  useEffect(() => {
    const handleEnterKey = (e) => {
      if (e.key === "Enter" && hoveredTrackIndex !== null) {
        const selectedTrack = tracks[hoveredTrackIndex];
        setSelectedTrackIndex(hoveredTrackIndex);

        audioController.stop();

        selectedTrack.onClick();
      }
    };

    window.addEventListener("keydown", handleEnterKey);

    return () => {
      window.removeEventListener("keydown", handleEnterKey);
    };
  }, [hoveredTrackIndex, tracks]);

  useEffect(() => {
    fetchMetadata(TRACKS, tracks, setTracks);
  }, []);

  // Saisie de recherche des artistes pour API deezer
  const onKeyDown = (e) => {
    if (e.keyCode === 13 && e.target.value !== "") {
      const userInput = e.target.value;
      getSongs(userInput);
    }
  };

  const getSongs = async (userInput) => {
    let response = await fetchJsonp(
      `https://api.deezer.com/search?q=${userInput}&output=jsonp`
    );
    if (response.ok) {
      response = await response.json();
      const _tracks = [...tracks];

      // Ajouter la source dans la data pour différencier les track deezer aux locales
      response.data.forEach((result) => {
        result.source = "deezer";
        _tracks.push(result);
      });
      setTracks(_tracks);
    }
  };

  // Ouverture de la tracklist avec "TAB"
  const handleTabKey = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      setShowTracks((prevShowTracks) => !prevShowTracks);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleTabKey);
    return () => {
      window.removeEventListener("keydown", handleTabKey);
    };
  }, []);

  // Réinitialise la recherche et vide tous les musiques deezer de la track
  const resetSearch = () => {
    setSearchInput("");
    const nonDeezerTracks = tracks.filter((track) => track.source !== "deezer");
    setTracks(nonDeezerTracks);
  };

  return (
    <>
      <div
        className={s.toggleTracks}
        onClick={() => setShowTracks(!showTracks)}
      >
        <img src="/images/align-justify.svg" alt="Toggle" className={s.icon} />
        <span>Tracklist</span>
      </div>

      <section
        className={`${s.wrapper} ${showTracks ? s.wrapper_visible : ""}`}
      >
        <div className={s.tracks}>
          <div className={s.header}>
            <span className={s.order}>#</span>
            <span className={s.title}>Titre</span>
            <span className={s.duration}>Durée</span>
          </div>

          {tracks.map((track, i) => (
            <Track
              key={track.title + i}
              title={track.title}
              duration={track.duration}
              cover={track.album.cover_xl}
              src={track.preview}
              index={i}
              isSelected={selectedTrackIndex === i}
              isHovered={hoveredTrackIndex === i}
              onClick={() => setSelectedTrackIndex(i)}
            />
          ))}
        </div>

        <div className={s.search}>
          <input
            type="text"
            placeholder="Chercher un artiste"
            className={s.searchInput}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <button className={s.resetBtn} onClick={resetSearch}>
            Réinitialiser
          </button>
        </div>
      </section>
    </>
  );
};

export default Tracks;
