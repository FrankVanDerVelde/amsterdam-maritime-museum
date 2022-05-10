// Context: MapBoxTest
import MapBoxService from "../../../Services/MapBox/MapBoxService";
import MapBoxProfile from "../../../Services/MapBox/MapBoxProfile";


describe("MapBox", () => {
    let mapBoxService = new MapBoxService();

    it('Get distance', async () => {
        let profile = MapBoxProfile.driving.value;
        let museumLocation = "4.91511,52.37138"
        let distance = await mapBoxService.getDistanceInMeters(museumLocation, profile);
        console.log(distance);
        expect(distance).to.equal(0);
    });

    it("Get coordinates for Alkmaar", async () => {
        const coordinates = await mapBoxService.getFirstPlaceForLocation("Alkmaar");
        console.log(coordinates);
        let isNull = coordinates === null;
        expect(isNull).to.equal(false);
    });
})