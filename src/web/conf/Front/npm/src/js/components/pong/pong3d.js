import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Component } from "@js/component";

let BALL_SPEED_X = 0.02;
let BALL_SPEED_Y = 0.02;
let PADDLE_SPEED = 0.02;

export class P3d extends Component {
    constructor() {
        super();
        this.upPressed = false;
        this.downPressed = false;
        this.wPressed = false;
        this.sPressed = false;
        this.scorePlayer1 = 0;
        this.scorePlayer2 = 0;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
    }

    render() {
        return `
            <h2 id="hd">Mode 3D</h2>
            <div id="pong3d-container"></div>
            <div id="scoreboard">
                <span id="scorePlayer1">Player 1: 0</span>
                <span id="scorePlayer2">Player 2: 0</span>
            </div>
            <div id="overlay">
                <div class="text-before">Are you ready?</div>
                <div class="controls">
                    <div class="player-controls">
                        <div class="player-name">Player 1</div>
                        <div class="key">A</div>
                        <div class="key">D</div>
                    </div>
                    <div class="player-controls">
                        <div class="player-name">Player 2</div>
                        <div class="key">ArrowLeft</div>
                        <div class="key">ArrowRight</div>
                    </div>
                </div>
                <div>
                    <button id="start-button">Start</button>
                    <button id="toggle-settings">Options</button>
                    <div id="options-container" class="hidden">
                        <button id="settings-option1" class="off">X2 (Off)</button>
                        <label for="color-picker">Choose Color for map:</label>
                        <input type="color" id="color-picker" name="color-picker">
                    </div>
                </div>
            </div>
            <div id="finish">Well played</div>
            <div id="finish2"></div>
            <div id="message"></div>
        `;
    }
    
    style() {
        return `
        <style>
            html, body {
                height: 100%;
                margin: 0;
                padding: 0;
                background-color: black;
                color: #ffffff;
                font-family: 'Press Start 2P', cursive;
                overflow: hidden;
            }
    
            #finish {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 50px;
                color: white;
                display: none;
            }

            #finish2 {
                position: absolute;
                top: 60%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 50px;
                color: white;
                display: none;
            }
            
            #hd {
                color: #ffffff;
                text-align: center;
                padding: 20px;
                background-color: black;
                border-bottom: 2px solid #333;
            }
    
            #pong3d-container {
                height: 100%;
                width: 100%;
                position: relative;
                background: black;
                user-select: none;
                overflow: hidden;
            }
    
            #scorePlayer1 {
                position: absolute;
                left: 20%;
                top: 5%;
            }
            
            #scorePlayer2 {
                position: absolute;
                right: 20%;
                top: 5%;
            }      
    
            #scoreboard span {
                font-size: 20px;
            }
    
            #overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
    
            #start-button, #toggle-settings {
                font-size: 20px;
                padding: 10px;
                background: black;
                color: white;
                border: 2px solid white;
                cursor: pointer;
                margin: 10px;
            }
    
            #options-container {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
    
            #settings-option1 {
                font-size: 20px;
                padding: 10px;
                background: black;
                color: white;
                border: 2px solid white;
                cursor: pointer;
                margin: 15px;
            }
    
            #settings-option1.on {
                background-color: green;
            }
    
            #settings-option1.off {
                background-color: red;
            }
    
            .hidden {
                display: none !important;
            }
    
            #message {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 50px;
                color: white;
            }
    
            .controls {
                display: flex;
                justify-content: space-between;
                width: 100%;
                padding: 0 20%;
                margin-bottom: 20px;
            }
    
            .player-controls {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
    
            .player-name {
                font-size: 24px;
                margin-bottom: 10px;
            }
    
            .key {
                font-size: 18px;
                border: 1px solid white;
                padding: 5px 10px;
                margin: 5px;
            }
    
            .text-before {
                font-size: 30px;
                margin-bottom: 20px;
                text-align: center;
            }
        </style>
        `;
    }

    
    CustomDOMContentLoaded() {
        document.addEventListener('keydown', this.escape);
        
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x808080);
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('pong3d-container').appendChild(this.renderer.domElement);
        // // Ajouter les contrôles de la caméra
        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        // this.controls.enableDamping = true; // Activer l'amortissement (inertie)
        // this.controls.dampingFactor = 0.25;
        // this.controls.enableZoom = true; // Activer le zoom
        // this.controls.enablePan = false; // Activer le déplacement
        // this.controls.maxPolarAngle = Math.PI; // Permettre une rotation complète à 360 degrés
        // this.controls.minPolarAngle = 0; // Permettre une rotation complète à 360 degrés
        
        // this.controls.mouseButtons = {
            //     LEFT: THREE.MOUSE.ROTATE, // Déplacer avec le clic gauche
            //     MIDDLE: THREE.MOUSE.DOLLY, // Zoomer avec la molette
        //     RIGHT: THREE.MOUSE.PAN // Tourner avec le clic droit
        // };
        
        document.getElementById('start-button').addEventListener('click', () => this.initGame());
        document.getElementById('toggle-settings').addEventListener('click', () => this.toggleSettings());
        document.getElementById('settings-option1').addEventListener('click', () => this.toggleSpeed());
        document.getElementById('color-picker').addEventListener('input', (event) => this.changeColor(event));
    }
    
    escape(event) {
        if (event.key === 'Escape')
            window.router.navigate('/pong');
        // this.cleanup();
    }

    async initGame() {
        document.getElementById('overlay').style.display = 'none';
        // await this.startGame();
        this.createObjects();
        this.addLights();
        this.camera.position.set(0, 5, 0); // Positionnez la caméra au-dessus de la scène
        this.ballSpeed = new THREE.Vector3(BALL_SPEED_X, BALL_SPEED_Y, 0);
        this.paddleSpeed = PADDLE_SPEED;
        this.addControls();
        this.animate();
    }

    toggleSettings() {
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.classList.toggle('hidden');
    }

    toggleSpeed() {
        const button = document.getElementById('settings-option1');
        if (button.classList.contains('off')) {
            button.classList.remove('off');
            button.classList.add('on');
            button.textContent = 'X2 (On)';
            BALL_SPEED_X = 0.04;
            BALL_SPEED_Y = 0.04;
            PADDLE_SPEED = 0.04;
        } else {
            button.classList.remove('on');
            button.classList.add('off');
            button.textContent = 'X2 (Off)';
            BALL_SPEED_X = 0.02;
            BALL_SPEED_Y = 0.02;
            PADDLE_SPEED = 0.02;
        }
        this.ballSpeed = new THREE.Vector3(BALL_SPEED_X, BALL_SPEED_Y, 0);
        this.paddleSpeed = PADDLE_SPEED;
    }

    changeColor(event) {
        const color = event.target.value;
        this.scene.background = new THREE.Color(color);
    }

    createObjects() {
        // Créer la balle
        const ballGeometry = new THREE.SphereGeometry(0.08, 32, 32);
        const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        this.ball = new THREE.Mesh(ballGeometry, ballMaterial);
        this.scene.add(this.ball);

        // Créer les paddles
        const paddleGeometry = new THREE.BoxGeometry(0.15, 0.85, 0.1);
        const paddleMaterial1 = new THREE.MeshStandardMaterial({ color: 0x6200ea });
        const paddleMaterial2 = new THREE.MeshStandardMaterial({ color: 0xea6200 });
        this.paddle1 = new THREE.Mesh(paddleGeometry, paddleMaterial1);
        this.paddle2 = new THREE.Mesh(paddleGeometry, paddleMaterial2);
        this.paddle1.position.x = -4.75;
        this.paddle2.position.x = 4.75;
        this.scene.add(this.paddle1);
        this.scene.add(this.paddle2);

        // Créer les murs
        const wallGeometry = new THREE.BoxGeometry(10, 0.05, 0.1);
        const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        this.wallTop = new THREE.Mesh(wallGeometry, wallMaterial);
        this.wallBottom = new THREE.Mesh(wallGeometry, wallMaterial);
        this.wallTop.position.y = 3.5;
        this.wallBottom.position.y = -1.5;
        this.scene.add(this.wallTop);
        this.scene.add(this.wallBottom);

        // Créer le sol
        const groundGeometry = new THREE.PlaneGeometry(10, 5);
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = 0;
        this.ground.position.y = -0.5;
        this.scene.add(this.ground);

    }

    addLights() {
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(10, 10, 10);
        this.scene.add(pointLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(-10, 10, -10);
        this.scene.add(directionalLight);
    }

    handleKey(event, isKeyDown) {
        const keyMap = {
            "ArrowLeft": () => this.upPressed = isKeyDown,
            "ArrowRight": () => this.downPressed = isKeyDown,
            "KeyD": () => this.wPressed = isKeyDown,
            "KeyA": () => this.sPressed = isKeyDown
        };
        if (keyMap[event.code]) {
            keyMap[event.code]();
        }
    }

    handleKeyUp(event) {
        this.handleKey(event, false);
    }

    handleKeyDown(event) {
        this.handleKey(event, true);
    }

    addControls() {
        window.addEventListener('keydown', (event) => this.handleKeyDown(event));
        window.addEventListener('keyup', (event) => this.handleKeyUp(event));
    }

    updatePaddles() {
        if (this.wPressed && this.paddle1.position.y < 3.1) {
            this.paddle1.position.y += this.paddleSpeed;
        }
        if (this.sPressed && this.paddle1.position.y > -1.1) {
            this.paddle1.position.y -= this.paddleSpeed;
        }
        if (this.upPressed && this.paddle2.position.y < 3.1) {
            this.paddle2.position.y += this.paddleSpeed;
        }
        if (this.downPressed && this.paddle2.position.y > -1.1) {
            this.paddle2.position.y -= this.paddleSpeed;
        }
    }

    updateCamera() {
        if (this.ballSpeed.x > 0) {
            this.camera.position.x = 7;
            this.camera.position.y = 1; // Ajustez cette valeur pour obtenir l'angle de vue souhaité
            this.camera.position.z = -0.5;
        
            this.camera.rotation.x = -Math.PI / 2; // 90 degrés pour une vue de dessus
            this.camera.rotation.y = Math.PI / 2; // 90 degrés pour une vue de dessus
            this.camera.rotation.z = 0;
        }
        else {
            this.camera.position.x = -7;
            this.camera.position.y = 1; // Ajustez cette valeur pour obtenir l'angle de vue souhaité
            this.camera.position.z = -0.5;
        
            this.camera.rotation.x = -Math.PI / 2; // 90 degrés pour une vue de dessus
            this.camera.rotation.y = -Math.PI / 2; // 90 degrés pour une vue de dessus
            this.camera.rotation.z = 0;
        }
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
    
        this.updatePaddles();
        
        const paddleWidth = 0.15;
        const paddleHeight = 0.85;
        const ballRadius = 0.08;
        
        this.ball.position.add(this.ballSpeed);
    
        this.ball.rotation.x += 0.1;
        this.ball.rotation.y += 0.1;
    
        if (this.ball.position.y >= 3.5 || this.ball.position.y <= -1.5 ) {
            this.ballSpeed.y = -this.ballSpeed.y;
        } else if (this.ball.position.x >= 5) {
            this.scorePlayer1++;
            this.updateScore();
            this.resetBall();
        } else if (this.ball.position.x <= -5) {
            this.scorePlayer2++;
            this.updateScore();
            this.resetBall();
        }
    
        if (this.ball.position.x - ballRadius <= this.paddle1.position.x + paddleWidth / 2 &&
            this.ball.position.x + ballRadius >= this.paddle1.position.x - paddleWidth / 2 &&
            this.ball.position.y - ballRadius <= this.paddle1.position.y + paddleHeight / 2 &&
            this.ball.position.y + ballRadius >= this.paddle1.position.y - paddleHeight / 2) {
            this.ballSpeed.x = -this.ballSpeed.x;
        }
    
        if (this.ball.position.x + ballRadius >= this.paddle2.position.x - paddleWidth / 2 &&
            this.ball.position.x - ballRadius <= this.paddle2.position.x + paddleWidth / 2 &&
            this.ball.position.y - ballRadius <= this.paddle2.position.y + paddleHeight / 2 &&
            this.ball.position.y + ballRadius >= this.paddle2.position.y - paddleHeight / 2) {
            this.ballSpeed.x = -this.ballSpeed.x;
        }
    
        this.updateCamera();
        // this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    updateScore() {
        const scorePlayer1Element = document.getElementById('scorePlayer1');
        const scorePlayer2Element = document.getElementById('scorePlayer2');
    
        if (scorePlayer1Element) {
            scorePlayer1Element.innerText = `Player 1: ${this.scorePlayer1}`;
        } else {
            console.error('Element with ID "scorePlayer1" not found.');
        }
    
        if (scorePlayer2Element) {
            scorePlayer2Element.innerText = `Player 2: ${this.scorePlayer2}`;
        } else {
            console.error('Element with ID "scorePlayer2" not found.');
        }
    
        if (this.scorePlayer1 >= 5) {
            this.cleanup();
            this.endGame('Player 1');

        } else if (this.scorePlayer2 >= 5) {
            this.cleanup();
            this.endGame('Player 2');
        }
    }
    
    cleanup() {
        // Supprimer les écouteurs d'événements
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
    
        // Arrêter les animations
        cancelAnimationFrame(this.animationId);
    
        // Nettoyer les références DOM
        // const scorePlayer1Element = document.getElementById('scorePlayer1');
        // const scorePlayer2Element = document.getElementById('scorePlayer2');
    
        // if (scorePlayer1Element) {
        //     scorePlayer1Element.innerText = '';
        // }
    
        // if (scorePlayer2Element) {
        //     scorePlayer2Element.innerText = '';
        // }
    
        // Définir les variables sur null pour permettre le garbage collection
    
        // Nettoyer la scène Three.js
        this.scene.traverse((object) => {
            if (!object.isMesh) return;
    
            object.geometry.dispose();
    
            if (object.material.isMaterial) {
                cleanMaterial(object.material);
            } else {
                // an array of materials
                for (const material of object.material) cleanMaterial(material);
            }
        });
    
        function cleanMaterial(material) {
            material.dispose();
    
            // dispose textures
            for (const key of Object.keys(material)) {
                const value = material[key];
                if (value && typeof value === 'object' && 'minFilter' in value) {
                    value.dispose();
                }
            }
        }
    }

    endGame(winner) {
        document.getElementById('pong3d-container').style.display = 'none';
        document.getElementById('scoreboard').style.display = 'none';
        document.getElementById('finish').style.display = 'block';
        document.getElementById('finish2').innerText = `${winner} win!`;
        document.getElementById('finish2').style.display = 'block';
        this.resetGame();
        this.CustomDOMContentUnload()
        setTimeout(() => {
            window.router.navigate('/pong');
        }, 3000);
    }
    
    resetGame() {
        this.resetBall();
        this.scorePlayer1 = 0;
        this.scorePlayer2 = 0;
        this.updateScore();
    }

    resetBall() {
        this.ball.position.set(0, 0, 0);
    
        if (this.scorePlayer1 > this.scorePlayer2) {
            this.ballSpeed = new THREE.Vector3(-BALL_SPEED_X, BALL_SPEED_Y, 0);
        }
        else {
            this.ballSpeed = new THREE.Vector3(BALL_SPEED_X, BALL_SPEED_Y, 0);
        }
    }

    counter(text) {
        var message = document.getElementById("message");
        if (text == 0) text = "GO!";
        if (text == -1) text = "";
        if (message !== null) message.textContent = text;
    }
    
    startGame() {
        return new Promise((resolve) => {
            let i = 0;
            const intervalGameStart = setInterval(() => {
                this.counter(3 - i);
                if (i === 4) {
                    clearInterval(intervalGameStart);
                    resolve();
                }
                i++;
            }, 1000);
        });
    }
    
    CustomDOMContentUnload() {
        console.log("P3D unloaded");
        document.removeEventListener('keydown', this.escape);
        window.removeEventListener('keydown', (event) => this.handleKeyDown(event));
        window.removeEventListener('keyup', (event) => this.handleKeyUp(event));
        this.cleanup();
    }
}