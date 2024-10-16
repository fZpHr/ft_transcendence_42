import { Component } from "@js/component";

export class Auth42 extends Component {
    constructor() {
        super();
        this.commands = ['help', 'ls', 'pwd', 'whoami', 'exit', 'clear', './login42.sh', 'bash login42.sh'];
        const terminal_out = [];
    }

    render(){
        return`
                <div id="container">
                <div id="terminal">
                <button id="credits" type="button" class="btn btn-link">©</button>
                        <pre id="terminal-out">Welcome Guest.\nType 'help' to see available commands.\nYou are not connected. Please ./login42.sh to continue, and access to all features.</pre>
                        <div id="input-container">
                            <span id="prompt">></span>
                            <input type="text" id="terminal-in" autofocus maxlength="100"/>
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
                scrollbar-width: none;
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
        document.getElementById('terminal-in').focus()

        credits.addEventListener('click', () => {
            this.terminal_out.innerText += '\n' + 'Credits page only available for connected users.\n';
            this.scrollToBottom();
        });
    }

    scrollToBottom() {
        const terminalOut = document.getElementById('terminal-out');
        terminalOut.scrollTop = terminalOut.scrollHeight;
    }

    command_handler(input) {
        this.terminal_out.innerText += '\n' + `> ${input}`;
        switch (input) {
            case 'help':
                this.terminal_out.innerText += '\n' + 'Command list:\n- clear\n- ls\n- pwd\n- whoami\n- exit';
                break;
            case 'ls':
                this.terminal_out.innerText += '\n' + 'login42.sh';
                break;
            case 'pwd':
                this.terminal_out.innerText += '\n' + `/Guest/`;
                break;
            case 'whoami':
                this.terminal_out.innerText += '\n' + `Guest`;
                break;
            case 'exit':
                this.terminal_out.innerText += '\n' + `Goodbye Guest`;
                setTimeout(() => {
                    window.location.href = "https://google.com";
                },1000);
                break;
            case 'clear':
                this.terminal_out.innerText = '';
                break;
            case './login42.sh':
                const hostname = window.location.hostname;
                const port = window.location.port ? `:${window.location.port}` : '';
                const redirectUri = `https://${hostname}${port}/users/register-42/`;
                const encodedRedirectUri = encodeURIComponent(redirectUri);
                const clientId = 'u-s4t2ud-74438314e8cff2be68aee7a119f4c95bff6ba35b11a2bf5c2627a31a869c9f28';
                const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${encodedRedirectUri}&response_type=code`;
                
                window.location.href = authUrl;
                break;
            case 'bash login42.sh':
                this.terminal_out.innerText += '\n' + 'bash: login42.sh: Permission denied';
                break
            default:
                this.terminal_out.innerText += '\n' + 'Command not found: ' + input;
                break;
        }
        this.scrollToBottom();
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

    autocomplete(inputElement) {
        const input = inputElement.value;
        const matchingCommands = this.commands.filter(command => command.startsWith(input));

        if (matchingCommands.length === 1) {
            inputElement.value = matchingCommands[0];
        }
    }
}