import { Component } from "@js/component";

export class NotFound extends Component {
    constructor() {
        super();
    }

    render() {
        return `
            <div id="overlay">
                <pre>
██╗  ██╗  ██████╗  ██╗  ██╗
██║  ██║ ██╔═████╗ ██║  ██║
███████║ ██║██╔██║ ███████║
╚════██║ ████╔╝██║ ╚════██║
     ██║ ╚██████╔╝      ██║
     ╚═╝  ╚═════╝       ╚═╝
                </pre>
                <div id="overlay-text">Page not found</div>
            </div>
        `;
    }

    style() {
        return `
            <style>
                #overlay {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: black;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    font-family: 'Press Start 2P', cursive;
                    font-size: 20px;
                    color: white;
                    user-select: none;
                }
                #overlay pre {
                    font-family: "Courier New", Courier, monospace;
                    color: white;
                    margin: 0;
                    padding: 0;
                }
                #overlay-text {
                    margin-top: 20px;
                }
            </style>
        `;
    }

    CustomDOMContentLoaded() {
        console.log("404 added to page.");
    }
}