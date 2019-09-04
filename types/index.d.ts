declare interface Config {
  url: string,
  loop: boolean
}
declare class AudioVisualization {
  url: string;
  loop: boolean;
  audioContext: AudioContext;
  source: AudioBufferSourceNode;
  analyser: AnalyserNode;
  gain: GainNode;
  frequency: Uint8Array;

  constructor(config: Config);
  setVoiceSize(size: number): void;
  setFftSzie(fftSize: number): void;
  play(callback?: (obj: { frequency: Array<Number> }) => void): void;
  stop(): void;
}

declare module "audio-visualization" {
  export = AudioVisualization;
}
