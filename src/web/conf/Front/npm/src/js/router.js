console.log('router.js');

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