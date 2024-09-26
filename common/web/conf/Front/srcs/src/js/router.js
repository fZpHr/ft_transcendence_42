export class Router {
    constructor(target, routes) {
        this.target = target;
        this.routes = routes;
    }

    async init() {
        console.log('router init');
        const route = window.location.pathname;
        console.log(this.routes[route]);
        console.log(this.routes[route].component);
        this.target.innerHTML = this.routes[route].component.render();
    }

    async findRoute() {
        const route = window.location.pathname;
        return this.routes[route];
    }
}