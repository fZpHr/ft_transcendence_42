import { Component } from "@js/component";

export class Connect4 extends Component{
    constructor(){
        super();
        this.ws = null;
    }

    render(){
        return`
        `;
    }

    style(){
        // MON CSS
        return `
        <style>
        </style>
        `;
        
    }

    CustomDOMContentLoaded(){
        this.ws = new WebSocket(`wss://${window.location.hostname}/wss-game/connect4/`);

        this.ws.onopen = () => {
            console.log("Connected to the server");
        };

        this.ws.onmessage = (event) => {
            console.log(event.data);
        };

        this.ws.onclose = () => {
            console.log("Disconnected from the server");
        };

        this.ws.onerror = (error) => {
            console.log("Error: ", error);
        }
    }

    CustomDOMContentUnload(){
        this.ws.close();
    }
}