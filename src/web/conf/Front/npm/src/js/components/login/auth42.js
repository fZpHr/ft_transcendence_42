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
        loginButton.addEventListener("click", async () => {
            const response = await fetch('https://localhost/users/register-42/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const data = await response.json();
            return data;
        });
    }
}