export class Route {
    constructor(path, component, extraRegex = null, permission = true) {
        this.path = path;
        if (extraRegex)
            this.path += '?';
        this.component = component;
        this.extraRegex = extraRegex;
        this.permission = permission;
    }
}