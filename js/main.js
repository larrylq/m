function bindEvent(obj, ev, fn) {
    obj.addEventListener(ev, fn, false);
}
function getId(obj) {
    return document.getElementById(obj);
}
function getWidth() {
    return {
        line: oLine.offsetWidth,
        dot: oDot.offsetWidth
    }
}
function defaultEvent(e) {
    e.preventDefault();
}

//播放列表
var mp3List = ['任素汐 - 我要你.mp3', '张靓颖 - 808 (Jack Novak Remix).mp3', '张靓颖 - DUST MY SHOULDERS OFF.mp3','GARNiDELiA - 極楽浄土.mp3','王菲 - 人间.mp3'],
//文件路径
baseUrl = 'music/';
//控制当前第几首歌
var num = 0;
//定时器
var t = null;
//播放模式状态
var m = 0;

var oLine = getId('progressLine');
var oPass = getId('progressPass');
var oDot = getId('progressDot');
var oDotWidth = oDot.offsetWidth;

var oAudio = getId('media');
var oPlay = getId('audioPlay');
var oPlayL = getId('audioPlayL');
var oPlayR = getId('audioPlayR');

//控制播放
function playAudio() {
    oAudio.onended = function() {

       if(m == 0){
          num = num;
       }else if(m == 1){
          num++;

          if (num >= mp3List.length) {
                num = 0;
          }
       }else{
          var random =  parseInt(Math.random()*(mp3List.length));
          num == random ? num = 0 : num = random ;
       }


        oAudio.src = baseUrl + mp3List[num];
        oAudio.play();
    }
}

//播放停止暂停
function playPause() {
    if (oAudio.paused) {
        oPlay.classList.add('mousicMove');
        oAudio.play();

        musicState();
    } else {
        clearInterval(t);
        oPlay.classList.remove('mousicMove');
        oAudio.pause();
    }
}

//播放器播放状态
function musicState() {
    clearInterval(t);
    t = setInterval(function() {
        var duration = oAudio.duration;
        var time = oAudio.currentTime;
        var per = time / duration;

        oPass.style.width = (getWidth().line - getWidth().dot) * per + 'px';
    },
    1000);
}

bindEvent(window, 'load',function() {
    oAudio.src = baseUrl + mp3List[num];
    playAudio();
});

bindEvent(oPlay, 'touchend',function() {
    playPause();
});

//上一首下一首
function playList(dir) {
    oPlay.classList.add('mousicMove');

    switch (dir) {
    case '+':
        num--;

        if (num < 0) {
            num = mp3List.length - 1;
        }
        break;
    case '-':
        num++;

        if (num >= mp3List.length) {
            num = 0;
        }
        break;
    default:
        num = 0;
        break;
    };

    oAudio.src = baseUrl + mp3List[num];
    oAudio.play();
}

bindEvent(oPlayL, 'touchend',function() {
    playList('+');
});
bindEvent(oPlayR, 'touchend',function() {
    playList('-');
});

//判断手机横竖屏状态：
bindEvent(window, "onorientationchange" in window ? "orientationchange": "resize",
function() {
    if (oAudio.paused) return;

    if (window.orientation === 180 || window.orientation === 0) {
        musicState();
    }
    if (window.orientation === 90 || window.orientation === -90) {
        musicState();
    }
},
false);

function defaultEvent(e) {
    e.preventDefault();
}

var disX, moveX, L, T, starX, starY, starXEnd, starYEnd;

//拖拽
oDot.addEventListener('touchstart',function(e) {
    document.addEventListener("touchmove", defaultEvent, false); //阻止触摸时页面的滚动，缩放
    disX = e.touches[0].clientX - this.offsetLeft;

    //手指按下时的坐标
    starX = e.touches[0].clientX;
    starY = e.touches[0].clientY;

});
oDot.addEventListener('touchmove',function(e) {
    L = e.touches[0].clientX - disX;
    //移动时 当前位置与起始位置之间的差值
    starXEnd = e.touches[0].clientX - starX;

    var w = document.documentElement.clientWidth - this.offsetWidth;

    if (L < 0) { //限制拖拽的X范围，不能拖出屏幕
        L = 0;
    } else if (L > w) {
        L = w;
    }

    moveX = L;

    oPass.style.width = moveX + 'px';

    var per = moveX / w;

    oAudio.currentTime = Math.floor(oAudio.duration * per);

});

oDot.addEventListener('touchend',function(e) {
    document.removeEventListener("touchmove", defaultEvent, false);
});

//去掉音乐后缀
function musicName(name) {
    return (name.split('.'))[0]
}

//列表显示隐藏
var oMusicList = getId('musicList');
var oMusicListClose = getId('musicListClose');
var oListBtn = getId('listBtn');
var oMusicChoice = getId('musicChoice');

function musicChoicePlay(mp3List) {
    var str = '';
    for (var i = 0; i < mp3List.length; i++) {
        str += '<li class="" src="' + i + '">' + '<a href="javascript:;">' + '<div class="musicTitle"><div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div><span>' + musicName(mp3List[i]) + '</span></div>' + '<div class="musicState"><span></span></div>' + '</a>' + '</li>';
    }
    oMusicChoice.innerHTML = str;

    var aLi = oMusicChoice.getElementsByTagName('li');

    for (var i = 0,
    len = aLi.length; i < len; i++) {
        aLi[i].index = i;
        aLi[i].addEventListener('touchend',
        function() {
            for (var i = 0,
            len = aLi.length; i < len; i++) {
                aLi[i].classList.remove('on');
            }
            aLi[this.index].classList.add('on');

            num = aLi[this.index].getAttribute('src');
            oAudio.src = baseUrl + mp3List[num];
            playPause();
        });
    }
}
musicChoicePlay(mp3List);

bindEvent(oListBtn, 'touchend',function() {
    if (!oAudio.paused) {
        var aLi = oMusicChoice.getElementsByTagName('li');
        for (var i = 0,
        len = aLi.length; i < len; i++) {
            aLi[i].classList.remove('on');
        }
        aLi[num].classList.add('on');
    }

    oMusicList.style.display = "block";
});

bindEvent(oMusicListClose, 'touchend',function() {
    oMusicList.style.display = "none";
});

//播放模式
var playmode = ['单曲循环', '循环播放', '随机'];
var oMusicPlayMode = getId('musicPlayMode');
bindEvent(oMusicPlayMode,'touchend',function(){

    m++;

    if(m>playmode.length-1)m=0;

    oMusicPlayMode.getElementsByTagName('i')[0].className = 'playmode'+m;
    oMusicPlayMode.getElementsByTagName('span')[0].innerHTML = playmode[m];
});
