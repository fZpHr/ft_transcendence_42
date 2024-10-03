import { Component } from "@js/component";

export class Auth42 extends Component {
    constructor() {
        super();
    }

    render() {
        return `
            <div class="container_main">
                <div class="container_center">
                    <img class="logo" src="https://profile.intra.42.fr/assets/42_logo-7dfc9110a5319a308863b96bda33cea995046d1731cebb735e41b16255106c12.svg" alt="42 Logo">
                    <div class="container_signin">Sign in to access the website</div>
                    <button id="loginButton" class="btn btn-primary">
                        Se connecter avec <img class="logo-button" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/2048px-42_Logo.svg.png" alt="42 Logo">
                    </button>
                </div>
            </div>
             
        `;
    }

    style() {
        return `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

            
                .container_main {
                    background: linear-gradient(135deg, #1e1f20, #2e2f30);
                    height: 100%;
                    width: 100%;
                    position: fixed;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .container_center {
                    height: 400px;
                    width: 600px;
                    position: relative;
                    border-radius: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: #1f1f1f;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    padding: 20px;
                    text-align: center;
                }

                .container_signin {
                    color: white;
                    font-size: 24px;
                    margin-bottom: 20px;
                    font-family: 'Roboto', sans-serif;
                    font-weight: 550;

                }

                .logo-button {
                    height: 20px; 
                    vertical-align: middle;
                }

                .logo {
                    height: 70px;
                    width: 70px;
                    margin-bottom: 20px;
                    padding: 10px;
                    border-radius: 50%;
                    border: 2px solid white;
                }

                .btn {
                    background-color: #007bff;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    font-size: 16px;
                    border-radius: 5px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    font-family: 'Roboto', sans-serif;
                    font-weight: 700;
                }

                .btn img {
                    margin-left: 10px;
                    height: 20px;
                }

                .btn:hover {
                    background-color: #0056b3;
                }
            </style>
        `;
    }

    CustomDOMContentLoaded() {
        console.log("Autre truc added to page.");
        const loginButton = this.querySelector("#loginButton");
        loginButton.addEventListener("click", () => {
            const hostname = window.location.hostname;
            const port = window.location.port ? `:${window.location.port}` : '';
            const redirectUri = `https://${hostname}${port}/users/register-42/`;
            const encodedRedirectUri = encodeURIComponent(redirectUri);
            console.log(`Redirect URI: ${redirectUri}`);
            console.log(`Encoded Redirect URI: ${encodedRedirectUri}`);
            const clientId = 'u-s4t2ud-74438314e8cff2be68aee7a119f4c95bff6ba35b11a2bf5c2627a31a869c9f28';
            const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${encodedRedirectUri}&response_type=code`;
    
            console.log(`Auth URL: ${authUrl}`);
            window.location.href = authUrl;
        });
    }
}