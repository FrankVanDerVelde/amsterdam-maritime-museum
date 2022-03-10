document.addEventListener("DOMContentLoaded", async function () {
    //Afstand die de bezoeker van het Scheepvaartmuseum heeft afgelegd
    let afgelegdeAfstand;

    //---------------------------------CO2-verbruik voor verschillende brandstoffen per km------------------------------
    //CO2 gebruik in gram diesel per km
    const co2GebruikDiesel = 132;

    //CO2 gebruik in gram benzine per km
    const co2GebruikBenzine = 120;

    //CO2 gebruik in gram LPG per km
    const co2GebruikLPG = 83;

    //CO2 gebruik in gram CNG per km voor laag en hoog calorisch
    const co2GebruikCNGLaag = 113;
    const co2GebruikCNGHoog = 112;
    //------------------------------------------------------------------------------------------------------------------

    async function co2BerekeningAuto(){
        if(document.querySelector("#vervoersmiddel") === document.querySelector("#Auto")){
            const co2GebruikAutoDiesel = afgelegdeAfstand * co2GebruikDiesel;
            const co2GebruikAutoBenzine = afgelegdeAfstand * co2GebruikBenzine;
            const co2GebruikAutoLPG = afgelegdeAfstand * co2GebruikLPG;
            const co2GebruikAutoCNGLaag = afgelegdeAfstand * co2GebruikCNGLaag;
            const co2GebruikAutoCNGHoog = afgelegdeAfstand * co2GebruikCNGHoog;

        }


    }

    async function co2BerekeningBus(){


    }

    async function co2BerekeningTrein(){


    }

    async function co2BerekeningFiets(){


    }

    async function co2BerekeningLopend(){


    }


})