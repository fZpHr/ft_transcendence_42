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
        <div id="game-wrapper">
            <div id="infos">
                <div id="player-info">
                    <div id="player1">
                        <img id="player1-img" src="https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png"></img>
                        <div id="player1-name"></div>
                    </div>
                    <div id="vs">VS</div>
                    <div id="player2">
                        <div id="player2-name"></div>
                        <img id="player2-img" src="https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png"></img>
                    </div>
                </div>
            </div>
            <div id="timer">30</div>
            <div id="connect-four"></div>
        </div>
        <div id="overlay">
            <div id="winnerText"></div>
            <div id="choose">
                <div class="arrows">
                    <img src="/public/img/arrow-select.png" alt="arrows">
                    <img src="/public/img/arrow-select.png" alt="arrows" display="none">
                </div>
                <div class="buttons">
                    <button class="pixel-corners" id="cancel">~/</button>
                    <button class="pixel-corners" id="play-again">Play Again</button>
                </div>
            </div>
        </div>
        `;
    }

    style(){
        // MON CSS
        return `
        <style>
            #infos {
                display: flex;
                flex-direction: column;
                width: 95%;
                margin-bottom: 20px;
            }

            #player1, #player2 {
                width: 45%;
                display: flex;
                flex-direction: row;
            }

            #player1 {
                justify-content: flex-start;
            }

            #player2 {
                justify-content: flex-end;
            }

            #player1-turn, #player2-turn {
                font-family: 'Press Start 2P', cursive;
                color: white;
                font-size: 8px;
            }

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
                background-color: black;
                border: 13px solid #1b1e21;
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
                clip-path: polygon(
                0px calc(100% - 25px),
                5px calc(100% - 25px),
                5px calc(100% - 15px),
                10px calc(100% - 15px),
                10px calc(100% - 10px),
                15px calc(100% - 10px),
                15px calc(100% - 5px),
                25px calc(100% - 5px),
                25px 100%,
                calc(100% - 25px) 100%,
                calc(100% - 25px) calc(100% - 5px),
                calc(100% - 15px) calc(100% - 5px),
                calc(100% - 15px) calc(100% - 10px),
                calc(100% - 10px) calc(100% - 10px),
                calc(100% - 10px) calc(100% - 15px),
                calc(100% - 5px) calc(100% - 15px),
                calc(100% - 5px) calc(100% - 25px),
                100% calc(100% - 25px),
                100% 25px,
                calc(100% - 5px) 25px,
                calc(100% - 5px) 15px,
                calc(100% - 10px) 15px,
                calc(100% - 10px) 10px,
                calc(100% - 15px) 10px,
                calc(100% - 15px) 5px,
                calc(100% - 25px) 5px,
                calc(100% - 25px) 0px,
                25px 0px,
                25px 5px,
                15px 5px,
                15px 10px,
                10px 10px,
                10px 15px,
                5px 15px,
                5px 25px,
                0px 25px
                );
            }
            
                
            .red {
                background-color: red;
            }

            .yellow {
                background-color: yellow;
            }
            
            .active-column.tile:not(.red):not(.yellow) {
                background-color: lightblue;
            }
                
            #player-info {
                display: flex;
                justify-content: space-evenly; /* Evenly space items */
                align-items: center; /* Center items vertically */
                width: 100%; /* Full width */
            }
            
            #player-info img {
                width: 50px; /* Adjust the width as needed */
                height: 50px; /* Adjust the height as needed */
                border-radius: 50%; /* Optional: make the image circular */
            }

            #player1-name, #player2-name {
                font-size: 1.2em;
                font-family: 'Press Start 2P', cursive;
                color: white;
                margin: 10px;
            }

            #vs {
                font-size: 1.2em;
                font-family: 'Press Start 2P', cursive;
                text-align: center;
                width: 10%;
                color: white;
                margin: 10px;
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

            #timer {
                font-size: 1.5em;
                color: white;
                margin: 10px;
                font-weight: bold;
                font-family: 'Press Start 2P', cursive;
            }

            .buttons {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 20px;
            }

            .arrows {
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: 20px;
            }

            .arrows img {
                width: 100px;
                height: 100px;
            }

            .pixel-corners {
                clip-path: polygon(
                    0px calc(100% - 42px),
                    6px calc(100% - 42px),
                    6px calc(100% - 30px),
                    12px calc(100% - 30px),
                    12px calc(100% - 18px),
                    18px calc(100% - 18px),
                    18px calc(100% - 12px),
                    30px calc(100% - 12px),
                    30px calc(100% - 6px),
                    42px calc(100% - 6px),
                    42px 100%,
                    calc(100% - 42px) 100%,
                    calc(100% - 42px) calc(100% - 6px),
                    calc(100% - 30px) calc(100% - 6px),
                    calc(100% - 30px) calc(100% - 12px),
                    calc(100% - 18px) calc(100% - 12px),
                    calc(100% - 18px) calc(100% - 18px),
                    calc(100% - 12px) calc(100% - 18px),
                    calc(100% - 12px) calc(100% - 30px),
                    calc(100% - 6px) calc(100% - 30px),
                    calc(100% - 6px) calc(100% - 42px),
                    100% calc(100% - 42px),
                    100% 42px,
                    calc(100% - 6px) 42px,
                    calc(100% - 6px) 30px,
                    calc(100% - 12px) 30px,
                    calc(100% - 12px) 18px,
                    calc(100% - 18px) 18px,
                    calc(100% - 18px) 12px,
                    calc(100% - 30px) 12px,
                    calc(100% - 30px) 6px,
                    calc(100% - 42px) 6px,
                    calc(100% - 42px) 0px,
                    42px 0px,
                    42px 6px,
                    30px 6px,
                    30px 12px,
                    18px 12px,
                    18px 18px,
                    12px 18px,
                    12px 30px,
                    6px 30px,
                    6px 42px,
                    0px 42px
                );
                }

            .buttons button {
                width: 300px;
                height: 85px;
                font-family: 'Press Start 2P', cursive;
                background-color: #252525;
                color: white;
                border-color: white;
            }

            #choose {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
            }
        </style>
        `;
            
    }

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
            switch (data.type) {
                case "game_start":
                    this.player = data.player1 == userName ? "player1" : "player2";
                    this.updateInfos(data);
                    this.startGame("player" + data.player_turn);
                    break;
                case "move":
                    this.startGame("player" + data.player_turn);
                    this.updateBoard(data);
                    break;
                case "game_full":
                    alert("Game is full");
                    setTimeout(() => {
                        window.router.navigate("/");
                    }, 5000);
                case "update":
                    this.updateInfos(data);
                    this.updateBoard(data);
                    this.updateTimer(data.timer);
                    break;
                case "game_over":
                    
                    document.getElementById("overlay").style.display = "flex";
                    document.getElementById("winnerText").innerText = data.winner + " wins!";
                    this.startGame(null);
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

    updateInfos(data) {
        document.getElementById("player1-name").innerText = data.player1;
        document.getElementById("player2-name").innerText = data.player2;
    }

    updateTimer(timer) {
        document.getElementById("timer").innerText = timer;
    }

    updateBoard(data) {
        this.board = data.board;
        for (var row = 0; row < 6; row++) {
            for (var col = 0; col < 7; col++) {
                if (this.board[row][col] == 1) {
                    document.getElementById(row + " " + col).classList.add("red");
                } else if (this.board[row][col] == 2) {
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
        this.updateTurn(player_turn);
        if (this.player == player_turn)
        {
            for (var row = 0; row < 6; row++) {
                let tile = document.getElementById(row + " 0");
                tile.classList.add("active-column");
            }
            this.column = 0;
            this.handleKeyDown = this.handleKeyDown.bind(this);
            document.addEventListener("keydown", this.handleKeyDown);
        }
        else
        {
            document.removeEventListener("keydown", this.handleKeyDown);
        }
    }

    updateTurn(player_turn)
    {
    }

    handleKeyDown(event) {
        if (event.key == "ArrowLeft") {
            for (var row = 0; row < 6; row++) {
                let tile = document.getElementById(row + " " + this.column);
                tile.classList.remove("active-column");
            }
            if (this.column > 0) this.column--;
            for (var row = 0; row < 6; row++) {
                let tile = document.getElementById(row + " " + this.column);
                tile.classList.add("active-column");
            }
        } else if (event.key == "ArrowRight") {
            for (var row = 0; row < 6; row++) {
                let tile = document.getElementById(row + " " + this.column);
                tile.classList.remove("active-column");
            }
            if (this.column < 6) this.column++; // Adjusted to ensure column does not exceed 6
            for (var row = 0; row < 6; row++) {
                let tile = document.getElementById(row + " " + this.column);
                tile.classList.add("active-column");
            }
        } else if (event.key == " ") {
            console.log("Enter");
            let row = this.checkAvailableTile(this.column);
            if (row != -1) {
                let tile = document.getElementById(row + " " + this.column);
                tile.classList.add(this.player);
                this.ws.send(JSON.stringify({ type: "move", player_id: this.player, column: this.column }));
                for (var roww = 0; roww < 6; roww++) {
                    let tile = document.getElementById(roww + " " + this.column);
                    tile.classList.remove("active-column");
                }
            }
        }
    }

    //Function that listen to keyboard event arrow left and right and enter to select column

    checkAvailableTile(column)
    {
        for (var row = 5; row >= 0; row--)
        {
            let tile = document.getElementById(row + " " + column);
            if (!tile.classList.contains("red") && !tile.classList.contains("yellow"))
            {
                return row;
            }
        }
        return -1;
    }

    CustomDOMContentUnload(){
        this.ws.close();
    }
}