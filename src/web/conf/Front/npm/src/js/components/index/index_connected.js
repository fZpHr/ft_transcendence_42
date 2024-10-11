import { Component } from "@js/component";

export class IndexConnected extends Component{
    constructor(){
        super();
        this.commands = ['help', 'ls', './pong.sh', './connect4.sh', './tournament.sh', 'pwd', 'whoami', 'exit', 'clear', 'cat', 'cat profil'];
    }

    render(){
        return `
            <div id="container">
            <div id="terminal">
            <button id="credits" type="button" class="btn btn-link">©</button>
                    <pre id="terminal-out">Welcome ${this.getCookie("user42")}.\nType 'help' to see available commands.</pre>
                    <div id="input-container">
                        <span id="prompt">></span>
                        <input type="text" id="terminal-in" autofocus />
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
                overflow-y: auto;
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
                box-shadow: none !important; /* Supprime l'ombre de focus */
            }
            
        </style>
        `;
    }

    CustomDOMContentLoaded(){
        this.setup_term();

        const credits = document.getElementById('credits');
        this.terminal_out = document.getElementById('terminal-out');

        credits.addEventListener('click', () => {
            window.router.navigate('/credits');
        });
    }

    command_handler(input) {
        const terminal_out = document.getElementById('terminal-out');
        const user42 = this.getCookie("user42");
        terminal_out.innerText += '\n' + `> ${input}`;
        switch (input) {
            case 'help':
                terminal_out.innerText += '\n' + 'Command list:\n- clear\n- ls\n- cat\n- pwd\n- whoami\n- exit';
                break;
            case 'ls':
                terminal_out.innerText += '\n' + 'pong.sh connect4.sh tournament.sh';
                break;
                case './pong.sh':
                    window.router.navigate('/pong');
                break;
                case './connect4.sh':
                    window.router.navigate('/matchmaking');
                break;
                case './tournament.sh':
                    window.router.navigate('/tournament');
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
                    let authUrl = `https://${window.location.hostname}:${window.location.port}/users/logout/`;
                    const csrftoken = this.getCookie('csrftoken'); 
                    fetch(authUrl, {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': csrftoken,
                            'Access-Control-Allow-Origin': '*',
                        },
                    }).then((response) => {
                        console.log(response)
                        if (response.ok) {
                            window.location.reload();
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
            case 'cat profil':
                const profile = {
                    name: user42,
                    pongRatio: '0/4',
                    connect4Ratio: '4/0',
                    tournamentRatio: '2/2'
                };
                const api_response = this.formatProfile(profile);
                terminal_out.innerText += '\n' + api_response;
                break;
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
                this.command_handler(input);
                terminal_in.value = '';
            } else if (event.key === 'Tab') {
                event.preventDefault();
                this.autocomplete(terminal_in);
            }
        });
    }

    formatProfile(profile) {
        const lineLength = 40;
        const pad = (str, length) => {
            const padding = ' '.repeat(length - str.length);
            return str + padding;
        };

        return `
            +${'-'.repeat(lineLength)}+
            | ${pad(`User ${profile.name}`, lineLength - 2)} |
            +${'-'.repeat(lineLength)}+
            | ${pad(`Pong ratio: ${profile.pongRatio}`, lineLength - 2)} |
            | ${pad(`Connect4 ratio: ${profile.connect4Ratio}`, lineLength - 2)} |
            | ${pad(`Tournament ratio: ${profile.tournamentRatio}`, lineLength - 2)} |
            +${'-'.repeat(lineLength)}+
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
    
    getCookie(name) {
        const cookieString = document.cookie.split(';').find(cookie => cookie.includes(name));
        if (cookieString) {
            return cookieString.split('=')[1];
        }
        return null;
    }

}