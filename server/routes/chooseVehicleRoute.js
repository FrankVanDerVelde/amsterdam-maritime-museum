const axios = require("axios").default;

class ChooseVehicleRoute {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #app

    constructor(app) {
        this.#app = app;

        this.#getVehicleFuel();
    }

    #getVehicleFuel() {
        this.#app.get("/choose-vehicle/getVehicleFuel:licensePlate", async (req, res) => {
            const instance = axios.create({baseURL: 'https://api.overheid.io'})

            try {
                instance.defaults.headers.common['ovio-api-key'] = '9893e4a7fbd8297e6cf90382ca8089e43c64c7ecbb4007d9d824028700332064';

                const data = await instance.get(`/voertuiggegevens/${req.params.licensePlate}`);

                let fuelTypes = []

                for (const fuelType of data.data.brandstof) {
                    console.log(fuelType);
                    fuelTypes.push(fuelType.brandstof_omschrijving)
                }

                console.log(fuelTypes);

                res.status(this.#errorCodes.HTTP_OK_CODE).json(fuelTypes);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }
}

module.exports = ChooseVehicleRoute