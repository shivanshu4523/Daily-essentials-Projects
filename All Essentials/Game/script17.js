let boxes = document.querySelectorAll(".box");

let turn = "X";
let isGameOver = false;

// Add sound effects
let clickSound = new Audio("mouse.mp3");
let winSound = new Audio("success.mp3");
let drawSound = new Audio("cute.mp3");

boxes.forEach(e => {
    e.innerHTML = "";
    e.addEventListener("click", () => {
        if (!isGameOver && e.innerHTML === "") {
            e.innerHTML = turn;
            clickSound.play(); // Play click sound
            checkWin();
            checkDraw();
            changeTurn();
        }
    });
});

function changeTurn() {
    if (turn === "O") {
        turn = "X";
        document.querySelector(".bg").style.left = "1px";
    } else {
        turn = "O";
        document.querySelector(".bg").style.left = "85px";
    }
}

function checkWin() {
    let winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < winConditions.length; i++) {
        let v0 = boxes[winConditions[i][0]].innerHTML;
        let v1 = boxes[winConditions[i][1]].innerHTML;
        let v2 = boxes[winConditions[i][2]].innerHTML;

        if (v0 !== "" && v0 === v1 && v0 === v2) {
            isGameOver = true;
            document.querySelector("#results").innerHTML = turn + " wins";
            document.querySelector("#play-again").style.display = "inline";
            winSound.play(); // Play win sound

            for (let j = 0; j < 3; j++) {
                boxes[winConditions[i][j]].style.backgroundColor = "#08D9D6";
                boxes[winConditions[i][j]].style.color = "#000";
            }
        }
    }
}

function checkDraw() {
    if (!isGameOver) {
        let isDraw = true;
        boxes.forEach(e => {
            if (e.innerHTML === "") isDraw = false;
        });

        if (isDraw) {
            isGameOver = true;
            document.querySelector("#results").innerHTML = "It's a draw!";
            document.querySelector("#play-again").style.display = "inline";
            drawSound.play(); // Play draw sound
        }
    }
}

document.querySelector("#play-again").addEventListener("click", () => {
    isGameOver = false;
    turn = "X";
    document.querySelector(".bg").style.left = "";
    document.querySelector("#results").innerHTML = "";
    document.querySelector("#play-again").style.display = "none";

    boxes.forEach(e => {
        e.innerHTML = "";
        e.style.removeProperty("background-color");
        e.style.color = "#fff";
    });
});

// audio


var audio = document.getElementById("myAudio");
audio.volume = 0.3;


var audio = document.getElementById("restart");
var playText = document.getElementById("play-again");

playText.onclick = function() {
    if (audio.paused) {
        audio.play();
    } 
};






