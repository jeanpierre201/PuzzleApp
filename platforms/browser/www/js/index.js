
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
     onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        
        
        console.log('Received Event: ' + id);
    }
};


// Start Countdown - 3000ms

   function onLoad() {  
           startCountdown();
    }

function startCountdown() {
    myVar = setInterval(function(){ alertFunc("timer"); }, 1000);
}

i = 3

function alertFunc(p1, p2, p3) {  

    id = "timer" + i;
    console.log(id);
    
    if (i > 0) {    
    document.getElementById(id).classList.add("countdown_animation");
    document.getElementById(id).innerHTML = i;
    document.getElementById(id).addEventListener("animationend", myEndFunction);
    i--;
    } else {
    clearTimeout(myVar);
    startPuzzle();
    }
} 


function myEndFunction() {
    this.classList.add("hidden");
}



// Start the game - initial delay 2000ms  - total 21000ms


function startPuzzle() {
document.getElementById("countdown").classList.add("background-gone");
document.getElementById("container_puzzle").classList.remove("hidden");
startTimer();
}


function startTimer() {
  setTimeout(function(){
  var elem = document.getElementById("myBar");   
  var height = 0;
  var total = 0;
  var id = setInterval(frame, 100);
  var called = false;
  function frame() {
    if (total == 210) {
      clearInterval(id);
    } else {
      total++;
      height = height + 0.47619047619048;
      elem.style.height = height + '%';
      var num = 21 - total * 1 / 10;
      num = num.toFixed(0)
      document.getElementById("nummer").innerHTML = num;

      if (num == 0 && called == false) {
          setTimeout(function(){ alert("Game Over"); }, 500);
          called = true;
          clearInterval(id);
          return;
      } 
    }

  }

}, 2000);
   
}


// Split image 4x3 - Shuffle Position


var canvas = document.createElement('canvas'), // In memory canvas
    ctx    = canvas.getContext("2d"),
    parts  = [],                               // to store base64 strings
    img    = new Image();

img.onload = split_12;
//img.src = "http://192.168.178.22:3000/img/banner-landscape.jpg"
img.src = "https://s3-eu-west-1.amazonaws.com/wagawin-ad-platform/media/testmode/banner-landscape.jpg"


var cols=4;
var rows=3;

 
 var shufflePieces = [];
 shufflePieces = shuffleArray(["0","1","2","3","4","5","6","7","8","9","10","11"]);
 var temporal = [];


function split_12(){

  var iw = img.width  / cols,  // 320
      ih = img.height / rows;  // 240

  canvas.width  = iw;
  canvas.height = ih;


  for(var i=0; i<cols*rows; i++){

      if (i>7) {

        var x = (-iw*i) % (iw*cols),
        y = -ih*2;

      } else {

        var x = (-iw*i) % (iw*cols),
        y = ((ih*i)<=ih*3) ? 0 : -ih ;
      }
    

    ctx.drawImage(this, x, y, cols*iw, rows*ih); // img, x, y, w, h

    parts.push( canvas.toDataURL('image/jpeg', 0.3) ); 
    var slicedImage = document.createElement("img");
    slicedImage.setAttribute("class", "piece");
    slicedImage.src = parts[i];
    document.getElementById("c"+shufflePieces[i]).appendChild( slicedImage );

    }  
     getOriginalPosition();     
};


function shuffleArray(array) {
   var temp = [];
   var len=array.length;
   while(len){
      temp.push(array.splice(Math.floor(Math.random()*array.length),1)[0]);
      len--;
   }
   return temp;
}


function getOriginalPosition() {
   for (var t = 0; t < shufflePieces.length; t++) {
     temporal[t] = shufflePieces.indexOf(t.toString());
   }
 //console.log(temporal);
}


// Make Canvas Sortable - drag and drop fubction

$(document).bind('pageinit', function() {
    $( "#sortable" ).sortable();
    $( "#sortable" ).disableSelection();
  });

  var droppableParent;
  
  $('ul .element').draggable({
    revert: 'invalid',
    revertDuration: 200,
    start: function () {
      droppableParent = $(this).parent();     
      $(this).addClass('being-dragged');
    },
    stop: function () {
      $(this).removeClass('being-dragged');
    }
  });
  
  $('ul li').droppable({
    hoverClass: 'drop-hover',
    drop: function (event, ui) {

      var draggable = $(ui.draggable[0]),
        draggableOffset = draggable.offset(),
        container = $(event.target),
        containerOffset = container.offset();

        var grapped = draggable["0"].offsetParent.id;
        var dropped = $(this).attr('id');
        swapPosition(grapped, dropped);

          if (checkOrderedArrElm(temporal,2)) {
          setTimeout(function(){ alert("Super!"); }, 500);
        }

      $('.element', event.target).appendTo(droppableParent).css({opacity: 0}).animate({opacity: 1}, 100);  
      draggable.appendTo(container).css({left: draggableOffset.left - containerOffset.left, top: draggableOffset.top - containerOffset.top}).animate({left: 0, top: 0}, 100);
    }
  });


// Update canvas on swaping position

function swapPosition(x,y) {

for (var i = 0; i < temporal.length; i++) {
  
  if (temporal[i] == x) {
    var temp = temporal[y];
    temporal[y] = temporal[x];
    temporal[x] = temp;
    console.log("Swap de " + x + " - "+y+" array position: "+temporal[y]+" - "+temporal[x]);
    console.log(temporal);
    return;
  }
}

} 


// Always check if canvas array is ordered incremental

function checkOrderedArrElm(a, b) {
    "use strict"; // optional.
    // --------------------------------------------
    // a is the array input to be tested.
    // --------------------------------------------
    // b is optional.
    // Undefined b (or other value besides 1) for ascending sequence.
    // b === 1 for descending sequence test.
    // --------------------------------------------
    var m = 0; // counter for loop.
    var current_num;
    var next_num;
    var result = a;
    var test;
    if (a !== undefined) {
        if (a.constructor === Array) { // check if input a is array object.
            result = true;
            while (m < a.length) { // loop through array elements.
                current_num = a[m];
                next_num = a[m + 1];
                if (typeof current_num === "number" &&
                        typeof next_num === "number") {
                    if (b === 1) {
                        test = current_num <= next_num; // descending.
                    } else {
                        test = current_num >= next_num; // ascending.
                    }
                    if (test) { // found unordered/same elements.
                        result = false;
                        break;
                    }
                }
                m += 1;
            }
        }
    }
    return result;
}



// Close button

document.getElementById("button").onclick = function() {close()};
function close() {
  document.getElementById("container_puzzle").classList.add("hidden");
}


   