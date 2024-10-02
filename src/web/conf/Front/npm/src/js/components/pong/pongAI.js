import { Component } from "@js/component";

export class PongAI extends Component{
    constructor(){
        super();
        this.gameReset = null;
    }

    render(){
        return`
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
                            <div class="key">W</div>
                            <div class="key">S</div>
                        </div>
                    </div>
                    <button id="start-button">Start</button>
                </div>
            </div>
        `;
    }

    style(){
        // MON CSS
        return `
        <style>
            #basePong {
                height: 831px;
                width: 1920px;
                position: relative;
                background: black;
                font-family: 'Press Start 2P', cursive;
                user-select: none;
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
                position: absolute;
                top: 30%;
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
            
        </style>
        `;
        
    }

    CustomDOMContentLoaded(){
        let ballSpeedX = 10; 
        let ballSpeedY = 1;
        let ball = document.getElementById("ball");
        let paddle_1 = document.getElementById("player_1_paddle");
        let paddle_2 = document.getElementById("player_2_paddle");
    
        let ballPositionX = getBallPosition().left;
        let ballPositionY = getBallPosition().top;
        const initialBallPos = { left: ballPositionX, top: ballPositionY };
        let score_1 = 0;
        let score_2 = 0;
    
        let upPressed = false, downPressed = false, wPressed = false, sPressed = false;
        const speedPaddle = 7;
        let intervalGameStart = null;
        function movePaddleUp(which) {
            const paddle = document.getElementById(`player_${which}_paddle`);
            if (paddle) {
                let currentTop = parseFloat(window.getComputedStyle(paddle).top);
                if (currentTop > 3)
                    paddle.style.top = (currentTop - speedPaddle) + "px";
            }
        }
    
        function movePaddleDown(which) {
            const paddle = document.getElementById(`player_${which}_paddle`);
            if (paddle) {
                let currentTop = parseFloat(window.getComputedStyle(paddle).top);
                const parent = paddle.parentElement;
                const maxBottom = parent.clientHeight - paddle.clientHeight - 5;
                if (currentTop < maxBottom - 10)
                    paddle.style.top = (currentTop + speedPaddle) + "px";
            }
        }
        
        let aiControlsArrows = true;

        function handleKey(event, isKeyDown) {
            const keyMap = {
                "ArrowUp": () => {
                    console.log("ArrowUp");
                    upPressed = isKeyDown;
                },
                "ArrowDown": () => {
                    console.log("ArrowDown");
                    downPressed = isKeyDown;
                },
                "KeyW": () => wPressed = isKeyDown,
                "KeyS": () => sPressed = isKeyDown
            };
            if (keyMap[event.code]) keyMap[event.code]();
        }

        function handleClick(e) {
            const overlay = document.getElementById("overlay-before-start");
            if (e.target.id === "start-button") {
                overlay.style.display = "none";
                initGame();
            }
        }
        
        // Add the event listener using the defined function
        document.addEventListener("click", handleClick);
        document.addEventListener("keyup", (e) => handleKey(e, false), true);
        document.addEventListener("keydown", (e) => handleKey(e, true), true);
    
        function resetGame() {
            console.log("Game reset");
            clearInterval(intervalGameStart);
            ballPositionX = initialBallPos.left;
            ballPositionY = initialBallPos.top;
            // ball.style.left = ballPositionX + "px";
            // ball.style.top = ballPositionY + "px";
            ballSpeedX = 10;
            ballSpeedY = 2;
            score_1 = 0;
            score_2 = 0;
            const score1 = document.getElementById("player_1_score");
            const score2 = document.getElementById("player_2_score");
            if (score1 !== null) score1.textContent = "0";
            if (score2 !== null) score2.textContent = "0";
            var message = document.getElementById("message");
            if (message !== null) message.textContent = "";
            wPressed = false;
            sPressed = false;
            upPressed = false;
            downPressed = false;
            document.removeEventListener("keyup", (e) => handleKey(e, false), true);
            document.removeEventListener("keydown", (e) => handleKey(e, true), true);
            document.removeEventListener("click", handleClick);
            cancelAnimationFrame(gameLoop);
            cancelAnimationFrame(moveBall);
        }
    
        this.gameReset = resetGame;
    
        function getBallPosition() {
            const ball = document.getElementById('ball');
            const rect = ball.getBoundingClientRect();
    
            const position = {
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
                height: rect.height
            };
            return position;
        }
    
    
        function checkCollision() {
            const ballRect = ball.getBoundingClientRect();
            const paddle1Rect = paddle_1.getBoundingClientRect();
            const paddle2Rect = paddle_2.getBoundingClientRect();
            

            const paddles = [
            { rect: paddle1Rect, speedMultiplier: -1.10, positionX: paddle1Rect.right },
            { rect: paddle2Rect, speedMultiplier: -1.10, positionX: paddle2Rect.left - ballRect.width }
            ];

            for (const paddle of paddles) {
                if (ballRect.left < paddle.rect.right && ballRect.right > paddle.rect.left &&
                    ballRect.top < paddle.rect.bottom && ballRect.bottom > paddle.rect.top) {
                    
                    ballSpeedX *= paddle.speedMultiplier;
                    ballPositionX = paddle.positionX;
            
                    let relativeIntersectY = (ballRect.top + (ballRect.height / 2)) - (paddle.rect.top + (paddle.rect.height / 2));
                    let normalizedRelativeIntersectionY = (relativeIntersectY / (paddle.rect.height / 2)) * 10;
                    
                    ballSpeedY = normalizedRelativeIntersectionY;
            
                    // Scale the paddle by 1.1
                    const paddleElement = paddle.rect === paddle1Rect ? paddle_1 : paddle_2;
                    paddleElement.style.transform = "scale(1.1)";
            
                    // Optionally, reset the scale after a short delay
                    setTimeout(() => {
                        paddleElement.style.transform = "scale(1)";
                    }, 100); // Reset after 200 milliseconds
                }
            }
            console.log(ballRect.left);
            console.log(ballRect.right);
        
            if (ballRect.left < 1) {
                ballPositionX = initialBallPos.left;
                ballPositionY = initialBallPos.top;
                ball.style.left = ballPositionX + "px";
                ball.style.top = ballPositionY + "px";
                ballSpeedX = ballSpeedX > 0 ? -10 : 10;
                ballSpeedY = 1;
                var score = document.getElementById("player_1_score")
                score_1 += 1;
                if (score !== null)
                    score.textContent = score_1;
            }
        
            if (ballRect.right > 1920) {
                ballPositionX = initialBallPos.left;
                ballPositionY = initialBallPos.top;
                ball.style.left = ballPositionX + "px";
                ball.style.top = ballPositionY + "px";
                ballSpeedX = ballSpeedX > 0 ? -10 : 10;
                ballSpeedY = 1;
                var score = document.getElementById("player_2_score")
                score_2 += 1;
                if (score !== null)
                    score.textContent = score_2;
            }
        }
    
        function counter(text) {
            var message = document.getElementById("message");
            if (text == 0) text = "GO!";
            if (text == -1) text = "";
            if (message !== null)
                message.textContent = text;
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
    
            if (ballPositionX >= basePong.clientWidth - ball.offsetWidth || ballPositionX <= 0) {
                ballSpeedX *= -1;
            }
    
            if (ballPositionY >= basePong.clientHeight - ball.offsetHeight - 1 || ballPositionY <= 0) {
                ballSpeedY *= -1;
            }
            if (score_1 === 5 || score_2 === 5) {
                return;
            }
    
            requestAnimationFrame(moveBall);
    }
    
        function gameLoop() {
            if (upPressed) movePaddleUp('2');
            if (downPressed) movePaddleDown('2');
            if (wPressed) movePaddleUp('1');
            if (sPressed) movePaddleDown('1');
            
            if (score_1 === 5 || score_2 === 5) {
                counter("Player " + (score_1 === 5 ? 1 : 2) + " wins!");
                const message = document.getElementById("message");
                const blinkInterval = setInterval(() => {
                    message.style.color = message.style.color === "white" ? "red" : "white";
                }, 500);
                setTimeout(() => {
                    resetGame();
                    clearInterval(blinkInterval);
                    window.router.navigate("/pong/");
                }, 5000);
                return;
            }
            requestAnimationFrame(gameLoop);
        }
        
        function AI() {
            const paddle = document.getElementById("player_2_paddle");
            const ball = document.getElementById("ball");
            const paddleRect = paddle.getBoundingClientRect();
            const ballRect = ball.getBoundingClientRect();
            const ballY = ballRect.top + ballRect.height / 2;
        
            if (aiControlsArrows) {
                if (paddleRect.top + paddleRect.height / 4 < ballY) {
                    const arrowDown = new KeyboardEvent("keydown", { code: "ArrowDown", key: "ArrowDown", keyCode: 40, which: 40, bubbles: true });
                    document.dispatchEvent(arrowDown);
                    setTimeout(() => {
                        const arrowDownUp = new KeyboardEvent("keyup", { code: "ArrowDown", key: "ArrowDown", keyCode: 40, which: 40, bubbles: true });
                        document.dispatchEvent(arrowDownUp);
                    }, 50);
                } else {
                    const arrowUp = new KeyboardEvent("keydown", { code: "ArrowUp", key: "ArrowUp", keyCode: 38, which: 38, bubbles: true });
                    document.dispatchEvent(arrowUp);
                    setTimeout(() => {
                        const arrowUpUp = new KeyboardEvent("keyup", { code: "ArrowUp", key: "ArrowUp", keyCode: 38, which: 38, bubbles: true });
                        document.dispatchEvent(arrowUpUp);
                    }, 50);
                }
            }
        
            requestAnimationFrame(AI);
        }
        
        async function initGame() {
            await   startGame();
            gameLoop();
            moveBall();
            AI();
        } 

        

    }

    CustomDOMContentUnload(){
        console.log("DOM CONTENT UNLOAD.");
        this.gameReset();
    }
}