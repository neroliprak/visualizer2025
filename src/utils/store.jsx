import { create } from "zustand";

const useStore = create((set) => ({
  currentSrc: null,
  currentTrackIndex: null,
  tracks: [],
  setTracks: (_tracks) => set(() => ({ tracks: _tracks })),

  currentSrc: null,
  setCurrentSrc: (src) => set(() => ({ currentSrc: src })),

  isPlaying: true,
  setIsPlaying: (value) => set({ isPlaying: value }),

  currentTrackIndex: null,
  setCurrentTrackIndex: (index) => set(() => ({ currentTrackIndex: index })),

  likedTracks: JSON.parse(localStorage.getItem("likedTracks")) || [],
  setTracks: (_tracks) => set(() => ({ tracks: _tracks })),
  setLikedTracks: (likedTracks) =>
    set(() => {
      localStorage.setItem("likedTracks", JSON.stringify(likedTracks));
      return { likedTracks };
    }),
}));

export default useStore;
