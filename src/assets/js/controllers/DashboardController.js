import {Controller} from "./controller.js";
import {NetworkManager} from "../framework/utils/networkManager.js";

export class DashboardController extends Controller{
    #dashboardView;
    #networkManager;

    constructor() {
        super();
        this.#networkManager = new NetworkManager();
        this.#setupView();
    }

    async #setupView() {
        this.#dashboardView = await super.loadHtmlIntoContent("html_views/Dashboard.html");
    }
}