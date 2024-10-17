export class Component extends HTMLElement {

    constructor() {
        super();
        this.isRendered = false;
        this.eventListeners = [];
    }

    //Called when the element is added to the page
    connectedCallback() {
        if (!this.isRendered) {
            this.innerHTML = this.render() + this.style();
            this.isRendered = true;
            this.CustomDOMContentLoaded();
        }
    }

    //Called when the element is removed from the page
    disconnectedCallback() {
        this.isRendered = false;
        this.CustomDOMContentUnload();
        this.removeExtraEventListeners();
        //remove all function
    }

    //Called when the element is moved to a new page
    adoptedCallback() {
        this.innerHTML = this.render() + this.style();
        //console.log("Custom element moved to new page.");
    }

    //Called when an attribute is changed, appended, removed, or replaced on the element
    attributeChangedCallback(name, oldValue, newValue) {
        //console.log(`Attribute ${name} has changed.`);
    }

    //For child classes, extra script after rendering the element (like adding event listeners)
    CustomDOMContentLoaded() {
    }

    CustomDOMContentUnload() {
    }

    addExtraEventListener(eventType, callback) {
        this.eventListeners.push({eventType, callback});
        this.addEventListener(eventType, callback);
    }

    removeExtraEventListeners() {
        this.eventListeners.forEach(eventListener => {
            this.removeEventListener(eventListener.eventType, eventListener.callback);
        });
    }

    removeExtraEventListener(eventType, callback) {
        this.eventListeners = this.eventListeners.filter(eventListener => {
            if (eventListener.eventType === eventType && eventListener.callback === callback) {
                this.removeEventListener(eventListener.eventType, eventListener.callback);
                return false;
            }
            return true;
        });
    }

    render() {
        return ''
    }

    style() {
        return ''
    }
}