export class Component extends HTMLElement {

    constructor() {
        super();
        this.isRendered = false;
    }

    //Called when the element is added to the page
    connectedCallback() {
        console.log("Custom element added to page.");
        if (!this.isRendered) {
            this.innerHTML = this.render() + this.style();
            this.isRendered = true;
            this.CustomDOMContentLoaded();
        }
    }

    //Called when the element is removed from the page
    disconnectedCallback() {
        console.log("Custom element removed from page.");
        this.isRendered = false;
        //remove all function
    }

    //Called when the element is moved to a new page
    adoptedCallback() {
        this.innerHTML = this.render() + this.style();
        console.log("Custom element moved to new page.");
    }

    //Called when an attribute is changed, appended, removed, or replaced on the element
    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute ${name} has changed.`);
    }

    //For child classes, extra script after rendering the element (like adding event listeners)
    CustomDOMContentLoaded() {
    }

    render() {
        return ''
    }

    style() {
        return ''
    }
}