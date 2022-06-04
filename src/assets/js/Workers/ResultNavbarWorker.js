import {App} from "../app.js";

export class ResultNavbarWorker {

    #app;
    #parentView;

    setup(app, parentView) {
        this.#app = app;
        this.#parentView = parentView;
        this.#addEventListeners()
        this.#setupView().then();
    }

    async #setupView() {

    }

    #addEventListeners() {
        this.#getRestartContainer()
            .onclick = this.#handleRestartClicked.bind(this);

        this.#getDistanceContainer()
            .onclick = this.#handleDistanceBreadCrumbClicked.bind(this);

        this.#getVehicleBreadcrumbContainer()
            .onclick = this.#handleVehicleBreadcrumbClicked.bind(this);
    }

    #handleRestartClicked() {
        localStorage.clear();
        this.#navigateToUserLocation();
    }

    #handleDistanceBreadCrumbClicked() {
        this.#navigateToUserLocation();
    }

    #handleVehicleBreadcrumbClicked() {
        this.#navigateToChooseVehicle();
    }

    #navigateToUserLocation() {
        PIXI.Loader.shared.reset();
        this.#app.loadController(App.CONTROLLER_USER_LOCATION);
    }

    #navigateToChooseVehicle() {
        PIXI.Loader.shared.reset();
        this.#app.loadController(App.CONTROLLER_CHOOSE_VEHICLE);
    }

    /** Getters **/
    #getRestartContainer() {
        return this.#parentView.querySelector('#restart-container');
    }

    #getDistanceContainer() {
        return this.#parentView.querySelector('#distance-breadcrumb-container');
    }

    #getVehicleBreadcrumbContainer() {
        return this.#parentView.querySelector('#vehicle-breadcrumb-container');
    }
}