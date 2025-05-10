import gsap from "gsap";
import detect from "bpm-detective";

class AudioController {
  constructor() {
    this.isPlaying = false;
    this.audio = null;
    this.currentTime = 0;
    this.loop = false;
  }

  setup() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.audio = new Audio();
    this.audio.crossOrigin = "anonymous";
    this.bpm = null;

    this.audio.volume = 0.1;

    this.audioSource = this.ctx.createMediaElementSource(this.audio);
    this.analyserNode = new AnalyserNode(this.ctx, {
      fftSize: 1024,
      smoothingTimeConstant: 0.8,
    });
    this.fdata = new Uint8Array(this.analyserNode.frequencyBinCount);

    this.audioSource.connect(this.analyserNode);
    this.audioSource.connect(this.ctx.destination);

    gsap.ticker.add(this.tick);

    this.audio.addEventListener("loadeddata", async () => {
      await this.detectBPM();
    });
  }

  detectBPM = async () => {
    const offlineCtx = new OfflineAudioContext(
      1,
      this.audio.duration * this.ctx.sampleRate,
      this.ctx.sampleRate
    );
    const response = await fetch(this.audio.src);
    const buffer = await response.arrayBuffer();
    const audioBuffer = await offlineCtx.decodeAudioData(buffer);
    this.bpm = detect(audioBuffer);
    console.log(`Detected BPM: ${this.bpm}`);
  };

  // Joue l'audio et vérifie si même audio - reprends la position de l'audio (pause) actuel et démarre la lecture
  play = (src) => {
    if (this.audio.src === src && !this.isPlaying) {
      this.audio.currentTime = this.currentTime;
      this.audio.play();
      this.isPlaying = true;
      return;
    }
    // Pas même audio - réinitialise la lecture de l'audio et démarre la lecture
    if (this.audio.src !== src) {
      this.currentTime = 0;
      this.audio.src = src;
      this.audio.onloadedmetadata = () => {
        this.audio.currentTime = this.currentTime;
        this.audio.play();
        this.isPlaying = true;
      };
    }
  };

  // Lecture en boucle
  setLoop = (shouldLoop) => {
    this.loop = shouldLoop;
    if (this.audio) {
      this.audio.loop = shouldLoop;
    }
  };

  // Avance la lecture de ...
  seekForward = (seconds) => {
    if (this.audio) {
      const newTime = this.audio.currentTime + seconds;
      this.audio.currentTime = Math.min(newTime, this.audio.duration);
      this.currentTime = this.audio.currentTime;
    }
  };

  // recule la lecture de ...
  seekBackward = (seconds) => {
    if (this.audio) {
      const newTime = this.audio.currentTime - seconds;
      this.audio.currentTime = Math.max(newTime, 0);
      this.currentTime = this.audio.currentTime;
    }
  };

  // Volume de l'audio
  setVolume = (value) => {
    if (this.audio) {
      this.audio.volume = value;
    }
  };

  // Temps précis pour lire l'audio (navigation libre de l'audio)
  seekTo = (time) => {
    if (this.audio) {
      this.audio.currentTime = Math.min(Math.max(0, time), this.audio.duration);
      this.currentTime = this.audio.currentTime;
    }
  };

  // Arrête la lecture
  stop = () => {
    if (!this.audio.paused) {
      this.currentTime = this.audio.currentTime;
      this.audio.pause();
      this.isPlaying = false;
    }
  };

  // Pause la lecture
  resume = () => {
    if (!this.isPlaying) {
      this.audio.play();
      this.isPlaying = true;
    }
  };

  // met à jour chaque tick (fréquence audio - obj 3D)
  tick = () => {
    this.analyserNode.getByteFrequencyData(this.fdata);
  };
}

const audioController = new AudioController();
export default audioController;
