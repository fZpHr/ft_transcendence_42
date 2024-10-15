import { Component } from "@js/component";
import { getCookie } from "@js/utils/cookie";

let BALL_SPEED_X = 5;
let BALL_SPEED_Y = 1;
let PADDLE_SPEED = 5;

export class PongAI extends Component {
    constructor() {
        super();
        this.gameReset = null;
        this.ws = null;
    }

    render() {
        return `
            <h2 id="hd">Mode local</h2>
            <div id="basePong">
                <div id="middleLine"></div>
                <div class="ball" id="ball">
                    <div class="ballstyle"></div>
                </div>
                <div id="player_1_paddle" class="paddle_1"></div>
                <div id="player_2_paddle" class="paddle_2"></div>
                <div class="text">
                    <div id="player_1_score" class="score_1">0</div>
                    <div id="player_2_score" class="score_2">0</div>
                    <div id="message"></div>
                </div>
                <div id="overlay-before-start">
                    <div class="controls">
                        <div class="text-before">Are you ready?</div>
                        <div class="player-controls">
                            <div class="player-name">Player 1</div>
                            <div class="key">W</div>
                            <div class="key">S</div>
                        </div>
                        <div class="player-controls">
                            <div class="player-name">Player 2</div>
                            <div class="key">ArrowUp</div>
                            <div class="key">ArrowDown</div>
                        </div>
                    </div>
                    <div>
                        <button id="start-button">Start</button>
                        <button id="toggle-settings">Options</button>
                        <div id="options-container" class="hidden">
                            <button id="settings-option1" class="off">X2 (Off)</button>
                            <label for="color-picker" >Choose Color for map:</label>
                            <input type="color" id="color-picker" name="color-picker">
                        </div>
                    </div>
                </div>
                <div id="overlay">
                    <div id="overlay-title">PONG</div>
                    <div id="overlay-text"></div>
                    <div id="overlay-score"></div>
                </div>
            </div>
        `;
    }

    style() {
        return `
    <style>
        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            background: rgb(9,9,121);
            background: radial-gradient(circle, rgba(9,9,121,1) 10%, rgba(2,0,36,1) 80%);
            color: #ffffff;
            font-family: 'Press Start 2P', cursive;
            user-select: none;
        }

        .hidden {
            display: none !important;
        }

        #options-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: absolute;
            top: 85%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px;
            border: 2px solid white;
            border-radius: 10px;
        }

        #hd {
            color: #ffffff;
            text-align: center;
            padding: 20px;
            background-color: rgba(0, 0, 0, 0.8);
            border-bottom: 2px solid #333;
            letter-spacing: 2px;
        }

        #basePong {
            height: 700px;
            width: 1480px;
            position: relative;
            background: black;
            user-select: none;
            overflow: hidden;
            left: 50%;
            top: 45%;
            transform: translate(-50%, -50%);
            border: 2px solid white;
            border-radius: 15px;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
        }

        .paddle_1,
        .paddle_2 {
            height: 100px;
            width: 18px;
            position: absolute;
            background: linear-gradient(180deg, #ffffff, #cccccc);
            border-radius: 5px;
            transition: transform 0.2s ease;
        }

        .paddle_1 {
            top: calc(50% - 50px);
            left: 40px;
        }

        .paddle_2 {
            top: calc(50% - 50px); 
            right: 40px;
        }

        .paddle_1:hover,
        .paddle_2:hover {
            transform: scale(1.1);
        }

        .ball {
            height: 15px;
            width: 15px;
            background: white;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: calc(50% - 7.5px);
            transition: transform 0.1s ease-out;
        }

        .score_1,
        .score_2,
        #message {
            color: grey;
            position: absolute;
            font-weight: 500;
            top: 10%;
            font-size: 50px;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        #middleLine {
            position: absolute;
            width: 0;
            height: 100%;
            left: 50%;
            border-left: 10px dashed grey;
            transform: translateX(-50%);
            opacity: 0.5;
        }   

        .score_1 {
            left: 35%; 
        }

        .score_2 {
            left: 65%;
        }

        #message {
            color: white;
            left: 49%;
            top: 30%;
        }

        #overlay-before-start {
            position: absolute;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-family: 'Press Start 2P', cursive;
            font-size: 30px;
            color: white;
            user-select: none;
            animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }

        #start-button,
        #toggle-settings {
            font-size: 20px;
            padding: 10px;
            background: black;
            color: white;
            border: 2px solid white;
            cursor: pointer;
            position: absolute;
            transition: 0.3s;
            transform: scale(1);
        }

        #start-button {
            top: 50%;
            left: calc(50% - 62px);
        }

        #toggle-settings {
            top: 60%;
            left: calc(48% - 45px);
        }

        #start-button:hover,
        #toggle-settings:hover {
            background: white;
            color: black;
            transform: scale(1.1);
        }

        .controls {
            display: flex;
            justify-content: space-around;
            width: 100%;
            margin-bottom: 20px;
        }

        .player-controls {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .player-name {
            font-size: 40px;
            margin-bottom: 5px;
            border-bottom: 5px solid white;
            padding-bottom: 5px;
        }

        .key {
            font-size: 24px;
            border: 1px solid white;
            padding: 10px;
            margin: 20px;
            text-align: center;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 5px;
            color: white;
            transition: background-color 0.3s;
        }

        .key:hover {
            background-color: rgba(255, 255, 255, 0.3);
        }

        .text-before {
            font-size: 30px;
            margin-bottom: 20px;
            position: absolute;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
        }
        
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
            display: none;
            user-select: none;
            text-align: center;
            animation: fadeIn 0.5s ease;
        }

        #overlay-title {
            font-size: 50px;
            margin-bottom: 100px;
            border-bottom: 5px solid white;
        }
    </style>

        `;
    }
    escape(event) {
        if (event.key === 'Escape')
            window.router.navigate('/pong');
    }

    CustomDOMContentLoaded() {
        this.ws = new WebSocket("wss://" + window.location.host + "/wss-game/pong-ai/");
        this.user = getCookie("user42");

        this.ws.onopen = () => {
            console.log("WS OPEN");
        }
         
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data);
            this.ws.send(JSON.stringify({type: "pong", user: this.user, paddleSpeed: PADDLE_SPEED}));
            if (data.type === "moveAi") {
                const time_to_move = data.duration;
                if (data.keyPressed === "ArrowUp") {
                    upPressed = true;
                    downPressed = false;
                    setTimeout(() => {
                        upPressed = false;
                    }, time_to_move);
                    console.log("up AI");
                } else if (data.keyPressed === "ArrowDown") {
                    downPressed = true;
                    upPressed = false;
                    setTimeout(() => {
                        downPressed = false;
                    }, time_to_move);
                    console.log("down AI");
                }
                else if (data.keyPressed === "none") {
                    upPressed = false;
                    downPressed = false;
                }
            }
        }

        this.ws.onclose = () => {
            console.log("WS CLOSE");
        }
        

        document.addEventListener('keydown', this.escape);

        let ballSpeedX = BALL_SPEED_X; 
        let ballSpeedY = BALL_SPEED_Y;
        const check = document.getElementById('settings-option1')
        if (check.classList.contains('on')) {
            BALL_SPEED_X = 10;
            BALL_SPEED_Y = 1;
            ballSpeedX = BALL_SPEED_X;
            ballSpeedY = BALL_SPEED_Y;
            PADDLE_SPEED = 10;
        }
        else {
            BALL_SPEED_X = 5;
            BALL_SPEED_Y = 1;
            ballSpeedX = BALL_SPEED_X;
            ballSpeedY = BALL_SPEED_Y;
        }
        
        document.getElementById('toggle-settings').addEventListener('click', function() {
            var optionsContainer = document.getElementById('options-container');
            optionsContainer.classList.toggle('hidden');
        });
        
        document.getElementById('settings-option1').addEventListener('click', function() {
            var button = this;
            if (button.classList.contains('off')) {
                button.classList.remove('off');
                button.classList.add('on');
                button.textContent = 'X2 (On)';
                BALL_SPEED_X = 10;
                BALL_SPEED_Y = 1;
                ballSpeedX = BALL_SPEED_X;
                ballSpeedY = BALL_SPEED_Y;
                PADDLE_SPEED = 10;


            } else {
                button.classList.remove('on');
                button.classList.add('off');
                button.textContent = 'X2 (Off)';
                BALL_SPEED_X = 5;
                BALL_SPEED_Y = 1;
                ballSpeedX = BALL_SPEED_X;
                ballSpeedY = BALL_SPEED_Y;
                PADDLE_SPEED = 5;
            }
        });
        
    
        function debounce(func, wait) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        }
    

        document.getElementById('color-picker').addEventListener('input', debounce(function(event) {
            var chosenColor = event.target.value;
            document.getElementById('basePong').style.backgroundColor = chosenColor;
        }, 1));

        const WINNING_SCORE = 5;
        const OVERLAY_DISPLAY_TIME = 3000;
   
        
        const ball = document.getElementById("ball");
        const paddle_1 = document.getElementById("player_1_paddle");
        const paddle_2 = document.getElementById("player_2_paddle");
        
        let ballScored = false;
    
        let ballPositionX = 732.5;
        let ballPositionY = 350;
        const initialBallPos = { left:  732.5, top:  350 };
        
        let score_1 = 0;
        let score_2 = 0;
        ballSpeedY  = 0;
    
        let upPressed = false, downPressed = false, wPressed = false, sPressed = false;
        let intervalGameStart = null;
        
        function movePaddle(which, direction) {
            const paddle = document.getElementById(`player_${which}_paddle`);
            if (paddle) {
                let currentTop = parseFloat(window.getComputedStyle(paddle).top);
                const parent = paddle.parentElement;
                const maxBottom = parent.clientHeight - paddle.clientHeight;
                let newTop = currentTop + direction * PADDLE_SPEED;
                if (newTop < 0)
                    newTop = 0;
                else if (newTop > maxBottom)
                    newTop = maxBottom;
                paddle.style.top = newTop + "px";
            }
        }
        
        function handleKey(event, isKeyDown) {
            const keyMap = {
                "ArrowUp": () => upPressed = isKeyDown,
                "ArrowDown": () => downPressed = isKeyDown,
                "KeyW": () => wPressed = isKeyDown,
                "KeyS": () => sPressed = isKeyDown
            };
            if (keyMap[event.code]) keyMap[event.code]();
        }

        function handleKeyUp(e) {
            handleKey(e, false);
        }
        
        function handleKeyDown(e) {
            handleKey(e, true);
        }

        function handleClick(e) {
            const overlay = document.getElementById("overlay-before-start");
            if (e.target.id === "start-button") {
                overlay.style.display = "none";
                initGame();
            }
        }
        
        // Event listeners for key presses
        // Dont forget to remove the event listeners when the game is over for performance reasons and for SPA
        document.addEventListener("click", handleClick);
        document.addEventListener("keyup", handleKeyUp, true);
        document.addEventListener("keydown", handleKeyDown, true);
        
        function resetGame() {
            clearInterval(intervalGameStart);
            ballPositionX = initialBallPos.left;
            ballPositionY = initialBallPos.top;
            ball.style.left = ballPositionX + "px";
            ball.style.top = ballPositionY + "px";
            ballSpeedX = BALL_SPEED_X;
            ballSpeedY = BALL_SPEED_Y;
            score_1 = 0;
            score_2 = 0;
            wPressed = false;
            sPressed = false;
            upPressed = false;
            downPressed = false;
            document.removeEventListener("keyup", handleKeyUp, true);
            document.removeEventListener("keydown", handleKeyDown, true);
            document.removeEventListener("click", handleClick);
            cancelAnimationFrame(gameLoop);
            cancelAnimationFrame(moveBall);
        }
    
        this.gameReset = resetGame;
        
        function getBallPosition() {
            const ball = document.getElementById('ball');
            const rect = ball.getBoundingClientRect();
        
            return {
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
                height: rect.height
            };
        }

        function resetBall() {
            ballPositionX = initialBallPos.left;
            ballPositionY = initialBallPos.top;
            ball.style.left = ballPositionX + "px";
            ball.style.top = ballPositionY + "px";
            ballSpeedX = ballSpeedX > 0 ? -BALL_SPEED_X : BALL_SPEED_X;
            ballSpeedY = BALL_SPEED_Y;
        }
        
        function showOverlay(message, score1, score2) {
            const overlay = document.getElementById("overlay");
            document.getElementById("overlay-text").textContent = message;
            document.getElementById("overlay-score").textContent = `Score: ${score1}-${score2}`;
            overlay.style.display = "block";
        }
        
        function hideOverlay() {
            document.getElementById("overlay").style.display = "none";
        }
        
        function checkCollision() {
            const ballRect = ball.getBoundingClientRect();
            const paddle1Rect = paddle_1.getBoundingClientRect();
            const paddle2Rect = paddle_2.getBoundingClientRect();
            
            const paddles = [
                { rect: paddle1Rect, speedMultiplier: -1, positionX: paddle1Rect.right },
                { rect: paddle2Rect, speedMultiplier: -1, positionX: paddle2Rect.left - ballRect.width }
            ];

            for (const paddle of paddles) {
                if (ballRect.left < paddle.rect.right && ballRect.right > paddle.rect.left &&
                    ballRect.top < paddle.rect.bottom && ballRect.bottom > paddle.rect.top) {
                    
                    ballSpeedX *= paddle.speedMultiplier;
            
                    let relativeIntersectY = (ballRect.top + (ballRect.height / 2)) - (paddle.rect.top + (paddle.rect.height / 2));
                    let normalizedRelativeIntersectionY = (relativeIntersectY / (paddle.rect.height / 2)) * 5; // ou 2

                    ballSpeedY = normalizedRelativeIntersectionY;
            
                    const paddleElement = paddle.rect === paddle1Rect ? paddle_1 : paddle_2;
                    paddleElement.style.transform = "scale(1.1)";
                    
                    setTimeout(() => {
                        paddleElement.style.transform = "scale(1)";
                    }, 100);
                }
            }
            
            const basePong = document.getElementById("basePong");
            const basePongRect = basePong.getBoundingClientRect();

            if (ballRect.left <= basePongRect.left + 5 && !ballScored) {
                score_2 += 1;
                ballScored = true;
                console.log("goal", ballRect.top)
                var score = document.getElementById("player_2_score");
                if (score !== null) score.textContent = score_2;

                showOverlay("Player 2 scores!", score_1, score_2);
                setTimeout(function () {
                    hideOverlay();
                    resetBall();
                    ballScored = false;
                }, OVERLAY_DISPLAY_TIME);
            }

            if (ballRect.right >= basePongRect.right - 5 && !ballScored) {
                score_1 += 1;
                ballScored = true;
                console.log("goal", ballRect.top)
                var score = document.getElementById("player_1_score");
                if (score !== null) score.textContent = score_1;

                showOverlay("Player 1 scores!", score_1, score_2);
                setTimeout(function () {
                    hideOverlay();
                    resetBall();
                    ballScored = false;
                }, OVERLAY_DISPLAY_TIME);
            }


        }
    
        function counter(text) {
            var message = document.getElementById("message");
            if (text == 0) text = "GO!";
            if (text == -1) text = "";
            if (message !== null) message.textContent = text;
        }
        
        function startGame() {
            return new Promise((resolve) => {
                let i = 0;
                intervalGameStart = setInterval(() => {
                    counter(3 - i);
                    if (i === 4) {
                        clearInterval(intervalGameStart);
                        resolve();
                    }
                    i++;
                }, 1000);
            });
        }
        
        function moveBall() {
            ballPositionX += ballSpeedX;
            ballPositionY += ballSpeedY;
    
            ball.style.left = ballPositionX + "px";
            ball.style.top = ballPositionY + "px";
            const basePong = document.getElementById("basePong");
            if (basePong === null) return;
    
            checkCollision();
            // if (ballPositionX >= basePong.clientWidth - ball.offsetWidth - 1 || ballPositionX <= 0) {
            //     ballSpeedX *= -1;
            // 
    
            if (ballPositionY >= basePong.clientHeight - ball.offsetHeight - 1 || ballPositionY <= 0) {
                ballSpeedY *= -1;
            }
            if (score_1 === WINNING_SCORE || score_2 === WINNING_SCORE) {
                return;
            }
    
            requestAnimationFrame(moveBall);
        }
        
        function gameLoop() {
            if (upPressed) movePaddle('2', -1);
            if (downPressed) movePaddle('2', 1);
            if (wPressed) movePaddle('1', -1);
            if (sPressed) movePaddle('1', 1);
            
            if (!ballScored && (score_1 === WINNING_SCORE || score_2 === WINNING_SCORE)) {
                showOverlay(`Player ${score_1 === WINNING_SCORE ? "1" : "2"} wins!`, score_1, score_2);
                setTimeout(() => {
                    resetGame();
                    window.router.navigate("/pong");
                }, OVERLAY_DISPLAY_TIME);
                return;
            }
            requestAnimationFrame(gameLoop);
        }
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        async function initGame() {
            await startGame();
            gameLoop();
            await sleep(300);
            moveBall();
            this.IntervalAI = setInterval(sendInfoToAI, 1000);
        } 

        initGame = initGame.bind(this);
        document.addEventListener('keydown', handleEndGame);
        
        function handleEndGame(event) {
            const buttons = document.querySelectorAll(".start-button");
            const updateActiveButton = (direction) => {
                for (let index = 0; index < buttons.length; index++) {
                    const element = buttons[index];
                    if (element.classList.contains("active")) {
                        if (direction === "up" && index > 0) {
                            element.classList.remove("active");
                            const nextIndex = (index - 1) % buttons.length;
                            buttons[nextIndex].classList.add("active");
                            break;
                        } else if (direction === "down" && index < buttons.length - 1) {
                            element.classList.remove("active");
                            const prevIndex = (index + 1) % buttons.length;
                            buttons[prevIndex].classList.add("active");
                            break;
                        }
                    }
                }
            };
        
            if (event.key === "Enter") {
                buttons.forEach(element => {
                    if (element.classList.contains("active")) {
                        element.click();
                    }
                });
            } else if (event.key === "ArrowUp") {
                updateActiveButton("up");
            } else if (event.key === "ArrowDown") {
                updateActiveButton("down");
            }
        }
        // AI PART 
        function sendInfoToAI() {
            console.log("paddle2 top", parseFloat(window.getComputedStyle(paddle_2).top) + 50)
            this.ws.send(JSON.stringify({
                type: "pongInfos",
                user: this.user,
                ballPosition: getBallPosition(),
                paddle1Position: parseFloat(window.getComputedStyle(paddle_1).top),
                paddle2Position: parseFloat(window.getComputedStyle(paddle_2).top) + 50,
                ballSpeedX: ballSpeedX,
                ballSpeedY: ballSpeedY,
                baseSize: {
                    width: document.getElementById("basePong").clientWidth,
                    height: document.getElementById("basePong").clientHeight
                },
                paddleSpeed: PADDLE_SPEED,
            }));
        }
        

        sendInfoToAI = sendInfoToAI.bind(this);
    }

    CustomDOMContentUnload() {
        this.gameReset();
        clearInterval(this.IntervalAI);
        if (this.ws && this.ws.readyState === WebSocket.OPEN)
            this.ws.close();
        document.removeEventListener('keydown', this.escape);
    }
}