import { Component } from "@js/component";
import { getCookie } from "@js/utils/cookie";

export class MatchMaking extends Component{
    constructor(){
        super();
        this.ws = null;
    }

    render(){
        return`
            <div id="overlay">
                <h1>Matchmaking</h1>
                <div id="overlay-text">Waiting for an opponent</div>
            </div>
        `;
    }

    style(){
        // MON CSS
        return `
        <style>
            #overlay {
                position: absolute;
                width: 100%;
                height: 100%;
                background: black;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-family: 'Press Start 2P', cursive;
                font-size: 20px;
                color: white;
                // display: none;
                user-select: none;
            }
            #overlay-text {
                margin-bottom: 20px;
            }
        </style>
        `;
        
    }

    CustomDOMContentLoaded(){
        const user42 = getCookie("user42");
        console.log(localStorage)
        this.ws = new WebSocket(`wss://${window.location.hostname}/wss-game/matchmaking/`);

        this.ws.onopen = () => {
            console.log("Connected to the server");
            this.ws.send(JSON.stringify({
                "player_id": user42
            }));
            this.counter();
        };

        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);
            switch (message.type) {
                case "match_found":
                    clearInterval(this.interval);
                    document.getElementById("overlay-text").innerText = "Opponent found";
                    this.redirection = setTimeout(() => {
                        window.router.navigate(`/connect4?id=${message.game_id}`);
                    }, 3000);
                    break;
                case "match_failed":
                    this.redirection = document.getElementById("overlay-text").innerText = event.data.message;
                    setTimeout(() => {
                        window.router.navigate(`/`);
                    }, 3000);
                    break;
            }
        };

        this.ws.onclose = () => {
            console.log("Disconnected from the server");
        };

        this.ws.onerror = (error) => {
            console.log("Error: ", error);
        }
    }

    CustomDOMContentUnload(){
        this.ws.close();
        clearInterval(this.interval);
        clearTimeout(this.redirection);
    }

    counter() {
        let i = 0;
        this.interval = setInterval(() => {
            i++;
            document.getElementById("overlay-text").innerText = `Waiting for an opponent ${".".repeat(i % 4)}`;
        }, 750);
    }
}