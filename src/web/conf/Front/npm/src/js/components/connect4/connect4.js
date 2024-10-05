import { Component } from "@js/component";
import { getCookie } from "@js/utils/cookie";

export class Connect4 extends Component{
    constructor(){
        super();
        this.ws = null;
        this.board = this.createBoard();
        this.player = null;
    }

    createBoard() {
        // Create a 6x7 board (6 rows, 7 columns) initialized with empty strings
        return Array.from({ length: 6 }, () => Array(7).fill(''));
    }

    render(){
        return`
        <div id="player-info">
            <div id="player1-info">
                <img id="player1-img" src="">
                <p id="player1-name"></p>
            </div>
            <p id="vs">VS</p>
            <div id="player2-info">
                <img id="player2-img" src="">
                <p id="player2-name"></p>
            </div>
            <div id="timer">30</div>
        </div> 
        <div id="game-wrapper">
            <h3 id="current-player">
            </h3>
            <h3 id="player-turn">
            </h3>
            <div id="connect-four">
            </div>
        </div>
        <div id="overlay">
            <div id="winnerText"></div>
            <div class="buttons">
                <button id="cancel">Menu principal</button>
            </div>
        </div>
        `;
    }

    style(){
        // MON CSS
        return `
        <style>
        
        connect4-component {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: black;
        }

        #game-wrapper {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        #connect-four {
            height: 540px;
            width: 630px;

            background-color: blue;
            border: 10px solid navy;
            margin: 0 auto;
            display: flex;
            flex-wrap: wrap;
        }

        #current-player {
            font-size: 2em;
            color: white;
            margin: 10px;
        }

        .tile {
            width: 70px;
            height: 70px;
            margin: 8px;

            background-color: white;
            border-radius: 50%;
            border: 5px solid navy;
        }

        .tile:not(.red):not(.yellow):hover {
            background-color: lightblue;
        }

        .red {
            background-color: red;
        }

        .yellow {
            background-color: yellow;
        }

        .active-column {
            background-color: lightblue;
        }

        #player-info {
            display: none;
            padding: 15px;
            position: absolute;
            flex-direction: column;
            margin-top: 10vh;
        }

        #player1-img,
        #player2-img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin: 10px;
        }

        #player1-name,
        #player2-name {
            font-size: 1.5em;
            color: white;
            margin: 10px;
            font-weight: bold;
        }

        #vs {
            font-size: 1.5em;
            color: rgb(99, 99, 99);
            margin: 10px;
            font-weight: bold;
            
        }

        #timer {
            font-size: 1.5em;
            color: white;
            margin: 10px;
            font-weight: bold;
        }

        #overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            display: none;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            z-index: 2;
            flex-direction: column;
        }

        #winnerText {
            padding: 200px;
        }
        .buttons {
            display: flex;
            justify-content: center;
            gap: 50px;
            align-items: center;
        }

        #cancel,
        #reconnect {
            border: none;
            background: none;
            color: white;
            padding: 10px 20px;
            border-radius: 10px;
            cursor: pointer;
            transition: background 0.3s ease;
            align-items: center;
        }

        #cancel:hover,
        #reconnect:hover {
            background: rgba(255, 255, 255, 0.2);
            }
            </style>
            `;
            
    }

    // gameFinished(winner) {
    //     document.getElementById('timer').innerText = '';
    //     console.log(`${winner} wins!`);
    //     let overlay = document.getElementById("overlay");
    //     document.getElementById("timer").style.display = "none";
    //     // const timerText = document.getElementById("timer-text");
    //     // const reconnect = document.getElementById("reconnect");
    //     const cancel = document.getElementById("cancel");
    //     const winnerText = document.getElementById("winnerText");
    //     if (winner == currentPlayer)
    //         {
    //             winnerText.innerHTML = "You win!";
    //         winnerText.style.color = "green";
    //     }
    //     else
    //     {
    //         winnerText.innerHTML = "You lose";
    //         winnerText.style.color = "red";
    //     }
    //     if (winner == "draw")
    //         {
    //             winnerText.innerHTML = "Draw!";
    //         winnerText.style.color = "white";
    //     }
    //     [cancel, overlay, winnerText].forEach(el => el.style.display = "flex");
    // }

    
    CustomDOMContentLoaded(){
        const userName = getCookie("user42");
        const searchParams = new URLSearchParams(window.location.search);
        const gameId = searchParams.get("id");
        this.ws = new WebSocket(`wss://${window.location.hostname}/wss-game/connect4/`);
        
        this.ws.onopen = () => {
            console.log("Connected to the server");
            this.checkUserIdInterval = setInterval(() => {
                if (userName && this.ws.readyState === WebSocket.OPEN) {
                    this.ws.send(JSON.stringify({ type: 'join', player_id: `${userName}`, room: `${gameId}` }));
                    clearInterval(this.checkUserIdInterval);
                }
            }, 100);
        };

        this.ws.onmessage = (event) => {
            let data = JSON.parse(event.data);
            console.log(event.data);
            console.log(data);
            switch (data.type) {
                case "game_start":
                    this.player = data.player1 == userName ? "player1" : "player2";
                    this.startGame("player" + data.player_turn);
                    break;
            }
        };
        
        this.ws.onclose = () => {
            console.log("Disconnected from the server");
        };

        this.ws.onerror = (error) => {
            console.log("Error: ", error);
        }

        this.setGame();
    }

    updateBoard(data) {
        this.board = data.board;
        for (var row = 0; row < 6; row++) {
            for (var col = 0; col < 7; col++) {
                if (this.board[row][col] == 'red') {
                    document.getElementById(row + " " + col).classList.add("red");
                } else if (this.board[row][col] == 'yellow') {
                    document.getElementById(row + " " + col).classList.add("yellow");
                }
            }
        }
    }

    setGame() 
    {
        for (var row = 0; row < 6; row++)
        {
            for (var col = 0; col < 7; col++) 
            {
                let tile = document.createElement("div");
                tile.className = "tile";
                tile.row = row;
                tile.col = col;
                tile.id = row + " " + col;
                document.getElementById("connect-four").appendChild(tile);
            }
        }
    }

    startGame(player_turn)
    {
        //I want to make active the first column for player_turn
        // this.updateBoard(data);
        console.log("player_turn", player_turn);
        if (this.player == player_turn)
        {
            for (var row = 0; row < 6; row++) {
                let tile = document.getElementById(row + " 0");
                tile.classList.add("active-column");
            }
        }
    }

    checkAvailableTile(row, col)
    {
        if (this.board[row][col] != '')
            return false;
        if (row != 5 && this.board[row + 1][col] != '')
            return true;
        if (row == 5 && this.board[row][col] == '')
            return true;
        return false;
    }


    CustomDOMContentUnload(){
        this.ws.close();
    }
}