import { Component } from "@js/component";

export class NotFound extends Component{
    constructor(){
        super();
    }

    render() {
        return `
            <h1>404</h1>
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
        console.log("404 added to page.");
    }
}