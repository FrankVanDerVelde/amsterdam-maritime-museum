/**
 * Entry point front end application - there is also an app.js for the backend (server folder)!
 *
 * All methods are static in this class because we only want one instance of this class
 * Available via a static reference(no object): `App.sessionManager.<..>` or `App.networkManager.<..>` or `App.loadController(..)`
 *
 * @author Lennard Fonteijn & Pim Meijer
 */

import { SessionManager } from "./framework/utils/sessionManager.js"
import { TreeBackgroundController } from "./controllers/treeBackgroundController.js"
import { UserLocationController } from "./controllers/UserLocationController.js"
import { DashboardController } from "./controllers/DashboardController.js";
import { ChooseVehicleController } from "./controllers/chooseVehicleController.js";
import { ChooseFuelController } from "./controllers/chooseFuelController.js";


export class App {
    //we only need one instance of the sessionManager, thus static use here
    // all classes should use this instance of sessionManager
    static sessionManager = new SessionManager();

    //controller identifiers, add new controllers here
    static CONTROLLER_TREE_BACKGROUND = "tree-background";
    static CONTROLLER_USER_LOCATION = "user-location";
    static CONTROLLER_DASHBOARD = "dashboard";
    static CONTROLLER_CHOOSE_VEHICLE = "choose-vehicle";
    static CONTROLLER_CHOOSE_FUEL = "choose-fuel";

    constructor() {
        //Always load the navigation

        //Attempt to load the controller from the URL, if it fails, fall back to the welcome controller.
        App.loadControllerFromUrl(App.CONTROLLER_USER_LOCATION);
        this.#addEventListenerForDashboardButton();
    }

    /**
     * Loads a controller
     * @param name - name of controller - see static attributes for all the controller names
     * @param controllerData - data to pass from on controller to another - default empty object
     * @returns {boolean} - successful controller change
     */
    static loadController(name, controllerData = {}) {
        // console.log("loadController: " + name);

        //log the data if data is being passed via controllers
        if (controllerData && Object.entries(controllerData).length !== 0) {
            // console.log(controllerData);
        }

        //load right controller based on the passed name to this function
        // console.log(name)
        switch (name) {
            case App.CONTROLLER_TREE_BACKGROUND:
                App.setCurrentController(name);
                new TreeBackgroundController(this);
                break;

            case App.CONTROLLER_USER_LOCATION:
                console.log(name)
                App.setCurrentController(name);
                new UserLocationController(this);
                break;

            case App.CONTROLLER_DASHBOARD:
                App.setCurrentController(name);
                new DashboardController();
                break;

            case App.CONTROLLER_CHOOSE_VEHICLE:
                App.setCurrentController(name);
                new ChooseVehicleController();
                break;

            case App.CONTROLLER_CHOOSE_FUEL:
                App.setCurrentController(name);
                new ChooseFuelController();
                break;

            default:
                return false;
        }
        return true;
    }

    /**
     * Alternative way of loading controller by url
     * @param fallbackController
     */
    static loadControllerFromUrl(fallbackController) {
        const currentController = App.getCurrentController();

        if (currentController) {
            if (!App.loadController(currentController)) {
                App.loadController(fallbackController);
            }
        } else {
            App.loadController(fallbackController);
        }
    }

    /**
     * Looks at current URL in the browser to get current controller name
     * @returns {string}
     */
    static getCurrentController() {
        return location.hash.slice(1);
    }

    /**
     * Sets current controller name in URL of the browser
     * @param name
     */
    static setCurrentController(name) {
        location.hash = name;
    }

    /**
     * Convenience functions to handle logged-in states
     * @param whenYes - function to execute when user is logged in
     * @param whenNo - function to execute when user is logged in
     */
    // static isLoggedIn(whenYes, whenNo) {
    //     if (App.sessionManager.get("username")) {
    //         whenYes();
    //     } else {
    //         whenNo();
    //     }
    // }

    // /**
    //  * Removes username via sessionManager and loads the login screen
    //  */
    // static handleLogout() {
    //     App.sessionManager.remove("username");

    //     //go to login screen
    //     // App.loadController(App.CONTROLLER_LOGIN);
    // }

    #addEventListenerForDashboardButton() {
        setTimeout(() => {
            const dashboardButton = document.querySelector('#dashboard-button');
            if (dashboardButton) {
                dashboardButton.removeEventListener('click', this.#handleDashboardButtonClicked, true);
                dashboardButton.addEventListener('click', this.#handleDashboardButtonClicked, true);
            }
        }, 100)
    }

    #handleDashboardButtonClicked(e) {
        console.log(e)
        App.loadController(App.CONTROLLER_DASHBOARD);
    }
}

//When the DOM is ready, kick off our application.
window.addEventListener("DOMContentLoaded", _ => {
    new App();
});