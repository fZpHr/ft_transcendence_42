import { Component } from "@js/component";

export class PongMain extends Component{
    constructor(){
        super();
    }

    render(){
        return`
            <div id="overlay">
                <div id="overlay-title">PONG</div>
                <div id="overlay-text">Choose your game</div>
                <button id="pong-ai">Pong against AI</button>
                <button id="pong-local">Pong 1v1 Local</button>
                <button id="pong-remote">Pong 1v1 Remote</button>
                <button id="reset-button">Quit</button>
            </div>
        `;
    }

    style(){
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
                font-size: 30px;
                color: white;
                // display: none;
                user-select: none;
            }

            #overlay-title {
                font-size: 50px;
                margin-bottom: 100px;
                border-bottom: 5px solid white;
            }
            #overlay-text {
                margin-bottom: 20px;
            }

            #overlay button {
                margin-bottom: 10px;
                font-size: 20px;
                padding: 10px;
                background: black;
                color: white;
                border: 2px solid white;
                cursor: pointer;
            }

            #overlay button:hover {
                background: white;
                color: black;
                transition: 0.3s;
                transform: scale(1.1);
            }


        </style>
        `;
        
    }

    CustomDOMContentLoaded(){
        document.addEventListener("click", (e) => {
            if (e.target.id === "pong-local") {
                window.router.navigate("/pong/local");
            }
            if (e.target.id === "pong-ai") {
                window.router.navigate("/pong/ai");
            }
            if (e.target.id === "reset-button") {
            }
        });

    }

    CustomDOMContentUnload(){
        console.log("DOM CONTENT UNLOAD.");
    }
}