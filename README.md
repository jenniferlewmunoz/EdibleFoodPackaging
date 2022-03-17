# The Adventure to Edbile Food Packaging
#### by Jennifer Lew Munoz


## Game Overview
This unique choose your own adventure game allows you to see how the invention of Edible Food Packaging could influence our world if it was to become widely available.
 
Click your way through the game and make tough decisions like where to get funding for your project from, and which companies to partner with.
 
Get as far as you can through the game to unlock all five of the players you're choosing for:
 
- Albert, Lead Scientist at EFP Labs
- John Mackey, CEO of Whole Foods
- Samantha, Small SF Business Owner
- Edward, Mayor of San Francisco
- Jen, San Francisco Local
 
If you reach a dead end in the game, you will be able to see how your choices made each player feel as a result (Upset, Neutral, Happy). Keep retrying until you reach the "Best Possible Ending" and unlock every single player!
 
## sketch.js
The sketch.js file is the main source code file that defines all the unique aspects of the game. It is broken down into a few sections:
 
- Variables
- p5.js Functions
- Clickables
- Draw Functions
- Helper Functions
- Splash & End Game Functions
- Intro Pages
- Scene One
- Scene Two
 
#### Variables
In this section, all the global variables whose data that we will need throughout different sections of the file are defined for easy access.
 
#### p5.js Functions
Here all the standard functions needed for a sketch.js file that uses p5.js are defined including preload() that loads in assets such as table data, images, and fonts before the program needs them, setup() that creates our canvas, and begins a timer, and draw() that draws all the UI elements for our game.
#### Clickables
In this section of the file our Clickable objects are set up and tell the program how we want our buttons to look and what we want them to do when they are hovered over or pressed.
 
#### Draw Functions
These functions decide what will be displayed on the screen depending on the current state of the program and the choices the user makes. The most notable function here would be the drawOther() function that checks the currentStateName variables and then decides which function should be called.
 
#### Helper Functions
This section contains a few helper functions for the last few sections of this file that decreases the amount of duplicate code, and creates an overall cleaner look to the code.
 
#### Splash and End Game Functions
Here we have the two screens that are displayed the most throughout the game. Firstly, drawSplash() which draws the very first page of the game that shows a girl eating a pizza wrapped in edible food packaging, and the game's title. The user is brought back to the splash scene at the end of every try in the game. Secondly, drawEndGame() displays the end game data showing which players the user unlocked, their satisfaction levels, and why the game has come to an end forcing the user to restart.
 
#### Intro Pages
This section describes the situation in which Albert the Scientist has created edible food packaging and they are looking for the user's help to get it mandated in San Francisco.
 
 
#### Scene One
Here the code describes everything that occurs in Scene One of the game, from where to get project funding to where should the project be prototyped.
 
#### Scene Two
This final section describes all the events that occur in the second scene of the game that mainly focuses on the mayor's view and his stance on mandating edible food packaging or not.

## Links
 - Link to Project: https://xarts.usfca.edu/~jjlewmunoz/EdibleFoodPackaging/
 - Link to Adobe XD Draft: https://xd.adobe.com/view/2fcfcb63-c976-42d6-8583-c570b0566ede-7a9c/