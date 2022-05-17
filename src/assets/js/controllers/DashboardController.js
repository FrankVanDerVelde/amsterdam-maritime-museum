import {App} from "../app.js";
import {Controller} from "./controller.js";
import {DashboardRepository} from "../repositories/dashboardRepository.js";

export class DashboardController extends Controller {
    #dashboardView;
    #dashboardRepository

    constructor() {
        super();
        this.#dashboardRepository = new DashboardRepository()
        this.#setupView();
    }

    async #setupView() {
        this.#dashboardView = await super.loadHtmlIntoContent("html_views/Dashboard.html");

        const totalVisitor = await this.#dashboardRepository.getTotalVisitor();
        const weeklySubmission = await this.#dashboardRepository.getWeeklySubmissions();
        const averageEmission = await this.#dashboardRepository.getCO2AveragePerVisitor();
        const averageDistance = await this.#dashboardRepository.getDistanceAveragePerVisitor();

        this.#dashboardView.querySelector("#totalVisitors").innerHTML = totalVisitor[0].amount_of_visitors;
        this.#dashboardView.querySelector("#weeklySubmissions").innerHTML = weeklySubmission[0].registrations;
        this.#dashboardView.querySelector("#averageEmission").innerHTML = averageEmission[0].average_CO2_emission + " kg";
        this.#dashboardView.querySelector("#averageDistance").innerHTML = averageDistance[0].average_distance_travelled + " km";
        this.#addEventListenerForBackToWebsiteButton();
    }

    #addEventListenerForBackToWebsiteButton() {
        const backToWebsiteButton = document.querySelector('#back-to-website-button');
        backToWebsiteButton.addEventListener('click', (e) => {
            App.loadController(App.CONTROLLER_USER_LOCATION);
        });
    }
}