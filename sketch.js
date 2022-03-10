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

// Player data: Scientist, Mackey, Owner, Mayor, Citizen
var reason;
var icons = [];
var scores = [10, 0, 0, 0, 0];
var unlocked = [true, false, false, false, false];

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

// Scientist Images
var scientist = [];

function preload() {
  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  complexStateMachine = new ComplexStateMachine("data/interactionTable.csv", "data/clickableLayout.csv");

  buttonFont = loadFont("fonts/OpenSans.ttf");
  titleFont = loadFont("fonts/OpenSans.ttf");

  // Preload images of girl on splash page
  splashImages[0] = loadImage('assets/girl_part_1.png');
  splashImages[1] = loadImage('assets/girl_part_2.png');
  splashImages[2] = loadImage('assets/girl_part_3.png');

  // Preload images of scientist
  scientist[0] = loadImage('assets/scientist.png');
  scientist[1] = loadImage('assets/scientist_upset.png');
  scientist[2] = loadImage('assets/scientist_wave_left.png');
  scientist[3] = loadImage('assets/scientist_wave_right.png');

  // Preload icon
  icons[0] = loadImage('assets/scientist_icon.png');
  icons[1] = loadImage('assets/mackey_icon.png');
  icons[2] = loadImage('assets/owner_icon.png');
  icons[3] = loadImage('assets/mayor_icon.png');
  icons[4] = loadImage('assets/citizen_icon.png');
  icons[5] = loadImage('assets/lock_icon.png');
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

// Update button when mouse is hovering over it
clickableButtonHover = function () {
  this.rColor = 255;
  this.gColor = 255;
  this.bColor = 255;
  this.transparency = 255;
}

// Update button when mouse is no longer hovering over it
clickableButtonOnOutside = function () {
  this.rColor = 232;
  this.gColor = 232;
  this.bColor = 230;
  this.transparency = 170;
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

function drawUI() {
  clickablesManager.draw();
}

// Draws a box without text
function drawBox(x, y, w, h) {
  fill(232, 232, 230, 170);
  strokeWeight(6);
  rect(x, y, w, h, 40);
}

// Draws a box with text
function drawTextBox(x, y, w, h, fontSize, message) {
  drawBox(x, y, w, h);

  // Style text
  fill(0);
  textSize(fontSize);
  textAlign(CENTER);
  textFont(titleFont);

  // Write/Format text
  let padding = 40;
  text(message, x + padding, y + padding, w - padding * 2, h - padding * 2);
}

function drawOther() {
  push();
  if (currentStateName == "Splash") drawSplashScreen();
  if (currentStateName == "Intro1") drawIntro1();
  if (currentStateName == "Intro2") drawIntro2();
  if (currentStateName == "Intro3") drawIntro3();
  if (currentStateName == "Scene1") drawScene1();
  if (currentStateName == "EndGame") drawEndGame();
  if (currentStateName == "Scene1Slide1") drawS1S1();
  pop();
}

function drawUI() {
  clickablesManager.draw();
}

function drawSplashScreen() {

  // Draw rect for title
  drawBox(70, 70, 600, 450);

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
  let imgSize = 700;

  img.resize(imgSize, imgSize);
  image(img, 960, height - (imgSize / 2));

  // Restart the image, and increase image index
  if (timer.expired()) {
    currentSplashImage++;
    if (currentSplashImage == 3) {
      currentSplashImage = 0;
    }
    timer.start();
  }
}

function drawEndGame() {

  // Draw UI
  drawScientist(1, 250);
  drawBox(850, 40, 350, 600);

  // Draw reason textbox
  drawTextBox(450, 40, 350, 400, 20, reason);

  // Draw text
  textSize(30);
  fill(0);
  text("End game results:", 1020, 100);

  // Draw data
  let yPos = 200;
  let meterY = 190;
  icons[5].resize(70, 70);

  for (i = 0; i < icons.length - 1; i++) {

    if (unlocked[i]) {
      // Draw icon
      icons[i].resize(70, 70);
      image(icons[i], 910, yPos);

      // Draw meter
      fill(255);

      let meterX = 960;
      let score = scores[i];

      for (j = score; score > 0; score = score - 10) {
        rect(meterX, meterY, 20, 20);
        meterX = meterX + 20;
      }
    } else {
      image(icons[5], 910, yPos);
    }
    yPos += 90;
    meterY = meterY + 90;
  }
}

function drawIconBox() {
  scientistIcon.resize(60, 60);
  image(scientistIcon, 900, 160);
}

function drawScientist(index, xcord) {
  let imgSize = 700;
  scientist[index].resize(imgSize, imgSize);
  image(scientist[index], xcord, height - (imgSize / 2));
}

function drawIntro1() {
  drawScientist(3, 300);
  let message = "Ready to embark on an adventure to a plastic-free world?";
  drawTextBox(620, 130, 470, 300, 45, message);
}

function drawIntro2() {
  drawScientist(0, 300);
  let message = "It's 2050, and we’ve finally created a great replacement for single-use plastic that wraps most our foods today. Edible food packaging would serve our environment in ways we can’t even imagine! Although we have lot’s of supporters, we have a lot of people trying to stop a mandate for edible food packaging here in San Francisco."
  drawTextBox(620, 130, 470, 290, 20, message);
}

function drawIntro3() {
  drawScientist(2, 900);
  let message = "Otherwise, I’m the lead scientist Albert at EFP Labs, we are the first to create edible food packaging that has all the properties to work in today’s world!\n\n\nWill you join us to reduce the production of single-use plastics and change the world as we know it today?";
  drawTextBox(120, 130, 500, 302, 20, message);
  reason = "By 2200, due to plastic littered oceans all sea life becomes extinct, and the overwhelming amount of plastic on land has decomposed and released plastic toxins that posion our soils leading to the extinction of the human population.";
}

function drawScene1() {
  drawScientist(0, 300);
  drawBox(530, 210, 600, 250);
  fill(0);
  textSize(100);
  text("Scene One:", 570, 350);
  textSize(40);
  text("The Logistics", 710, 400);
}

function drawS1S1() {
  drawScientist(0, 300);
  let message = "We’re going to need some funding to start prototyping in stores to show the world how our edible food packing works. Should we ask an environmental organization to fund us, or take a loan out ourselves to ensure that we are the only ones credited.";
  drawTextBox(550, 140, 500, 230, 20, message);
}