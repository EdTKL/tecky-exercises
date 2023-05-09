const unitLength = 20;
let boxColor = `rgb(128,168,0)`;
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
      }};
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


function drawCurrentOnly() {
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        if (currentBoard[x][y] == 1) {
          fill(boxColor);
        } else {
          fill(30);
        }
        stroke(strokeColor);
        rect(x * unitLength, y * unitLength, unitLength, unitLength);
      }
    }
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
          // Sound effect
          let index = x % 7;
          sounds[index].play();
       
        } else {
          // Stasis
          nextBoard[x][y] = currentBoard[x][y];
        }
      }
    }
  
    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
  }

function windowResized() {
    resizeCanvas(windowWidth, windowHeight-100);
  }

/**********************************************************************/
/*                              EVENTS 
/**********************************************************************/  
/**
 * When mouse is dragged
 */
function mouseDragged() {
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
}
  
  /**
   * When mouse is pressed
   */
function mousePressed() {
    noLoop();
    mouseDragged();
}
  
  /**
   * When mouse is released
   */
function mouseReleased() {
    if (!isPaused) {
    loop();
  }}


  document.querySelector("#reset-game").addEventListener("click", function () {
    init();
    draw();
  });


function speedBtn() {
    const speedElm = document.querySelector("#speed");
    const fpsElm = document.querySelector("#fps");
    speedElm.addEventListener('click', function() {
        fpsElm.style.display = "block";
        fpsElm.addEventListener('click', function(){
          const frame = fpsElm.value;
          frameRate(parseInt(frame));
          return frame;
        })
      });
    speedElm.addEventListener('mouseleave', function() {
        fpsElm.style.display = "none";
      });
  }
speedBtn();

// function rulesBtn(){
//   const rulesElm = document.querySelector("#rules");
//   rulesElm.addEventListener("click", function () {
//     const smBtns = document.querySelectorAll("#rules>.sm-btns");
//     for (smBtn of smBtns) {
//       smBtn.style.display = "block";
//     }
//   });
//   rulesElm.addEventListener("mouseleave", function () {
//     const smBtns = document.querySelectorAll("#rules>.sm-btns");
//     for (smBtn of smBtns) {
//       smBtn.style.display = "none";
//     }
//   });
// }
// rulesBtn();


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


function patternsBtn() {
  const patternsElm = document.querySelector("#patterns");
  patternsElm.addEventListener("click", function () {
    const smBtns = document.querySelectorAll("#patterns>.sm-btns");
    for (smBtn of smBtns) {
      smBtn.style.display = "block";
    }
  });
  placePatterns();
  patternsElm.addEventListener("mouseleave", function () {
    const smBtns = document.querySelectorAll("#patterns>.sm-btns");
    for (smBtn of smBtns) {
      smBtn.style.display = "none";
    }
  });
};

function placePatterns() {
  const gggBtn = document.querySelector("#ggg");
  const gldBtn = document.querySelector("#gld");
  const lwsBtn = document.querySelector("#lws");
  const pauseElm = document.querySelector("#pause-resume");
  gggBtn.addEventListener("click", function () {
      noLoop();
      isPaused = true;
      pauseElm.innerHTML = "Resume";
      init();
      currentBoard[1][5] = 1;
      currentBoard[1][6] = 1;
      currentBoard[2][5] = 1;
      currentBoard[2][6] = 1;
      currentBoard[11][5] = 1;
      currentBoard[11][6] = 1;
      currentBoard[11][7] = 1;
      currentBoard[12][4] = 1;
      currentBoard[12][8] = 1;
      currentBoard[13][3] = 1;
      currentBoard[13][9] = 1;
      currentBoard[14][3] = 1;
      currentBoard[14][9] = 1;
      currentBoard[15][6] = 1;
      currentBoard[16][4] = 1;
      currentBoard[16][8] = 1;
      currentBoard[17][5] = 1;
      currentBoard[17][6] = 1;
      currentBoard[17][7] = 1;
      currentBoard[18][6] = 1;
      currentBoard[21][3] = 1;
      currentBoard[21][4] = 1;
      currentBoard[21][5] = 1;
      currentBoard[22][3] = 1;
      currentBoard[22][4] = 1;
      currentBoard[22][5] = 1;
      currentBoard[23][2] = 1;
      currentBoard[23][6] = 1;
      currentBoard[25][1] = 1;
      currentBoard[25][2] = 1;
      currentBoard[25][6] = 1;
      currentBoard[25][7] = 1;
      currentBoard[35][3] = 1;
      currentBoard[35][4] = 1;
      currentBoard[36][3] = 1;
      currentBoard[36][4] = 1;
      drawCurrentOnly();
    });

  gldBtn.addEventListener("click", function () {
      noLoop();
      isPaused = true;
      pauseElm.innerHTML = "Resume";
      init();
      currentBoard[1][2] = 1;
      currentBoard[2][3] = 1;
      currentBoard[3][1] = 1;
      currentBoard[3][2] = 1;
      currentBoard[3][3] = 1;
      drawCurrentOnly();
    });

  lwsBtn.addEventListener("click", function () {
      noLoop();
      isPaused = true;
      pauseElm.innerHTML = "Resume";
      init();
      currentBoard[1][2] = 1;
      currentBoard[1][3] = 1;
      currentBoard[1][4] = 1;
      currentBoard[2][1] = 1;
      currentBoard[2][4] = 1;
      currentBoard[3][4] = 1;
      currentBoard[4][4] = 1;
      currentBoard[5][1] = 1;
      currentBoard[5][3] = 1;
      drawCurrentOnly();
    });
};
patternsBtn();

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
        button.style.borderColor = strokeColor;
      };
    const smButtons = document.querySelectorAll(".sm-btns");
      for (const smButton of smButtons){
        smButton.style.backgroundColor = boxColor;
        smButton.style.borderColor = strokeColor;
      };
    
    drawCurrentOnly();
  });
};
styleBtn();

