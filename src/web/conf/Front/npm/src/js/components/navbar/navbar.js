import { Component } from "@js/component";

function getCookie(name) {
    const cookieString = document.cookie.split(';').find(cookie => cookie.includes(name));
    if (cookieString) {
        return cookieString.split('=')[1];
    }
    return null;
}
export class NavBar extends Component{
    constructor(){
        super();
    }

    render(){
        const pseudo = getCookie('user42');
        return`
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav mr-auto">
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
                    <ul class="navbar-nav ml-auto">
                        <li classe="nav-item">
                            <a class="nav-link" id="logout-navlink">Logout</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link">${pseudo ? pseudo : 'Guest'}</a>
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

        const logoutNavLink = this.querySelector("#logout-navlink");
        logoutNavLink.addEventListener("click", () => {
            let authUrl = "https://localhost/users/logout";
            window.location.href = authUrl;
        });
    }

}