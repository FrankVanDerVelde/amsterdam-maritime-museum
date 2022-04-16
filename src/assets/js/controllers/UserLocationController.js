import { Controller } from "./controller.js";
import {NetworkManager} from "../framework/utils/networkManager.js";

export class UserLocationController extends Controller {
    #userLocationView;
    #networkManager

    constructor() {
        super();
        this.#networkManager = new NetworkManager();
        this.#setupView();
    }

    async #setupView() {
        this.#userLocationView = await super.loadHtmlIntoContent("html_views/UserLocation.html");

        this.#userLocationView.querySelector("#calculate-distance-button").addEventListener("click", async () => {
            await this.#calculateClicked();
        });

        this.#getLocation();
    }

    async #calculateClicked() {
        this.#setLoadingState();
        const cityName = this.#getCityNameInput();
        const result = await this.#getDistanceForCity(cityName);
        this.#updateDistanceLabelTo(Number(result.distance_in_km));
    }

    #setLoadingState() {
        this.#userLocationView.querySelector("#distance-result-label").innerHTML = `Calculating...`
        this.#userLocationView.querySelector("#distance-result-label").hidden = false;
    }

    #getCityNameInput() {
        return this.#userLocationView.querySelector("#city-name").value;
    }

    async #getDistanceForCity(city) {
        return await this.#networkManager.doRequest(`/map/distance_for_city/${city}`, "GET");
    }

    #updateDistanceLabelTo(distanceInKm) {
        this.#userLocationView.querySelector("#distance-result-label").innerHTML = `Distance from museum in KM: ${distanceInKm}`;
    }

    #getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.#showPosition, this.#showError);
        } else {
            div.innerHTML = "The Browser Does not Support Geolocation";
        }
    }

    #showPosition(position) {
        console.log(position)
    }

    #showError(error) {
        print(error);
        // if (error.PERMISSION_DENIED)
        //     div.innerHTML = "The User have denied the request for Geolocation.";
    }
}