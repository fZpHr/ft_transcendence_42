import { fetchUSERAPI } from "@js/router";

document.querySelector('#main-content').innerHTML = `
  <div>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn
    </p>
  </div>
`
fetchUSERAPI().then(data => {
  console.log(data);
});