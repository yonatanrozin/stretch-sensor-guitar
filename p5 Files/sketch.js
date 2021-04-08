let tempo = 10; //duration of playback notes (in frames/note)
let buttonCount = 16; //change to desired # of buttons in the sequencer

let circles = []; //holds visual expanding circles objects
let buttons = [buttonCount]; //holds button objects

let playIndex = 0; //button note currently being played
let playing = false; //true during sequencer playback
let pressTime; //time at which sequencer begins playback

let serial; // variable to hold an instance of the serialport library
let port = '/dev/tty.usbmodem14401';
let inData = 0; //incoming data

let notes = [buttonCount];
let guitar;
function preload() {
  guitar = loadImage("guitar.jpg");
  for (let i = 0; i < buttonCount; i++) {
    notes[i] = loadSound('guitarNote.wav');
  }
}

function setup() {
  frameRate(30);
  createCanvas(windowHeight, windowHeight);
  for (let j = 0; j < buttonCount; j++) {
    buttons[j] = new Button(j);
  }

  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on('list', printList); // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen); // callback for the port opening
  serial.on('data', serialEvent); // callback for when new data arrives
  serial.on('error', serialError); // callback for errors
  serial.on('close', portClose); // callback for the port closing

  serial.list(); // list the serial ports
  serial.open(port);
}

// get the list of ports:
function printList(portList) {
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    console.log(i + portList[i]);
  }
}

function serverConnected() {
  console.log('connected to server.');
}

function portOpen() {
  console.log('the serial port opened.')
}

function serialEvent() { //triggers when receiving an input
  inData = serial.readLine();
  if (inData.length > 0) {
    var noteInfo = inData.split(',');
    playSound(noteInfo[0], noteInfo[1], noteInfo[2]);
  }
}

function serialError(err) {
  console.log('Something went wrong with the serial port. ' + err);
}

function portClose() {
  console.log('The serial port closed.');
}



function playSound(string, volume, pitch) {

  if (string == 0) {
    pitch = map(pitch, 0, 1022, 2, 1);
    volume = map(volume, 630, 570, 0.3, 2);
  } else if (string == 1) {
    pitch = map(pitch, 0, 1022, 2, 1);
    volume = map(volume, 610, 560, 0.3, 2);
  } else if (string == 2) {
    pitch = map(pitch, 0, 1022, 2, 0.5);
    volume = map(volume, 650, 580, 0.3, 2);
  }

  notes[string].stop(); //prevents multiple notes on one string
  notes[string].setVolume(volume);
  notes[string].rate(pitch);
  notes[string].play();
  circles.push(new ExpandingCircle(string, volume));
  recordNote(volume, pitch);
}

function draw() {
  image(guitar, 0, 0, width, height);
  drawCircles();
  drawButtons();
  if (playing) playback();
}

class ExpandingCircle {
  constructor(string, volume) {
    this.string = string;
    this.xPos = 3 * width / 8 + this.string * width / 8;
    this.yPos = 11 * (width / 16);
    this.radius = 0;
    this.alpha = 255;
    this.volume = volume;

  }

  drawCircle() {
    noFill();
    let strokeWidth = map(this.volume, 0.3, 2, 1, 10);
    strokeWeight(strokeWidth);
    stroke(0, 0, 0, this.alpha);
    circle(this.xPos, this.yPos, this.radius);
    this.radius += 3;
    this.alpha -= 3;
  }
}

class Button {
  constructor(i) {
    this.i = i
    this.xPos = width / 16 + this.i * (width / 16);
    this.yPos = width / 16;
    this.size = width / 16;
    this.isPressed = 0;
    this.notePitch = 0;
    this.noteVolume = 0;
  }

  drawButton() {
    strokeWeight(3);
    stroke(0);
    if (this.isPressed == 0) {
      fill(0, 0, 0, 255);

    } else if (this.isPressed == 1) {
      fill(255, 0, 0, 255);

    } else if (this.isPressed == 2) {
      fill(0, 255, 0, 255);
    }
    stroke(255);
    rect(this.xPos, this.yPos, this.size, this.size);
  }

  pressed() {
    return (mouseX > this.xPos && mouseX < this.xPos + this.size && mouseY > this.yPos && mouseY < this.yPos + this.size);
  }
  
  playNote() {
    notes[this.i].stop();
    notes[this.i].setVolume(this.noteVolume);
    notes[this.i].rate(this.notePitch);
    notes[this.i].play();
  }
}

function mousePressed() {

  for (let i = 0; i < buttonCount; i++) {
    buttons[i].isPressed = buttons[i].pressed();
  }
}

function keyPressed() {
  if (keyCode === 32) { //if spacebar pressed
    playing = true;
    pressTime = frameCount;
    playIndex = 0;
    for (let i = 0; i < buttonCount; i++) {
      buttons[i].isPressed = 0; //unpresses any buttons
    }
  }
}

function recordNote(volume, pitch) {
  for (let i = 0; i < buttonCount; i++) {
    if (buttons[i].isPressed) {
      buttons[i].noteVolume = volume;
      buttons[i].notePitch = pitch;
    }
  }
}

function drawCircles() {
  for (let i = 0; i < circles.length; i++) {
    circles[i].drawCircle();
  }
}

function drawButtons() {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].drawButton();
  }
}

function playback() {
  var playbackFrames = frameCount - pressTime; //frames since keyPressed
  var player = playbackFrames % tempo - 1; //# of notes since keyPressed
  if (player == 0) {
    buttons[playIndex].playNote();
    buttons[playIndex].isPressed = 2;
    if (playIndex < buttonCount) {
      playIndex++;
    }
    if (playIndex == buttonCount) {
      playing = false;
    }

  }
}
