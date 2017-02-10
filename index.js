"use strict";

$(document).ready(function () {
  setTimeout(makeFirstMove, 350);
});

// Todo: Create UI for player to decide if they want to go first or second, and choose their marker
// Todo: Create score keeping feature
// Todo: Create option for two computer opponenets, and option for two human opponents

var player1 = {
  "player": "human",
  "marker": "x",
  "moves": []
};

var player2 = {
  "player": "computer",
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

$(".resetGame").click(function () {
  $("td").html("");
  player1.moves = [];
  player2.moves = [];
  setTimeout(makeFirstMove, 350);
});

function makeFirstMove() {
  if (player1.player === "computer") {
    var locationOfMove = Math.floor(Math.random() * 9);
    player1.moves.push(locationOfMove);
    $("#" + locationOfMove).html(player1.marker);
    cycleActivePlayer(player1);
  } else {
    makePlayerMove(player1);
    $(".messageToPlayer").html("Player 1, go!");makePlayerMove
  }
}

function cycleActivePlayer(lastPlayerToGo) {
  if (scanForWinningCombo(player1.moves)) {
    $(".messageToPlayer").html("Player 1 is the winner!");
  } else if (scanForWinningCombo(player2.moves)) {
    $(".messageToPlayer").html("Player 2 is the winner!");
  } else if (scanForTie()) {
    $(".messageToPlayer").html("It's a tie!");
  } else {
    var whoseNext = lastPlayerToGo === player1 ? "Player 2" : "Player 1";
    $(".messageToPlayer").html(whoseNext + " , go!");
    if (lastPlayerToGo === player1) {
      setTimeout(function () {
        makePlayerMove(player2);
      }, 350);
    } else {
      setTimeout(function () {
        makePlayerMove(player1);
      }, 350);
    }
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

function scanForTie() {
  var tie = false;
  var playedLocations = 0;
  $("td").each(function (td) {
    if ($(this).text() !== "") {
      playedLocations++
      if (playedLocations === 9) {
        tie = true;
        $(".messageToPlayer").css("transform", "scale(2)");
      }
    }
  });
  return tie;
}

function makePlayerMove(playerNumber) {
  if (playerNumber.player === "human") {
    makeHumanMove(playerNumber);
  } else {
    makeComputerMove(playerNumber);
  }
}

function makeHumanMove(playerNumber) {
  $("td").click(function () {
    if ($(this).html() === "") {
      var locationOfMove = parseInt($(this).attr("id"));
      playerNumber.moves.push(locationOfMove);
      $(this).html(playerNumber.marker);
      cycleActivePlayer(playerNumber);
    }
  });
}

function makeComputerMove(playerNumber) {
  if (playerNumber === player1) {
    var locationOfMove = determineOffensiveMove(playerNumber);
    console.log("case 1");
  }

  if (locationOfMove === undefined) {
    locationOfMove = determineDefensiveMove(playerNumber);
    console.log("case 2");
  }
  if (locationOfMove === undefined) {
    locationOfMove = selectTheFirstEmptySquare();
    console.log("case 3");
  }
  playerNumber.moves.push(locationOfMove);
  $("#" + locationOfMove).html(playerNumber.marker);
  cycleActivePlayer(playerNumber);
}

function determineOffensiveMove(currentPlayer) {
  var otherPlayer = currentPlayer === player1 ? player2 : player1;
  var potentialMoves = [];
  winningCombos.forEach(function (combo) {
    var validCombination = currentPlayer.moves.every(function (val) {
      return combo.indexOf(val) !== -1;
    });

    var invalidatedByOtherPlayerMoves = otherPlayer.moves.some(function (val) {
      return combo.indexOf(val) !== -1;
    });

    if (validCombination && !invalidatedByOtherPlayerMoves) {
      combo.forEach(function (val) {
        if (currentPlayer.moves.indexOf(val) === -1) {
          potentialMoves.push(val);
        }
      });
    }
  });
  return potentialMoves[Math.floor(Math.random() * potentialMoves.length)];
}

function determineDefensiveMove(currentPlayer) {
  var otherPlayer = currentPlayer === player1 ? player2 : player1;
  var locationOfMove;
  winningCombos.forEach(function (combo) {
    var defensiveMove = combo.filter(function (val) {
      return otherPlayer.moves.indexOf(val) === -1;
    });
    if (defensiveMove.length === 1 && currentPlayer.moves.indexOf(defensiveMove[0]) === -1) {
      locationOfMove = defensiveMove[0];
    }
  });
  return locationOfMove;
}

function selectTheFirstEmptySquare() {
  var locationOfMove;
  $("td").each(function (td) {
    if ($(this).html() === "") {
      locationOfMove = parseInt($(this).attr("id"));
    }
  });
  return locationOfMove;
}
