import { Component } from "@js/component";

export class Credits extends Component {
    constructor() {
        super();
    }

    render() {
        return `
            <div id="overlay" class="d-flex flex-column justify-content-center align-items-center bg-dark text-white vh-100">
                <div id="credits-title" class="display-4 mb-4 text-uppercase text-center border-bottom pb-3 w-75">Credits</div>
                <div id="credits-list" class="row w-100 justify-content-center">
                    <div class="credit-item card bg-secondary text-white mb-3 col-lg-3 col-md-4 col-sm-6 mx-2 animate-fade-in" style="animation-delay: 0s;">
                        <div class="card-body text-center shadow-lg rounded">
                            <div class="credit-name card-title h4">Benoit</div>
                            <div class="credit-role card-text">Digital Innovation and Strategy Manager AND Business Intelligence and Data Analytics Specialist</div>
                        </div>
                    </div>
                    <div class="credit-item card bg-secondary text-white mb-3 col-lg-3 col-md-4 col-sm-6 mx-2 animate-fade-in" style="animation-delay: 0.5s;">
                        <div class="card-body text-center shadow-lg rounded">
                            <div class="credit-name card-title h4">Emile</div>
                            <div class="credit-role card-text">Senior MonkeyType High-Velocity Typing Optimization AND AI and Machine Learning Solutions Architect</div>
                        </div>
                    </div>
                    <div class="credit-item card bg-secondary text-white mb-3 col-lg-3 col-md-4 col-sm-6 mx-2 animate-fade-in" style="animation-delay: 1s;">
                        <div class="card-body text-center shadow-lg rounded">
                            <div class="credit-name card-title h4">Heliam</div>
                            <div class="credit-role card-text">DevOps Pipeline Automation Engineer AND IT Infrastructure and Operations Manager</div>
                        </div>
                    </div>
                </div>
                <button id="back" type="button" class="btn btn-outline-light mt-4">Back</button>
            </div>
        `;
    }

    style() {
        return `
            <style>
                html, body {
                background-color: black;
                color: white;
                }

                .bg-dark {
                    background-color: black !important;
                }

                .bg-secondary {
                    background-color: #6200ea !important;
                }

                #overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    font-family: 'Press Start 2P', cursive;
                    font-size: 20px;
                    user-select: none;
                }
                #credits-title {
                    font-size: 30px;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    border-bottom: 2px solid white;
                }
                .credit-item {
                    width: 100%;
                    max-width: 300px;
                    opacity: 0;
                    animation: fadeIn 1.5s ease forwards;
                }
                .credit-name {
                    font-size: 24px;
                    font-weight: bold;
                    text-transform: uppercase;
                }
                .credit-role {
                    font-size: 18px;
                    color: #ddd;
                }
                .card {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .card:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                }
                @media (max-width: 576px) {
                    #credits-title {
                        font-size: 24px;
                    }
                    .credit-item {
                        width: 90%;
                    }
                }
                
                /* Animation fade-in */
                @keyframes fadeIn {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            </style>
        `;
    }

    redirectTruc(event) {
        if (event.key === 'Escape') {
            window.router.navigate('/');
        }
    }

    CustomDOMContentLoaded() {
        const back = document.getElementById('back');
        back.addEventListener('click', () => {
            window.router.navigate('/');
        }, {once: true});
        document.addEventListener('keydown', this.redirectTruc);
    }

    CustomDOMContentUnload() {
        document.removeEventListener('keydown', this.redirectTruc);
    }
}
