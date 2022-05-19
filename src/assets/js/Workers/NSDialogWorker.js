import { NSRepository } from "../repositories/NSRepository.js";

export class NSDialogWorker {
    #parentView;
    #nsRepo;

    constructor() {
        this.#nsRepo = new NSRepository();
    }

    setView(view) {
        this.#parentView = view;
    }

    setup() {
        this.#showStationList().then();

        this.#parentView
            .querySelector('#ns-done-button')
            .onclick = this.#calculateTripButtonClicked.bind(this);

        this.#parentView
            .querySelector('#tram-vehicle')
            .onclick = this.#toggleNSDialog.bind(this);

        this.#parentView
            .querySelector('#ns-close-dialog-button')
            .onclick = this.#toggleNSDialog.bind(this);
    }

    async #showStationList() {
        let stationsSelect = this.#parentView.querySelector('#stations');
        let stations = await this.#nsRepo.getAllStations();
        await stations.forEach( station => {
            stationsSelect.appendChild(this.#createStationOption(station));
        })
    }

    #createStationOption(station) {
        let opt = document.createElement('option');
        opt.value = String(station.code);
        opt.innerHTML = String(station.name);
        return opt;
    }

    async #calculateTripButtonClicked() {
        let amountOfPeople = Number(this.#parentView.querySelector('#ns-number-of-persons').value);
        let stationCode = this.#parentView.querySelector('#stations').value;

        let results = await this.#nsRepo.getTripPrice(stationCode, "ASD")
        this.#displayPrice(await results.results.priceInEuro * amountOfPeople)
    }

    #displayPrice(price) {
        this.#parentView.querySelectorAll('.ns-price-result-label').forEach((label) => {
            label.innerHTML = `€${price.toLocaleString()}`
        })
    }

    #toggleNSDialog() {
        this.#parentView.querySelector('#ns-dialog').classList.toggle('hidden');
    }
}