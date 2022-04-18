export class LocationDistance {
    distanceInMeters;
    distanceInKM

    constructor(distanceInMeters) {
        this.distanceInMeters = distanceInMeters
        this.distanceInKM = distanceInMeters / 1000
    }
}

let locDistance = new LocationDistance(100);