console.log('router.js');

export async function fetchUSERAPI() {
    const response = await fetch('https://localhost:8002/users');
    const data = await response.json();
    return data;
}