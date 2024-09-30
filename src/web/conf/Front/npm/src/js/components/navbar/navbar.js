import { Component } from "@js/component";

export class NavBar extends Component{
    constructor(){
        super();
    }

    render(){
        return`
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ml-auto">
                        <li class="nav-item active">
                            <a class="nav-link" id="truc-navlink">truc</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="autretruc-navlink">autre truc</a>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link" id="pong-navlink">pong</a>
                        </li>
                    </ul>
                </div>
            </nav>
        `;
    }

    style(){
        return `
            <style>
            </style>
        `;
    }

    CustomDOMContentLoaded(){
        const trucNavLink = this.querySelector("#truc-navlink");
        trucNavLink.addEventListener("click", () => {
            window.router.navigate("/truc/");
        });

        const autreTrucNavLink = this.querySelector("#autretruc-navlink");
        autreTrucNavLink.addEventListener("click", () => {
            window.router.navigate("/autretruc/");
        });

        const pongNavLink = this.querySelector("#pong-navlink");
        pongNavLink.addEventListener("click", () => {
            window.router.navigate("/pong/");
        });
    }
}