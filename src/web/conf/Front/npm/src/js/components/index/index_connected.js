import { Component } from "@js/component";
import { getCookie } from "@js/utils/cookie";

export class IndexConnected extends Component{
    constructor(){
        super();
        this.commands = ['help', 'ls', './pong.sh', './connect4.sh', './tournament.sh', 'pwd', 'whoami', 'exit', 'clear', 'cat', './profil.txt', 'cat ./profil.txt', 'cat profil.txt', 'cat ./pong.sh', 'cat pong.sh', 'cat ./connect4.sh', 'cat connect4.sh', 'cat ./tournament.sh', 'cat tournament.sh', 'bash pong.sh', 'bash connect4.sh', 'bash tournament.sh', 'bash profil.txt'];
        this.profil_info = {}
    }

    render(){
        return `
            <div id="container">
            <div id="terminal">
            <button id="credits" type="button" class="btn btn-link">©</button>
                    <pre id="terminal-out">Welcome ${getCookie("user42")}.\nType 'help' to see available commands.</pre>
                    <div id="input-container">
                        <span id="prompt">></span>
                        <input type="text" id="terminal-in" autofocus maxlength="100" />
                    </div>
                </div>
            </div>
        `;
    }

    style(){
        return `
             <style>

            #container {
                position: relative;
                height: 100vh;
                overflow: hidden;
            }

            #terminal {
                background-color: black;
                padding: 50px;
                z-index: 1;
                text-align: left;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
            }

            #terminal-out {
                color: white;
                margin: 5;
                white-space: pre-wrap;
                font-size: 1.2em;
                overflow: hidden;
            }

            #input-container {
                display: flex;
                align-items: center;
            }

            #prompt {
                color: white;
                font-family: monospace;
                margin-right: 5px;
            }

            #terminal-in {

                color: white;
                background-color: black;
                border: none;
                outline: none;
                font-size: 1em;
                font-family: monospace;
                width: 100%;
            }

            .btn-link {
                color: white;
                position: absolute;
                right: 0;
                top: 0;
            }
            
            .btn-link:focus,
            .btn-link:active {
                outline: none !important;
                border: none !important;
                box-shadow: none !important;
            }
            
        </style>
        `;
    }

    CustomDOMContentLoaded(){
        this.setup_term();

        const credits = document.getElementById('credits');
        this.terminal_out = document.getElementById('terminal-out');
        document.getElementById('terminal-in').focus()

        credits.addEventListener('click', () => {
            window.router.navigate('/credits');
        });
        this.profil_info = this.get_user_info();  
        //console.log('test')  
    }

    get_user_info()
    {
        //console.log("get user")
        const getUserURL = "https://" + window.location.host + "/users/get-info/";
        const csrftoken = getCookie('csrftoken'); 
        fetch(getUserURL, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken, // Include CSRF token if needed
            },
        }).then((response) => {
            if (response.ok) {
                return response.json(); // Assuming the response is in JSON format
            } else {
                throw new Error('Network response was not ok');
            }
        }).then((data) => {
            this.profil_info = data;
            //console.log(this.profil_info)
        }).catch((error) => {
            console.log("Stop spamming f5 :)");
        });
        return null;
    }

    command_handler(input) {
        const terminal_out = document.getElementById('terminal-out');
        const user42 = getCookie("user42");
        terminal_out.innerText += '\n' + `> ${input}`;
        switch (input) {
            case 'help':
                terminal_out.innerText += '\n' + 'Command list:\n- clear\n- ls\n- cat\n- pwd\n- whoami\n- exit';
                break;
            case 'ls':
                terminal_out.innerText += '\n' + 'pong.sh connect4.sh tournament.sh profil.txt';
                break;
            case './pong.sh':
                window.router.navigate('/pong');
                break;
            case 'bash pong.sh':
                window.router.navigate('/pong');
                break;
            case './connect4.sh':
                window.router.navigate('/matchmaking');
                break;
            case 'bash connect4.sh':
                window.router.navigate('/matchmaking');
                break;
            case './tournament.sh':
                window.router.navigate('/tournament');
                break;
            case 'bash tournament.sh':
                window.router.navigate('/tournament');
                break;
            case './profil.txt':
                terminal_out.innerText += '\n' + 'Use cat command to see inside the file'
                break;
            case 'bash profil.txt':
                terminal_out.innerText += '\n' + 'Use cat command to see inside the file'
                break;
            case 'pwd':
                terminal_out.innerText += '\n' + `/${user42}/ft_transcendence`;
                break;
            case 'whoami':
                terminal_out.innerText += '\n' + `${user42}`;
                break;
            case 'exit':
                terminal_out.innerText += '\n' + `Goodbye ${user42}`;
                setTimeout(() => {
                    const port = window.location.port ? `:${window.location.port}` : '';
                    let authUrl = `https://${window.location.hostname}${port}/users/logout/`;
                    const csrftoken = getCookie('csrftoken'); 
                    fetch(authUrl, {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': csrftoken,
                            'Access-Control-Allow-Origin': '*',
                        },
                    }).then((response) => {
                        //console.log(response)
                        if (response.ok) {
                            window.router.navigate('/');
                        }
                    });
                }, 1000);
                break;
            case 'clear':
                terminal_out.innerText = '';
                break;
            case 'cat':
                terminal_out.innerText += '\n' + 'Usage: cat [file]';
                break;
            case 'cat ./profil.txt':
                terminal_out.innerText += '\n' + this.formatProfile();
                break;
            case 'cat profil.txt':
                terminal_out.innerText += '\n' + this.formatProfile();
                break;
            case 'cat ./pong.sh':
                terminal_out.innerText += '\n' + '#!/bin/bash\nif [ -x "/usr/bin/pong-main" ]; then \n    /usr/bin/pong-main \nelse\n    echo "Le binaire pong-main n\'a pas été trouvé dans /usr/bin.\"\n    exit 1\nfi'
                break;
            case 'cat pong.sh':
                terminal_out.innerText += '\n' + '#!/bin/bash\nif [ -x "/usr/bin/pong-main" ]; then \n    /usr/bin/pong-main \nelse\n    echo "Le binaire pong-main n\'a pas été trouvé dans /usr/bin.\"\n    exit 1\nfi'
                break;
            case 'cat ./connect4.sh':
                terminal_out.innerText += '\n' + '#!/bin/bash\nif [ -x "/usr/bin/matchmaking" ]; then \n    /usr/bin/matchmaking \n    if [ -z "Match Found" ]; then\n       /usr/bin/connect4\nelse\n    echo "Le binaire matchmaking n\'a pas été trouvé dans /usr/bin.\"\n    exit 1\nfi'
                break;
            case 'cat connect4.sh':
                terminal_out.innerText += '\n' + '#!/bin/bash\nif [ -x "/usr/bin/matchmaking" ]; then \n    /usr/bin/matchmaking \n    if [ -z "Match Found" ]; then\n       /usr/bin/connect4\nelse\n    echo "Le binaire matchmaking n\'a pas été trouvé dans /usr/bin.\"\n    exit 1\nfi'
                break;
            case 'cat ./tournament.sh':
                terminal_out.innerText += '\n' + '#!/bin/bash\nif [ -x "/usr/bin/tournament" ]; then \n    /usr/bin/tournament \nelse\n    echo "Le binaire tournament n\'a pas été trouvé dans /usr/bin.\"\n    exit 1\nfi'
                break
            case 'cat tournament.sh':
                terminal_out.innerText += '\n' + '#!/bin/bash\nif [ -x "/usr/bin/tournament" ]; then \n    /usr/bin/tournament \nelse\n    echo "Le binaire tournament n\'a pas été trouvé dans /usr/bin.\"\n    exit 1\nfi'
                break
            default:
                terminal_out.innerText += '\n' + 'Command not found: ' + input;
                break;
        }
    }

    setup_term() {
        const terminal_in = document.getElementById('terminal-in');
        terminal_in.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const input = terminal_in.value.trim();
                terminal_in.value = '';
                this.command_handler(input);
                const terminal_out = document.getElementById('terminal-out')
                if (terminal_out)
                    terminal_out.scrollTop = terminal_out.scrollHeight 
            } else if (event.key === 'Tab') {
                event.preventDefault();
                this.autocomplete(terminal_in);
                const terminal_out = document.getElementById('terminal-out')
                if (terminal_out)
                    terminal_out.scrollTop = terminal_out.scrollHeight 
            }
        });
    }


    formatProfile() {
        if (!this.profil_info)
        {
            return `
            +${'-'.repeat(lineLength)}+
            | ${center(`User ${getCookie('user42')}`, lineLength - 2)} |
            +${'-'.repeat(lineLength)}+`
        }
        const lineLength = 40;
        const pad = (str, length) => {
            const padding = ' '.repeat(length - str.length);
            return str + padding;
        };

        const center = (str, length) => {
            let paddingEnd = '';
            let padding = ' '.repeat((length - str.length)/ 2);
            if (str.length % 2)
                paddingEnd = ' '.repeat(((length - str.length)/ 2) + 1);
            else
                paddingEnd = padding;
            return padding + str + paddingEnd;
        }

        if (this.profil_info.games.length == 0)
            return `
            +${'-'.repeat(lineLength)}+
            | ${center(`User ${getCookie('user42')}`, lineLength - 2)} |
            | ${center(`No game played yet`, lineLength - 2)} |
            +${'-'.repeat(lineLength)}+
            `

        function infos(games) {
            let htmlFinal = '';
            games.forEach(element => {
                htmlFinal += `            +${'-'.repeat(lineLength)}+\n`
                htmlFinal += `            | ${center(`Connect4`, lineLength - 2)} |\n`;
                htmlFinal += `            | ${pad(`${element.me} VS ${element.opp}`, lineLength - 2)} |\n`
                htmlFinal += `            | ${pad(`Winner: ${element.winner}`, lineLength - 2)} |\n`
            });
            return htmlFinal;
        }

        function calculateWinRatio(games, user_id) {
            let wins = 0;
            games.forEach(game => {
                if (game.winner === user_id) {
                    wins++;
                }
            });
            return Math.floor((wins / games.length) * 100);
        }

        const winRatio = calculateWinRatio(this.profil_info.games, getCookie('user42'));

        return `
            +${'-'.repeat(lineLength)}+
            | ${center(`User ${getCookie('user42')}`, lineLength - 2)} |
            | ${center(`Win ratio of the last 5 games: ${winRatio}%`, lineLength - 2)} |
${infos(this.profil_info.games)}            +${'-'.repeat(lineLength)}+
            `;
    }

    autocomplete(inputElement) {
        const input = inputElement.value;
        const matchingCommands = this.commands.filter(command => command.startsWith(input));
    
        if (matchingCommands.length === 1) {
            inputElement.value = matchingCommands[0];
        } else if (matchingCommands.length > 1) {
            const terminal_out = document.getElementById('terminal-out');
            terminal_out.innerText += '\n' + matchingCommands.join(' ');
        }
    }
}