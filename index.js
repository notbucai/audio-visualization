function AudioVisualization(config = {}) {
  // 音乐地址
  /** @type {String} */
  this.url = config.url;
  // 是否循环播放
  this.loop = config.loop || false;
  // 音频上下文
  /** @type {AudioContext} */
  this.audioContext = null;
  /** @type {AudioBufferSourceNode} */
  this.source = null;
  /** @type {AnalyserNode}*/
  this.analyser = null;
  /** @type {GainNode} */
  this.gain = null;
  /** @type {number} */
  this._fftsize = 32;
  /** @type {Uint8Array} */
  this.frequency = null;
  this.state = false;
  this.init();
}

AudioVisualization.prototype = {

  async init() {
    await this.initAudioContext();
    await this.intiAnalyser();
    await this.initAudioSource();
    await this.initGain();
    this.state = true;
  },
  // 初始化音频上下文
  async initAudioContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;

    /** @type {AudioContext} */
    this.audioContext = new window.AudioContext();
  },
  // 初始化音频时间和频率数据对象
  async intiAnalyser() {
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.smoothingTimeConstant = 0.9;
    this.setFftSzie(this._fftsize);
  },
  // 初始化音乐源
  async initAudioSource() {
    const audioData = await this._getAudioData();
    // 解码音频文件
    const audioBuffer = await this.audioContext.decodeAudioData(audioData);

    this.source = this.audioContext.createBufferSource();
    this.source.buffer = audioBuffer;
    // 链接 频率解析
    this.source.connect(this.analyser);
    // 连接输出设备
    this.analyser.connect(this.audioContext.destination);
  },
  // 初始化设备控制
  // 控制音频图的整体增益（或音量）
  async initGain() {
    this.gain = this.audioContext.createGain();
    this.source.connect(this.gain);
    this.gain.connect(this.audioContext.destination);
    this.setVoiceSize(10);
  },
  initFrequency() {
    this.frequency = new Uint8Array(this.analyser.frequencyBinCount);
  },
  // 声音大小 size 表示大小 100分制
  setVoiceSize(size) {
    this.gain.gain.setValueAtTime(size / 10, this.audioContext.currentTime);
    this.initFrequency();
  },
  // 设置要获取的数量 默认 64
  setFftSzie(fftSize) {
    this.analyser.fftSize = fftSize * 2;
  },
  // 获取 audio 数据
  async _getAudioData() {
    const res = await fetch(this.url);
    //网络资源并转成 arraybuffer
    const arraybufferData = await res.arrayBuffer();
    return arraybufferData;
  },
  async _forFrequency() {
    this.analyser.getByteFrequencyData(this.frequency);
  },
  exex(fn) {
    setInterval(() => {
      this._forFrequency();
      fn && fn({ frequency: Array.from(this.frequency) });
    }, 0);
  },
  play(fn) {
    const timer = setInterval(() => {
      if (this.state) {
        clearInterval(timer);
        this.source.start(0);
        this.source.loop = this.loop;
        this.exex(fn);
      }
    }, 0);
  },
  stop() {
    this.source.stop(0);
  },

};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = AudioVisualization;
}