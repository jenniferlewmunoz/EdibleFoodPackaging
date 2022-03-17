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
var backgroundImage;

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
var abel_regular;

// Variables for splash page
var splashImages = [];
var titleImages = [];
var continue_button;
var currentSplashImage = 0;
var currentTitleImage = 0;
var timer;

// Players
var scientist = [];
var mackey;
var owner;
var mayor;
var citizen;

function preload() {
  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  complexStateMachine = new ComplexStateMachine("data/interactionTable.csv", "data/clickableLayout.csv");

  // Preload fonts
  buttonFont = loadFont("fonts/OpenSans.ttf");
  titleFont = loadFont("fonts/OpenSans.ttf");
  abel_regular = loadFont("fonts/Abel-Regular.ttf");

  // Preload images of girl on splash page
  splashImages[0] = loadImage('assets/girl_part_1.png');
  splashImages[1] = loadImage('assets/girl_part_2.png');
  splashImages[2] = loadImage('assets/girl_part_3.png');

  // Preload images of title on splash page
  titleImages[0] = loadImage('assets/title_down.png');
  titleImages[1] = loadImage('assets/title_up.png');

  // Preload image of continue button on splash page
  continue_button = loadImage('assets/continue.png');

  // Preload images of scientist
  scientist[0] = loadImage('assets/scientist.png');
  scientist[1] = loadImage('assets/scientist_upset.png');
  scientist[2] = loadImage('assets/scientist_wave_left.png');
  scientist[3] = loadImage('assets/scientist_wave_right.png');

  // Preload images of players 
  mackey = loadImage('assets/mackey.png');
  owner = loadImage('assets/small_business_owner.png');
  mayor = loadImage('assets/mayor_happy.png');
  citizen = loadImage('assets/citizen.png');

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
    clickables[i].textFont = abel_regular;
    clickables[i].width = 150;
    clickables[i].height = 60;
    clickables[i].textSize = 35;

    // Background color (232, 232, 230, 170);
    clickables[i].rColor = 255;
    clickables[i].gColor = 255;
    clickables[i].bColor = 255;
    clickables[i].transparency = 0;
  }
}

// Update button when mouse is hovering over it
clickableButtonHover = function () {
  this.textColor = "#4D7BB0";
}

// Update button when mouse is no longer hovering over it
clickableButtonOnOutside = function () {
  this.textColor = "#000000";
}

clickableButtonPressed = function () {
  complexStateMachine.clickablePressed(this.name);
}

// this is a callback, which we use to set our display image
function setImage(imageFilename) {
  backgroundImage = loadImage(imageFilename);
}

// this is a callback, which we can use for different effects
function stateChanged(newStateName) {
  currentStateName = newStateName;
  console.log(currentStateName);
}

// First draw white background for smooth transitions
function drawBackground() {
  background(255);
}

// Draws background image for each slide
function drawImage() {
  if (backgroundImage !== undefined) {
    image(backgroundImage, width / 2, height / 2);
  }
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
  textFont(abel_regular);

  // Write/Format text
  let padding = 40;
  text(message, x + padding, y + padding, w - padding * 2, h - padding * 2);
}

// TEST FUNCTION ===============================================
function drawTextBar(message, x, y, w, h) {
  noStroke();
  fill(232, 232, 230, 220);
  rect(0, 360, width, 250);

  // Name Box

  stroke(0);
  fill(0, 0, 0);
  textFont(abel_regular);
  textSize(35);
  //rect(x, y, w, h);
  text(message, x, y, w, h);
}

// Draw small UI elements depending on currentStateName
function drawOther() {
  push();
  if (currentStateName == "Splash") drawSplashScreen();
  if (currentStateName == "Intro1") drawIntro1();
  if (currentStateName == "Intro2") drawIntro2();
  if (currentStateName == "Intro3") drawIntro3();
  if (currentStateName == "Scene1") drawScene1();
  if (currentStateName == "EndGame") drawEndGame();
  if (currentStateName == "Scene1Slide1") drawS1S1();
  if (currentStateName == "Scene1Slide1") drawS1S1();
  if (currentStateName == "StoreOption1") drawStoreOption1();
  if (currentStateName == "StoreOption2") drawStoreOption2();
  if (currentStateName == "ChooseWholeFoods") drawChooseWholeFoods();
  if (currentStateName == "ChooseSmallBusiness") drawChooseSmallBusiness();
  if (currentStateName == "Scene2") drawScene2();
  pop();
}

// Draw clickables
function drawUI() {
  clickablesManager.draw();

  // Draw continue button on splash page
  if (currentStateName == "Splash") {
    continue_button.resize(230, 200);
    image(continue_button, 825, 510);
  }
}

function drawSplashScreen() {

  // Print title
  let img1 = titleImages[currentTitleImage];
  let imgSize1 = 750;
  img1.resize(imgSize1, imgSize1);
  image(img1, 830, 250);

  // Print one image of the girl
  let img2 = splashImages[currentSplashImage];
  let imgSize2 = 650;
  img2.resize(imgSize2, imgSize2);
  image(img2, 250, height - (imgSize2 / 2));

  // Restart the image, and increase image index
  if (timer.expired()) {
    currentSplashImage++;
    currentTitleImage++;
    if (currentSplashImage == 3) {
      currentSplashImage = 0;
    }
    if (currentTitleImage == 2) {
      currentTitleImage = 0;
    }
    timer.start();
  }

  //Reset end game data
  scores = [10, 0, 0, 0, 0];
  unlocked = [true, false, false, false, false];
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
  textSize(15);

  let yCord = 160;
  text("Upset", 970, yCord);
  text("Neutral", 1060, yCord);
  text("Happy", 1150, yCord);

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

// Helper function for drawIntro1-3() that draws scientist image
function drawScientist(index, xcord) {
  let imgSize = 700;
  scientist[index].resize(imgSize, imgSize);
  image(scientist[index], xcord, height - (imgSize / 2));
}

function drawIntro1() {

  let message = "Ready to embark on an adventure to a plastic-free world?";
  drawTextBar(message, 500, 430, 600, 180);
  drawScientist(3, 300);
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

// Draws the scene 1 slide
function drawScene1() {
  drawScientist(0, 300);
  drawBox(530, 210, 600, 250);
  fill(0);
  textSize(100);
  text("Scene One:", 570, 350);
  textSize(40);
  text("The Logistics", 710, 400);
}

// Scene 1, Slide 1
function drawS1S1() {
  drawScientist(0, 300);
  let message = "We’re going to need some funding to start prototyping in stores to show the world how our edible food packing works. Should we ask an environmental organization to fund us, or take a loan out ourselves to ensure that we are the only ones credited.";
  drawTextBox(560, 140, 500, 230, 20, message);
}

function drawStore(message, textBoxHeight) {
  // Draw text
  drawTextBox(370, 120, 500, textBoxHeight, 20, message);

  // Draw players
  let imgSize = 700;
  mackey.resize(imgSize, imgSize);
  image(mackey, 200, height - (imgSize / 2));

  owner.resize(imgSize, imgSize);
  image(owner, 1070, height - (imgSize / 2));

  // Update end game data
  reason = "Unfortunately, it was realized that new technology was needed to ensure longer shelve lives in stores and neither the Lab or the store had that kind of funded so the project has come to an end.";
  unlocked[1] = true;
  unlocked[2] = true;
  scores[1] = 40;
  scores[2] = 40;
}

function drawStoreOption1() {
  // Draw text
  let message = "WWF loved the idea of edible food packing, and have gernously offered to cover all the prototyping cost to gain exposure. Now, we need to go into stores and ask to prototype our products on their shelves. Who should we ask?";
  drawTextBox(370, 120, 500, 230, 20, message);

  // Draw players
  let imgSize = 700;
  mackey.resize(imgSize, imgSize);
  image(mackey, 200, height - (imgSize / 2));

  owner.resize(imgSize, imgSize);
  image(owner, 1070, height - (imgSize / 2));

  // Update end game data
  unlocked[1] = true;
  unlocked[2] = true;
  scores[1] = 40;
  scores[2] = 40;
}

function drawStoreOption2() {
  // Draw text
  let message = "The Lab was approved for a loan that was only 50% of asking, but it’s still a good start. Now, we need to go into stores and ask to prototype our products on their shelves. Who should we ask?";
  drawTextBox(370, 150, 500, 190, 20, message);

  // Draw players
  let imgSize = 700;
  mackey.resize(imgSize, imgSize);
  image(mackey, 200, height - (imgSize / 2));

  owner.resize(imgSize, imgSize);
  image(owner, 1070, height - (imgSize / 2));

  // Update end game data
  reason = "Unfortunately, it was realized that new technology was needed to ensure longer shelve lives in stores and neither the Lab or the store had that kind of funds so the project has come to an end.";
  unlocked[1] = true;
  unlocked[2] = true;
  scores[1] = 40;
  scores[2] = 40;
}

function drawChooseWholeFoods() {
  // Draw text
  let message = "We’ve successfully launched our Edible Food Packed products in Whole Foods all throughout San Francisco, but just after a few weeks, we began to notice a problem. The shelve lives of the products are a lot shorter than plastic wrapped items. We’re going to have to put technology in stores that allows longer shelve lives.";
  drawTextBox(400, 100, 490, 300, 20, message);

  // Draw players
  let imgSize = 700;
  mackey.resize(imgSize, imgSize);
  image(mackey, 200, height - (imgSize / 2));

  scientist[0].resize(imgSize, imgSize);
  image(scientist[0], 1070, height - (imgSize / 2));

  // Update end game data
  scores[1] = 20;
}

function drawChooseSmallBusiness() {
  // Draw text
  let message = "We’ve successfully launched our Edible Food Packed products in a store, but just after a few weeks, we began to notice a problem. The shelve lives of the products are a lot shorter than plastic wrapped items. We’re going to have to put technology in stores that allows longer shelve lives.";
  drawTextBox(400, 100, 490, 300, 20, message);

  // Draw players
  let imgSize = 700;
  owner.resize(imgSize, imgSize);
  image(owner, 200, height - (imgSize / 2));

  scientist[0].resize(imgSize, imgSize);
  image(scientist[0], 1070, height - (imgSize / 2));

  // Update end game data
  reason = "Unfortunately, working with a small business did not get Edible Food Packaging the exposure it needed to continue production and testing so WWF pulled their funding and the project has come to an end.";
  scores[2] = 20;
}

function drawScene2() {
  // Draw mayor
  let imgSize = 700;
  mayor.resize(imgSize, imgSize);
  image(mayor, 280, height - (imgSize / 2));

  // Draw text
  drawBox(530, 210, 600, 250);
  fill(0);
  textSize(100);
  text("Scene Two:", 570, 350);
  textSize(40);
  text("Thoughts of the people", 640, 400);
}