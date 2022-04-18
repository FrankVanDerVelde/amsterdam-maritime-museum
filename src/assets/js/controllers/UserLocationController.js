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
        this.#watchForLocationTextFieldChanges();
        this.#showsActivityIndicator(false);
        this.#showsLocationResult(false);
        this.#showsErrorBox(false);
        this.#getCurrentLocationButton().addEventListener('click', () => {
            this.#getLocation();
        })
    }

    #watchForLocationTextFieldChanges() {
        const inputHandler = debounce(async (event) => {
            if (event.target.value == null || event.target.value === '')
                return;
            this.#showsActivityIndicator(true);
            await this.#calculateDistance();
            this.#showsActivityIndicator(false);
        }, 500)

        this.#getLocationNameTextField().addEventListener('input', inputHandler);
    }

    async #calculateDistance() {
        this.#showsActivityIndicator(true);
        const locationName = this.#getLocationNameTextField().value;
        try {
            const result = await this.#mapRepository.getDistanceForLocation(locationName);
            this.#updateDistanceLabel(result.place_name, UserLocationController.#roundTo2Decimals(result.distance_in_km));
            this.#showsLocationResult(true);
            this.#showsErrorBox(false);
        } catch (e) {
            this.#showNoLocationsFoundError(locationName);
            this.#showsLocationResult(false);
        }
        this.#showsActivityIndicator(false);
    }

    #showsActivityIndicator(value) {
        this.#getActivityIndicatorContainer().hidden = !value;
    }

    #showsLocationResult(value) {
        this.#getDistanceResultsContainer().style.display = value === true ? "inline-block" : "none";
    }

    #updateDistanceLabel(locationName, distanceInKm) {
        this.#getDistanceResultsLabel().innerHTML =  `${locationName} (${distanceInKm} KM)`;
    }

    #getLocation() {
        if (navigator.geolocation) {
            this.#showsActivityIndicator(true);
            this.#showsLocationResult(false);
            navigator.geolocation.getCurrentPosition(async (location) => {
                await this.#showPositionForCoords(location.coords);
                this.#getLocationNameTextField().value = '';
                this.#showsActivityIndicator(false);
                this.#showsErrorBox(false);
            }, () => {
                this.#showLocationFetchError();
            });
        } else {
            this.#showLocationFetchError();
        }
    }

    async #showPositionForCoords(coords) {
        const response = await this.#mapRepository.getDistanceForCoords(coords);
        this.#updateDistanceLabel(response.place_name, UserLocationController.#roundTo2Decimals(response.distance_in_km));
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
        this.#getErrorLabelTitle().innerHTML = "Er is een fout opgetreden";
        this.#getErrorLabelDescription().innerHTML = description;
    }

    #showsErrorBox(value) {
        this.#getErrorContainer().hidden = !value;
    }

    /** HTML elements */
    #getCurrentLocationButton() {
        return this.#getElementByIdId('current-location-button');
    }

    #getDistanceResultsContainer() {
        return this.#getElementByIdId('distance-result-container');
    }

    #getDistanceResultsLabel() {
        return this.#getElementByIdId('distance-result-label');
    }

    #getLocationNameTextField() {
        return this.#getElementByIdId('location-name-text-field');
    }

    #getActivityIndicatorContainer() {
        return this.#getElementByIdId('activity-indicator');
    }

    #getErrorLabelTitle() {
        return this.#getElementByIdId('error-title-label');
    }

    #getErrorLabelDescription() {
        return this.#getElementByIdId('error-description-label');
    }

    #getErrorContainer() {
        return this.#getElementByIdId('error-container')
    }

    /** Helpers **/
    #getElementByIdId(id) {
        return this.#userLocationView.querySelector(`#${id}`);
    }

    static #roundTo2Decimals(number) {
        return Math.round((Number(number) + Number.EPSILON) * 100) / 100
    }
}
