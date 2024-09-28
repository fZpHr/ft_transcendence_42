import { Component } from "@js/component";

export class Pong extends Component{
    constructor(){
        super();
        this.gameReset = null;
    }

    render(){
        return`
            <div id="basePong">
            <div class="ball" id="ball">
                <div class="ballstyle"></div>
            </div>
            <div id="player_1_paddle" class="paddle_1"></div>
            <div id="player_2_paddle" class="paddle_2"></div>
            <div class="text">
                <div id="player_1_score" class="score_1">0</div>
                <div class="tild">-</div>
                <div id="player_2_score" class="score_2">0</div>
                <div id="message"></div>
            </div>
        </div>
        `;
    }

    style(){
        // MON CSS
        return `
        <style>
            #basePong {
    height: 85vh;
    width: 80vw;
    border-radius: 14px;

}

.paddle_1,
.paddle_2 {
    height: 100px;
    width: 18px;
    position: fixed;
    background: rgb(0, 0, 0);
}

.paddle_1 {
    top: 50%;
    left: 5%;
}

.paddle_2 {
    top: 50%; 
    right: 5%;
}


.ball {
    height: 30px;
    width: 30px;
    border-radius: 50%;
    background: black;
    position: fixed;
    top: 50%;
    right: 50%;
}

.score_1,
.score_2,
.tild,
#message {
    color: black;
    position: fixed;
    font-weight: 500px;
    top: 10%;
    font-size: 50px;
}

.score_1 {
    right: 55%
}

.tild {
    right: 50%
}

.score_2 {
    right: 44%;
}

#message {
    right: 50%;
    top: 30%;
}
        </style>
        `;
        
    }

    CustomDOMContentLoaded(){
        let upPressed = false;
        let downPressed = false;
        let wPressed = false;
        let sPressed = false;
        const speedPaddle = 7;

        function movePaddleUp(which) {
            const paddle = document.getElementById(`player_${which}_paddle`);
            if (paddle) {
                let currentTop = parseFloat(window.getComputedStyle(paddle).top);
                if (currentTop > 0)
                    paddle.style.top = (currentTop - speedPaddle) + "px";
            }
        }

        function movePaddleDown(which) {
            const paddle = document.getElementById(`player_${which}_paddle`);
            if (paddle) {
                let currentTop = parseFloat(window.getComputedStyle(paddle).top);
                if (currentTop < window.innerHeight - paddle.offsetHeight)
                    paddle.style.top = (currentTop + speedPaddle) + "px";
            }
        }

        function movePaddleKeyUp(event) {
            switch (event.code) {
                case "ArrowUp":
                    if (!upPressed) {
                        upPressed = true;
                        movePaddleUp('2');
                    }
                    break;
                case "ArrowDown":
                    if (!downPressed) {
                        downPressed = true;
                        movePaddleDown('2');
                    }
                    break;
                case "KeyW":
                    if (!wPressed) {
                        wPressed = true;
                        movePaddleUp('1');
                    }
                    break;
                case "KeyS":
                    if (!sPressed) {
                        sPressed = true;
                        movePaddleDown('1');
                    }
                    break;
                default:
                    break;
            }
        };

        function movePaddleKeyDown(event) {
            switch (event.code) {
                case "ArrowUp":
                    upPressed = false;
                    break;
                case "ArrowDown":
                    downPressed = false;
                    break;
                case "KeyW":
                    wPressed = false;
                    break;
                case "KeyS":
                    sPressed = false;
                    break;
                default:
                    break;
            }
        };
        document.addEventListener("keyup", movePaddleKeyDown, true);
        document.addEventListener("keydown", movePaddleKeyUp, true);
        

        let gameRunning = false;
        let gameInterval;

        this.gameReset = function resetGame() {
            console.log("Game reset");
            clearInterval(gameInterval);
            gameRunning = false;
            // Réinitialiser les variables globales ici
            ballPositionX = initialBallPos.left;
            ballPositionY = initialBallPos.top;
            ballSpeedX = initialBallSpeedX;
            ballSpeedY = initialBallSpeedY;
            score_1 = 0;
            score_2 = 0;
            document.getElementById("player_1_score").textContent = score_1;
            document.getElementById("player_2_score").textContent = score_2;
            wPressed = false;
            sPressed = false;
            upPressed = false;
            downPressed = false;
            document.removeEventListener("keyup", movePaddleKeyDown, true);
            document.removeEventListener("keydown", movePaddleKeyUp, true);
            cancelAnimationFrame(gameLoop);
            cancelAnimationFrame(moveBall);
        }

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

        let ballSpeedX = 10; 
        let ballSpeedY = 1;
        let ball = document.getElementById("ball");
        let paddle_1 = document.getElementById("player_1_paddle");
        let paddle_2 = document.getElementById("player_2_paddle");

        let ballPositionX = getBallPosition().left;
        let ballPositionY = getBallPosition().top;
        let score_1 = 0;
        let score_2 = 0;

        let initialBallPos = { left: getBallPosition().left, top: getBallPosition().top };

        function checkCollision() {
            const ballRect = ball.getBoundingClientRect();
            const paddle1Rect = paddle_1.getBoundingClientRect();
            const paddle2Rect = paddle_2.getBoundingClientRect();

            if (ballRect.left < paddle1Rect.right && ballRect.right > paddle1Rect.left && 
                ballRect.top < paddle1Rect.bottom && ballRect.bottom > paddle1Rect.top)
            {
                ballSpeedX *= -1;
                ballPositionX = paddle1Rect.right;
            }

            if (ballRect.left < paddle2Rect.right && ballRect.right > paddle2Rect.left &&
                ballRect.top < paddle2Rect.bottom && ballRect.bottom > paddle2Rect.top)
            {
                ballSpeedX *= -1;
                ballPositionX = paddle2Rect.left - ballRect.width;
            }

            if (ballRect.left < 1) {
                ballPositionX = initialBallPos.left;
                ballPositionY = initialBallPos.top;
                ball.style.left = ballPositionX + "px";
                ball.style.top = ballPositionY + "px";
                ballSpeedX = -ballSpeedX;
                var score = document.getElementById("player_1_score")
                score_1 += 1;
                score.textContent = score_1;
            }

            if (ballRect.right > window.innerWidth - 1) {
                ballPositionX = initialBallPos.left;
                ballPositionY = initialBallPos.top;
                ball.style.left = ballPositionX + "px";
                ball.style.top = ballPositionY + "px";
                ballSpeedX = -ballSpeedX;
                var score = document.getElementById("player_2_score")
                score_2 += 1;
                score.textContent = score_2;
            }
        }

        function myFunction(text) {
            var message = document.getElementById("message");
            if (text == 0) text = "GO!";
            if (text == -1) text = "";
            message.textContent = text;
        }
        
        function startGame() {
            return new Promise((resolve) => {
                for (let i = 0; i <= 4; i++) {
                    setTimeout(() => {
                        myFunction(3 - i);
                        if (i === 4) {
                            resolve();
                        }
                    }, i * 1000);
                }
            });
        }


        function moveBall() {
            ballPositionX += ballSpeedX;
            ballPositionY += ballSpeedY;

            ball.style.left = ballPositionX + "px";
            ball.style.top = ballPositionY + "px";

            checkCollision();

            if (ballPositionX >= window.innerWidth - ball.offsetWidth || ballPositionX <= 0) {
                ballSpeedX *= -1;
            }

            if (ballPositionY >= window.innerHeight - ball.offsetHeight || ballPositionY <= 0) {
                ballSpeedY *= -1;
            }

            requestAnimationFrame(moveBall);
    }

        function gameLoop() {
            if (upPressed) movePaddleUp('2');
            if (downPressed) movePaddleDown('2');
            if (wPressed) movePaddleUp('1');
            if (sPressed) movePaddleDown('1');
            

            // how to stop animation frame
            if (score_1 === 5 || score_2 === 5) {
                myFunction("Player " + (score_1 === 5 ? 1 : 2) + " wins!");
                this.gameReset()
                return;
            }
            requestAnimationFrame(gameLoop);
        }

        async function initGame() {
            await   startGame();
            gameLoop();
            moveBall();
        } 

        initGame()
    }

    CustomDOMContentUnload(){
        console.log("Custom element removed from page.");
        this.gameReset();
    }
}