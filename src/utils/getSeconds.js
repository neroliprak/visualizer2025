// Retourne format de la durée - mm:ss
export const getSeconds = (duration) => {
  const minutes = Math.floor(duration / 60);
  let seconds = Math.round(duration - minutes * 60);

  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  return minutes + ":" + seconds;
};
