"use strict";

var player1 = {
  "player": "computer",
  "marker": "x"
};
var player2 = {
  "player": "human",
  "marker": "o"
};
var whoseTurn = player1;
var firstMove = false;

// Winning combinations
var allWinningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

var copyOfWinningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]
var humanMoves = [];
var player1Combos = allWinningCombos;
var player2Combos = allWinningCombos;
var locationOfCompMove;
var compMoveHistory = [];

$(document).ready(function() {
  makeComputerMove();
});

var considerMovesArr = [];

function makeComputerMove() {
  var considerThisMove;
  if (!firstMove && player1.player === "computer") {
    locationOfCompMove = getRandomInt(0, 9);
    firstMove = true;
  } else {
    var possibleMoves = [];
    allWinningCombos.forEach(function(combo) {
      if (combo !== null) {
        //console.log("All valid winning combos: ", combo); // Shows all currently valid winning combos
        var oneMove = combo.filter(function(val) {
          return compMoveHistory.indexOf(val) === -1;
        });
        if (oneMove.length < 3) {
          oneMove.forEach(function(val) {
            possibleMoves.push(val);
          });
        }
        console.log(possibleMoves);
        locationOfCompMove = possibleMoves[0];
      }
    });
  }

  var makeMove = false;

  considerMovesArr.push(locationOfCompMove)
  copyOfWinningCombos.forEach(function(combo) {
    if (combo.every(function(val) {
        return considerMovesArr.indexOf(val) !== -1;
      })) {
      // locationOfCompMove is good
      console.log("This will be a winning move!");
      makeMove = true;
    }
  });
  if (makeMove === false) {
    if (defendFromHumanWin() >= 0) {
      locationOfCompMove = defendFromHumanWin();
      humanMoves = [];
      console.log("Blocked!");
    }
  }

  compMoveHistory.push(locationOfCompMove);
  updateGameboard(player1Moves, locationOfCompMove, "Computer");
  
  // Illistrate move
  $("#" + locationOfCompMove).html(player1.marker);
  cycleActivePlayer();
}

function defendFromHumanWin() {
  // Comp will make a blockMove even if it has the opportunity to win. Need to address this bug.

  var blockMove;
  // $("td").each(function(td) {
  //   if ($(this).html() === "o") {
  //     humanMoves.push(parseInt($(this).attr("id")));
  //   }
  // });
  if (humanMoves.length > 1) {
    //console.log("Human moves", humanMoves);

    copyOfWinningCombos.forEach(function(combo) {
      if (humanMoves.every(function(val) {
          return combo.indexOf(val) !== -1;
        })) {
        //   console.log("Human could win with this combo", combo);
        // Filter out current human moves with completing combo position
        blockMove = combo.filter(function(val) {
          return humanMoves.indexOf(val) === -1;
        });
        //  console.log(blockMove);
      }
    });
  }
  return blockMove;
}

function cycleActivePlayer() {
  if (whoseTurn === player1) {
    whoseTurn = player2;
    var message = "Player 2 turn";
  } else {
    // Issue with this line?
    whoseTurn = player1;
    message = "Player 1 turn";
    // makeComputerMove();
  }

  $(".messageToPlayer").html(message);
}

// Updates available valid moves for computer to make
function updateAvailableCombos(playerCombos, locationOfMove) {
  playerCombos.forEach(function(combo) {
    if (combo !== null) {
      if (combo.some(function(val) {
          return val == locationOfMove;
        })) {
        playerCombos[playerCombos.indexOf(combo)] = null;
      }
    }
  });
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// Human player functionality
$("td").click(function() {
  if ($(this).html() === "") {
    updateAvailableCombos(allWinningCombos, $(this).attr("id"));
    humanMoves.push(parseInt($(this).attr("id")));

    cycleActivePlayer();
    updateGameboard(player2Moves, parseInt($(this).attr("id")), "Human");
    $(this).html(player2.marker);
  }
});

var player1Moves = [];
var player2Moves = [];

function updateGameboard(playerMovesArray, move, player) {
  playerMovesArray.push(move)
    // console.log(playerMovesArray);
  copyOfWinningCombos.forEach(function(combo) {

    if (combo.every(function(val) {
        return playerMovesArray.indexOf(val) !== -1;
      })) {

      setTimeout(function() {
        $(".messageToPlayer").html("The " + player + " is the winner!");
      }, 250);
    }
  });
}

function translateIntegerToLocation(integer) {
  switch (integer) {
    case 0:
      return "zero";
      break;
    case 1:
      return "one";
      break;
    case 2:
      return "two";
      break;
    case 3:
      return "three";
      break;
    case 4:
      return "four";
      break;
    case 5:
      return "five"
      break;
    case 6:
      return "six";
      break;
    case 7:
      return "seven";
      breakl
    case 8:
      return "eight";
      break;
  }
}

// Temp button
$(".makeCompMove").click(function() {
  makeComputerMove();
});