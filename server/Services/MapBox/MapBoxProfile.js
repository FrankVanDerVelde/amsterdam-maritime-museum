class MapBoxProfile {
    static driving = new MapBoxProfile("mapbox/driving")
    static drivingTraffic = new MapBoxProfile("mapbox/driving-traffic")
    static walking = new MapBoxProfile("mapbox/walking")
    static cycling = new MapBoxProfile("mapbox/cycling")

    constructor(profile) {
        this.value = profile
    }
}

module.exports = MapBoxProfile;