import { Component } from "@js/component";
export class Auth42 extends Component{
    constructor(){
        super();
    }

    render(){
        return`
            <div class="container_center text-center">
                <button id="loginButton" class="btn btn-primary">
                    Se connecter avec <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/42_Logo.svg/2048px-42_Logo.svg.png" alt="42 Logo" style="height: 20px; vertical-align: middle;">
                </button>
            </div>
        `;
    }

    style(){
        return `
            <style>
                h1 {
                    color: red;
                }
            </style>
        `;
    }

    CustomDOMContentLoaded(){
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
