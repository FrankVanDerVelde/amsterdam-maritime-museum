import {App} from "../app.js";

export class ResultNavbarWorker {
    #app;

    setup(app) {
        this.#app = app;
        this.#addEventListeners()
    }

    #addEventListeners() {
        this.#getRestartContainer().onclick = this.#handleRestartClicked.bind(this);
    }

    #handleRestartClicked() {
        localStorage.clear();
        this.#navigateToUserLocation();
    }

    #navigateToUserLocation() {
        this.#app.loadController(App.CONTROLLER_USER_LOCATION);
    }

    /** Getters **/
    #getRestartContainer() {
        return document.getElementById('restart-container')
    }
}