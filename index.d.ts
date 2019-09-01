declare class AudioVisualization {
  url: string;
  loop: boolean;
  audioContext: AudioContext;
  source: AudioBufferSourceNode;
  analyser: AnalyserNode;
  gain: GainNode;
  frequency: Uint8Arrayl;

  setVoiceSize(size: number): void;
  setFftSzie(fftSize: number): void;
  play(callback?: (obj: { frequency: Array }) => void): void;
  stop(): void;
}
