# 音频可视化

![npm](https://img.shields.io/npm/v/audio-visualization)
![dw](https://img.shields.io/npm/dw/audio-visualization)
![npm](https://img.shields.io/npm/l/audio-visualization)
![min](https://img.shields.io/bundlephobia/min/audio-visualization)
![date](https://img.shields.io/date/1567611291)


## 简介
`audio-visualization` 是一个通过 `WEB-AUDIO-API` 实现的实现的音乐可视化的库，通过本库你可以获取到`当前音频`的音频频谱。  

## 例子

> 请参考: ./docs/demo.html 或者 [点击我](https://wuxinweb.github.io/audio-visualization/demo.html)

## 使用方法  `已支持语法提示`
1. script引入  
`下载index.js 正常引入  `
2. require   
`npm install audio-visualization`  
`require('audio-visualization');`  
3. webpack / vue  
`import AV from 'audio-visualization';`  


```JavaScript
const av = new AudioVisualization({
  url: './1.mp3',
  loop: false,
});
// 调用 setVoiceSize 可设置 声音大小
av.setVoiceSize(100);
// 调用 setFftSzie 可设置 frequency长度 
av.setFftSzie(128);
// 调用 play 传入 回调函数 
// - frequency 可获取到频谱
// - currentTime 获取当前播放进度
// - audiostate 得到当前状态
av.play(function ({ frequency, currentTime, audiostate }) {
  console.log(frequency,urrentTime, audiostate);
});
// 单独调用直接启动不会执行回调 建议调用不要直接调用而是 调用 play
start(): void;
// 暂停音频内容的进度.
suspend(): void;
// 重新启动一个已被暂停的音频环境
resume(): void;
// 停止后无法再次启动，请慎重
stop(): void;
```

## 更新记录

> time: **2019-09-04** versions: **0.0.3** 引入 `d.ts` 支持语法提示  

> time: **2019-09-26** versions: **0.1.0** 修复停止后无法启动/同时加了几个可以获取的属性  