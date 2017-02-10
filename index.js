"use strict";

// Temporary
$(document).ready(function () {
  makeFirstMove();
  makePlayer2Move(); // Simply enabling functionality of button
});

// Temporary
$(".makeCompMove").click(function () {
  makePlayer1Move();
});


var player1 = {
  "player": "computer",
  "marker": "x",
  "moves": []
};

var player2 = {
  "player": "human",
  "marker": "o",
  "moves": []
};

var winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

function makeFirstMove() {
  var locationOfMove = Math.floor(Math.random() * 9);
  player1.moves.push(locationOfMove);
  $("#" + locationOfMove).html(player1.marker);
  cycleActivePlayer("player1");
}

function cycleActivePlayer(lastPlayerToGo) {
  if (scanForWinningCombo(player1.moves)) {
    $(".messageToPlayer").html("Player 1 is the winner!");
  } else if (scanForWinningCombo(player2.moves)) {
    $(".messageToPlayer").html("Player 2 is the winner!");
  } else {
    var whoseNext = lastPlayerToGo === "player1" ? "Player 2" : "Player 1";
    $(".messageToPlayer").html(whoseNext + " , go!");
  }
}

function scanForWinningCombo(arrayOfCurrentMoves) {
  var winner = false;
  winningCombos.forEach(function (combo) {
    var winningCombination = combo.every(function (val) {
      return arrayOfCurrentMoves.indexOf(val) !== -1;
    });
    if (winningCombination) {
      winner = true;
      $(".messageToPlayer").css("transform", "scale(2)");
    }
  });
  return winner;
}

// Computer player functionality
function makePlayer1Move() {
  var locationOfMove = determineOffensiveMove();
  if (locationOfMove === undefined) {
    locationOfMove = determineDefensiveMove();
  }
  if (locationOfMove === undefined) {
    locationOfMove = fillInLastMove();
  }
  player1.moves.push(locationOfMove);
  $("#" + locationOfMove).html(player1.marker);
  cycleActivePlayer("player1");
}

function determineOffensiveMove() {
  var potentialMoves = [];
  winningCombos.forEach(function (combo) {
    var validCombination = player1.moves.every(function (val) {
      return combo.indexOf(val) !== -1;
    });

    var invalidatedByPlayer2Moves = player2.moves.some(function (val) {
      return combo.indexOf(val) !== -1;
    });

    if (validCombination && !invalidatedByPlayer2Moves) {
      combo.forEach(function (val) {
        if (player1.moves.indexOf(val) === -1) {
          potentialMoves.push(val);
        }
      });
    }
  });
  return potentialMoves[Math.floor(Math.random() * potentialMoves.length)];
}

function determineDefensiveMove() {
  var locationOfMove;
  winningCombos.forEach(function (combo) {
    var defensiveMove = combo.filter(function (val) {
      return player2.moves.indexOf(val) === -1;
    });
    if (defensiveMove.length === 1 && player1.moves.indexOf(defensiveMove[0]) === -1) {
      locationOfMove = defensiveMove[0];
    }
  });
  return locationOfMove;
}

function fillInLastMove() {
  $("td").each(function (td) {
    if ($(this).html() === "") {
      return parseInt($(this).attr("id"));
    }
  });
  console.log("Simply selecting the first blank square");
}

// Human player functionality
function makePlayer2Move() {
  $("td").click(function () {
    if ($(this).html() === "") {
      var locationOfMove = parseInt($(this).attr("id"));
      player2.moves.push(locationOfMove);
      $(this).html(player2.marker);
      cycleActivePlayer("player2");
    }
  });
}
