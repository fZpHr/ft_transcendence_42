import { Component } from "@js/component";
import { getCookie } from "../../utils/cookie";

export class Index extends Component{
    constructor(){
        super();
    }

    render(){
        let html;
        let isUserConnected = getCookie('connected');
        if (isUserConnected)
            html = `
                <index-connected-component></index-connected-component>`
        else
            html = `<auth42-component></auth42-component>`
        return html;
    }
}