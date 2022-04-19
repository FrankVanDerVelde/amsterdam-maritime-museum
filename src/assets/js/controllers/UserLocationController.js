import {Controller} from "./controller.js";
import {MapRepository} from "../repositories/mapRepository.js";
import {DashboardRepository} from "../repositories/dashboardRepository.js";
import {debounce} from "../utils/debounce.js";

export class UserLocationController extends Controller {

    #userLocationView;
    #mapRepository;
    #dashboardRepository;
    #usersDistanceToMuseum;

    constructor() {
        super();
        this.#mapRepository = new MapRepository();
        this.#dashboardRepository = new DashboardRepository();
        this.#setupView().then();
    }

    async #setupView() {
        console.log();
        this.#createVisitorIfNeeded().then();
        this.#userLocationView = await super.loadHtmlIntoContent("html_views/UserLocation.html");
        this.#watchForLocationTextFieldChanges();
        this.#showsActivityIndicator(false);
        this.#showsLocationResult(false);
        this.#showsErrorBox(false);
        this.#getCurrentLocationButton().addEventListener('click', () => { this.#getLocation(); })
        this.#getContinueContainer().addEventListener('click', () => { this.#handleContinueButtonClicked(); })
        this.#showsContinueButton(false);
    }

    async #createVisitorIfNeeded() {
        if (localStorage.getItem('visitorId') !== null)
            return;
        let result = await this.#dashboardRepository.createVisitor()
        localStorage.setItem('visitorId', result.insertId);
    }

    #watchForLocationTextFieldChanges() {
        const inputHandler = debounce(async (event) => {
            if (event.target.value == null || event.target.value === '')
                return;
            this.#showsActivityIndicator(true);

            await this.#tryShowSearchResults();
            this.#showsActivityIndicator(false);
        }, 500)

        this.#getLocationNameTextField().addEventListener('input', inputHandler);
    }

    async #tryShowSearchResults() {
        let locationName = this.#getLocationNameTextField().value;
        let results = await this.#mapRepository.getPlaces(locationName);
        let places = await results.results
        this.#showsSearchResultsContainer(true);
        let resultsContainer = this.#getSearchResultsContainer();
        this.#removeAllChildNodes(resultsContainer);
        this.#addPlacesToResultContainer(places);
        this.#addClickEventListenersToResultElements();
    }

    #addPlacesToResultContainer(places) {
        let resultsContainer = this.#getSearchResultsContainer();
        places.forEach((place) => {
            resultsContainer.insertAdjacentHTML(
                'beforeend',
                this.#createSearchResultItem(place.id, place.place_type[0], place.place_name)
            );
        });
    }

    #createSearchResultItem(placeId, type, placeName) {
        let iconName = type === 'address' ? 'fa-road' : 'fa-city';
        return `
            <div data-placename="${placeName}" class="user-location-search-result-element">
                <div data-placename="${placeName}" class="user-location-search-result-element-content">
                    <i data-placename="${placeName}" class="fa-solid ${iconName}"></i>
                    <p data-placename="${placeName}">${placeName}</p>
                </div>
            </div>`;
    }

    #addClickEventListenersToResultElements() {
        this.#userLocationView
            .querySelectorAll('.user-location-search-result-element')
            .forEach((searchElement) => {
                searchElement.addEventListener('click', (e) => {
                    this.#handleResultElementClicked(e.target.dataset.placename)
                })
            })
    }

    #handleResultElementClicked(placeName) {
        this.#showsSearchResultsContainer(false);
        this.#getLocationNameTextField().value = placeName;
        this.#calculateDistance().then();
    }

    #showsSearchResultsContainer(shouldShow) {
        let resultsContainer = this.#getSearchResultsContainer();
        let defaultClasses = "user-location-search-container transition transition-all ease-in-out duration-300";
        if (shouldShow) {
            resultsContainer.classList.value = `${defaultClasses} scale-100 opacity-100`
        } else {
            resultsContainer.classList.value = `${defaultClasses} scale-90 opacity-0`
            setTimeout(() => { resultsContainer.classList.value = `transition transition-all ease-in-out duration-300 scale-90 hidden`}, 350)
        }
    }

    async #calculateDistance() {
        this.#showsActivityIndicator(true);
        const locationName = this.#getLocationNameTextField().value;
        try {
            const result = await this.#mapRepository.getDistanceForLocation(locationName);
            let distanceInKm = this.#roundTo2Decimals(result.distance_in_km)
            this.#usersDistanceToMuseum = distanceInKm;
            this.#updateDistanceLabel(result.place_name, distanceInKm);
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
        let distanceInKm = this.#roundTo2Decimals(response.distance_in_km);
        this.#usersDistanceToMuseum = distanceInKm;
        this.#showsContinueButton(this.#canContinue());
        this.#updateDistanceLabel(response.place_name, distanceInKm);
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

    #canContinue() {
        return (this.#usersDistanceToMuseum !== undefined && !isNaN(Number(this.#usersDistanceToMuseum)))
    }

    #handleContinueButtonClicked() {
        alert(`${this.#canContinue() === true ? `kan door gaan, afstand naar museum: ${this.#usersDistanceToMuseum}` : "Locatie is nog niet ingevuld." }`)
    }

    #showsContinueButton(canContinue) {
        this.#getContinueContainer().style.opacity = canContinue ? "1" : "0.6";
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

    #getContinueContainer() {
        return this.#getElementByIdId('continue-container');
    }

    #getSearchResultsContainer() {
        return this.#getElementByIdId('search-results-container');
    }

    /** Helpers **/
    #getElementByIdId(id) {
        return this.#userLocationView.querySelector(`#${id}`);
    }

    #roundTo2Decimals(number) {
        return Math.round((Number(number) + Number.EPSILON) * 100) / 100
    }

    #removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
}
