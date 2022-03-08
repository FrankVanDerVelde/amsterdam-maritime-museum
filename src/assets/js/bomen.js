document.addEventListener("DOMContentLoaded", async function () {

    //Dit is het aantal CO2 die wordt uitgestoten door de manier van vervoer van de gebruiker in kilo
    let co2Gebruiker = 1000;

    //De compensatie CO2 van een boom ligt tussen de 21,77kg en 31,5kg per jaar
    //Het gemiddelde is dus 26.635kg per jaar
    const gemiddeldeCo2BomenPerJaar = 26.635;

    // await co2Berekening();

    // async function aantalBomenBerekening() {
        const aantalBomenCompensatiePerJaar = Math.round((co2Gebruiker / gemiddeldeCo2BomenPerJaar) * 100) / 100;
        const aantalBomenCompensatiePerMaand = aantalBomenCompensatiePerJaar * 12;
        const aantalBomenCompensatiePerDag = aantalBomenCompensatiePerJaar * 365;

        document.querySelector("#aantalBomenPerJaar").innerHTML = aantalBomenCompensatiePerJaar;
        document.querySelector("#aantalBomenPerMaand").innerHTML = aantalBomenCompensatiePerMaand;
        document.querySelector("#aantalBomenPerDag").innerHTML = aantalBomenCompensatiePerDag;
    // }
})