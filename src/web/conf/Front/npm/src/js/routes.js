export class Route {
    constructor(path, component, extraRegex = null) {
        this.path = path;
        if (extraRegex)
            this.path += '?';
        this.component = component;
        this.extraRegex = extraRegex;
    }
}