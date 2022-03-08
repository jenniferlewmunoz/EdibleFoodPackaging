/*******************************************************************************************************************
      Moody
    by Scott Kildall
 
  Color Palette Values:

  Black: #031927
  Turquoise: #3ED8D2
  Canary: #FFF689
  Sizzling Red: #F2545B
  Pale Purple: #E9D6EC

    Uses the p5.ComplexStateMachine library. Check the README.md + source code documentation
    The index.html needs to include the line:  <script src="p5.complexStateManager.js"></script>
*********************************************************************************************************************/

var complexStateMachine;           // the ComplexStateMachine class
var clickablesManager;             // our clickables manager
var clickables;                    // an array of clickable objects

var currentStateName = "";
var moodImage;

// Color
var bkColor = '#031927';
var textColor = '#E9D6EC';

// Fonts
var buttonFont;
var titleFont;

// Variables for splash page
var splashImages = [];
var currentSplashImage = 0;
var timer;

function preload() {
  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  complexStateMachine = new ComplexStateMachine("data/interactionTable.csv", "data/clickableLayout.csv");

  buttonFont = loadFont("fonts/OpenSans.ttf");
  titleFont = loadFont("fonts/OpenSans.ttf");

  // Preload images of girl on splash page
  splashImages[0] = loadImage('assets/girl_part_1.png');
  splashImages[1] = loadImage('assets/girl_part_2.png');
  splashImages[2] = loadImage('assets/girl_part_3.png');
}

// Setup code goes here
function setup() {
  createCanvas(1280, 720);
  imageMode(CENTER);

  // setup the clickables = this will allocate the array
  clickables = clickablesManager.setup();

  // setup the state machine with callbacks
  complexStateMachine.setup(clickablesManager, setImage, stateChanged);

  // call OUR function to setup additional information about the p5.clickables
  // that are not in the array 
  setupClickables();

  // Set up the timer
  timer = new Timer(1000);
  timer.start();

  //textAlign(CENTER, CENTER);
}


// Draw code goes here
function draw() {
  drawBackground();
  drawImage();
  drawOther();
  drawUI();
}

function setupClickables() {
  // All clickables to have same effects
  for (let i = 0; i < clickables.length; i++) {

    // Call back function
    clickables[i].onHover = clickableButtonHover;
    clickables[i].onOutside = clickableButtonOnOutside;
    clickables[i].onPress = clickableButtonPressed;

    // Customize the button
    clickables[i].textFont = buttonFont;
    clickables[i].width = 150;
    clickables[i].height = 60;
    clickables[i].textSize = 25;
    clickables[i].strokeWeight = 5;

    // Background color (232, 232, 230, 170);
    clickables[i].rColor = 232;
    clickables[i].gColor = 232;
    clickables[i].bColor = 230;
    clickables[i].transparency = 170;
  }
}

// tint when mouse is over
clickableButtonHover = function () {
  this.color = "#FFFFFF";
  this.noTint = false;
  this.tint = "#FF0000";
}

// color a light gray if off
clickableButtonOnOutside = function () {
  // backto our gray color
  this.color = "#E9D6EC";
}

clickableButtonPressed = function () {
  complexStateMachine.clickablePressed(this.name);
}

// this is a callback, which we use to set our display image
function setImage(imageFilename) {
  moodImage = loadImage(imageFilename);
}

// this is a callback, which we can use for different effects
function stateChanged(newStateName) {
  currentStateName = newStateName;
  console.log(currentStateName);
}

//==== MODIFY THIS CODE FOR UI =====/

function drawBackground() {
  background(color(bkColor));
}

function drawImage() {
  if (moodImage !== undefined) {
    image(moodImage, width / 2, height / 2);
  }
}

function drawOther() {
  push();

  if (currentStateName == "Splash") {
    drawSplashScreen();
  }

  // Draw mood — if not on Splash or Instructions screen  
  if (currentStateName !== "Splash" && currentStateName !== "Instructions") {
    fill(color(textColor));
    textFont(buttonFont);
    textSize(24);
    text(currentStateName, width / 2, 50);
  }

  pop();
}

//-- right now, it is just the clickables
function drawUI() {
  clickablesManager.draw();
}

function drawSplashScreen() {

  // Make rectangle
  fill(232, 232, 230, 170);
  strokeWeight(20);
  rect(70, 70, 600, 450, 40);

  // Write title
  fill(0);
  textSize(70);
  textAlign(CENTER);
  textFont(titleFont);
  text("The Adventure to Edible Food Packaging", 135, 140, 500, 400);
  textSize(20);
  text("Brought to you by Albert E. at EFP Labs", 380, 480);

  // Print one image of the girl
  let img = splashImages[currentSplashImage];
  let imgSize = 600;

  img.resize(imgSize, imgSize);
  image(img, 950, height - (imgSize / 2));

  // Restart the image, and increase image index
  if (timer.expired()) {
    currentSplashImage++;
    if (currentSplashImage == 3) {
      currentSplashImage = 0;
    }
    timer.start();
  }
}