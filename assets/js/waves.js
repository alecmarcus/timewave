var c = null;       // Canvas
var p5new = new p5();
var wavNum = 1;
document.addEventListener("keyup", function (evt) {
  // console.log(evt.keyCode);
  // on the h key release, hide the boxes
  if (evt.keyCode === 72) {
    document.getElementById("labels").classList.toggle("hidden");
    var fs = document.querySelectorAll("fieldset");
    for (var x = 0; x < fs.length; x++) {
      fs[x].classList.toggle("hidden");
    }
  }
});

function Wave(y, amp, prd, sz, dst, spd) {
  this.w = null;                   // Width of entire wave
  // var xspacing = 20;    // Distance between each horizontal location   <Now controlled by dotDstSldr>
  this.theta = 0.0;         // Start angle
  // var amplitude = 5.0;  // Height of wave                              <Now controlled by ampSldr>
  // var period = 200.0;   // How many pixels before the wave repeats     <Now controlled by prdSldr>
  this.dx = null;                  // Value for incrementing x
  this.yvalues = [];             // Using an array to store height values for the wave

  // Control wave properies by slider. In order: amplitude, period, dot size, xspacing, speed (theta +=), theta (not working)
  // Create global variables to be controlled by sliders
  // this.xspacing;
  // this.theta;
  // this.amplitude;
  // this.period;

  // var p5new = new p5();
  this.ampSldr = p5new.createSlider(0, 200, amp);
  this.prdSldr = p5new.createSlider(0, 2000, prd);
  this.dotSzSldr = p5new.createSlider(1, 50, sz);
  this.dotDstSldr = p5new.createSlider(0.1, 400, dst, 0.1);
  this.speedSldr = p5new.createSlider(0.0005, 5, spd, 0.001);
  // this.thetaSldr = p5new.createSlider(0, 360, 0);

  // Create a div for each fieldset
  var d = document.createElement("div");

  // Put the sliders in their own fieldset
  var f = document.createElement("fieldset");

  // Generate random color for the fieldset
  // f.style.backgroundColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

  // Appedn the fieldset into the div
  d.appendChild(f);

  // Create and configure a fieldset legend
  var l = document.createElement("legend");
  l.textContent = "Wave " + wavNum;

  // Increment the legend counter
  wavNum++;

  // Append the legend into the fieldset
  f.appendChild(l);

  // Get references to the underlying DOM elements:
  var ampElt = this.ampSldr.elt;
  var prdElt = this.prdSldr.elt;
  var dotSzElt = this.dotSzSldr.elt;
  var dotDstElt = this.dotDstSldr.elt;
  var speedElt = this.speedSldr.elt;

  // Append the input elements into the fieldset
  f.appendChild(ampElt);
  f.appendChild(prdElt);
  f.appendChild(dotSzElt);
  f.appendChild(dotDstElt);
  f.appendChild(speedElt);

  // ******************************************************

  function insertAfter(elem, refElem) {
    var parent = refElem.parentNode;
    var next = refElem.nextSibling;

    if (next) {
      return parent.insertBefore(elem, next)
    } else {
      return parent.appendChild(elem)
    }

  }

  // Generate spans for each slider
  var sliders = [ampElt, prdElt, dotSzElt, dotDstElt, speedElt];
  sliders.forEach(function (slider) {
    // Create container for slider value
    var s = document.createElement("span");
    s.textContent = "---";

    // Insert the element just after the slider using custom insertAfter function
    insertAfter(s, slider);

    // Set up event handler for slider
    slider.addEventListener("input", function () {
      // Update corresponding span with slider value
      s.textContent = this.value;
    });

  });

  // ********************************************************

  // Insert the div into the body
  document.body.appendChild(d);
  this.calcWave = function() {
    // theta = thetaSldr.value();   Setting to a constant freezes the wave. To use, best to set a modifier, such as theta + thetaSldr.value();
    this.amplitude = this.ampSldr.value();
    // Increment theta (try different values for 'angular velocity' here) (read: speed)
    // theta += 0.02;
    this.theta += this.speedSldr.value();

    // For every x value, calculate a y value with sine function
    var x = this.theta;
    for (var i = 0; i < this.yvalues.length; i++) {
      this.yvalues[i] = (sin(x) * this.amplitude) - y; //offest waves
      x+=this.dx;
    }
  }

  //***************************************


  this.renderWave = function() {
    var dotSz = this.dotSzSldr.value();
    noStroke();
    fill(255);
    // A simple way to draw the wave with an ellipse at each location
    for (var x = 0; x < this.yvalues.length; x++) {
      ellipse(x*this.xspacing, height/2+this.yvalues[x], dotSz, dotSz); // play with these for non-circular dots
    }
  }

  // Continually recalculate the period by redifining dependent varables
  this.setPeriod = function() {
    this.xspacing = this.dotDstSldr.value();
    this.period = this.prdSldr.value();
    this.w = width;
    this.dx = (TWO_PI / this.period) * this.xspacing;
    this.yvalues = new Array(floor(this.w/this.xspacing));
  }

}

// For dynamic resizing of canvas and wave
function setParams() {
  c.size(document.documentElement.clientWidth, document.documentElement.clientHeight);
  waves.forEach(function(elem){
    elem.setPeriod;
  });
}

function setup() {
  // create canvas in c variable. size doesnt matter, setParams immediately corrects it
  c = createCanvas(100, 100);
  setParams();
}

// keep canvas dimensions equal to window dimensions
function windowResized() {
  setParams();
}

//Create array of waves
// BASE CONVERSIONS (1s/s): ---      9,   ---   ---    0.1
//           if 1:1:1, use: amp,   prd,   sz,   dst,   spd
//                       H:  50    540     4,     9  .0016
//                       M:  50     27     4,  0.45   .005
//                       S:  50     27     4,  0.25    0.3
var waves = [new Wave( 250,  50,   540,   20,   135, .00027),
             new Wave(   0,  50,    360,    4,  36,  .0016),
             new Wave(-250,  50,    1760,    4,  4,    .1)];

function draw() {
  background(0);
  for(var i = 0; i < waves.length; i++) {
    waves[i].calcWave();
    waves[i].renderWave();
    waves[i].setPeriod();
  }
}
