/**
 * Controller for the calculator
 */

import { Controller} from "./controller.js";

export class CalculatorController extends Controller {
    #createCalculatorView;

    constructor() {
        super();

        this.#setupView();
    }

    async #setupView() {
        this.#createCalculatorView = await super.loadHtmlIntoContent("html_views/treeCanvas.html");
    }
}