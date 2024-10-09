import { Component } from "@js/component";
import { getCookie } from "@js/utils/cookie";

export class Connect4 extends Component{
    constructor(){
        super();
        this.ws = null;
        this.board = this.createBoard();
        this.player = null;
        this.avalaibleColumns = [0, 1, 2, 3, 4, 5, 6];
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
            <div id="current-player">
                <div id="player1-turn"></div>
                <div id="timer">30</div>
                <div id="player2-turn"></div>
            </div>
            <div id="connect-four"></div>
            <div id="keyboard" class="keycaps">
                <button id="arrow-left" class="arrows pixel-corners">
                    <img src="/public/img/arrow-left-button.png" style="width: 100%; height:100%"></img>
                </button>
                <button id="space" class="pixel-corners">
                    <img src="/public/img/space-bar-icon.png" style="width: 80%; height:75%"></img>
                </button>
                <button id="arrow-right" class="arrows pixel-corners">
                    <img src="/public/img/arrow-right-button.png" style="width: 100%; height:100%"></img>
                </button>
            </div>
        </div>
        <div id="overlay">
            <div id="winnerText"></div>
            <div id="choose">
                <div class="buttons">
                    <button class="pixel-corners-active" id="cancel">Go back Home</button>
                    <button class="pixel-corners" id="play-again">Play Again</button>
                </div>
            </div>
        </div>`;
    }

    style(){
        // MON CSS
        return `
        <style>

            #keyboard {
                display: flex;
                flex-direction: row;
                justify-content: space-evenly;
                width: 100%;
                height: 80px;
                margin-top: 20px;
            }

            #keyboard .arrows {
                width: 15%;
            }

            #space {
                width: 60%;
            }
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

            connect4-component {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: black;
            }

            #current-player {
                display: flex;
                align-items: center;
                flex-direction: row;
                justify-content: space-evenly;
                width: 100%;
            }

            #player1-turn, #player2-turn {
                font-family: 'Press Start 2P', cursive;
                color: white;
                font-size: 0.8em;
                text-align: center;
                width: 45%;
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
                width: 10%;
                text-align: center;
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
                padding: 100px;
                font-size: 2em;
                font-family: 'Press Start 2P', cursive;
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

            .keycaps {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 20px;
            }

            .keycaps button {
                width: 300px;
                height: 85px;
                font-family: 'Press Start 2P', cursive;
                background-color: #252525;
                color: white;
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

            .buttons button {
                width: 300px;
                height: 85px;
                font-family: 'Press Start 2P', cursive;
                background-color: #252525;
                color: white;
            }

            #choose {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
            }
            
            .pixel-corners-active,
.pixel-corners-active--wrapper {
  clip-path: polygon(0px calc(100% - 30px),
    5px calc(100% - 30px),
    5px calc(100% - 20px),
    10px calc(100% - 20px),
    10px calc(100% - 15px),
    15px calc(100% - 15px),
    15px calc(100% - 10px),
    20px calc(100% - 10px),
    20px calc(100% - 5px),
    30px calc(100% - 5px),
    30px 100%,
    calc(100% - 30px) 100%,
    calc(100% - 30px) calc(100% - 5px),
    calc(100% - 20px) calc(100% - 5px),
    calc(100% - 20px) calc(100% - 10px),
    calc(100% - 15px) calc(100% - 10px),
    calc(100% - 15px) calc(100% - 15px),
    calc(100% - 10px) calc(100% - 15px),
    calc(100% - 10px) calc(100% - 20px),
    calc(100% - 5px) calc(100% - 20px),
    calc(100% - 5px) calc(100% - 30px),
    100% calc(100% - 30px),
    100% 30px,
    calc(100% - 5px) 30px,
    calc(100% - 5px) 20px,
    calc(100% - 10px) 20px,
    calc(100% - 10px) 15px,
    calc(100% - 15px) 15px,
    calc(100% - 15px) 10px,
    calc(100% - 20px) 10px,
    calc(100% - 20px) 5px,
    calc(100% - 30px) 5px,
    calc(100% - 30px) 0px,
    30px 0px,
    30px 5px,
    20px 5px,
    20px 10px,
    15px 10px,
    15px 15px,
    10px 15px,
    10px 20px,
    5px 20px,
    5px 30px,
    0px 30px);
  position: relative;
}
.pixel-corners-active {
  border: 5px solid transparent;
}
.pixel-corners-active--wrapper {
  width: fit-content;
  height: fit-content;
}
.pixel-corners-active--wrapper .pixel-corners-active {
  display: block;
  clip-path: polygon(5px 30px,
    10px 30px,
    10px 20px,
    15px 20px,
    15px 15px,
    20px 15px,
    20px 10px,
    30px 10px,
    30px 5px,
    calc(100% - 30px) 5px,
    calc(100% - 30px) 10px,
    calc(100% - 20px) 10px,
    calc(100% - 20px) 15px,
    calc(100% - 15px) 15px,
    calc(100% - 15px) 20px,
    calc(100% - 10px) 20px,
    calc(100% - 10px) 30px,
    calc(100% - 5px) 30px,
    calc(100% - 5px) calc(100% - 30px),
    calc(100% - 10px) calc(100% - 30px),
    calc(100% - 10px) calc(100% - 20px),
    calc(100% - 15px) calc(100% - 20px),
    calc(100% - 15px) calc(100% - 15px),
    calc(100% - 20px) calc(100% - 15px),
    calc(100% - 20px) calc(100% - 10px),
    calc(100% - 30px) calc(100% - 10px),
    calc(100% - 30px) calc(100% - 5px),
    30px calc(100% - 5px),
    30px calc(100% - 10px),
    20px calc(100% - 10px),
    20px calc(100% - 15px),
    15px calc(100% - 15px),
    15px calc(100% - 20px),
    10px calc(100% - 20px),
    10px calc(100% - 30px),
    5px calc(100% - 30px));
}
.pixel-corners-active::after,
.pixel-corners-active--wrapper::after {
  content: "";
  position: absolute;
  clip-path: polygon(0px calc(100% - 30px),
    5px calc(100% - 30px),
    5px calc(100% - 20px),
    10px calc(100% - 20px),
    10px calc(100% - 15px),
    15px calc(100% - 15px),
    15px calc(100% - 10px),
    20px calc(100% - 10px),
    20px calc(100% - 5px),
    30px calc(100% - 5px),
    30px 100%,
    calc(100% - 30px) 100%,
    calc(100% - 30px) calc(100% - 5px),
    calc(100% - 20px) calc(100% - 5px),
    calc(100% - 20px) calc(100% - 10px),
    calc(100% - 15px) calc(100% - 10px),
    calc(100% - 15px) calc(100% - 15px),
    calc(100% - 10px) calc(100% - 15px),
    calc(100% - 10px) calc(100% - 20px),
    calc(100% - 5px) calc(100% - 20px),
    calc(100% - 5px) calc(100% - 30px),
    100% calc(100% - 30px),
    100% 30px,
    calc(100% - 5px) 30px,
    calc(100% - 5px) 20px,
    calc(100% - 10px) 20px,
    calc(100% - 10px) 15px,
    calc(100% - 15px) 15px,
    calc(100% - 15px) 10px,
    calc(100% - 20px) 10px,
    calc(100% - 20px) 5px,
    calc(100% - 30px) 5px,
    calc(100% - 30px) 0px,
    30px 0px,
    30px 5px,
    20px 5px,
    20px 10px,
    15px 10px,
    15px 15px,
    10px 15px,
    10px 20px,
    5px 20px,
    5px 30px,
    0px 30px,
    0px 50%,
    5px 50%,
    5px 30px,
    10px 30px,
    10px 20px,
    15px 20px,
    15px 15px,
    20px 15px,
    20px 10px,
    30px 10px,
    30px 5px,
    calc(100% - 30px) 5px,
    calc(100% - 30px) 10px,
    calc(100% - 20px) 10px,
    calc(100% - 20px) 15px,
    calc(100% - 15px) 15px,
    calc(100% - 15px) 20px,
    calc(100% - 10px) 20px,
    calc(100% - 10px) 30px,
    calc(100% - 5px) 30px,
    calc(100% - 5px) calc(100% - 30px),
    calc(100% - 10px) calc(100% - 30px),
    calc(100% - 10px) calc(100% - 20px),
    calc(100% - 15px) calc(100% - 20px),
    calc(100% - 15px) calc(100% - 15px),
    calc(100% - 20px) calc(100% - 15px),
    calc(100% - 20px) calc(100% - 10px),
    calc(100% - 30px) calc(100% - 10px),
    calc(100% - 30px) calc(100% - 5px),
    30px calc(100% - 5px),
    30px calc(100% - 10px),
    20px calc(100% - 10px),
    20px calc(100% - 15px),
    15px calc(100% - 15px),
    15px calc(100% - 20px),
    10px calc(100% - 20px),
    10px calc(100% - 30px),
    5px calc(100% - 30px),
    5px 50%,
    0px 50%);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  display: block;
  pointer-events: none;
}
.pixel-corners-active::after {
  margin: -5px;
}


.pixel-corners,
.pixel-corners--wrapper {
  clip-path: polygon(0px calc(100% - 30px),
    5px calc(100% - 30px),
    5px calc(100% - 20px),
    10px calc(100% - 20px),
    10px calc(100% - 15px),
    15px calc(100% - 15px),
    15px calc(100% - 10px),
    20px calc(100% - 10px),
    20px calc(100% - 5px),
    30px calc(100% - 5px),
    30px 100%,
    calc(100% - 30px) 100%,
    calc(100% - 30px) calc(100% - 5px),
    calc(100% - 20px) calc(100% - 5px),
    calc(100% - 20px) calc(100% - 10px),
    calc(100% - 15px) calc(100% - 10px),
    calc(100% - 15px) calc(100% - 15px),
    calc(100% - 10px) calc(100% - 15px),
    calc(100% - 10px) calc(100% - 20px),
    calc(100% - 5px) calc(100% - 20px),
    calc(100% - 5px) calc(100% - 30px),
    100% calc(100% - 30px),
    100% 30px,
    calc(100% - 5px) 30px,
    calc(100% - 5px) 20px,
    calc(100% - 10px) 20px,
    calc(100% - 10px) 15px,
    calc(100% - 15px) 15px,
    calc(100% - 15px) 10px,
    calc(100% - 20px) 10px,
    calc(100% - 20px) 5px,
    calc(100% - 30px) 5px,
    calc(100% - 30px) 0px,
    30px 0px,
    30px 5px,
    20px 5px,
    20px 10px,
    15px 10px,
    15px 15px,
    10px 15px,
    10px 20px,
    5px 20px,
    5px 30px,
    0px 30px);
  position: relative;
}
.pixel-corners {
  border: 5px solid transparent;
}
.pixel-corners--wrapper {
  width: fit-content;
  height: fit-content;
}
.pixel-corners--wrapper .pixel-corners {
  display: block;
  clip-path: polygon(5px 30px,
    10px 30px,
    10px 20px,
    15px 20px,
    15px 15px,
    20px 15px,
    20px 10px,
    30px 10px,
    30px 5px,
    calc(100% - 30px) 5px,
    calc(100% - 30px) 10px,
    calc(100% - 20px) 10px,
    calc(100% - 20px) 15px,
    calc(100% - 15px) 15px,
    calc(100% - 15px) 20px,
    calc(100% - 10px) 20px,
    calc(100% - 10px) 30px,
    calc(100% - 5px) 30px,
    calc(100% - 5px) calc(100% - 30px),
    calc(100% - 10px) calc(100% - 30px),
    calc(100% - 10px) calc(100% - 20px),
    calc(100% - 15px) calc(100% - 20px),
    calc(100% - 15px) calc(100% - 15px),
    calc(100% - 20px) calc(100% - 15px),
    calc(100% - 20px) calc(100% - 10px),
    calc(100% - 30px) calc(100% - 10px),
    calc(100% - 30px) calc(100% - 5px),
    30px calc(100% - 5px),
    30px calc(100% - 10px),
    20px calc(100% - 10px),
    20px calc(100% - 15px),
    15px calc(100% - 15px),
    15px calc(100% - 20px),
    10px calc(100% - 20px),
    10px calc(100% - 30px),
    5px calc(100% - 30px));
}
.pixel-corners::after,
.pixel-corners--wrapper::after {
  content: "";
  position: absolute;
  clip-path: polygon(0px calc(100% - 30px),
    5px calc(100% - 30px),
    5px calc(100% - 20px),
    10px calc(100% - 20px),
    10px calc(100% - 15px),
    15px calc(100% - 15px),
    15px calc(100% - 10px),
    20px calc(100% - 10px),
    20px calc(100% - 5px),
    30px calc(100% - 5px),
    30px 100%,
    calc(100% - 30px) 100%,
    calc(100% - 30px) calc(100% - 5px),
    calc(100% - 20px) calc(100% - 5px),
    calc(100% - 20px) calc(100% - 10px),
    calc(100% - 15px) calc(100% - 10px),
    calc(100% - 15px) calc(100% - 15px),
    calc(100% - 10px) calc(100% - 15px),
    calc(100% - 10px) calc(100% - 20px),
    calc(100% - 5px) calc(100% - 20px),
    calc(100% - 5px) calc(100% - 30px),
    100% calc(100% - 30px),
    100% 30px,
    calc(100% - 5px) 30px,
    calc(100% - 5px) 20px,
    calc(100% - 10px) 20px,
    calc(100% - 10px) 15px,
    calc(100% - 15px) 15px,
    calc(100% - 15px) 10px,
    calc(100% - 20px) 10px,
    calc(100% - 20px) 5px,
    calc(100% - 30px) 5px,
    calc(100% - 30px) 0px,
    30px 0px,
    30px 5px,
    20px 5px,
    20px 10px,
    15px 10px,
    15px 15px,
    10px 15px,
    10px 20px,
    5px 20px,
    5px 30px,
    0px 30px,
    0px 50%,
    5px 50%,
    5px 30px,
    10px 30px,
    10px 20px,
    15px 20px,
    15px 15px,
    20px 15px,
    20px 10px,
    30px 10px,
    30px 5px,
    calc(100% - 30px) 5px,
    calc(100% - 30px) 10px,
    calc(100% - 20px) 10px,
    calc(100% - 20px) 15px,
    calc(100% - 15px) 15px,
    calc(100% - 15px) 20px,
    calc(100% - 10px) 20px,
    calc(100% - 10px) 30px,
    calc(100% - 5px) 30px,
    calc(100% - 5px) calc(100% - 30px),
    calc(100% - 10px) calc(100% - 30px),
    calc(100% - 10px) calc(100% - 20px),
    calc(100% - 15px) calc(100% - 20px),
    calc(100% - 15px) calc(100% - 15px),
    calc(100% - 20px) calc(100% - 15px),
    calc(100% - 20px) calc(100% - 10px),
    calc(100% - 30px) calc(100% - 10px),
    calc(100% - 30px) calc(100% - 5px),
    30px calc(100% - 5px),
    30px calc(100% - 10px),
    20px calc(100% - 10px),
    20px calc(100% - 15px),
    15px calc(100% - 15px),
    15px calc(100% - 20px),
    10px calc(100% - 20px),
    10px calc(100% - 30px),
    5px calc(100% - 30px),
    5px 50%,
    0px 50%);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #191919;
  display: block;
  pointer-events: none;
}
.pixel-corners::after {
  margin: -5px;
}
        </style>
        `;
            
    }

    CustomDOMContentLoaded(){
        const userName = getCookie("user42");
        this.ws = new WebSocket(`wss://${window.location.hostname}:${window.location.port}/wss-game/connect4/`);
        
        this.ws.onopen = () => {
            console.log("Connected to the server");
            const searchParams = new URLSearchParams(window.location.search);
            const gameId = searchParams.get("id");
            this.checkUserIdInterval = setInterval(() => {
                if (userName && this.ws.readyState === WebSocket.OPEN) {
                    this.ws.send(JSON.stringify({ type: 'join', player_id: `${userName}`, room: `${gameId}` }));
                    clearInterval(this.checkUserIdInterval);
                }
            }, 100);
        };

        this.ws.onmessage = (event) => {
            let data = JSON.parse(event.data);
            console.log("data", data);
            switch (data.type) {
                case "game_start":
                    this.player = data.player1.username == userName ? "player1" : "player2";
                    this.updateInfos(data);
                    this.startGame("player" + data.player_turn);
                    break;
                case "move":
                    this.updateBoard(data);
                    this.updateTurn("player" + data.player_turn);
                    this.startGame("player" + data.player_turn);
                    break;
                case "game_full":
                    this.game_full(data);
                    this.ws.close(3845);
                    break;
                case "update":
                    this.updateTurn("player" + data.player_turn);
                    this.updateInfos(data);
                    this.updateBoard(data);
                    this.updateTimer(data.timer);
                    if (!this.player)
                    {
                        this.player = data.player1.username == userName ? "player1" : "player2";
                        this.startGame("player" + data.player_turn);
                    }
                    break;
                case "game_over":
                    this.updateTurn(null);
                    this.updateBoard(data);
                    this.updateInfos(data);
                    this.endGame(data);
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

    endGame(data) {
        const activeTiles = document.querySelectorAll(".tile.active-column");
        activeTiles.forEach(tile => {
            tile.classList.remove("active-column");
        });
        document.getElementById("overlay").style.display = "flex";
        if (data.option && data.option == 'draw')
            document.getElementById("winnerText").innerText = "Draw!";
        else
            document.getElementById("winnerText").innerText = data.winner + " wins!";
        document.removeEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keydown", this.handleEndGame);
    }

    handleEndGame(event) {
        const buttons = document.querySelectorAll(".buttons button");
        console.log("event", event);
        console.log("buttons", buttons);
    
        const updateActiveButton = (direction) => {
            buttons.forEach((element, index) => {
                console.log("element", element);
                console.log("index", index);
                if (element.classList.contains("pixel-corners-active")) {
                    if (direction === "up" && index > 0) {
                        element.classList.remove("pixel-corners-active");
                        element.classList.add("pixel-corners");
                        const nextIndex = (index - 1) % buttons.length;
                        buttons[nextIndex].classList.add("pixel-corners-active");
                        buttons[nextIndex].classList.remove("pixel-corners");
                    } else if (direction === "down" && index < buttons.length - 1) {
                        element.classList.remove("pixel-corners-active");
                        element.classList.add("pixel-corners");
                        const prevIndex = (index + 1 + buttons.length) % buttons.length;
                        buttons[prevIndex].classList.add("pixel-corners-active");
                        buttons[prevIndex].classList.remove("pixel-corners");
                    }
                }
            });
        };
    
        if (event.key === " ") {
            buttons.forEach(element => {
                if (element.classList.contains("pixel-corners-active")) {
                    if (element.id == "cancel") {
                        window.router.navigate("/");
                    }
                    if (element.id == "play-again") {
                        window.router.navigate("/matchmaking/");
                    }
                }
            });
        } else if (event.key === "ArrowUp") {
            updateActiveButton("up");
        } else if (event.key === "ArrowDown") {
            updateActiveButton("down");
        }
    }

    updateInfos(data) {
        document.getElementById("player1-name").innerText = data.player1.username;
        document.getElementById("player2-name").innerText = data.player2.username;
    }

    updateTimer(timer) {
        document.getElementById("timer").innerText = timer;
    }

    updateBoard(data) {
        this.board = data.board;
        const lastTile = document.querySelector(".tile.pixel-corners-active");
        console.log(lastTile)
        if (lastTile)
            lastTile.classList.remove("pixel-corners-active");
        for (var row = 0; row < 6; row++) {
            for (var col = 0; col < 7; col++) {
                if (this.board[row][col] == 1) {
                    document.getElementById(row + " " + col).classList.add("red");
                } else if (this.board[row][col] == 2) {
                    document.getElementById(row + " " + col).classList.add("yellow");
                }
                if (data.lastMove && data.lastMove[0] == row && data.lastMove[1] == col) {
                    document.getElementById(row + " " + col).classList.add("pixel-corners-active");
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
        for (var col = 0; col < 7; col++)
        {
            if (this.checkColumnFull(col))
            {
                let index = this.avalaibleColumns.indexOf(col);
                if (index > -1)
                    this.avalaibleColumns.splice(index, 1);
            }
        }
        if (this.player == player_turn)
        {
            this.column = this.avalaibleColumns[0];
            for (var row = 0; row < 6; row++) {
                let tile = document.getElementById(row + " " + this.column);
                tile.classList.add("active-column");
            }
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
        if (player_turn == "player1")
        {
            document.getElementById("player1-turn").innerHTML = "Player 1's turn";
            document.getElementById("player2-turn").innerHTML = "";
        }
        else if (player_turn == "player2")
        {
            document.getElementById("player1-turn").innerHTML = "";
            document.getElementById("player2-turn").innerHTML = "Player 2's turn";
        }
        else 
        {
            document.getElementById("player1-turn").innerHTML = "";
            document.getElementById("player2-turn").innerHTML = "";
        }
    }

    handleKeyDown(event) {
        if (event.key == "ArrowLeft") {
            const arrowLeft = document.getElementById("arrow-left");
            arrowLeft.classList.remove("pixel-corners");
            arrowLeft.classList.add("pixel-corners-active");
            setTimeout(() => {
                arrowLeft.classList.remove("pixel-corners-active");
                arrowLeft.classList.add("pixel-corners");
            }, 100);
            for (var row = 0; row < 6; row++) {
                let tile = document.getElementById(row + " " + this.column);
                tile.classList.remove("active-column");
            }
            if (this.column > 0 && this.avalaibleColumns.indexOf(this.column) > 0)
                this.column = this.avalaibleColumns[this.avalaibleColumns.indexOf(this.column) - 1];
            for (var row = 0; row < 6; row++) {
                let tile = document.getElementById(row + " " + this.column);
                tile.classList.add("active-column");
            }
        } else if (event.key == "ArrowRight") {
            const arrowRight = document.getElementById("arrow-right");
            arrowRight.classList.remove("pixel-corners");
            arrowRight.classList.add("pixel-corners-active");
            setTimeout(() => {
                arrowRight.classList.remove("pixel-corners-active");
                arrowRight.classList.add("pixel-corners");
            }, 100);
            for (var row = 0; row < 6; row++) {
                let tile = document.getElementById(row + " " + this.column);
                tile.classList.remove("active-column");
            }
            if (this.column < 6 && this.avalaibleColumns.indexOf(this.column) < this.avalaibleColumns.length - 1)
                this.column = this.avalaibleColumns[this.avalaibleColumns.indexOf(this.column) + 1];
            for (var row = 0; row < 6; row++) {
                let tile = document.getElementById(row + " " + this.column);
                tile.classList.add("active-column");
            }
        } else if (event.key == " ") {
            const space = document.getElementById("space");
            space.classList.remove("pixel-corners");
            space.classList.add("pixel-corners-active");
            setTimeout(() => {
                space.classList.remove("pixel-corners-active");
                space.classList.add("pixel-corners");
            }, 100);
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

    game_full(data) {
        document.getElementById("overlay").style.display = "flex";
        document.getElementById("winnerText").innerText = data.message;
        setTimeout(() => {
            window.router.navigate("/");
        }, 5000);
    }

    checkColumnFull(column)
    {
        for (var row = 0; row < 6; row++)
        {
            let tile = document.getElementById(row + " " + column);
            if (!tile.classList.contains("red") && !tile.classList.contains("yellow"))
            {
                return false;
            }
        }
        return true
    }

    CustomDOMContentUnload(){
        if (this.ws.readyState === WebSocket.OPEN)
            this.ws.close();
        document.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener("keydown", this.handleEndGame);
    }
}