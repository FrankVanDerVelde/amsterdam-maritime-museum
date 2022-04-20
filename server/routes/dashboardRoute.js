class DashboardRoute {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #databaseHelper = require("../framework/utils/databaseHelper")
    #app

    /**
     * @param app - ExpressJS instance(web application) we get passed automatically via app.js
     * Important: always make sure there is an app parameter in your constructor!
     */
    constructor(app) {
        this.#app = app;

        //method for calculating total visitors
        this.#getVisitorTotal()

        //method for calculating visitor per week
        this.#getWeeklySubmissions()

        //method for calculating average CO2 per visitor
        this.#getCO2AveragePerVisitor()

        //method for calculating average distance travelled
        this.#getDistanceAveragePerVisitor()

        //method for calculating reduced emissions
        this.#getSavedEmissions()

        this.#createVisitor();
    }

    #getVisitorTotal() {
        this.#app.get("/dashboard/getVisitorTotal", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT COUNT(id) AS 'amount_of_visitors' FROM visitors ;",
                });

                //just give all data back as json, could also be empty
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch(e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    #getWeeklySubmissions() {
        this.#app.get("/dashboard/getWeeklySubmissions", async (req, res) => {
            let car = req.query.car;
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT WEEK(date_submitted) AS week, COUNT(id) AS registrations FROM submissions " +
                        "WHERE '20220101' <= date_submitted AND date_submitted < '20230101' " +
                        "GROUP BY WEEK(date_submitted) ORDER BY WEEK(date_submitted);",
                });

                //just give all data back as json, could also be empty
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch(e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    #getCO2AveragePerVisitor() {
        this.#app.get("/dashboard/getCO2AveragePerVisitor", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT SUM(original_CO2)/COUNT(id) AS 'average_CO2_emission' FROM pad_svm_5_dev.submissions;",
                });

                //just give all data back as json, could also be empty
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch(e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    #getDistanceAveragePerVisitor() {
        this.#app.get("/dashboard/getDistanceAveragePerVisitor", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT SUM(distance)/COUNT(id) AS 'average_distance_travelled' FROM pad_svm_5_dev.submissions;",
                });

                //just give all data back as json, could also be empty
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch(e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    #getSavedEmissions() {
        this.#app.get("/dashboard/getSavedEmissions", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "SELECT (Sum(original_CO2)/Count(id)) - (Sum(final_CO2)/Count(id)) AS 'saved_emissions' FROM pad_svm_5_dev.submissions;",
                });

                //just give all data back as json, could also be empty
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch(e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }

    #createVisitor() {
        this.#app.post("/dashboard/createVisitor", async (req, res) => {
            try {
                const data = await this.#databaseHelper.handleQuery({
                    query: "INSERT INTO `visitors` (`id`, `date_visited`, `submissionId`) VALUES (NULL, NOW(), NULL)"
                });

                //just give all data back as json, could also be empty
                res.status(this.#errorCodes.HTTP_OK_CODE).json(data);
            } catch(e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        });
    }
}

module.exports = DashboardRoute