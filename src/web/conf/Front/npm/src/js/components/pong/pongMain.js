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
                <div class="buttons">
                    <button id="pong-ai" class="pixel-corners-active">Pong against AI</button>
                    <button id="pong-local" class="pixel-corners">Pong 1v1 Local</button>
                    <button id="pong-remote" class="pixel-corners">Pong 1v1 Remote</button>
                    <button id="reset-button" class="pixel-corners">Quit</button>
                </div>
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
                overflow: hidden;
            }

            #overlay-title {
                font-size: 50px;
                margin-bottom: 100px;
                border-bottom: 5px solid white;
            }

            .settings-menu {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-top: 10px;
            }


            #overlay-text {
                margin-bottom: 20px;
            }

            .buttons {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            #overlay button {
                width: 300px;
                height: 85px;
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

            pixel-corners-active,
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
            // background: #ffffff;
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
        document.addEventListener("click", (e) => {
            if (e.target.id === "pong-local") {
                window.router.navigate("/pong/local");
            }
            else if (e.target.id === "pong-ai") {
                window.router.navigate("/pong/ai");
            }
            else if (e.target.id === "pong-remote") {
                window.router.navigate("/pong/remote");
            }
            else if (e.target.id === "reset-button") {
                window.router.navigate("/");
            }
        });
        document.addEventListener("keydown", this.handleEndGame);
    }

    handleEndGame(event) {
        const buttons = document.querySelectorAll(".buttons button");
        const updateActiveButton = (direction) => {
            for (let index = 0; index < buttons.length; index++) {
                const element = buttons[index];
                if (element.classList.contains("pixel-corners-active")) {
                    if (direction === "up" && index > 0) {
                        element.classList.remove("pixel-corners-active");
                        element.classList.add("pixel-corners");
                        const nextIndex = (index - 1) % buttons.length;
                        buttons[nextIndex].classList.add("pixel-corners-active");
                        buttons[nextIndex].classList.remove("pixel-corners");
                        break;
                    } else if (direction === "down" && index < buttons.length - 1) {
                        console.log("index down", index);
                        console.log("-----------------");
                        element.classList.remove("pixel-corners-active");
                        element.classList.add("pixel-corners");
                        const prevIndex = (index + 1) % buttons.length;
                        buttons[prevIndex].classList.add("pixel-corners-active");
                        buttons[prevIndex].classList.remove("pixel-corners");
                        break;
                    }
                }
            }
        };
        if (event.key === "Enter") {
            buttons.forEach(element => {
                if (element.classList.contains("pixel-corners-active")) {
                    if (element.id == "reset-button") {
                        window.router.navigate("/");
                    }
                    else if (element.id == "pong-local") {
                        window.router.navigate("/pong/local");
                    }
                    else if (element.id == "pong-ai") {
                        window.router.navigate("/pong/ai");
                    }
                    else if (element.id == "pong-remote") {
                        window.router.navigate("/pong/remote");
                    }
                }
            });
        } else if (event.key === "ArrowUp") {
            updateActiveButton("up");
        } else if (event.key === "ArrowDown") {
            updateActiveButton("down");
        }
    }

    CustomDOMContentUnload(){
        console.log("DOM CONTENT UNLOAD.");
    }
}