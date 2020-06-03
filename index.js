let canvasy;
let ctx;

window.isHidingNow = false;

let wipeyFrame = 0;

let imageDataArray;
let cumulativeOpacity;
let pixelArrayLength;

let alphaArrayLength;
let alphaArrayMaxCumulativeOpacity;

let color1 = '255,0,0';
let color2 = '120,20,255';

window.addEventListener('DOMContentLoaded',function(){
  if (window.isHidingNow != true) {
    document.body.style.backgroundColor = "rgb("+color2+")";
    document.body.style.color = "rgb("+color1+")";
  } else {
    document.body.style.backgroundColor = null;
    document.body.style.color = null;
  }
});

let wait = 2000;

let interact = 1;

window.addEventListener('touchstart', function onFirstTouch() {
  // we could use a class
  document.body.classList.add('touchscreen');
  clearInterval(titleInterval);

  // or set some global variable
  window.USER_IS_TOUCHING = true;

  // we only need to know once that a human touched the screen, so we can stop listening now
  window.removeEventListener('touchstart', onFirstTouch, false);
}, false);

function wipeyCanvasSetup() {
  if (window.isHidingNow != true) {
    document.body.style.color = "rgb("+color1+")";

    canvasy = document.createElement('canvas');
    canvasy.setAttribute('id','wipeyCanvas');
    canvasy.classList.add('wipey-canvas');
    document.body.insertBefore(canvasy,document.body.childNodes[0]);

    ctx = canvasy.getContext("2d");

    wipeyCanvasSize();
  }
}

function fillCanvasWithGradient() {
  if (window.isHidingNow != true) {
    // Create gradient
    let grd = ctx.createLinearGradient(0, 0, canvasy.width, 0);
    grd.addColorStop(0, "rgb("+color1+")");
    grd.addColorStop(1, "white");

    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvasy.width, canvasy.height);
  }
}

function fillCanvasWithFlat() {
  if (window.isHidingNow != true) {
    ctx.fillStyle = "rgb("+color1+")";
    ctx.fillRect(0, 0, canvasy.width, canvasy.height);
  }
}

function wipeyCanvasSize() {
  if (window.isHidingNow != true) {
    canvasy.width = window.innerWidth;
    canvasy.height = window.innerHeight;

    imageDataArray = ctx.getImageData(0,0,canvasy.width,canvasy.height).data;
    cumulativeOpacity = alphaArrayMaxCumulativeOpacity;
    pixelArrayLength = imageDataArray.length;

    alphaArrayLength = pixelArrayLength / 4;
    alphaArrayMaxCumulativeOpacity = alphaArrayLength * 255;
    fillCanvasWithGradient();
  }
}

function wipeyWipey(x,y) {
  if (window.isHidingNow != true) {
    if (interact == 1) {
      document.body.style.color = "rgb("+color1+")";
      document.body.style.backgroundColor = "rgb("+color2+")";
      //Make the radius and centre of the circle half of the overall width and height of its container rect
      let widthOfRect = window.innerWidth * 0.4;
      let halfOfRect = widthOfRect/2;
      let grd = ctx.createRadialGradient(x,y,0, x,y,halfOfRect);
      grd.addColorStop(0, "rgba("+color2+",1)");
      grd.addColorStop(1, "rgba("+color1+",0)");

      ctx.fillStyle = grd;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillRect(x - halfOfRect, y - halfOfRect, widthOfRect, widthOfRect);

      if (wipeyFrame % 10 == 0) {

        imageDataArray = ctx.getImageData(0,0,canvasy.width,canvasy.height).data;
        pixelArrayLength = imageDataArray.length;
        alphaArrayLength = pixelArrayLength / 4;
        cumulativeOpacity = 0;
        //get the alpha values for each pixel
        for (let i = 3; i < pixelArrayLength; i+=4) {
          cumulativeOpacity+= imageDataArray[i];
        }

        if (cumulativeOpacity < alphaArrayMaxCumulativeOpacity*0.002) {
          cumulativeOpacity = alphaArrayMaxCumulativeOpacity;

          //make a temporary variable to store color1 in while we swap the colours over
          let color1Swap = color1;
          color1 = color2;
          color2 = color1Swap;

          document.body.removeChild(document.getElementById('wipeyCanvas'));
          interact = 0;
          setTimeout(function(){
            document.body.classList.add('canvasTransparent');
          },1600);
          setTimeout(function(){
            wipeyCanvasSetup();
            document.body.classList.remove('canvasTransparent');
            interact = 1;
          },wait);
        }
      }
      wipeyFrame++;
    }
  }
}

window.addEventListener('DOMContentLoaded',wipeyCanvasSetup);
window.addEventListener('resize',wipeyCanvasSize);

window.addEventListener('load',onLoad);


function onLoad() {
  if (window.isHidingNow != true) {
    document.body.classList.add('loaded');

    document.addEventListener('mousemove',function(e){
      if (!window.USER_IS_TOUCHING) {
        wipeyWipey(e.clientX,e.clientY);
      }
    });

    document.addEventListener('touchmove', function(e) {
      if (window.USER_IS_TOUCHING) {
        let touchposx = Math.round(e.touches[0].clientX);
        let touchposy = Math.round(e.touches[0].clientY);
        if (touchposx > 1 && touchposy >1){
          wipeyWipey(touchposx, touchposy);
        }
      }
    });
  }
}
