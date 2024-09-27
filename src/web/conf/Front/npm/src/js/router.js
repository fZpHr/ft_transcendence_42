console.log('router.js');

export async function register42() {
    const response = await fetch('https://localhost:8003/register42');
    const data = await response.json();
    if (data.json )
    return data;
}