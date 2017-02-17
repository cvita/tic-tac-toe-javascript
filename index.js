"use strict";

var player1 = {
  "player": undefined,
  "marker": "x",
  "moves": [],
  "score": 0
};

var player2 = {
  "player": undefined,
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
  "numberOfGames": 0,
  "currentPlayer": player2 // Creates condition, which prompts Player 1 for game's first move
}

$(document).ready(function () {
  var scaledHeight = Math.floor($(window).width() * 0.25);
  if (scaledHeight > 225) {
    scaledHeight = 225;
  }
  $(".gameSquare").css("height", scaledHeight + "px");
  var canvasHeight = $("canvas").css("height");
  $("canvas").css("width", canvasHeight);
});

$(".radio").click(function () {
  if ($("#player1Human").prop("checked")) {
    player1.player = "human";
  }
  if ($("#player1Computer").prop("checked")) {
    player1.player = "computer";
  }
  if ($("#player2Human").prop("checked")) {
    player2.player = "human";
  }
  if ($("#player2Computer").prop("checked")) {
    player2.player = "computer";
  }
  if (player1.player && player2.player) {
    $(".startGame").removeClass("disabled");
  }
});

$(".startGame").click(function () {
  if (!$(this).hasClass("disabled")) {
    $(".dialogueBox").css("box-shadow", "none");
    $(".introUtility").slideUp("slow", function () {
      $(".dialogueBox").css("left", "18em");
      $(".dialogueBox").css("width", "16em");
      $(".dialogueBox").css("opacity", "0.8");
      $(".dialogueBox").css("border-radius", "2em");
      $(".dialogueBox").css("color", "white").css("letter-spacing", "0.1em");
      setTimeout(function () {
        $(".scoreboard").fadeIn("fast", function () {
          $(".gameSquare").css("border-color", "grey");
        });
        if (player1.player === "human") {
          enableHumanMove(player1);
        }
        if (player2.player === "human") {
          enableHumanMove(player2);
        }
        cycleActivePlayer();
      }, 1600);
    });
  }
});

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
      $(".messageToPlayer").html(
        playerNumber.marker.toUpperCase() + "'s win!<br>" +
        playerNumber.marker.toUpperCase() + "'s " + playerNumber.score + " to " +
        losingPlayer.marker.toUpperCase() + "'s " + losingPlayer.score + "<br>" +
        "game no. " + gameboard.numberOfGames
      );
      $(".gameSquare").css("border-color", "white");
      $(".playAgain").show();
      break;
      // Todo: highlight the winning combo on the gameboard
    }
  }
  if (player1.moves.length + player2.moves.length === 9) {
    gameboard.numberOfGames++;
    $(".messageToPlayer").html("It's a tie!<br>" +
      player1.marker.toUpperCase() + "'s " + player1.score + " to " +
      player2.marker.toUpperCase() + "'s " + player2.score + "<br>" +
      "game no. " + gameboard.numberOfGames
    );
    $(".gameSquare").css("border-color", "white");
    $(".playAgain").show();
  } else if (!aWinningCombination) {
    cycleActivePlayer();
  }
}

$(".playAgain").click(function () {
  $(this).hide();
  $(".gameSquare").css("border-color", "grey");
  player1.moves = [];
  player2.moves = [];
  gameboard.availablePositions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  gameboard.currentPlayer = player2;
  clearAllCanvasElements();
  cycleActivePlayer();
});

function cycleActivePlayer() {
  if (gameboard.currentPlayer === player1) {
    $(".messageToPlayer").html("O's, go!");
    gameboard.currentPlayer = player2;
    if (player2.player === "computer") {
      makeComputerMove(player2);
    }
  } else {
    $(".messageToPlayer").html("X's, go!");
    gameboard.currentPlayer = player1;
    if (player1.player === "computer") {
      makeComputerMove(player1);
    }
  }
}

function enableHumanMove(playerNumber) {
  $("td").click(function () {
    var locationOfMove = $(this).index("td");
    if (gameboard.availablePositions[locationOfMove] !== null) {
      gameboard.availablePositions[locationOfMove] = null;
      var currentPlayer = gameboard.currentPlayer;
      currentPlayer.moves.push(locationOfMove);
      if (currentPlayer === player1) {
        drawX(locationOfMove);
      } else {
        drawO(locationOfMove);
      }
      setTimeout(function () {
        scanForWinningCombo(gameboard.currentPlayer);
      }, 900);
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
  if (playerNumber === player1) {
    drawX(locationOfMove);
  } else {
    drawO(locationOfMove);
  }
  setTimeout(function () {
    scanForWinningCombo(gameboard.currentPlayer);
  }, 900);
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
  context.strokeStyle = "#337ab7";

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
  context.strokeStyle = "#f0ad4e";

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

function clearAllCanvasElements() {
  for (var i = 0; i < gameboard.availablePositions.length; i++) {
    var canvas = document.getElementsByTagName("canvas")[i];
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// $(".stepThroughNextMove").click(function () {
//   if ($(".messageToPlayer").html() === "Player 2, go!") {
//     makeComputerMove(player2);
//   } else {
//     makeComputerMove(player1);
//   }
// });