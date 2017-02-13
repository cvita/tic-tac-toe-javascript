"use strict";

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
  "player": "computer",
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
  ]
}

var numberOfGames = 0;

$(document).ready(function () {
  cycleActivePlayer(player2); // Creates condition to cue Player 1
});

$(".playAgain").click(function () {
  player1.moves = [];
  player2.moves = [];
  gameboard.availablePositions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  $("td").html("");
  cycleActivePlayer(player2);
});

function playAgain() {
  if (numberOfGames < 100) {
    player1.moves = [];
    player2.moves = [];
    gameboard.availablePositions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    $("td").html("");
    cycleActivePlayer(player2); // Creates condition to cue Player 1
  } else {
    console.log(player1.score + " to " + player2.score + ", out of " + numberOfGames + " games");
  }
}

function scanForWinningCombo(playerNumber) {
  for (var i = 0; i < gameboard.winningCombos.length; i++) {
    var aWinningCombination = gameboard.winningCombos[i].every(function (val) {
      return playerNumber.moves.indexOf(val) !== -1;
    });

    if (aWinningCombination) {
      numberOfGames++;
      playerNumber.score++;
      var losingPlayer = playerNumber === player1 ? player2 : player1;
      $(".messageToPlayer").html(playerNumber.score + " / " + losingPlayer.score + "<br>");
      $(".messageToPlayer").append(playerNumber.player + " is the winner!<br>Game no. " + numberOfGames);
      $(".messageToPlayer").css("transform", "scale(1.5)");
      playAgain();
      break;
    }

    if (i === gameboard.winningCombos.length - 1) {
      if (player1.moves.length + player2.moves.length === 9) {
        numberOfGames++;
        $(".messageToPlayer").html("It's a tie!<br>Game no. " + numberOfGames);
        $(".messageToPlayer").css("transform", "scale(1.5)");
        playAgain();
      } else {
        cycleActivePlayer(playerNumber);
      }
    }
  }
}

function cycleActivePlayer(lastPlayerToGo) {
  if (lastPlayerToGo === player1) {
    $(".messageToPlayer").html("Player 2, go!");
    if (player2.player === "computer") {
      makeComputerMove(player2);
    } else {
      enableHumanMove(player2);
    }
  } else {
    $(".messageToPlayer").html("Player 1, go!");
    if (player1.player === "computer") {
      makeComputerMove(player1);
    } else {
      enableHumanMove(player1);
    }
  }
}

function enableHumanMove(playerNumber) {
  $("td").click(function () {
    if ($(this).html() === "") {
      var locationOfMove = parseInt($(this).attr("id"));
      gameboard.availablePositions[locationOfMove] = null;
      playerNumber.moves.push(locationOfMove);
      $(this).html(playerNumber.marker);
      scanForWinningCombo(playerNumber);
    }
  });
}

function makeComputerMove(playerNumber) {
  if (player1.moves.length === 0) {
    var locationOfMove = Math.floor(Math.random() * 9);
  } else {
    if (playerNumber === player1) {
      locationOfMove = determineOffensiveMove(playerNumber);
    }

    if (locationOfMove === undefined) { // !locationOfMove == 0 bug
      locationOfMove = determineDefensiveMove(playerNumber);
    }

    if (locationOfMove === undefined) {
      locationOfMove = selectTheFirstEmptySquare();
    }
  }
  gameboard.availablePositions[locationOfMove] = null;
  playerNumber.moves.push(locationOfMove);
  $("#" + locationOfMove).html(playerNumber.marker);
  scanForWinningCombo(playerNumber);
}

function determineOffensiveMove(currentPlayer) {
  var otherPlayer = currentPlayer === player1 ? player2 : player1;
  var locationOfMove;
  gameboard.winningCombos.forEach(function (combo) {
    // All of players current moves are included in this combo
    var validCombination = currentPlayer.moves.every(function (val) {
      return combo.indexOf(val) !== -1;
    });
    // None of the other players moves are included in this combo
    var invalidatedByOtherPlayerMoves = otherPlayer.moves.some(function (val) {
      return combo.indexOf(val) !== -1;
    });

    if (validCombination && !invalidatedByOtherPlayerMoves) {
      locationOfMove = combo.find(function (val) {
        return currentPlayer.moves.indexOf(val) === -1;
      });
    }
  });
  return locationOfMove;
}

function determineDefensiveMove(currentPlayer) {
  var otherPlayer = currentPlayer === player1 ? player2 : player1;
  for (var i = 0; i < gameboard.winningCombos.length; i++) {
    var defensiveMoves = gameboard.winningCombos[i].filter(function (val) {
      return otherPlayer.moves.indexOf(val) === -1;
    });
    if (defensiveMoves.length === 1 && gameboard.availablePositions.indexOf(defensiveMoves[0]) !== -1) {
      return defensiveMoves[0];
    }
  }
}

function selectTheFirstEmptySquare() {
  for (var i = 0; i < gameboard.availablePositions.length; i++) {
    if (gameboard.availablePositions[i] !== null) {
      return gameboard.availablePositions[i];
    }
  }
}
