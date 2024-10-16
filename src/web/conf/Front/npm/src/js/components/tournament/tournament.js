import { Component } from "@js/component";

let BALL_SPEED_X = 5;
let BALL_SPEED_Y = 1;
let PADDLE_SPEED = 5;

export class Tournament extends Component {
    constructor() {
        super();
        this.players = [];
        this.player1 = null;
        this.player2 = null;
        this.currentMatch = 0;
        this.jump = 0;
        this.winner = null;
        this.winners = [];
        this.end = false;
        this.start = false;
    }

    render() {
        return `
        <h2 id="hd">Mode Tournoi</h2>
        <div id="tournament-container">
                <div id="player-registration">
                    <div id="player-inputs"></div>
                    <button id="start-tournament-button">Démarrer le tournoi</button>
                    </div>
                    <div id="tournament-progress" style="display: none;">
                    <h2>Tournoi en cours</h2>
                    <button id="start-pong-button">Lancer la partie</button>
                    <button id="toggle-settings">Options</button>
                    <div id="options-container" class="hidden">
                        <button id="settings-option1" class="off">X2 (Off)</button>
                        <label for="color-picker" >Choose Color for map:</label>
                        <input type="color" id="color-picker" name="color-picker">
                    </div>
                    <button id="reset-tournament">Nouveau tournoi</button>
                    <div id="current-match"></div>
                    <div id="tournament-bracket"></div>
                    <div id="control" class="controls">
                        <div id="control1" class="player-controls">
                            <div class="player-name">Player 1</div>
                            <div class="key">W</div>
                            <div class="key">S</div>
                        </div>
                        <div id="control2" class="player-controls">
                            <div class="player-name">Player 2</div>
                            <div class="key">ArrowUp</div>
                            <div class="key">ArrowDown</div>
                        </div>
                    </div>
                    </div>
                    <div id="tournament-result" style="display: none;">
                    <h2>Résultat du tournoi</h2>
                    <div id="winner-display"></div>
                    <button id="reset-end">Nouveau tournoi</button>
                    </div>
            </div>

            <div id="pong-container" style="display: none;">
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
                    </div>
                    <div id="overlay">
                        <div id="overlay-title">PONG</div>
                        <div id="overlay-text"></div>
                        <div id="overlay-score"></div>
                    </div>
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
                background-color: #121212;
                color: #ffffff;
                font-family: 'Press Start 2P', cursive;
            }

            #hd {
                color: #ffffff;
                text-align: center;
                padding: 20px;
                background-color: #1f1f1f;
                border-bottom: 2px solid #333;
            }

            #player-registration,
            #tournament-container {
                background-color: #1f1f1f;
                padding: 20px;
                text-align: center;
                justify-content: center;
                display: flex;
                margin-top: 10px;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }

            button {
                background-color: #6200ea;
                color: #ffffff;
                border: none;
                padding: 10px 20px;
                margin: 10px;
                cursor: pointer;
                border-radius: 5px;
                transition: background-color 0.3s ease, transform 0.3s ease;
            }

            button:hover {
                background-color: #3700b3;
                transform: scale(1.05);
            }

            input {
                margin: 5px;
                padding: 10px;
                border: 2px solid #333;
                border-radius: 5px;
                background-color: #2c2c2c;
                color: #ffffff;
                transition: border-color 0.3s ease;
            }

            input:focus {
                border-color: #6200ea;
                outline: none;
            }

            #tournament-bracket {
                margin-top: 20px;
            }

            .match {
                margin: 10px 0;
                padding: 10px;
                background-color: #333;
                border-radius: 5px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }


        


            /* Pong */

            #control1 {
                background-color: #6200ea;
                color: #ffffff;
                border: none;
                padding: 10px 20px;
                margin: 10px;
                cursor: pointer;
                border-radius: 5px;
                transition: background-color 0.3s ease, transform 0.3s ease;
            }

            #control2 {
                background-color: #6200ea;
                color: #ffffff;
                border: none;
                padding: 10px 20px;
                margin: 10px;
                cursor: pointer;
                border-radius: 5px;
                transition: background-color 0.3s ease, transform 0.3s ease;
            }

            .hidden {
                display: none !important;
            }
            
            #options-container {
                background-color: #6200ea;
                color: #ffffff;
                border: none;
                padding: 10px 20px;
                margin: 10px;
                cursor: pointer;
                border-radius: 5px;
                transition: background-color 0.3s ease, transform 0.3s ease;
            }

            #hd {
                color: #ffffff;
                text-align: center;
                padding: 20px;
                background-color: black;
                border-bottom: 2px solid #333;
            }
            #basePong {
                height: 831px;
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
            }

            #settings-menu {
                background-color: #6200ea;
                color: #ffffff;
                border: none;
                padding: 10px 20px;
                margin: 10px;
                cursor: pointer;
                border-radius: 5px;
                transition: background-color 0.3s ease, transform 0.3s ease;
            }

            #settings-menu {
                font-size: 20px;
                padding: 10px;
                text-align: center;
            }

            #settings-menu button, #settings-menu input[type="color"] {
                margin: 5px;
            }

            #settings-option1.on {
                background-color: green;
                color: white;
            }

            #settings-option1.off {
                background-color: red;
                color: white;
            }

            #settings-option1 {
                background-color: #6200ea;
                color: #ffffff;
                border: none;
                padding: 10px 20px;
                margin: 10px;
                cursor: pointer;
                border-radius: 5px;
                transition: background-color 0.3s ease, transform 0.3s ease;
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
                left: calc(50% - 62px);
            }

            #toggle-settings:hover,
            #start-button:hover {
                background: white;
                color: black;
                transition: 0.3s;
                transform: scale(1.1);
            }

            #controls {
                display: flex;
                justify-content: center;
                margin-top: 20px;
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

    escape(event) {
        if (event.key === 'Escape')
            window.router.navigate('/');
    }

    CustomDOMContentLoaded() {

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




        this.setupEventListeners();
        this.renderPlayerInputs();

        const savedPlayers = JSON.parse(localStorage.getItem('players'));
        if (savedPlayers) {
            this.players = savedPlayers;
            this.renderPlayerInputs();
        }

       if (this.loadFullState()) {
            this.updateUIWithTournamentState();
       }

        const WINNING_SCORE = 3;
        const OVERLAY_DISPLAY_TIME = 3000;

        const ball = document.getElementById("ball");
        const paddle_1 = document.getElementById("player_1_paddle");
        const paddle_2 = document.getElementById("player_2_paddle");

        let ballScored = false;
    
        const initialBallPos = getBallPosition();
        let ballPositionX = initialBallPos.left;
        let ballPositionY = initialBallPos.top;
        
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
            if (keyMap[event.code]) {
                event.preventDefault();
                keyMap[event.code]();
            }
        }

        function handleKeyUp(e) {
            handleKey(e, false);
        }
        
        function handleKeyDown(e) {
            handleKey(e, true);
        }

        function handleClick(e) {
            const overlay = document.getElementById("overlay-before-start");
            if (e.target.id === "start-pong-button") {
                document.getElementById('tournament-container').style.display = 'none';
                document.getElementById('pong-container').style.display = 'block';
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
            const initialBallPos = getBallPosition();
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
            const ballWidth = ball.offsetWidth;
            const ballHeight = ball.offsetHeight;
        
            return {
                top: (836 / 2) - (ballHeight / 2),
                left: (1920 / 2) - (ballWidth / 2),
                width: ballWidth,
                height: ballHeight
            };
        }
        
        function resetBall() {
            const initialBallPos = getBallPosition();
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
    
            if (ballPositionY >= 836 - ball.offsetHeight - 1 || ballPositionY <= 0) {
                ballSpeedY *= -1;
            }
            if (score_1 === WINNING_SCORE || score_2 === WINNING_SCORE) {
                return;
            }
    
            requestAnimationFrame(moveBall);
        }
        
        const gameLoop = () => {
            if (upPressed) movePaddle('2', -1);
            if (downPressed) movePaddle('2', 1);
            if (wPressed) movePaddle('1', -1);
            if (sPressed) movePaddle('1', 1);
            
            if (!ballScored && (score_1 === WINNING_SCORE || score_2 === WINNING_SCORE)) {
                showOverlay(`Player ${score_1 === WINNING_SCORE ? this.player1 : this.player2} wins!`, score_1, score_2);
                this.handleMatchResult(score_1 === WINNING_SCORE ? 0 : 1);
                setTimeout(() => {
                    resetGame();
                    window.router.navigate("/tournament");
                }, OVERLAY_DISPLAY_TIME);
                return;
            }
            requestAnimationFrame(gameLoop);
        }
        
        function initGame() {
            resetBall();
            startGame().then(() => {
                gameLoop();
                moveBall();
        }); 
    }
}

    setupEventListeners() {
        document.getElementById('start-tournament-button').addEventListener('click', () => this.startTournament());
        document.getElementById('reset-tournament').addEventListener('click', () => this.resetTournament());
        document.getElementById('reset-end').addEventListener('click', () => this.resetTournament());
    }

    renderPlayerInputs() {
        const container = document.getElementById('player-inputs');
        container.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            container.innerHTML += `<input type="text" id="player${i}" value="${this.players[i] || ''}" placeholder="Nom du joueur ${i + 1}">`;
        }
    }

    startTournament() {
        this.players = Array.from(document.querySelectorAll('#player-inputs input')).map(input => input.value).filter(name => name.trim() !== '');
        if (this.players.length !== 4) {
            alert("Veuillez entrer 4 noms de joueurs pour démarrer le tournoi");
            return;
        }
        if (!this.areNamesUnique(this.players)) {
            alert("Les noms des joueurs doivent être différents");
            return;
        }
        this.initializeTournament();
        document.getElementById('player-registration').style.display = 'none';
        document.getElementById('tournament-progress').style.display = 'block';
    }
    
    areNamesUnique(names) {
        for (let i = 0; i < names.length; i++) {
            for (let j = i + 1; j < names.length; j++) {
                if (names[i] === names[j]) {
                    return false;
                }
            }
        }
        return true;
    }

    initializeTournament() {
        this.player1 = this.players[this.currentMatch]
        this.player2 = this.players[this.currentMatch + 1];
        this.start = true;
        this.saveFullState();
        this.Match();
        this.saveFullState();
    }

    showTournamentProgress() {
        document.getElementById('player-registration').style.display = 'none';
        document.getElementById('tournament-progress').style.display = 'block';
        this.updateTournamentBracket();
    }

    Match() {
        if (this.currentMatch < this.players.length - 1) {
            document.getElementById('current-match').textContent = `Match en cours : ${this.player1} vs ${this.player2}`;
        }
        else {
            this.winner = (this.winners[0] == this.winners[1] || this.winners[0] == this.winners[2]) ? this.winners[1] : this.winners[0];
            this.finishTournament();
        }
    }

    handleMatchResult(winnerIndex) {
        this.updateTournamentBracket(winnerIndex);
        this.Match();
        this.currentMatch++;
        this.jump += 2;

        if (this.jump < this.players.length - 1) {
            this.player1 = this.players[this.jump];
            this.player2 = this.players[this.jump + 1];
        }
        else {
            this.player1 = this.winners[0];
            this.player2 = this.winners[1];
            this.end = true;
        }
        this.saveFullState();
    }

    updateTournamentBracket(winnerIndex) {
        const bracketElement = document.getElementById('tournament-bracket');
        if (!this.end) {
            this.winners[this.currentMatch] = this.players[this.jump + winnerIndex];
            let html = `<div class="match">Match ${this.currentMatch + 1}: winner ${this.winners[this.currentMatch]}</div>`;
            bracketElement.innerHTML += html;
        }
        else {
            let html = `<div class="match">Match ${this.currentMatch + 1}: winner ${this.winners[winnerIndex]}</div>`;
            bracketElement.innerHTML += html;
        }
        this.saveFullState();
    }

    updateUIBracket() {
        const bracketElement = document.getElementById('tournament-bracket');
        let html = '';
        for (let i = 0; i < this.currentMatch; i++) {
            html += `<div class="match">Match ${i + 1}: winner ${this.winners[i]}</div>`;
        }
        bracketElement.innerHTML = html;
    }

    finishTournament() {
        document.getElementById('tournament-progress').style.display = 'none';
        document.getElementById('tournament-result').style.display = 'block';
        document.getElementById('winner-display').textContent = `Le gagnant du tournoi est : ${this.winner} bien joué !`;
        this.saveFullState();
    }

    resetTournament() {
        this.players = [];
        this.currentMatch = 0;
        this.winner = null;
        this.winners = [];
        this.player1 = null;
        this.player2 = null;
        this.jump = 0;
        this.end = false;
        this.start = false;
        document.getElementById('tournament-bracket').innerHTML = '';
        document.getElementById('tournament-result').style.display = 'none';
        document.getElementById('player-registration').style.display = 'block';
        document.getElementById('tournament-progress').style.display = 'none';
        this.renderPlayerInputs();
        localStorage.removeItem('fullTournamentState');
    }

    
    updateUIWithTournamentState() {
        this.renderPlayerInputs();
        if (this.winner) {
            document.getElementById('tournament-progress').style.display = 'none';
            document.getElementById('tournament-result').style.display = 'block';
            document.getElementById('player-registration').style.display = 'none';
            document.getElementById('winner-display').textContent = `Le gagnant du tournoi est : ${this.winner} bien joué !`;
        } else if (this.start) {
            document.getElementById('tournament-progress').style.display = 'block';
            document.getElementById('tournament-result').style.display = 'none';
            this.showTournamentProgress();
            this.updateTournamentBracket();
            this.Match();
            this.updateUIBracket();
        }
    }
    
    loadFullState() {
        const savedState = localStorage.getItem('fullTournamentState');
        if (savedState) {
            const fullState = JSON.parse(savedState);
            this.players = fullState.players ?? [];
            this.player1 = fullState.player1 ?? null;
            this.player2 = fullState.player2 ?? null;
            this.currentMatch = fullState.currentMatch ?? 0;
            this.jump = fullState.jump ?? 0;
            this.winners = fullState.winners ?? [];
            this.winner = fullState.winner ?? null;
            this.end = fullState.end ?? false;
            this.start = fullState.start ?? false;
            return true;
        }
        return false;
    }

    saveFullState() {
        const fullState = {
            players: this.players ?? [],
            player1: this.player1 ?? null,
            player2: this.player2 ?? null,
            currentMatch: this.currentMatch ?? 0,
            jump: this.jump ?? 0,
            winners: this.winners ?? [],
            winner: this.winner ?? null,
            end: this.end ?? false,
            start: this.start ?? false,
        };
        localStorage.setItem('fullTournamentState', JSON.stringify(fullState));
    }

    CustomDOMContentUnload() {
        this.gameReset();
        document.removeEventListener('keydown', this.escape);   
    }
}
