import { Component } from "@js/component";

export class PongLocal extends Component {
    constructor() {
        super();
        this.gameReset = null;
    }

    render() {
        return `
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
                    <button id="start-button">Start</button>
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
            #basePong {
                height: 831px; /* If you modify the size u have to modify the condition in JS */
                width: 1920px;
                position: relative;
                background: black;
                font-family: 'Press Start 2P', cursive;
                user-select: none;
                overflow: hidden;
            }

            .paddle_1,
            .paddle_2 {
                height: 100px;
                width: 18px;
                position: absolute;
                background: white;
            }

            .paddle_1 {
                top: calc(50% - 50px);
                left: 40px;
            }

            .paddle_2 {
                top: calc(50% - 50px); 
                right: 40px;
            }

            .ball {
                height: 15px;
                width: 15px;
                background: white;
                position: absolute;
                top: 50%;
                left: calc(50% - 7.5px);
            }

            .score_1,
            .score_2,
            .tild,
            #message {
                color: grey;
                position: absolute;
                font-weight: 500px;
                top: 10%;
                font-size: 50px;
            }

            #middleLine {
                position: absolute;
                width: 0;
                height: 100%;
                left: 50%;
                border-left: 10px dashed grey;
                transform: translateX(-50%);
            }   

            .score_1 {
                left: 35%; 
            }

            .tild {
                left: 50%;
            }

            .score_2 {
                left: 65%;
            }

            #message {
                color: white;
                left: 50%;
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
            }

            #start-button {
                font-size: 20px;
                padding: 10px;
                background: black;
                color: white;
                border: 2px solid white;
                cursor: pointer;
                position: absolute;
                top: 50%;
                left: calc(50% - 50px);
            }

            #start-button:hover {
                background: white;
                color: black;
                transition: 0.3s;
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

            .player-controls div {
                margin: 5px 0;
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
            }

            #overlay-message {
                margin-bottom: 20px; 
            }

            #overlay-title {
                font-size: 50px;
                margin-bottom: 100px;
                border-bottom: 5px solid white;
            }

        </style>
        `;
    }

    CustomDOMContentLoaded() {
        const BALL_SPEED_X = 10;
        const BALL_SPEED_Y = 1;
        const PADDLE_SPEED = 7;
        const WINNING_SCORE = 5;
        const OVERLAY_DISPLAY_TIME = 3000;

        const ball = document.getElementById("ball");
        const paddle_1 = document.getElementById("player_1_paddle");
        const paddle_2 = document.getElementById("player_2_paddle");

        let ballScored = false;
        let ballSpeedX = BALL_SPEED_X; 
        let ballSpeedY = BALL_SPEED_Y;
    
        let ballPositionX = getBallPosition().left;
        let ballPositionY = getBallPosition().top;
        const initialBallPos = { left: ballPositionX, top: ballPositionY };
        
        let score_1 = 0;
        let score_2 = 0;
    
        let upPressed = false, downPressed = false, wPressed = false, sPressed = false;
        let intervalGameStart = null;
        
        function movePaddle(which, direction) {
            const paddle = document.getElementById(`player_${which}_paddle`);
            if (paddle) {
                let currentTop = parseFloat(window.getComputedStyle(paddle).top);
                const parent = paddle.parentElement;
                const maxBottom = parent.clientHeight - paddle.clientHeight - 5;
                const newTop = currentTop + direction * PADDLE_SPEED;
                if (newTop > 3 && newTop < maxBottom - 10) {
                    paddle.style.top = newTop + "px";
                }
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
                    ballPositionX = paddle.positionX;
            
                    let relativeIntersectY = (ballRect.top + (ballRect.height / 2)) - (paddle.rect.top + (paddle.rect.height / 2));
                    let normalizedRelativeIntersectionY = (relativeIntersectY / (paddle.rect.height / 2)) * 10;
                    
                    ballSpeedY = normalizedRelativeIntersectionY;
            
                    const paddleElement = paddle.rect === paddle1Rect ? paddle_1 : paddle_2;
                    paddleElement.style.transform = "scale(1.1)";
            
                    setTimeout(() => {
                        paddleElement.style.transform = "scale(1)";
                    }, 100);
                }
            }
            
            if (ballRect.left < 1 && !ballScored) {
                score_2 += 1;
                ballScored = true;
                var score = document.getElementById("player_2_score");
                if (score !== null) score.textContent = score_2;
                
                showOverlay("Player 2 scores!", score_1, score_2);
                setTimeout(function() {
                    hideOverlay();
                    resetBall();
                    ballScored = false;
                }, OVERLAY_DISPLAY_TIME);
            }
            
            if (ballRect.right > 1920 && !ballScored) {
                score_1 += 1;
                ballScored = true;
                var score = document.getElementById("player_1_score");
                if (score !== null) score.textContent = score_1;
                
                showOverlay("Player 1 scores!", score_1, score_2);
                setTimeout(function() {
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
            if (ballPositionX >= 1920 - ball.offsetWidth || ballPositionX <= 0) {
                ballSpeedX *= -1;
            }
    
            if (ballPositionY >= 831 - ball.offsetHeight - 1 || ballPositionY <= 0) {
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
                    window.router.navigate("/pong/");
                }, OVERLAY_DISPLAY_TIME);
                return;
            }
            requestAnimationFrame(gameLoop);
        }
        
        async function initGame() {
            await startGame();
            gameLoop();
            moveBall();
        } 
    }

    CustomDOMContentUnload() {
        this.gameReset();
    }
}