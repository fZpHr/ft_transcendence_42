export class Router {
    constructor(target, routes) {
        this.target = target;
        this.routes = routes;
    }

    async init() {
        console.log('router init');
        let route = window.location.pathname;
        this.target.innerHTML = ''
        if (!this.routes[route]) {
            route = '/404/';
        }
        const customElement = document.createElement(this.routes[route].component);
        this.target.append(customElement);
        this.popStateHandler();
    }

    async navigate(path) {
        if (path === window.location.pathname) {
            return;
        }
        let regex = null;
        if (path.includes('?')) {
            regex = path.split('?')[1];
            path = path.split('?')[0];
        }
        const route = this.routes[path];
        if (!route) {
            this.navigate('/404/');
            return;
        }
        if (regex && route.extraRegex) {
            const regexPattern = new RegExp(route.extraRegex);
            if (!regexPattern.test(regex)) {
                console.log('Regex does not match');
                this.navigate('/404/');
                return;
            }
        }
        window.history.pushState({}, path, window.location.origin + path + (regex ? '?' + regex : ''));
        this.target.innerHTML = ''
        const customElement = document.createElement(route.component);
        this.target.append(customElement);
    }

    async findRoute() {
        const route = window.location.pathname;
        return this.routes[route];
    }

    async popStateHandler() {
        window.addEventListener('popstate', async (event) => {
            console.log('popstate');
            let route = await this.findRoute();
            if (!route) {
                route = this.routes['/404/'];
            }
            this.target.innerHTML = '';
            const customElement = document.createElement(route.component);
            this.target.append(customElement);
        });
    }
}