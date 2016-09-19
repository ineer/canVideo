# canVideo.js

It is easy to play video with canVideo.js, and just supports HTML5.

Use less codes, automatically adapt to different devices.

## Features

simple, tiny, compatibility, and automatic.

## What is canVideo?

### CanVideo.js is a free and open source library that allows you to:

* **Play and control video** files in your webpage.
* Not need third party libraries.

### canVideo supports:

* Format supported depends on your browser.

  - All browsers: webm
  - Chrome: webm, mp4, ogv
  - Chrome for android: webm, mp4
  - Firefox: webm, ogv
  - Firefox for android: webm, mp4, ogv

* Browsers using **HTML5**:

  - Chrome
  - Firefox
  - Opare
  - Safari
  - IE11+

## Usage

### 1. Add Stylesheet and Script

```html
<head>
	//...
	<link rel="stylesheet" href="lib/css/canvideo.min.css">
	//...
</head>
<body>
	//...
	<script src="lib/js/canvideo.min.js"></script>
	//...
</body>
```

### 2. Add `<canvas>` tag

It is easy to play video that you just code like these.

```html	
<div><div class="canvideo">
	<canvas video title="string" src="url" >
		Your browser dose not support canvas.
	</canvas>
</div></div>
```
**warn: It will not play video, if you do not add 'video' in `<canvas>` tag.**

If you need video to autoplay, loop, or mute(start playing), you can code like these:

```html	
<div><div class="canvideo">
	<canvas video autoplay loop muted title="string" src="url" >
		Your browser dose not support canvas.
	</canvas>
</div></div>
```

If you need to play more videos, you must use JavaScript codes:

```html
//...
<script src="lib/js/canvideo.min.js"></script>
<script>
	var videoList = [
		['title1', 'url1'],
		['title2', 'url2'],
		//...
		['titleN', 'urlN']
	]
	var video = new CanVideo(videoList);
	// Uses API to do more...
</script>
//...	
```

### Methods/API

* autoplay(Boolean): Controls video whether autoplay or not.
* load(): Begins preload of video.
* loop(Boolean): Controls video whether loop or not.
* muted(Boolean): Control video whether mute or not,when video starts playing.
* pause(): Pauses playback of video.
* play(): Begins playback of video.
* playRate(times): Controls playbackRate times of video.
* src(url): Changes url of video, just play, not to change video list.
* stop(): Let video preload and pause.
* time(s, m, h): Changes current time of video.
* title(String): Set title of video player.
* version(): Shows current version of canvideo.js.
* volume(Number): Controls volume of video, just 0 to 1;

### Events

* oncanplay: Fires when the browser can start playing the video.
* onended: Fires when the current video list is ended.
* onpause: Fires when the video has been paused.
* onplay: Fires when the video has been started or is no longer paused.
* onwaiting: Fires when the video stops because it needs to buffer the next frame.

## License

canVideo is licensed under the [MIT license](http://opensource.org/licenses/MIT).

## Author:

Github: [ineer](https://github.com/ineer)  
知乎(zhihu): [@叶砜](https://www.zhihu.com/people/ineer)
