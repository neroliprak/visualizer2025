import Canvas from "./components/Canvas/Canvas";
import Landing from "./components/Landing/Landing";
import Dropzone from "./components/Dropzone/Dropzone";
import Tracks from "./components/Tracks/Tracks";
import Picker from "./components/Picker/Picker";
import useStore from "./utils/store";
import AudioPlayerControl from "./components/AudioPlayerControl/AudioPlayerControl";
import TrackInfo from "./components/TrackInfo/TrackInfo";

function App() {
  const { currentSrc } = useStore();

  return (
    <>
      {/* Affiche les contrôles audio si une track est lancée */}
      {currentSrc && <AudioPlayerControl />}
      <TrackInfo />

      <Landing />
      <Dropzone />
      <Picker />
      <Tracks />
      <Canvas />
    </>
  );
}

export default App;
