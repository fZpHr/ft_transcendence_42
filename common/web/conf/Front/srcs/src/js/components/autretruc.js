import { Component } from "@js/component";

export class autretruc extends Component{
    constructor(){
        super();
    }

    render(){
        this.innerHTML = `
            <h1>Autre truc</h1>
            <p>Un autre truc</p>
        `;
    }

    style(){
        return `
            h1 {
                color: red;
            }
        `;
    }

    CustomDOMContentLoaded(){
        console.log("Autre truc added to page.");
    }
}