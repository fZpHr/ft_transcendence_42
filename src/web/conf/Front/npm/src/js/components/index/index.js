import { Component } from "@js/component";

export class Index extends Component{
    constructor(){
        super();
    }

    render(){
        let html;
        let isUserConnected = document.cookie.includes("connected=true");
        if (isUserConnected)
            html = `
                <index-connected-component></index-connected-component>`
        else
            html = `<auth42-component></auth42-component>`
        return html;
    }
}