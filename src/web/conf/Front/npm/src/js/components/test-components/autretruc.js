import { Component } from "@js/component";

export class autretruc extends Component{
    constructor(){
        super();
    }

    render(){
        return`
            <h1>Autre truc</h1>
            <p>Un autre truc</p>
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
    }
}