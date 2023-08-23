import assert from 'assert';
import GeoLocationValidator from '../src/index';
import { describe, it } from 'mocha';
import { config } from 'dotenv';
import { Coordinates } from '../src/interfaces';

// Hard code geocoordinates
let address = '52 Elitor Street, Woji, Port Harcourt';
let myCoordinates: Coordinates = {
  latitude: 4.825979675576107,
  longitude: 7.05675985088703,
};
config();
describe('Geolocation Validator suite', () => {
  describe("Fetch a device's coordinates", async () => {
    it('Using fetchcoordinates method', () => {
      const geoLocator = new GeoLocationValidator(
        process.env.AZURE_MAP_API_KEY as string
      );
      let deviceLocation = geoLocator.fetchCoordinates();
      console.log(deviceLocation);
      assert(deviceLocation);
    });
  });
  describe('Geocode Address', async () => {
    it('Using geoCode Address', async () => {
      const geoLocator = new GeoLocationValidator(
        process.env.AZURE_MAP_API_KEY as string
      );
      let addressCoordinates = await geoLocator.geoCodeAddress(address);
      console.log(addressCoordinates);
      assert(addressCoordinates);
    });
  });
  describe('Geocode address and calculate the distance', async () => {
    it('Geocode and calculate', async () => {
      const geoLocator = new GeoLocationValidator(
        process.env.AZURE_MAP_API_KEY as string
      );
      let addressCoordinates = await geoLocator.geoCodeAddress(address);

      let distance = geoLocator.calculateDistanceBetweenCoordinates(
        myCoordinates,
        addressCoordinates
      );
      console.log(distance);
      assert(distance);
    });
  });

  describe('Validate Address', async () => {
    it('Use validateLocation', async () => {
      const geoLocator = new GeoLocationValidator(
        process.env.AZURE_MAP_API_KEY as string
      );
      let addressCoordinates = await geoLocator.geoCodeAddress(address);

      let validationResult = await geoLocator.validateLocation(
        myCoordinates,
        addressCoordinates,
        2000
      );
      console.log(validationResult);
      assert(validationResult);
    });
  });
});
