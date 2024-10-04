import { Component } from "@js/component";

export class Connect4 extends Component{
    constructor(){
        super();
        this.ws = null;
        this.board = null;
    }

    render(){
        return`
        <div id="connect4-overlay">

        </div>
        `;
    }

    style(){
        // MON CSS
        return `
        <style>
            #connect4-overlay {
                background: black;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            #board {
                margin-bottom: auto;
                margin-top: auto;
                width: 700px;
                height: 600px;
                background: darkgrey;
                display: flex;
                border-radius: 10px;
            }
        </style>
        `;
        
    }

    CustomDOMContentLoaded(){
        this.ws = new WebSocket(`wss://${window.location.hostname}/wss-game/connect4/`);

        this.ws.onopen = () => {
            console.log("Connected to the server");
        };

        this.ws.onmessage = (event) => {
            console.log(event.data);
        };

        this.ws.onclose = () => {
            console.log("Disconnected from the server");
        };

        this.ws.onerror = (error) => {
            console.log("Error: ", error);
        }

        this.board = document.createElement("div");
        this.board.id = "board";
        document.getElementById("connect4-overlay").appendChild(this.board);
        this.img = document.createElement("img");
        this.img.src = "/public/connect4.png"; // Reference the image from the public directory
        this.board.appendChild(this.img);
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 7; j++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.style.width = "100px";
                cell.style.height = "100px";
                cell.style.border = "1px solid black";
                cell.style.display = "flex";
                cell.style.justifyContent = "center";
                cell.style.alignItems = "center";
                cell.style.fontSize = "50px";
                cell.style.cursor = "pointer";
                cell.style.position = "relative"; // Ensure the cell is positioned relative to its container
                cell.style.zIndex = "1"; // Set a higher z-index to bring the cell to the foreground
                cell.onclick = () => {
                    this.ws.send(JSON.stringify({
                        row: i,
                        col: j
                    }));
                };
                this.board.appendChild(cell);
            }
        }
    }

    CustomDOMContentUnload(){
        this.ws.close();
    }
}