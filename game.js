const unitLength = 20;
let boxColor = `rgb(128,128,0)`;
let strokeColor = 'rgba(0,180,0, 0)';
let columns; /* To be determined by window width */
let rows; /* To be determined by window height */
let currentBoard;
let nextBoard;
let randomR;
let randomG;
let randomB;
let isPaused = false;

function getRandomColor(){
  randomR = Math.floor(Math.random()*256);
  randomG = Math.floor(Math.random()*256);
  randomB = Math.floor(Math.random()*256);
  return randomR, randomG, randomB;
}


function init() {
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        currentBoard[i][j] = 0;
        nextBoard[i][j] = 0;
      }}
}


function setup() {
    /* Set the canvas to be under the element #canvas*/
    const canvas = createCanvas(windowWidth, windowHeight - 100);
    canvas.parent(document.querySelector("#canvas"));
  
    /*Calculate the number of columns and rows */
    columns = floor(width / unitLength);
    rows = floor(height / unitLength);
  
    /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
    currentBoard = [];
    nextBoard = [];
    for (let i = 0; i < columns; i++) {
      currentBoard[i] = [];
      nextBoard[i] = [];
    }
    // Now both currentBoard and nextBoard are array of array of undefined values.
    init(); // Set the initial values of the currentBoard and nextBoard
  }


function draw() {
    background(30);
    generate();
    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        if (currentBoard[i][j] == 1) {
          fill(boxColor);
        } else {
          fill(30);
        }
        stroke(strokeColor);
        rect(i * unitLength, j * unitLength, unitLength, unitLength);
      }}
    };


function generate() {
    //Loop over every single box on the board
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        // Count all living members in the Moore neighborhood(8 boxes surrounding)
        let neighbors = 0;
        for (let i of [-1, 0, 1]) {
          for (let j of [-1, 0, 1]) {
            if (i == 0 && j == 0) {
              // the cell itself is not its own neighbor
              continue;
            }
            // The modulo operator is crucial for wrapping on the edge
            neighbors +=
              currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
          }
        }
  
        // Rules of Life
        if (currentBoard[x][y] == 1 && neighbors < 2) {
          // Die of Loneliness
          nextBoard[x][y] = 0;
        } else if (currentBoard[x][y] == 1 && neighbors > 3) {
          // Die of Overpopulation
          nextBoard[x][y] = 0;
        } else if (currentBoard[x][y] == 0 && neighbors == 3) {
          // New life due to Reproduction
          nextBoard[x][y] = 1;
        } else {
          // Stasis
          nextBoard[x][y] = currentBoard[x][y];
        }
      }
    }
  
    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
  }


/**********************************************************************/
/*                              EVENTS 
/**********************************************************************/  
/**
 * When mouse is dragged
 */
function mouseDragged() {
    if(!isPaused){
    /**
     * If the mouse coordinate is outside the board
     */
    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
      return;
    }
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
    currentBoard[x][y] = 1;
    fill(boxColor);
    stroke(strokeColor);
    rect(x * unitLength, y * unitLength, unitLength, unitLength);
  }}
  
  /**
   * When mouse is pressed
   */
function mousePressed() {
    if (!isPaused){
    noLoop();
    mouseDragged();
  }}
  
  /**
   * When mouse is released
   */
function mouseReleased() {
    if (!isPaused){
    loop();
  }}


  document.querySelector("#reset-game").addEventListener("click", function () {
    init();
  });


function speedBtn() {
    const speedElm = document.querySelector("#speed");
    const rangeElm = document.querySelector("#range-container");
    speedElm.addEventListener('click', function() {
      if (rangeElm.style.display == "none"){
        rangeElm.style.display = "block";
      } else{
        rangeElm.style.display = "none";
      }
  })};
  speedBtn();


  // document.querySelector("#rules").addEventListener("click", function () {
  //   init();
  // });
 
function pauseBtn() {
  const pauseElm = document.querySelector("#pause-resume");
  pauseElm.addEventListener("click", function() {
      if (pauseElm.innerHTML === "Pause"){
        isPaused = true;
        noLoop();
        pauseElm.innerHTML = "Resume";
    } else if (pauseElm.innerHTML === "Resume"){
        isPaused = false;
        loop();
        pauseElm.innerHTML = "Pause";
      }
  })};
  pauseBtn();


  // document.querySelector("#patterns").addEventListener("click", function () {
  // });
   

  // document.querySelector("#resize").addEventListener("click", function () {
  //   init();
  // });

function styleBtn() {
    const styleElm = document.querySelector("#style");
    styleElm.addEventListener("click", function() {
      getRandomColor();
      boxColor = `rgb(${randomR},${randomG},${randomB})`;
      getRandomColor();
      strokeColor = `rgb(${randomR},${randomG},${randomB})`;
      const buttons = document.querySelectorAll(".btns");
      for (const button of buttons){
        button.style.backgroundColor = boxColor;
      };
      for (const button of buttons){
        button.style.borderColor = strokeColor;
      };
      for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
          if (currentBoard[i][j] == 1) {
            fill(boxColor);
          } else {
            fill(30);
          }
          stroke(strokeColor);
          rect(i * unitLength, j * unitLength, unitLength, unitLength);
        }};
    })}
  styleBtn();

