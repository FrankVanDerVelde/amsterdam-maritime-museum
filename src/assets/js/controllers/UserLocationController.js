import {Controller} from "./controller.js";
import {MapRepository} from "../repositories/mapRepository.js";
import {debounce} from "../utils/debounce.js";

export class UserLocationController extends Controller {

    #userLocationView;
    #mapRepository;

    constructor() {
        super();
        this.#mapRepository = new MapRepository();
        this.#setupView().then();
    }

    async #setupView() {
        this.#userLocationView = await super.loadHtmlIntoContent("html_views/UserLocation.html");
        this.#watchForLocationTextfieldChanges();
        this.#showsActivityIndicator(false);
        this.#showsLocationResult(false);
        this.#showsErrorBox(false);
    }

    #watchForLocationTextfieldChanges() {
        const inputHandler = debounce(async (event) => {
            console.log(event)
            if (event.target.value == null || event.target.value === '') return;
            this.#showsActivityIndicator(true);
            await this.#calculateDistance();
            this.#showsActivityIndicator(false);
        }, 500);

        this.#userLocationView.querySelector('#city-name').addEventListener('input', inputHandler);
        this.#userLocationView.querySelector('#current-location-button').addEventListener('click', () => {
            this.#getLocation();
        })
    }

    async #calculateDistance() {
        this.#showsActivityIndicator(true);
        const cityName = this.#getLocationNameInput();
        try {
            const result = await this.#mapRepository.getDistanceForLocation(cityName);
            this.#updateDistanceLabel(result.place_name, this.#roundTo2Decimals(result.distance_in_km));
            this.#showsLocationResult(true);
        } catch (e) {
            this.#showNoLocationsFoundError();
            this.#showsLocationResult(false);
        } finally {
            this.#showsActivityIndicator(false);
        }
    }

    #showsActivityIndicator(value) {
        this.#userLocationView.querySelector('#activity-indicator').hidden = !value;
    }

    #getLocationNameInput() {
        return this.#userLocationView.querySelector("#city-name").value;
    }

    #roundTo2Decimals(number) {
        return Math.round((Number(number) + Number.EPSILON) * 100) / 100
    }

    #showsLocationResult(value) {
        this.#userLocationView
            .querySelector('#distance-result-container')
            .style.display = value === true ? "inline-block" : "none";
    }

    #updateDistanceLabel(locationName, distanceInKm) {
        this.#userLocationView.querySelector("#distance-result-label").innerHTML = `${locationName} (${distanceInKm} KM)`;
    }

    #getLocation() {
        if (navigator.geolocation) {
            this.#showsActivityIndicator(true);
            this.#showsLocationResult(false);
            navigator.geolocation.getCurrentPosition(async (location) => {
                await this.#showPositionForCoords(location.coords);
                this.#userLocationView.querySelector("#city-name").value = "";
                this.#showsActivityIndicator(false);
            }, () => {
                this.#showLocationFetchError();
            });
        } else {
            this.#showLocationFetchError();
        }
    }

    async #showPositionForCoords(coords) {
        const response = await this.#mapRepository.getDistanceForCoords(coords);
        this.#updateDistanceLabel(response.place_name, this.#roundTo2Decimals(response.distance_in_km));
        this.#showsLocationResult(true);
    }

    #showLocationFetchError() {
        this.#updateErrorDescription('We konden uw locatie niet bepalen, zoek de locatie handmatig in met de zoekbalk.');
        this.#showsErrorBox(true);
    }

    #showNoLocationsFoundError(locationName) {
        this.#updateErrorDescription(`We konden geen locatie vinden met de naan '${locationName}'`);
        this.#showsErrorBox(true);
    }

    #updateErrorDescription(description) {
        this.#userLocationView.querySelector('#error-title-label').innerHTML = "Er is een fout opgetreden";
        this.#userLocationView.querySelector('#error-description-label').innerHTML = description;
    }

    #showsErrorBox(value) {
        this.#userLocationView.querySelector('#error-container').hidden = !value;
    }
}