/*!
 * canVideo v0.1.0
 * Copyright 2016 Ineer
 * Licensed under MIT (https://github.com/ineer/canvideo/blob/master/LICENSE)
 */

(function() {

// Encountered UC browser and QQ browser, prompted not to provide video playback.
// b.v.* = browser.versions.*
var b={
	v:function () {
		var u = navigator.userAgent;
		return {
			// Firefox kernel
			gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,

			// mobile device
			mobile: !!u.match(/AppleWebKit.*Mobile.*/),

			// UC browser
			UC: u.indexOf('UCBrowser') > -1 || u.indexOf('UC') > -1,

			// QQ browser
			QQ: u.indexOf('QQBrowser') > -1 || u.indexOf('QQ') > -1,

			// android device
			android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,

			// iPhone device
			iPhone: u.indexOf('iPhone') > -1 ,

			// iPad device
			iPad: u.indexOf('iPad') > -1
		};
	}()
};
if (b.v.android && b.v.UC) {
	alert('由于UC劫持Video的恶劣行为,'
		+ '用户使用UC浏览网页, canVideo将不提供视频播放功能.\n'
		+ '为此不便,深表歉意.\n'
		+ '推荐使用Chrome或Firefox进行浏览.');
	return false;
}
if (b.v.android && b.v.QQ) {
	alert('由于QQ浏览器劫持Video的恶劣行为,'
		+ '用户使用QQ浏览器浏览网页, canVideo将不提供视频播放功能.\n'
		+ '为此不便,深表歉意.\n'
		+ '推荐使用Chrome或Firefox进行浏览.');
	return false;
}
// Gets the Canvas with the video sign, only to get the first one and the only one.
var canc = document.querySelector('canvas[video]');

if (!canc) {
	alert('Don\'t found video sign in Canvas tags, please read help document to use canVideo.js accurately.');
	return false;
} else {

	// C4V will be As the only global variable
	var C4V = {
		// Record click times
		ct: 0,

		// FPS
		fps: 30,

		// fullscreen status
		isFullScreen: false
	};

	// Load control module
	loadControls(canc.parentNode);

	// Because the HTML code is rewritten, you need to retrieve the Canvas handle.
	canc = document.querySelector('canvas[video]');
	var canctx = canc.getContext('2d');

	// Create a transition video, it is not actually added to the DOM tree.
	var canv = document.createElement('video');

		// Get handle
		// Tool bar
	var vTool           = getId('v-tool'),
		// Content bar
		vContent        = getId('v-content'),
		// Control bar
		vControl        = getId('v-control'),
		// Back button
		vBack           = getId('v-back'),
		// Video title
		vTitle          = getId('v-title'),
		// Real time
		vTime           = getId('v-time'),
		// Rotate button
		vRotate         = getId('v-rotate'),
		// Poster button
		vPoster         = getId('v-poster'),
		// Loading sign
		vLoading        = getId('v-loading'),
		// Video current time
		vCurrent        = getId('current-time'),
		// Video duration time
		vDuration       = getId('duration-time'),
		// Progress bar
		vProgress       = getId('v-progress'),
		vProgressHandle = getId('v-progress-handle'),
		// Play and pause button
		vPlay           = getId('v-play'),
		// Stop button
		vStop           = getId('v-stop'),
		// Volume bar
		vVolume         = getId('v-volume'),
		vVolumeHandle   = getId('v-volume-handle'),
		// FullScreen button
		vFullScreen     = getId('v-fullscreen');

	// initialize,
	// and let the tool bar and the control bar begin to hide.
	initCanvas(canc);
	initVideo(canc, canv);
	setOpacity(vTool, 0);
	setOpacity(vControl, 0);

// Init - End -
// ****************************************************

// ****************************************************
// EventListener of video - Start -

	// When listening to the video load,
	// get the width of the video and the height of the video.
	canv.addEventListener('loadedmetadata', function() {

		// According to the width and the height,
		// calculate the size of the canvas.
		setDrawArea(canc, canv);

		// get current time
		vCurrent.innerHTML  = getVideoTime(canv.currentTime);

		// get duration time
		vDuration.innerHTML = getVideoTime(canv.duration);

		// set the style of play button 
		setTimeout	(function() {
			setPlayOrPauseButton();
			getSeek(vProgressHandle.parentNode.style);
		}, 500);

	}, 0);

	// Draw image to canvas from video.
	canv.addEventListener('play', function () {

		videoLoop();

	}, 0);

	canv.addEventListener('pause', function() {

		vPlay.classList.remove('pause');

	}, 0);

	canv.addEventListener('ended', function() {

		nextVideo();

	}, 0);

	// Loading sign hidden
	canv.addEventListener('canplay', function() {

		setLoading(vLoading, false);

	}, 0);

	// Loading sign show
	canv.addEventListener('waiting', function() {

		setLoading(vLoading, true);

	}, 0);

	// Listen to the volume change
	canv.addEventListener('volumechange', function() {
		
		var temp;
		
		changeVolume(vVolumeHandle.style);

		temp = vVolume.parentNode.parentNode;
		if (canv.volume > .66) {
			temp.className = 'v-button volume high';
		} else if (canv.volume > .33) {
			temp.className = 'v-button volume medium';
		} else if (canv.volume > 0) {
			temp.className = 'v-button volume low';
		} else {
			temp.className = 'v-button volume mute';
		}

	}, 0);

// EventListener of video - End -
// ****************************************************
// EventListener of controls - Start -

	// it will show controls if you click,
	// and video will play or pause if you doubleclick.
	// Compatible with Firefox mobile version cannot double click
	vContent.addEventListener('click', function () {

		C4V.ct++;
		if (C4V.ct == 1) { // click event
			changeOpacity(vTool, vControl);
			setTimeout(function(){C4V.ct = 0}, 300);
		} else { // double click event
			setPlayOrPause();
			C4V.ct = 0;
		}

	}, 0);

	// back button
	vBack.addEventListener('click', function() {

		exitFullScreen(canc,canv);

	}, 0);

	// rotate button
	vRotate.addEventListener('click', function() {

		setRotate(canc.parentNode.style);

	}, 0);

	// poster button
	vPoster.addEventListener('click', function() {

		setPlayOrPause();
		vPoster.style.display = 'none';

	}, 0);

	// play or pause 
	vPlay.addEventListener('click', function() {

		setPlayOrPause();

	}, 0);

	// video will stop if you click stop button
	vStop.addEventListener('click', function() {

		setStop();

	}, 0);

	// when video plays, progress can run
	vProgress.addEventListener('click', function(e) {

		setProgress(vProgress.getBoundingClientRect(),
			        vProgressHandle.style,
			        document.body,
			        e);

	}, 0);

	// when you wacth video with personal computer, volume will can be used;
	// but you wacth it with mobile, volume will be disabled.
	vVolume.addEventListener('click', function(e) {

		setVolume(vVolume.getBoundingClientRect(),
				  vVolumeHandle.style,
				  document.body,
				  e);

	}, 0);

	// fullscreen
	vFullScreen.addEventListener('click', function() {

		fullScreen(canc,canv);
		// if you enter ESC or back button of mobile, video will exitfullscreen.
		setTimeout(checkBackButton, 500);

	}, 0);

// EventListener of controls - End -
// ****************************************************


// ****************************************************
// Function of init - Start -

	function initCanvas(c) {

		// Save offsetWidth and offsetHeight of Canvas
		getCanvasOffset(c);

		setCanvasInit(c);

		setCanvasParentClass(c.parentNode);

	}

	function initVideo(c, v) {

		v.src = c.attributes['src'] ? c.attributes['src'].value : [];

		if (c.attributes['autoplay']) {
			v.autoplay = true;
			vPoster.style.display = 'none';
		}

		v.loop = c.attributes['loop'] ? true : false;

		v.muted = c.attributes['muted'] ? true : false;

		vTitle.innerHTML = c.attributes['title']
						   		? c.attributes['title'].value
						   		: [];
		C4V.title = vTitle.innerHTML;

	}

	function getId(id) {

		return document.getElementById(id);

	}

	function getCanvasOffset(c) {

		C4V.cow = c.offsetWidth;
		C4V.coh = c.offsetHeight;

	}

	function setCanvasInit(c) {

		c.width = C4V.cow;
		c.height = C4V.coh;

	}

	function setCanvasParentClass(c) {

		b.v.android || b.v.iPhone || b.v.iPad
			? c.classList.add('mobile')
			: c.classList.add('pc')

		C4V.rotate = '0';

	}

// Function of init - End -
// ****************************************************
// Function of video - Start -

	function setDrawArea(c, v) {

		C4V.vw = v.videoWidth;
		C4V.vh = v.videoHeight;

		if (C4V.vw / C4V.vh > c.offsetWidth / c.offsetHeight) {
			C4V.dw = c.offsetWidth;
			C4V.dh = c.offsetWidth * C4V.vh / C4V.vw;
		} else {
			C4V.dh = c.offsetHeight;
			C4V.dw = c.offsetHeight * C4V.vw / C4V.vh;
		}

	}

	function videoLoop() {

		canctx.drawImage(canv, (canc.offsetWidth - C4V.dw) / 2,
				(canc.offsetHeight - C4V.dh) / 2,
				C4V.dw, C4V.dh);

		// get current time
		vCurrent.innerHTML = getVideoTime(canv.currentTime);

		C4V.currentTime = vCurrent.innerHTML;

		// change the value of progress bar
		changeProgress(vProgressHandle.style);

		if (!canv.paused && !canv.ended) {
			setTimeout(videoLoop, 1000 / C4V.fps); // default at 30fps
		}

	}

// Function of video - End -
// ****************************************************
// Function of controls - Start -

	function setOpacity(elem, num) {

		elem.style.opacity = num;

		// content z-index = 3
		elem.style.zIndex = num === 0 ? '2' : '4';

	}

	function changeOpacity(t, c) {

		if (t.style.opacity == '1') {
			setOpacity(t, 0);
			setOpacity(c, 0);
			vRotate.style.display = 'none';
		} else {
			setOpacity(t, 1);
			setOpacity(c, 1);
			vRotate.style.display = 'block';
		}
		
	}

	function setPlayOrPauseButton() {

		!canv.paused
			? vPlay.classList.add('pause')
			: vPlay.classList.remove('pause');

	}

	function setPlayOrPause() {

		if (!canv.paused) {
			canv.pause();
		} else {
			canv.play();
			setTimeout(videoLoop, 500);
			vPlay.classList.add('pause');
		}

	}

	// function of stop button 
	function setStop() {

		canv.load();
		setTimeout(function() {
			canv.pause();
			changeProgress(vProgressHandle.style);
		}, 1150);

	}

	function getVideoTime(t) {

		var h, m, s;
		
		h = Math.floor(t / 3600);
		m = Math.floor((t - 3600 * h) / 60);
		s = Math.floor((t - 3600 * h) - 60 * m);

		h = h < 10 ? ('0' + h) : h;
		m = m < 10 ? ('0' + m) : m;
		s = s < 10 ? ('0' + s) : s;

		return h > 0
			   		? (h + ':' + m + ':' + s)
			   		: (m + ':' + s);

	}

	function getSeek(handle) {

		// handle = vProgressHandle.parentNode.style
		C4V.pow = vProgress.offsetWidth;
		C4V.seek = canv.buffered.end(0);
		handle.width = (100 * C4V.seek / canv.duration) + '%';
		C4V.seekValue = handle.width;

		if (C4V.seek == canv.duration) {
			handle.width = '100%';
			C4V.seekValue = handle.width;
			return false;
		}

		setTimeout(function() {
			getSeek(handle);
		}, 1000);

	}

	function changeProgress(handle) {

		// handle = vProgressHandle.style
		handle.width = (100 * canv.currentTime / canv.duration) + '%';

	}

	function setProgress(progress, handle, b, e) {

		// progress = vProgress.getBoundingClientRect()
		// handle = vProgressHandle.style
		// b = document.body
		C4V.pow = vProgress.offsetWidth;

		if (C4V.rotate == 0) {
			C4V.how = e.pageX - progress.left - b.scrollLeft;
		} else if (C4V.rotate == 90) {
			C4V.how = e.pageY - progress.top - b.scrollTop;
		} else if (C4V.rotate == 180) {
			C4V.how = e.pageX - progress.left - b.scrollLeft;
			C4V.how = C4V.pow - C4V.how;
		} else if (C4V.rotate == 270) {
			C4V.how = e.pageY - progress.top - b.scrollTop;
			C4V.how = C4V.pow - C4V.how;
		}

		handle.width = (100 * C4V.how / C4V.pow) + '%';
		canv.currentTime = C4V.how / C4V.pow * canv.duration;

		if(canv.paused && !canv.ended) {
			setTimeout(videoLoop, 1200);
		}

	}

	function changeVolume(handle) {

		// handle = vVolumeHandle.style
		handle.height = 100 * canv.volume / 1 + '%';

	}

	function setVolume(volume, handle, b, e) {

		var temp;

		// volume = vVolume.getBoundingClientRect()
		// handle = vVolumeHandle.style
		// b = document.body
		C4V.voh = vVolume.offsetHeight;
		C4V.hoh = e.pageY - volume.top - b.scrollTop;

		temp = (C4V.voh - C4V.hoh) / C4V.voh;
		if (temp > 1) {
			canv.volume = 1;
			handle.height = '100%';
		} else if (temp < 0) { 
			canv.volume = 0;
			handle.height = '0%';
		} else {
			canv.volume = temp;
			handle.height = 100 * temp + '%';
		}

		C4V.volume = temp;

	}

	(function getTime() {

		var date = new Date(),
			h = date.getHours(),
			m = date.getMinutes(),
			s = date.getSeconds();

		h = h < 10 ? ('0' + h) : h;
		m = m < 10 ? ('0' + m) : m;
		s = s < 10 ? ('0' + s) : s;

		vTime.innerHTML = h + ':' + m + ':' +s;

		setTimeout(getTime, 1000);

	})();

	function fullScreen(c, v) {

		if (c.requestFullScreen) {
			c.parentNode.requestFullScreen();
		} else if (c.webkitRequestFullScreen) {
			c.parentNode.webkitRequestFullScreen();
		} else if (c.mozRequestFullScreen) {
			// Because of the particularity of Firefox, the grandfather of full screen.
			c.parentNode.parentNode.mozRequestFullScreen();
		}

		if (window.screen.width < window.screen.height) {
			c.parentNode.style.transform = 'rotate(90deg)';
			C4V.rotate = '90';
			c.width = window.screen.height;
			c.height = window.screen.width;
			c.parentNode.style.width = window.screen.height + 'px';
			c.parentNode.style.height = window.screen.width + 'px';
			if (b.v.gecko) { // Firefox mobile browser
				C4V.toX = c.height / 2;
				C4V.toY = c.height / 2;
				c.parentNode.style.transformOrigin = C4V.toX + 'px ' + C4V.toY + 'px';
			}
		} else {
			c.parentNode.style.width = window.screen.width + 'px';
			c.parentNode.style.height = window.screen.height + 'px';
			c.width = window.screen.width;
			c.height = window.screen.height;
		}

		setDrawArea(c, v);

		c.parentNode.classList.add('full-screen');
		C4V.isFullScreen = true;

		videoLoop();
		
	}

	function exitFullScreen(c, v) {

		if (document.exitFullScreen) {
			document.exitFullScreen();
		} else if (document.webkitCancelFullScreen) {
			document.webkitCancelFullScreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		}

		c.parentNode.style.width = C4V.cow + 'px';
		c.parentNode.style.height = C4V.coh + 'px';
		c.width = C4V.cow;
		c.height = C4V.coh;
		c.parentNode.style.transform = 'rotate(0deg)';
		C4V.rotate = '0';

		setDrawArea(c, v);

		c.parentNode.classList.remove('full-screen');
		C4V.isFullScreen = false;

		videoLoop();
		
	}

	function nextVideo() {
		if (!canv.loop) {
			if (C4V.listNum < C4V.list.length) {
				C4V.listNum ++;
			} else {
				C4V.listNum = 1;
			}

			vTitle.innerHTML = C4V.list[C4V.listNum - 1][0];
			canv.src = C4V.list[C4V.listNum - 1][1];

			setPlayOrPause();
		}
	}

	function setLoading(l, boo) {

		l.style.display = boo ? 'block' : 'none';

	}

	function setRotate(elem) {

		// 0 - 180
		if (C4V.rotate == 0) {
			elem.transform = 'rotate(180deg)';
		// 90 - 270
		} else if (C4V.rotate == 90) {
			if (b.v.gecko) {
				C4V.toX = window.screen.height / 2;
				C4V.toY = window.screen.height / 2;
				elem.transformOrigin = C4V.toX + 'px ' + C4V.toY + 'px';
			}
			elem.transform = 'rotate(270deg)';
		// 180 - 0
		} else if (C4V.rotate == 180) {
			elem.transform = 'rotate(0deg)';
		// 270 - 90
		} else if (C4V.rotate == 270) {
			if (b.v.gecko) {
				C4V.toX = window.screen.width / 2;
				C4V.toY = window.screen.width / 2;
				elem.transformOrigin = C4V.toX + 'px ' + C4V.toY + 'px';
			}
			elem.transform = 'rotate(90deg)';
		}

		C4V.rotate = elem.transform.replace(/[^0-9]/ig,'');

	}

	function checkBackButton() {

		if (!document.webkitIsFullScreen
			&& document.webkitIsFullScreen !== undefined
			|| !document.mozFullScreen
			&& document.mozFullScreen !== undefined) {
			exitFullScreen(canc,canv);
			return;
		}

		setTimeout(checkBackButton, 1000 / 8);

	}

// Function of controls - End -
// ****************************************************


// ****************************************************
// Open API interface for developers, so that developers can pass Javascript
// control the video in a variety of States, in addition to supporting the basic video playback,
// API also added features for the developer to prepare for the control of video.
//
// API - Start -

	var CanVideo = window.CanVideo = function(url) {

		_this = canv;
		vTitle.innerHTML = url ? url[0][0] : [];
		_this.src = url ? url[0][1] : [];

		C4V.list = url ? url : {};
		C4V.listNum = url ? 1 : 0;

	};

	CanVideo.prototype = {

		src: function(url) {

			if (url === undefined) {
				return _this.src;
			}

			_this.src = url;
			return true;

		},

		title: function(title) {

			if (title === undefined) {
				return vTitle.innerHTML;
			}

			vTitle.innerHTML = title;
			return true;

		},

		add: function(arr) {
			// wait for coding
		},

		remove: function(index) {
			// wait for coding
		},

		load: function() {

			_this.load();

		},

		play: function() {

			_this.play();

		},

		// Pause current video.
		pause: function() {

			_this.pause();

		},

		stop: function() {

			setStop();

		},

		autoplay: function(boo) {

			_this.autoplay = boo;

		},

		loop: function(boo) {

			_this.loop = boo;

		},

		muted: function(boo) {

			_this.muted = boo;

		},

		time: function(s, m, h) {

			var temp;
			
			if (m === undefined && h ===undefined) {
				temp = s;
			} else if (h === undefined) {
				temp = s + m * 60;
			} else {
				temp = s + m * 60 + h * 3600;
			}

			_this.currentTime = temp;
			return true;

		},

		volume: function(num) {

			if (typeof num == 'number') {
				if (num > 1) {
					_this.volume = 1;
				} else if (num < 0) {
					_this.volume = 0;
				} else {
					_this.volume = num;
				}
				C4V.volume = num;
				return true;
			}

			throw {
				name: 'TypeError',
				message: 'volume needs number.'
			};

		},

		playRate: function(times) {

			if (typeof times === 'number' && times > 0){
				_this.playbackRate = times;
				return true;
			}

			throw {
				name: 'TypeError',
				message: 'playRate needs number.'
			};

		},

		version: function() {

			alert('canVideo version: v0.1.0, Welcome to use.');

		}

		// API list
		// api: function() {

		// 	showAPI();

		// }

	}

// API - End -
// ****************************************************
// API 说明 list
// 
// API - Start -

	// function API.list() {
	// 	var api = '很高兴您能使用canVideo.js,我们准备了API供开发者使用.\n'
	// 		+ 'example:var video = new canvideo(url);\n\n\t\t'
	// 		+ 'canVideo的API列表:\n\n\t\t'
	// 		+ '.src(url):获取或设置视频文件URL;\n\t\t'
	// 		+ '.title(title):设置视频标题\n\t\t'
	// 		+ '.load():视频恢复开始状态\n\t\t'
	// 		+ '.play():视频播放;\n\t\t'
	// 		+ '.pause():视频暂停;\n\t\t'
	// 		+ '.stop():视频停止;\n\t\t'
	// 		+ '.autoplay(boolean):视频自动播放;\n\t\t'
	// 		+ '.loop(boolean):视频循环;\n\t\t'
	// 		+ '.muted(boolean):视频静音;\n\t\t'
	//      + '.time(s, m, h):视频时间跳转;\n\t\t'
	// 		+ '.volume(number):视频音量:\n\t\t'
	// 		+ '.playbackRate(times):视频播放速率;\n\t\t'
	// 		+ '.api():canVideo的API列表;\n\t\t'
	// 		+ '.version():canVideo版本号.';
	// 	console.log(api);
	// };
	// API.list(); // Console.log提示API接口.
			   // 开发完后请删除showAPI();

// API - End -
// ****************************************************


// ****************************************************
// Function of loading controls - Start -
/*
 * if you append a new method to control the video,
 * you need revise controlsHTML
 *
**/
	function loadControls(c) {

		var controlsHTML = ['',
			'<div id="v-tool" class="v-tool-bar">',
				'<div id="v-back" class="v-button back">',
					'<label for="v-back">Back</label>',
				'</div>',
				'<div class="v-title-bar">',
					'<label id="v-title" class="v-title"></label>',
				'</div>',
				'<div id="v-time" class="v-button time"></div>',
				'<div class="v-button tool-menu">',
					'<input type="checkbox" id="v-tool-menu">',
					'<label for="v-tool-menu"></label>',
					'<div class="v-tool-content">',
						'<ul>',
							'<li>Tool1</li>',
							'<li>Tool2</li>',
							'<li>Tool3</li>',
						'</ul>',
					'</div>',
				'</div>',
			'</div>',
			'<div id="v-content" class="v-content">',
				'<div id="v-poster" class="poster"></div>',
				'<div id="v-loading" class="loading"></div>',
				'<div id="v-rotate" class="v-button rotate"></div>',
			'</div>',
			'<div id="v-control" class="v-control-bar">',
				'<div class="v-progress-bar">',
					'<div id="current-time" class="v-current-time"></div>',
					'<div class="v-progress">',
						'<div class="v-progress-back" id="v-progress">',
							'<div class="v-progress-seek">',
								'<label id="v-progress-handle" for="v-progress" class="v-slider progress-handle"></label>',
							'</div>',
						'</div>',
					'</div>',
					'<div id="duration-time" class="v-duration-time"></div>',
				'</div>',
				'<div class="v-control">',
					'<div class="v-control-left"></div>',
					'<div id="v-play" class="v-button play"></div>',
					'<div id="v-stop" class="v-button stop"></div>',
					'<div class="v-control-right">',
						'<div class="v-control-right"></div>',
						'<div class="v-button volume high">',
							'<input type="checkbox" id="v-volume-button">',
							'<label for="v-volume-button"></label>',
							'<div class="v-volume-bar">',
								'<div id="v-volume" class="v-volume">',
									'<label id="v-volume-handle" for="v-volume" class="v-slider volume-handle"></label>',
								'</div>',
							'</div>',
						'</div>',
						'<div id="v-fullscreen" class="v-button fullscreen"></div>',
					'</div>',
				'</div>',
			'</div>'
		];

		controlsHTML = controlsHTML.join('');
		c.innerHTML += controlsHTML;

	}
// Function of loading controls - End -
// ****************************************************

} // if (canc) {...} - End -

})(); // Closure - End -