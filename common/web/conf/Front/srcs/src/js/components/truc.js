import { Component } from "@js/component";

export class truc extends Component{
    constructor(){
        super();
    }

    render(){
        this.innerHTML = `
            <h1>truc</h1>
            <p>Un truc</p>
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
        console.log("truc added to page.");
    }
}