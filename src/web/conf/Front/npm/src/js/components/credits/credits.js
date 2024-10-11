import { Component } from "@js/component";

export class Credits extends Component {
    constructor() {
        super();
    }

    render() {
        return `
            <div id="overlay">
                <div id="credits-title">Credits</div>
                <div id="credits-list">
                    <div class="credit-item">
                        <div class="credit-name">User 1</div>
                        <div class="credit-role">Role 1</div>
                    </div>
                    <div class="credit-item">
                        <div class="credit-name">User 2</div>
                        <div class="credit-role">Role 2</div>
                    </div>
                    <div class="credit-item">
                        <div class="credit-name">User 3</div>
                        <div class="credit-role">Role 3</div>
                    </div>
                </div>
            </div>
        `;
    }

    style() {
        return `
            <style>
                #overlay {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: black;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    font-family: 'Press Start 2P', cursive;
                    font-size: 20px;
                    color: white;
                    user-select: none;
                }
                #credits-title {
                    font-size: 30px;
                    margin-bottom: 20px;
                }
                #credits-list {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .credit-item {
                    margin: 10px 0;
                    text-align: center;
                }
                .credit-name {
                    font-size: 24px;
                }
                .credit-role {
                    font-size: 18px;
                    color: #ccc;
                }
            </style>
        `;
    }

    CustomDOMContentLoaded() {
        console.log("Credits page loaded.");
    }
}