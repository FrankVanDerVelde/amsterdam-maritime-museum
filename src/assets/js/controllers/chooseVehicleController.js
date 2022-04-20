/**
 * Controller for the calculator
 */

import { Controller} from "./controller.js";

export class ChooseVehicleController extends Controller {
    #chooseVehicleView;

    constructor() {
        super();

        this.#setupView();
    }

    async #setupView() {
        this.#chooseVehicleView = await super.loadHtmlIntoContent("html_views/chooseVehicle.html");

        const test = this.#chooseVehicleView;

        const buttonCards = test.querySelectorAll('.btn_card');

        buttonCards.forEach(card => {
            card.addEventListener('click', function (e) {
                const active = test.querySelector('.btn_card.active');

                console.log(active);

                if (active) {
                    active.classList.toggle('active');

                    // test.querySelector('.btn_card .active').classList.toggle('active');
                }

                card.classList.toggle('active');

            })
        })
    }
}