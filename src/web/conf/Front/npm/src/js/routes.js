export class Route {
    constructor(path, component) {
        this.path = path;
        this.component = component;
        // customElements.get(component) ? this.component = customElements.get(component) : console.error(`Component ${component} not found`);
    }
}