"use strict";

// User Story: I can play a game of Tic Tac Toe with the computer.
// User Story: I can play a game of Tic Tac Toe with the computer.
// User Story: I can choose whether I want to play as X or O.

// Todo: Create UI for player to decide if they want to go first or second, and choose their marker
// Todo: Create score keeping feature
// Todo: Create option for two computer opponenets, and option for two human opponents

var player1 = {
  "player": "computer",
  "marker": "x",
  "moves": [],
  "score": 0
};

var player2 = {
  "player": "human",
  "marker": "o",
  "moves": [],
  "score": 0
};

var gameboard = {
  "availablePositions": [0, 1, 2, 3, 4, 5, 6, 7, 8],
  "winningCombos": [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ],
  "numberOfGames": 0
}


$(document).ready(function () {
  var scaledHeight = Math.floor($(window).width() * 0.25);
  if (scaledHeight > 225) {
    scaledHeight = 225;
  }
  $("td").css("height", scaledHeight + "px");
  var canvasHeight = $("canvas").css("height");
  $("canvas").css("width", canvasHeight);
  cycleActivePlayer(player2); // Creates condition to cue Player 1
  enableHumanMove(player2); // Todo: Human can only move when it's their turn
});

$(".stepThroughNextMove").click(function () {
  if ($(".messageToPlayer").html() === "Player 2, go!") {
    makeComputerMove(player2);
  } else {
    makeComputerMove(player1);
  }
});

$(".playAgain").click(function () {
  player1.moves = [];
  player2.moves = [];
  gameboard.availablePositions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  $("td").html("");
  cycleActivePlayer(player2);
});

function playAgain() {
  if (gameboard.numberOfGames < 10) {
    player1.moves = [];
    player2.moves = [];
    gameboard.availablePositions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    $("td").html("");
    cycleActivePlayer(player2); // Creates condition to cue Player 1
  } else {
    console.log(player1.score + " to " + player2.score + ", out of " + gameboard.numberOfGames + " games");
  }
}

function scanForWinningCombo(playerNumber) {
  var aWinningCombination;
  for (var i = 0; i < gameboard.winningCombos.length; i++) {
    var combo = gameboard.winningCombos[i];
    aWinningCombination = combo.every(function (val) {
      return playerNumber.moves.indexOf(val) !== -1;
    });
    if (aWinningCombination) {
      gameboard.numberOfGames++;
      playerNumber.score++;
      var losingPlayer = playerNumber === player1 ? player2 : player1;
      // Todo: highlight the winning combo on the gameboard
      $(".messageToPlayer").html(playerNumber.score + " / " + losingPlayer.score + "<br>");
      $(".messageToPlayer").append(playerNumber.marker + " is the winner!<br>Game no. " + gameboard.numberOfGames);
      $(".messageToPlayer").css("transform", "scale(1.5)");
      //playAgain();
      break;
    }
  }

  if (player1.moves.length + player2.moves.length === 9) {
    gameboard.numberOfGames++;
    $(".messageToPlayer").html("It's a tie!<br>Game no. " + gameboard.numberOfGames);
    $(".messageToPlayer").css("transform", "scale(1.5)");
    //playAgain();
  } else if (!aWinningCombination) {
    cycleActivePlayer(playerNumber);
  }
}

function cycleActivePlayer(lastPlayerToGo) {
  if (lastPlayerToGo === player1) {
    $(".messageToPlayer").html("Player 2, go!");
    if (player2.player === "computer") {
      makeComputerMove(player2);
    }
  } else {
    $(".messageToPlayer").html("Player 1, go!");
    if (player1.player === "computer") {
      makeComputerMove(player1);
    }
  }
}

function enableHumanMove(playerNumber) {
  $("td").click(function () {
    if ($(this).text() === "") {
      var locationOfMove = $(this).index("td");
      gameboard.availablePositions[locationOfMove] = null;
      playerNumber.moves.push(locationOfMove);
      // $(this).html(playerNumber.marker);
      if (playerNumber === player1) {
        drawX(locationOfMove);
      } else {
        drawO(locationOfMove);
      }
      scanForWinningCombo(playerNumber);
    }
  });
}

function makeComputerMove(playerNumber) {
  if (player1.moves.length === 0) {
    var locationOfMove = Math.floor(Math.random() * 9);
    // console.log("Random: ", playerNumber.marker, " ", locationOfMove);
  } else {
    locationOfMove = determineOffensiveMove(playerNumber);
    // console.log("Offensive: ", playerNumber.marker, " ", locationOfMove);
  }
  if (locationOfMove === undefined) {
    locationOfMove = determineDefensiveMove(playerNumber);
    // console.log("Deffensive: ", playerNumber.marker, " ", locationOfMove);
  }
  if (locationOfMove === undefined) {
    locationOfMove = selectTheFirstEmptySquare();
    // console.log("First empty square", playerNumber.marker, " ", locationOfMove);
  }
  gameboard.availablePositions[locationOfMove] = null;
  playerNumber.moves.push(locationOfMove);
  //$("td").eq(locationOfMove).html(playerNumber.marker);
  if (playerNumber === player1) {
    drawX(locationOfMove);
  } else {
    drawO(locationOfMove);
  }
  scanForWinningCombo(playerNumber);
}

function determineOffensiveMove(currentPlayer) {
  var otherPlayer = currentPlayer === player1 ? player2 : player1;
  for (var i = 0; i < gameboard.winningCombos.length; i++) {
    var combo = gameboard.winningCombos[i];
    var invalidatedByOtherPlayerMoves = otherPlayer.moves.some(function (val) {
      return combo.indexOf(val) !== -1;
    });
    if (invalidatedByOtherPlayerMoves) {
      continue;
    }
    var missingValuesFromWinningCombo = combo.filter(function (val) {
      return currentPlayer.moves.indexOf(val) === -1;
    });
    if (missingValuesFromWinningCombo.length === 1) {
      return missingValuesFromWinningCombo[0];
    }
  }
}

function determineDefensiveMove(currentPlayer) {
  var otherPlayer = currentPlayer === player1 ? player2 : player1;
  for (var i = 0; i < gameboard.winningCombos.length; i++) {
    var combo = gameboard.winningCombos[i];
    var defensiveMoves = combo.filter(function (val) {
      return otherPlayer.moves.indexOf(val) === -1;
    });
    if (defensiveMoves.length === 1 && gameboard.availablePositions[defensiveMoves[0]] !== null) {
      return defensiveMoves[0];
    }
    if (defensiveMoves.length === 2) {
      var secondBestMove = defensiveMoves.find(function (val) {
        return gameboard.availablePositions.indexOf(val) !== -1;
      });
    }
  }
  return secondBestMove;
}

function selectTheFirstEmptySquare() {
  for (var i = 0; i < gameboard.availablePositions.length; i++) {
    if (gameboard.availablePositions[i] !== null) {
      return gameboard.availablePositions[i];
    }
  }
}

// Drawing markers idea:
function drawX(locationOfMove) {
  var canvas = document.getElementsByTagName("canvas")[locationOfMove];
  var context = canvas.getContext("2d");
  canvas.width = canvas.height;
  context.lineWidth = $("body").css("font-size").slice(0, -2);
  context.strokeStyle = "#fff";

  // Width X Height    
  var startPosition = canvas.width * 0.25; // canvas is a square
  var endPosition = canvas.width * 0.75;

  var x = startPosition;
  for (var i = startPosition; i < endPosition; i++) {
    var drawFirstStroke = setTimeout(function () {
      context.beginPath();
      context.moveTo(startPosition, startPosition);
      context.lineTo(x, x);
      context.stroke();
      x++;
    }, i * 3);
  }

  setTimeout(function () {
    var startPos = endPosition;
    var endPos = startPosition;
    for (var i = startPosition; i < endPosition; i++) {
      var drawSecondStroke = setTimeout(function () {
        context.beginPath();
        context.moveTo(startPosition, endPosition);
        context.lineTo(endPos, startPos);
        context.stroke();
        startPos--;
        endPos++;
      }, i * 3);
    }
  }, 225);
}

function drawO(locationOfMove) {
  var canvas = document.getElementsByTagName("canvas")[locationOfMove];
  var context = canvas.getContext("2d");
  canvas.width = canvas.height;
  context.lineWidth = $("body").css("font-size").slice(0, -2);
  context.strokeStyle = "#fff";

  var centerX = canvas.width * 0.5;
  var centerY = canvas.height * 0.5;
  var radius = canvas.width * 0.25;

  var x = 6.25
  for (var i = 6.25; i > 0; i = i - 0.05) {
    var drawFirstStroke = setTimeout(function () {
      context.beginPath();
      context.arc(centerX, centerY, radius, x, (2 * Math.PI)); // Second to last parameter affects completion of circle
      context.stroke();
      x = x - 0.1
    }, i * 150);
  }
}







