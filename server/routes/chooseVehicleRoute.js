const axios = require("axios").default;

class ChooseVehicleRoute{
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #app

    constructor(app) {
        this.#app = app;

        this.#getLicensePlate();
    }

    #getLicensePlate(){
        this.#app.get("/choose-vehicle/getLicensePlate", async (req, res) => {
            const instance = axios.create({
                baseURL : 'https://api.overheid.io'
            })

            try{
                instance.defaults.headers.common['ovio-api-key'] = '9893e4a7fbd8297e6cf90382ca8089e43c64c7ecbb4007d9d824028700332064';

                const data = await instance.get("/voertuiggegevens/K-001-HL");

                res.status(this.#errorCodes.HTTP_OK_CODE).json(data.data.brandstof[0].brandstof_omschrijving);
            }catch (e){
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }
}

module.exports = ChooseVehicleRoute