import { Component } from "@js/component";
import { getCookie } from "@js/utils/cookie";

let BALL_SPEED_X = 7.5;
let BALL_SPEED_Y = 1;
let PADDLE_SPEED = 5;

export class PongAI extends Component {
    constructor() {
        super();
        this.gameReset = null;
        this.ws = null;
        this.clearTimeout = null;
    }

    render() {
        return `
            <h2 id="hd">Mode AI</h2>
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
                            <div class="player-name">You</div>
                            <div class="key">W</div>
                            <div class="key">S</div>
                        </div>
                        <div class="player-controls">
                            <div class="player-name">AI</div>
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
        }
         
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.ws.send(JSON.stringify({type: "pong", user: this.user, paddleSpeed: PADDLE_SPEED}));
            if (data.type === "moveAi") {
                const time_to_move = data.duration;
                if (data.keyPressed === "ArrowUp") {
                    upPressed = true;
                    downPressed = false;
                    setTimeout(() => {
                        upPressed = false;
                    }, time_to_move);
                } else if (data.keyPressed === "ArrowDown") {
                    downPressed = true;
                    upPressed = false;
                    setTimeout(() => {
                        downPressed = false;
                    }, time_to_move);
                }
                else if (data.keyPressed === "none") {
                    upPressed = false;
                    downPressed = false;
                }
            }
        }

        this.ws.onclose = () => {
        }
        

        document.addEventListener('keydown', this.escape);

        const check = document.getElementById('settings-option1');
        const basePong = document.getElementById("basePong");
        BALL_SPEED_X = check.classList.contains('on') ? 10 : 7.5;
        let ballSpeedX = BALL_SPEED_X;
        let ballSpeedY = 0;

        if (check.classList.contains('on')) {
            PADDLE_SPEED = 10;
        }

        document.getElementById('toggle-settings').addEventListener('click', function() {
            document.getElementById('options-container').classList.toggle('hidden');
        });

        document.getElementById('settings-option1').addEventListener('click', function() {
            const button = this;
            const isOff = button.classList.contains('off');
            button.classList.toggle('off', !isOff);
            button.classList.toggle('on', isOff);
            button.textContent = `X2 (${isOff ? 'On' : 'Off'})`;
            
            BALL_SPEED_X = isOff ? 10 : 5;
            ballSpeedX = BALL_SPEED_X;
            PADDLE_SPEED = isOff ? 10 : 5;
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
        const OVERLAY_DISPLAY_TIME = 1500;
   
        
        const ball = document.getElementById("ball");
        const paddle_1 = document.getElementById("player_1_paddle");
        const paddle_2 = document.getElementById("player_2_paddle");
        
        let ballScored = false;
    
        let ballPositionX = 732.5;
        let ballPositionY = 350;
        const initialBallPos = { left:  732.5, top:  350 };
        
        let score_1 = 0;
        let score_2 = 0;

    
        let upPressed = false, downPressed = false, wPressed = false, sPressed = false;
        let intervalGameStart = null;
        
        function handleKey(event, isKeyDown) {
            const keyMap = {
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
            ballSpeedX = 0;
            ballSpeedY = 0;
            score_1 = 0;
            score_2 = 0;
            wPressed = false;
            sPressed = false;
            upPressed = false;
            downPressed = false;
            document.removeEventListener("keyup", handleKeyUp, true);
            document.removeEventListener("keydown", handleKeyDown, true);
            document.removeEventListener("click", handleClick);
            resetBall();
            cancelAnimationFrame(moveBall);
            cancelAnimationFrame(gameLoop);
        }
    
        this.gameReset = resetGame;

        function resetBall() {
            ballPositionX = initialBallPos.left;
            ballPositionY = initialBallPos.top;
            ball.style.left = ballPositionX + "px";
            ball.style.top = ballPositionY + "px";
            ballSpeedX = ballSpeedX > 0 ? -BALL_SPEED_X : BALL_SPEED_X;
            ballSpeedY = 0;
        }
        
        function showOverlay(message, score1, score2) {
            const overlay = document.getElementById("overlay");
            document.getElementById("overlay-text").textContent = message;
            document.getElementById("overlay-score").textContent = `Score: ${score1}-${score2}`;
            overlay.style.display = "block";
        }
        
        function updateScore(score, scoreElementId, message, updatedScore1, updatedScore2) {
            score += 1;
            ballScored = true;
            const scoreElement = document.getElementById(scoreElementId);
            if (scoreElement) scoreElement.textContent = score;
        
            showOverlay(message, updatedScore1, updatedScore2);
            this.clearTimeout = setTimeout(() => {
                document.getElementById("overlay").style.display = "none";
                resetBall();
                ballScored = false;
            }, OVERLAY_DISPLAY_TIME);
            return score;
        }

        updateScore = updateScore.bind(this);

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

        function checkCollision() {
            if (!this.isGameRunning) return;
            const ballRect = ball.getBoundingClientRect();
            const paddle1Rect = paddle_1.getBoundingClientRect();
            const paddle2Rect = paddle_2.getBoundingClientRect();
            const paddles = [
                { rect: paddle1Rect, element: paddle_1 },
                { rect: paddle2Rect, element: paddle_2 }
            ];
            for (const { rect, element } of paddles) {
                if (ballRect.left < rect.right && ballRect.right > rect.left &&
                    ballRect.top < rect.bottom && ballRect.bottom > rect.top) {                  
                    ballSpeedX *= -1;
                    const relativeIntersectY = (ballRect.top + ballRect.height / 2) - (rect.top + rect.height / 2);
                    const normalizedRelativeIntersectionY = (relativeIntersectY / (rect.height / 2)) * 5;
                    ballSpeedY = normalizedRelativeIntersectionY;
                    element.style.transform = "scale(1.1)";      
                    setTimeout(() => {
                        element.style.transform = "scale(1)";
                    }, 100);
                }
            }
            const basePongRect = basePong.getBoundingClientRect();
            if (ballRect.left <= basePongRect.left + 5 && !ballScored) score_2 = updateScore(score_2, "player_2_score", "AI scores!", score_1, score_2 + 1);
            if (ballRect.right >= basePongRect.right - 5 && !ballScored) score_1 = updateScore(score_1, "player_1_score", "Player 1 scores!", score_1 + 1, score_2);
        }

        checkCollision = checkCollision.bind(this);

        function moveBall() {
            ballPositionX += ballSpeedX;
            ballPositionY += ballSpeedY;
    
            ball.style.left = ballPositionX + "px";
            ball.style.top = ballPositionY + "px";
            if (basePong === null) return;
            checkCollision();
            if (ballPositionY >= basePong.clientHeight - ball.offsetHeight - 1 || ballPositionY <= 0) ballSpeedY *= -1;
            if (score_1 === WINNING_SCORE || score_2 === WINNING_SCORE) return;
            requestAnimationFrame(moveBall);
        }
        
        function gameLoop() {
            if (upPressed) movePaddle('2', -1);
            if (downPressed) movePaddle('2', 1);
            if (wPressed) movePaddle('1', -1);
            if (sPressed) movePaddle('1', 1);
            
            if (!ballScored && (score_1 === WINNING_SCORE || score_2 === WINNING_SCORE)) {
                showOverlay(`Player ${score_1 === WINNING_SCORE ? "1" : "2"} wins!`, score_1, score_2);
                this.isGameRunning = false;
                setTimeout(() => {
                    resetGame();
                    window.router.navigate("/pong");
                }, OVERLAY_DISPLAY_TIME);
                return;
            }
            requestAnimationFrame(gameLoop);
        }

        gameLoop = gameLoop.bind(this);

        function counter(text) {
            const message = document.getElementById("message");
            if (message) message.textContent = text === 0 ? "GO!" : text === -1 ? "" : text;
        }

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        function startGame() {
            return new Promise((resolve) => {
                let i = 0;
                intervalGameStart = setInterval(() => {
                    counter(3 - i);
                    if (++i > 4) {
                        clearInterval(intervalGameStart);
                        resolve();
                    }
                }, 1000);
            });
        }

        async function initGame() {
            await startGame();
            gameLoop();
            this.isGameRunning = true;
            await sleep(300);
            moveBall();
            this.IntervalAI = setInterval(sendInfoToAI, 1000);
        };

        initGame = initGame.bind(this);
        // AI PART 
        function sendInfoToAI() {
            this.ws.send(JSON.stringify({
                type: "pongInfos",
                user: this.user,
                ballPosition: {
                    top: parseFloat(window.getComputedStyle(ball).top),
                    left: parseFloat(window.getComputedStyle(ball).left),
                    width: 15,
                    height: 15
                },
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
        this.isGameRunning = false;
        clearTimeout(this.clearTimeout);
    }
}