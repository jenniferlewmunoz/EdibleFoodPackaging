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
    clickables[i].width = 200;
    clickables[i].height = 40;
    clickables[i].textSize = 30;

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

// Draw small UI elements depending on currentStateName
function drawOther() {
  push();

  if (currentStateName == "Splash") drawSplashScreen();
  if (currentStateName == "EndGame") drawEndGame(scientist[1]);
  if (currentStateName == "BestEndGame") drawBestEndGame();

  if (currentStateName == "Intro1") drawIntro1();
  if (currentStateName == "Intro2") drawIntro2();
  if (currentStateName == "Intro3") drawIntro3();

  if (currentStateName == "Scene1") drawScene1();
  if (currentStateName == "Scene1Choice1") drawScene1Choice1();
  if (currentStateName == "ChooseNonProfit") drawChooseNonProfit();
  if (currentStateName == "ChooseLoan") drawChooseLoan();
  if (currentStateName == "ChooseWholeFoods") drawChooseWholeFoods();
  if (currentStateName == "ChooseSmallBusiness") drawChooseSmallBusiness();

  if (currentStateName == "Scene2") drawScene2();
  if (currentStateName == "Scene2Choice1") drawScene2Choice1();
  if (currentStateName == "ChooseListen") drawChooseListen();
  if (currentStateName == "Scene2Choice2") drawScene2Choice2();

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

// ============== HELPER FUNCTIONS ==============
function drawTextBar(message, boxY, boxHeight, x, y, w, h) {

  // Draw transparent bar
  noStroke();
  fill(232, 232, 230, 220);
  rect(0, boxY, width, boxHeight);

  // Draw text
  stroke(0);
  textSize(30);
  fill(0, 0, 0);
  textFont(abel_regular);
  text(message, x, y, w, h);
}

function drawPlayer(player, imgSize, xcord) {
  player.resize(imgSize, imgSize);
  image(player, xcord, height - (imgSize / 2));
}

function drawBox(x, y, w, h) {
  fill(232, 232, 230, 170);
  strokeWeight(6);
  rect(x, y, w, h, 40);
}

function drawTextBox(x, y, w, h, fontSize, message) {
  drawBox(x, y, w, h);

  // Style text
  fill(0);
  textSize(fontSize);
  textAlign(CENTER);
  textFont(abel_regular);

  // Write/Format text
  let padding = 40;
  text(message, x + padding, y + 80, w - padding * 2, h - padding * 2);
}

// ============== FUNCS FOR SPLASH & ENDGAME ==============
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

function drawEndGame(scientist) {

  // Draw UI
  drawPlayer(scientist, 700, 630);
  drawBox(850, 40, 350, 600);

  // Draw text
  drawTextBox(60, 40, 350, 600, 20, reason);
  textSize(30);
  fill(0);
  text("SUMMARY", 230, 100);
  text("END GAME RESULTS", 1030, 100);

  // Draw data labels
  let yCord = 160;
  textSize(15);
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

// ============== INTRO PAGES ==============
function drawIntro1() {
  let message = "Ready to embark on an adventure to a plastic-free world?";
  drawTextBar(message, 360, 250, 490, 435, 510, 180);
  drawPlayer(scientist[3], 700, 300);
}

function drawIntro2() {
  let message = "Hi, I’m Albert and I work here at EFP Labs in San Francisco, CA! At my lab we’ve recently finished creating Edible Food Packaging that could become a great replacement for single-use plastics.";
  drawTextBar(message, 360, 250, 490, 390, 510, 220);
  drawPlayer(scientist[0], 700, 240);
}

function drawIntro3() {
  let message = "Our goal is to replace single-use plastics and have edible food packaging mandated across all the grocery stores in San Francisco. This would serve as an example for other cities & possibly change the world as we know it today! Will you help us?";
  drawTextBar(message, 360, 250, 90, 390, 600, 200)
  drawPlayer(scientist[2], 700, 990);
  reason = "By 2200, due to plastic littered oceans all sea life becomes extinct, and the overwhelming amount of plastic on land has decomposed and released plastic toxins that posion our soils leading to the extinction of the human population.";
}

// ============== SCENE ONE ==============
function drawScene1() {
  noStroke();
  drawTextBar("The Logistics", 360, 250, 720, 485, 300, 100);
  textSize(100);
  text("Scene One:", 600, 470);
  drawPlayer(scientist[0], 700, 300);
}

function drawScene1Choice1() {
  let message = "We need funding to prototype in stores and show the world how our edible food packaging works. Should we ask a non-profit environmental organization to fund our project, or take a loan out ourselves?";
  drawTextBar(message, 360, 250, 450, 390, 530, 220);
  drawPlayer(scientist[0], 700, 250);
}

function drawChooseNonProfit() {
  // Draw text
  let message = "The non-profit organization loved the idea and have generously offered to cover all cost related to increasing exposure. Now where should we prototype our products, a large chain like Whole Foods, or in a small business?";
  textAlign(CENTER);
  drawTextBar(message, 350, 280, 350, 370, 600, 220);

  // Draw players
  drawPlayer(mackey, 600, 190);
  drawPlayer(owner, 580, 1100);

  // Update end game data
  unlocked[1] = true;
  unlocked[2] = true;
  scores[1] = 50;
  scores[2] = 50;
}

function drawChooseLoan() {
  // Draw text
  let message = "The Lab was approved for a loan that was only 50% of asking, but it’s still a good start. Now, we need to go into stores and ask to prototype our products on their shelves. Who should we ask?";
  textAlign(CENTER);
  drawTextBar(message, 390, 240, 350, 410, 600, 220);

  // Draw players
  drawPlayer(mackey, 600, 190);
  drawPlayer(owner, 580, 1100);

  // Update end game data
  reason = "Unfortunately, after prototyping edible food packaging in stores for a few weeks, we came to realize that the self lives were much shorter than those wrapped in plastic. In order to keep a longer shelf life, expensive technology would have to be put into store which the lab couldn’t afford since the loan was only 50 percent of their asking. Edible packed products were pulled from shelves and the invention did not get the exposure it needed.";
  unlocked[1] = true;
  unlocked[2] = true;
  scores[1] = 50;
  scores[2] = 50;
}

function drawChooseWholeFoods() {
  // Draw text
  let message = "We’ve successfully launched in SF’s Whole Foods, however, we’ve come to realize that the shelf life of these products are a lot shorter than those of plastic wrapped items. We’re going to have to put technology that preserves shelf life in store.";
  textAlign(CENTER);
  drawTextBar(message, 350, 280, 350, 370, 600, 220);

  // Draw players
  drawPlayer(mackey, 600, 180);
  drawPlayer(scientist[0], 600, 1100);

  // Update end game data
  reason = "CEO of Whole Foods John Mackey is furious that you've come into his stores with your idea telling him that he has to pay for prototyping costs. Mackey thinks is rude and tells you that he no longer wants to work with EFP Labs. The non-profit organization that was helping you dosen't want any bad publicity with a giant corperation like Whole Foods so they stop funding EFP Labs too ensure there is no trouble.";
  scores[1] = 10;
}

function drawChooseSmallBusiness() {
  // Draw text
  let message = "We’ve successfully launched in a local SF grocery store, however, we’ve come to realize that the shelf life of these products are a lot shorter than those of plastic wrapped items. We’re going to have to put technology that preserves shelf life in store.";
  textAlign(CENTER);
  drawTextBar(message, 350, 280, 350, 370, 600, 220);

  // Draw players
  drawPlayer(owner, 600, 180);
  drawPlayer(scientist[0], 600, 1100);

  // Update end game data
  reason = "Unfortunately, working with a small grocery store business in San Francisco did not get “Edible Food Packaging” the expose it needed to continue prooduction and testing. After months of seeing no return, the non-profit environmental organization decided to end their partnership with EFP Labs and pulled all funding.";
  scores[2] = 20;
}

// ============== SCENE ONE ==============
function drawScene2() {
  drawTextBar("Thoughts of the people", 360, 250, 670, 485, 300, 100);
  textSize(100);
  text("Scene Two:", 580, 470);
  drawPlayer(mayor, 700, 250);

  // Update end game data
  unlocked[3] = true;
  scores[0] = 20;
  scores[1] = 50;
  scores[3] = 50;
}

function drawScene2Choice1() {
  let message = "The SF City Mayor election is coming up soon and the topic of mandating edible food packaging is stirring up quite a controversy. If I want to get re-elected for mayor, I have to make the right choice.";
  drawTextBar(message, 360, 250, 440, 390, 500, 220);
  drawPlayer(mayor, 700, 200);

  // Update end game data
  reason = "A good mayor should always listen to their people, so you didn't get re-elected. Your opponent was sponsered had an \"anonymous\" campaign donation (from Whole Foods), and therefore, pushed to ignore edible food packaging and not mandate it in San Francisco leading the project to its end.";
  scores[3] = 10;
}

function drawChooseListen() {
  drawPlayer(scientist[0], 500, 150);
  drawPlayer(citizen, 500, 450);
  drawPlayer(mackey, 500, 800);
  drawPlayer(owner, 500, 1100);

  textAlign(CENTER);
  let message, x = 30, y = 40, w = 1050, h = 150;

  if (mouseY > 220 && mouseX > 30 && mouseX < 265) {
    message = "Albert, EFP Lab Scientist: Mandating edible food packaging would change the world as we know it today! It would have such a positive impact on our environment and start a new sustainable industry. This would create new jobs in production and research (the possibilities for edible food packaging & the technology that ensures longer shelf lives).";
  } else if (mouseY > 220 && mouseX > 350 && mouseX < 555) {
    message = "Jen, SF Local: Edible packaging would have a great impact on our environment as it’ll help save animals that suffer from plastics contaminating their ecosystems. Additionally, as a local, it could possibly help us keep our streets cleaner because I always hear from friends that our sidewalks are “disgusting”. So it would be nice to see that change in the city!";
  } else if (mouseY > 220 && mouseX > 665 && mouseX < 925) {
    message = "John Mackey, CEO of Whole Foods: Edible packaging is a good concept, but I don’t think it’s ready to be taking over our store shelves just yet. To keep a variety of products on shelves, stores will have to invest in new tech & machinery, and that’s just something many businesses can’t afford. The prices would increase & impact the lives of many locals.";
  } else if (mouseY > 220 && mouseX > 990 && mouseX < 1215) {
    message = "Samantha, Small Buisness Owner: Edible packaging would be lovely for the environment, however, many small businesses like mine will be unable to afford the new technology needed to ensure long shelf lives and variety in our stores. This will force many stores to shut down and would overall destroy the small business culture SF is known for.";
  } else {
    message = "Hover over player to see what they have to say.";
    x = 300;
    y = 85;
    w = 600;
    h = 50;
  }

  drawTextBar(message, 30, 170, x, y, w, h);

  // Update end game data
  unlocked[4] = true;
  scores[4] = 50;
}

function drawScene2Choice2() {
  let message = "After hearing what the people of San Francisco have to say on the issues, what will your stance as mayor be on the issue?";
  textAlign(CENTER);
  drawTextBar(message, 360, 250, 600, 390, 500, 220);
  drawPlayer(mayor, 700, 200);

  // Update end game data
  reason = "The mayor was not not re-elected for the next term of San Francisco City Mayor because so many citizens in the city were for edible food packaging. Grocery store owners are happy with the results because they don't need to worry about changing how they run their businesses anytime soon. Nonetheless, the streets of the city continue to stay littered and the environment does not get any better.";
  scores[0] = 10;
  scores[1] = 70;
  scores[2] = 80;
  scores[3] = 10;
  scores[4] = 30;
}

function drawBestEndGame() {
  // Best end game data
  reason = "Congratulations, you’ve reached the best possible ending! The streets have become noticeably cleaner now that edible food packaging has taken over single use plastics. Other cities around the Bay are beginning to introduce edible packaging in their stores after seeing how well it has worked in the city. In order to prevent the decline of SF’s small business culture, every store that was impacted by the mandate received a stipend to help with the cost of technology needed to improve shelf life to make everyone happy!";
  scores[0] = 100;
  scores[1] = 70;
  scores[2] = 60;
  scores[3] = 100;
  scores[4] = 100;

  drawEndGame(scientist[0]);
}