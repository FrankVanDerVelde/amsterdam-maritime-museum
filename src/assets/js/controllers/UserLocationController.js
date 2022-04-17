import { Controller } from "./controller.js";
import {NetworkManager} from "../framework/utils/networkManager.js";
import {debounce} from "../utils/debounce.js";

export class UserLocationController extends Controller {
    #userLocationView;
    #networkManager

    constructor() {
        super();
        this.#networkManager = new NetworkManager();
        this.#setupView().then();
    }

    async #setupView() {
        this.#userLocationView = await super.loadHtmlIntoContent("html_views/UserLocation.html");
        this.#watchForLocationChanges();
    }

    #watchForLocationChanges() {
        const inputHandler = debounce(async (event) => {
            if (event.target.value == null || event.target.value === '') return;
            await this.#calculateDistance();
        }, 500);

        this.#userLocationView.querySelector('#city-name').addEventListener('input', inputHandler);
        this.#userLocationView.querySelector('#current-location-button').addEventListener('click', () => {
            this.#getLocation();
        })
    }

    async #calculateDistance() {
        this.#setLoadingState();
        const cityName = this.#getCityNameInput();
        const result = await this.#getDistanceForCity(cityName);
        this.#updateDistanceLabelTo(Number(result.distance_in_km));
    }

    #setLoadingState() {
        this.#userLocationView.querySelector("#distance-result-label").innerHTML = `Calculating...`
        this.#userLocationView.querySelectorAll("#distance-result-container").hidden = false;
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
            navigator.geolocation.getCurrentPosition(async  (location) => {
                await this.#showPosition(location.coords);
            }, this.#showError);
        } else {
            div.innerHTML = "The Browser Does not Support Geolocation";
        }
    }

    async #showPosition(position) {
        const response = await this.#networkManager.doRequest(`/map/distance_for_city/${position.longitude},${position.latitude}`, "GET");
        this.#updateDistanceLabelTo(response.distance_in_km);
    }

    #showError(error) {
        print(error);
        // if (error.PERMISSION_DENIED)
        //     div.innerHTML = "The User have denied the request for Geolocation.";
    }
}