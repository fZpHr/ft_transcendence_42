export class Router {
    constructor(target, routes) {
        this.target = target;
        this.routes = routes;
    }

    async init() {
        console.log('router init');
        const route = window.location.pathname;
        this.target.innerHTML = ''
        if (!this.routes[route]) {
            this.target.innerHTML = '404';
            return;
        }
        const customElement = document.createElement(this.routes[route].component);
        this.target.append(customElement);
        this.popStateHandler();
    }

    async navigate(path) {
        if (path === window.location.pathname) {
            return;
        }
        const route = this.routes[path];
        window.history.pushState({}, path, window.location.origin + path);
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
            const route = await this.findRoute();
            this.target.innerHTML = '';
            const customElement = document.createElement(route.component);
            this.target.append(customElement);
        });
    }
}

export async function register42(userData) {
    const response = await fetch('https://localhost/users/register-42/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    const data = await response.json();
    return data;
}

window.register42 = register42;