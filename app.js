/* My idea for the 15 puzzle solution:
1. Use grid and grid-template-areas and populate each area with buttons + one empty div.  
2. Create an object that tells us which buttons are neighbors. When the empty div has the same grid-area as the object key, the neighbors buttons goes from disable to enable.
3. Clicking on a button swaps the button and the empty brick areas.
4. When all the buttons has their correct grid-areas, the player will be notified that the game is finished.
5. The correct animations will be selected based on the position of the empty div vs the pushed button. 

Above is the basic idea for the app. See full code below.

PS. To try out the winning message without actually completing the puzzle, just click the empty box before hitting start game:)

*/

//Object of all neighbor areas
const movable = {
  A: ["B", "F"],
  B: ["A", "C", "G"],
  C: ["B", "D", "H"],
  D: ["C", "E", "I"],
  E: ["D", "J"],
  F: ["A", "G", "K"],
  G: ["F", "B", "H", "L"],
  H: ["C", "G", "I", "M"],
  I: ["D", "H", "J", "N"],
  J: ["E", "I", "O"],
  K: ["F", "L"],
  L: ["G", "K", "M"],
  M: ["H", "L", "N"],
  N: ["I", "M", "O"],
  O: ["J", "N"]
};

// Function to loop all bricks to see if they are in the currentArea array (in the movable object). If not, disable the buttons.
const disableButtons = (currentArea, allBricks) => {

  allBricks.forEach(brick => {
    const brickArea = brick.style.gridArea.slice(0, 1); //slice, to return one letter, otherwise returns A / A / A / A 
    const current = currentArea.slice(0, 1);
    //enable buttons if they are in currentArea array, otherwise disable
    if (movable[current].includes(brickArea)) {
      brick.disabled = false;
    } else {
      brick.disabled = true;
    }
  });
}

// Function to shuffle the bricks
const randomize = () => {

  //change message & button text
  document.getElementById('message').innerHTML = "Good luck!";
  document.getElementById('btnStart').innerHTML = "Shuffle Bricks";

  //Create array of all bricks
  const getBricks = document.querySelectorAll(".brick");
  const allBricks = Array.from(getBricks); 

  //Shuffle letters, same letters as the brick areas
  const areaArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"]
  const shuffledArray = areaArray.sort(() => Math.random() - 0.5);

  //Add shuffle animation
  document.querySelectorAll('.brick').forEach((brick) => {
    brick.classList.add("aniShuffle");
    setTimeout(() => {
      brick.classList.remove("aniShuffle");
    }, 1000);
  });

  //Change brick grid-areas to the shuffled letters
  allBricks.forEach((brick, i) => {
    brick.style.gridArea = shuffledArray[i]
  });

  //Disable buttons
  allBricks.forEach(brick => {
    let brickArea = brick.style.gridArea
    disableButtons(brickArea, allBricks)
  });
}

//Runs on pageload. Sets an event listener (click) for each button
const runCode = () => {

  //Create array of all bricks
  const getBricks = document.querySelectorAll(".brick");
  const allBricks = Array.from(getBricks); 
  const emptyBrick = document.getElementById("brickEmpty");


  //Add an event listener (click), to alla bricks. When clicking, it swaps the brick and the empty div
  allBricks.forEach(brick => {
    brick.addEventListener("click", event => {

      let clickedArea = brick.style.gridArea.slice(0, 1)
      let emptyArea = emptyBrick.style.gridArea.slice(0, 1)

      const c = letter => clickedArea.includes(letter) //check if clicked area includes letters, to make the if statement below more readable

      //Check rows for showing the correct animatons

      //If clicked on highest row
      if (c('A') || c('B') || c('C') || c('D') || c('E')) {

        if (emptyArea < 'F') { // if empty is on the same row
          emptyArea < clickedArea ? brick.classList.add("aniLeft") : brick.classList.add("aniRight")
        }
        if (emptyArea > 'E') { // if empty is on a lower row
          brick.classList.add("aniDown");
        }
      }

      //If clicked on middle row
      if (c('F') || c('G') || c('H') || c('I') || c('J')) {

        if (emptyArea < 'F') { //if empty is on a higher row
          brick.classList.add("aniUp");
        }
        if (emptyArea > 'E' && emptyArea < 'K') { // if empty is also on highest row
          emptyArea < clickedArea ? brick.classList.add("aniLeft") : brick.classList.add("aniRight")
        }
        if (emptyArea > 'J') { //if empty is on a lower row
          brick.classList.add("aniDown");
        }
      }

      //If clicked on lowest row
      if (c('K') || c('L') || c('M') || c('N') || c('O')) {
        if (emptyArea < 'K') { //if empty is on a higher row
          brick.classList.add("aniUp");
        }
        if (emptyArea > 'J') { //if empty is on the same row
          emptyArea < clickedArea ? brick.classList.add("aniLeft") : brick.classList.add("aniRight")
        }
      }

      // Swap brick with empty div, but first wait for the animation to finish (setTimeout works because we know the animation takes 0,5 seconds)
      setTimeout(() => {

        //remove animaton
        brick.classList.remove("aniUp");
        brick.classList.remove("aniDown");
        brick.classList.remove("aniLeft");
        brick.classList.remove("aniRight");

        //Swap bricks (current brick takes empty spot) 
        let brickArea = brick.style.gridArea
        let emptyAreaA = emptyBrick.style.gridArea
        brick.style.gridArea = emptyAreaA
        emptyBrick.style.gridArea = brickArea

        // Disable buttons that are not neighbors
        disableButtons(brickArea, allBricks); 

        checkIfWon();

      }, 500);
    });
  });

  //When all bricks has the correct gridArea, it means you won
  const checkIfWon = () => {
    if (
      document.getElementById("brick1").style.gridArea.slice(0, 1) === "A" &&
      document.getElementById("brick2").style.gridArea.slice(0, 1) === "B" &&
      document.getElementById("brick3").style.gridArea.slice(0, 1) === "C" &&
      document.getElementById("brick4").style.gridArea.slice(0, 1) === "D" &&
      document.getElementById("brick5").style.gridArea.slice(0, 1) === "E" &&
      document.getElementById("brick6").style.gridArea.slice(0, 1) === "F" &&
      document.getElementById("brick7").style.gridArea.slice(0, 1) === "G" &&
      document.getElementById("brick8").style.gridArea.slice(0, 1) === "H" &&
      document.getElementById("brick9").style.gridArea.slice(0, 1) === "I" &&
      document.getElementById("brick10").style.gridArea.slice(0, 1) === "J" &&
      document.getElementById("brick11").style.gridArea.slice(0, 1) === "K" &&
      document.getElementById("brick12").style.gridArea.slice(0, 1) === "L" &&
      document.getElementById("brick13").style.gridArea.slice(0, 1) === "M" &&
      document.getElementById("brick14").style.gridArea.slice(0, 1) === "N" &&
      document.getElementById("brickEmpty").style.gridArea.slice(0, 1) === "O"
    ) {
      //change message and background animation for celebrating
      document.getElementById('message').innerHTML = "Congratulations! You finished the puzzle!"
      document.getElementById('container').classList.add("aniYouWon");

      setTimeout(() => {
        document.getElementById('container').classList.remove("aniYouWon");
      }, 2000);
    }
  }

  //Lock all bricks before clicking start
  allBricks.forEach(brick => {
    brick.disabled = true;
  });

} //End of runCode function