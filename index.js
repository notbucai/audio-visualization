(function () {
  function AudioVisualization ({ url, loop = false }) {
    // 音乐地址
    /** @type {String} */
    this.url = url;
    // 是否循环播放
    this.loop = loop || false;
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
    // 0表示未启动 1表示运行中 2表示暂停 3表示停止
    this.audiostate = 0;
    this.init();
  }

  AudioVisualization.prototype = {
    get currentTime () {
      return this.audioContext && this.audioContext.currentTime;
    },
    async init () {
      this.initAudioContext();
      this.intiAnalyser();
      await this.initAudioSource();
      this.initGain();
      this.state = true;
    },
    // 初始化音频上下文
    initAudioContext () {
      const AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;

      /** @type {AudioContext} */
      this.audioContext = new window.AudioContext();
      this.audioContext.suspend();
    },
    // 初始化音频时间和频率数据对象
    intiAnalyser () {
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.smoothingTimeConstant = 0.9;
      this.setFftSzie(this._fftsize);
    },
    // 初始化音乐源
    async initAudioSource () {
      const audioData = await this._getAudioData();
      // 解码音频文件
      const audioBuffer = await this.audioContext.decodeAudioData(audioData);

      this.source = this.audioContext.createBufferSource();
      this.source.buffer = audioBuffer;
      // 链接 频率解析
      this.source.connect(this.analyser);
      // 连接输出设备
      this.analyser.connect(this.audioContext.destination);
      // 是否循环播放
      this.source.loop = this.loop;
    },
    // 初始化设备控制
    // 控制音频图的整体增益（或音量）
    initGain () {
      this.gain = this.audioContext.createGain();
      this.source.connect(this.gain);
      this.gain.connect(this.audioContext.destination);
      this.setVoiceSize(10);
    },
    initFrequency () {
      this.frequency = new Uint8Array(this.analyser.frequencyBinCount);
    },
    // 声音大小 size 表示大小 100分制
    setVoiceSize (size) {
      this.gain.gain.setValueAtTime(size / 10, this.audioContext.currentTime);
      this.initFrequency();
    },
    // 设置要获取的数量 默认 64
    setFftSzie (fftSize) {
      this.analyser.fftSize = fftSize * 2;
    },
    // 获取 audio 数据
    async _getAudioData () {
      const res = await fetch(this.url);
      //网络资源并转成 arraybuffer
      const arraybufferData = await res.arrayBuffer();
      return arraybufferData;
    },
    _forFrequency () {
      this.analyser.getByteFrequencyData(this.frequency);
    },
    // 轮询
    exex (fn) {
      clearInterval(this.timerIndex);
      this.timerIndex = setInterval(() => {
        this._forFrequency();
        fn && fn({ frequency: Array.from(this.frequency), currentTime: this.currentTime, audiostate: this.audiostate });
      }, 0);
    },
    /**
     * @param {function} fn 回调
     */
    play (fn) {
      if (this.audiostate === 3) {
        throw new Error('已经停止无法继续请重新new一个对象');
      }
      const timer = setInterval(() => {
        if (this.state) {
          clearInterval(timer);
          // 判断状态 执行对应的函数
          if (this.audiostate === 0) {
            this.start();
          } else if (this.audiostate != 3 && this.audiostate != 1) {
            this.resume();
          }
          this.exex(fn);
        }
      }, 0);
    },
    // 启动
    start () {
      this.resume();
      this.source.start(0);
      this.audiostate = 1;
    },
    // 停止，无法再次启动
    stop () {
      this.audiostate = 3;
      this.audioContext.close();
    },
    // 暂停
    suspend () {
      this.audiostate = 2;
      this.audioContext.suspend();
    },
    resume () {
      this.audiostate = 1;
      this.audioContext.resume()
    }

  };

  if (typeof window !== 'undefined') {
    window.AudioVisualization = AudioVisualization;
  } else if (typeof global !== 'undefined') {
    global.AudioVisualization = AudioVisualization;
  }

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = AudioVisualization;
  }

})();


