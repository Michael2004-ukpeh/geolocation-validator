import assert from 'assert';
import { GeoLocationValidator } from '../src/index';
import { describe, it } from 'mocha';
import { config } from 'dotenv';
import { Coordinates } from '../src/interfaces';

// Hard code geocoordinates
let address =
  '7 Grace Avenue off kemka Street, Location bus stop, NTA road, Mgbuoba, Port Harcourt.';
let myCoordinates: Coordinates = {
  latitude: 4.825979675576107,
  longitude: 7.05675985088703,
};
config();
describe('Geolocation Validator suite', () => {
  describe("Fetch a device's coordinates", async () => {
    it('Using ip', async () => {
      const geoLocator = new GeoLocationValidator();
      let deviceLocation = await geoLocator.fetchIpCoordinatesClient(
        process.env.IPDATA_API_KEY as string,
        process.env.ABSTRACT_API_KEY as string
      );
      console.log('ip location:', deviceLocation);
      assert(deviceLocation);
    });
  });
  describe('Geocode Address', async () => {
    it('Using geoCode Address', async () => {
      const geoLocator = new GeoLocationValidator();
      let addressCoordinates = await geoLocator.geoCodeAddressGoogle(
        address,
        process.env.GOOGLE_MAP_API_KEY as string
      );
      console.log(addressCoordinates);
      assert(addressCoordinates);
    });
  });
  describe('Geocode address and calculate the distance', async () => {
    it('Geocode and calculate', async () => {
      const geoLocator = new GeoLocationValidator();
      let deviceLocation = await geoLocator.fetchIpCoordinatesClient(
        process.env.IPDATA_API_KEY as string,
        process.env.ABSTRACT_API_KEY as string
      );
      let addressCoordinates = await geoLocator.geoCodeAddressGoogle(
        address,
        process.env.GOOGLE_MAP_API_KEY as string
      );

      let distance = geoLocator.calculateDistanceBetweenCoordinates(
        deviceLocation as Coordinates,
        addressCoordinates
      );
      console.log(distance);
      assert(distance);
    });
  });

  describe('Validate Address', async () => {
    it('Use validateLocation', async () => {
      const geoLocator = new GeoLocationValidator();
      let deviceLocation = await geoLocator.fetchIpCoordinatesClient(
        process.env.IPDATA_API_KEY as string,
        process.env.ABSTRACT_API_KEY as string
      );
      let addressCoordinates = await geoLocator.geoCodeAddressGoogle(
        address,
        process.env.GOOGLE_MAP_API_KEY as string
      );

      let validationResult = await geoLocator.validateLocation(
        deviceLocation as Coordinates,
        addressCoordinates,
        2000
      );
      console.log(validationResult);
      assert(validationResult);
    });
  });
});
