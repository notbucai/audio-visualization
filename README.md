# 音频可视化

![build](https://img.shields.io/appveyor/ci/wuxinweb/audio-visualization)

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
// 调用 play 传入 回调函数 frequency 可获取到频谱
av.play(function ({frequency}) {
  console.log(frequency);
});
```

## 更新记录

> time: **2019-09-04** versions: **0.0.3** 引入 `d.ts` 支持语法提示