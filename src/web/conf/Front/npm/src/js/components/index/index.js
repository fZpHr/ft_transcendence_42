import { Component } from "@js/component";

export class Index extends Component{
    constructor(){
        super();
    }

    setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }
    

    render(){
        let html;
        let isUserConnected = document.cookie.includes("connected=true");
        if (isUserConnected)
            html = `
            <div id="container">
                <navbar-component></navbar-component>
                <div class="leftPolygon" id="connect4">Connect4</div>
                <div class="rightPolygon" id="pong">Pong</div>
                <div class="bottomPolygon" id="tournaments">Tournaments</div>
            </div>

            `
        else
            html = `<auth42-component></auth42-component>`
        return html;
    }

    style(){
        return `
             <style>
            #container {
                position: relative;
                height: 100vh;
                overflow: hidden;
            }

            .leftPolygon, .rightPolygon, .bottomPolygon {
                position: absolute;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 2em;
                color: white;
            }

            .leftPolygon {
                clip-path: polygon(0 0, 50% 0, 50% 50%, 100%);
                background-color: red;
                width: 50%;
                height: 100%;
            }

            .rightPolygon {
                clip-path: polygon(0 0, 100%, 100% 100%, 50% 50%);
                background-color: blue;
                width: 50%;
                height: 100%;
                right: 0;
            }

            .bottomPolygon {
                clip-path: polygon(0 100%, 50% 0%, 100% 100%);
                background-color: green;
                width: 100%;
                height: 50%;
                bottom: 0;
            }
        </style>
        `;
    }

    CustomDOMContentLoaded(){
    }
}