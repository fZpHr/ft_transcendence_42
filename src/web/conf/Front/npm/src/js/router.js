import { getCookie, deleteCookie, setCookie } from './utils/cookie.js';

export class Router {
    constructor(target, routes) {
        this.target = target;
        this.routes = routes;
    }

    async init() {
        let route = window.location.pathname;
        this.navigate(route);
        this.popStateHandler();
    }

    async navigate(path) {  
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
        try
        {
            const response = await fetch(`https://${window.location.hostname}:${window.location.port}/users/me/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data.status === 'error')
            {
                this.updateCookies(false, null, null);
                if (route.permission)
                {
                    this.navigate('/');
                    return;
                }
            }
            else if (data.status === 'success')
                this.updateCookies(true, getCookie('token'), getCookie('user42'));
        }
        catch (error)
        {
            this.updateCookies(false, null, null);
            if (route.permission)
                this.navigate('/');
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

    async updateCookies(connected, token, user42)
    {
        if (connected == false)
            deleteCookie('connected');
        else
            setCookie('connected', connected);
        if (token === null)
            deleteCookie('token');
        else
            setCookie('token', token);
        if (user42 === null)
            deleteCookie('user42');
        else
            setCookie('user42', user42);
    }

    async popStateHandler() {
        window.addEventListener('popstate', async (event) => {
            this.navigate(window.location.pathname);
        });
    }
}