import axios from 'axios';
import {
  Coordinates,
  FetchCoordinatesResult,
  ValidationMessage,
} from './interfaces';

export default class GeoLocationValidator {
  private azureMapApi: string;
  private radiusOfEarth = 6371000; //meters

  constructor(azureMapAPIKey: string) {
    this.azureMapApi = azureMapAPIKey;
  }

  /**
   * Fetches coordinates using HTML5G Geolocation API on
   */
  fetchCoordinates = (): FetchCoordinatesResult | any => {
    try {
      let navigator = window.navigator;
      if (navigator) {
        const coordinates = navigator.geolocation.getCurrentPosition(
          (position) => {
            return {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              altitude: position.coords.altitude,
            };
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                throw new Error(
                  'application denied request to access location of device'
                );
                break;
              case error.POSITION_UNAVAILABLE:
                throw new Error('User is in outer space');
                break;
              case error.TIMEOUT:
                throw new Error('Request to get location timed out');
                break;
              default:
                throw new Error(' Buy a new devie and throwaway that komkom');
                break;
            }
          }
        );
      } else {
        throw new Error('Geolocation not supported by client application');
      }
    } catch (error: any) {
      throw error;
    }
  };

  /**
   * using Azure Map services, a physical address can be passed to give its coordinates
   * @param address - Pass in the physical address of a location to
   */
  geoCodeAddress = async (address: string): Promise<Coordinates> => {
    try {
      let addressQuerystring = `https://atlas.microsoft.com/search/address/json?subscription-key=${
        this.azureMapApi
      }&api-version=1.0&query=${encodeURIComponent(address)}`;
      let { data } = await axios.get(addressQuerystring);

      let coordinates = data.results[0].position;
      return {
        latitude: coordinates.lat,
        longitude: coordinates.lon,
      };
    } catch (error: any) {
      throw error.message;
    }
  };

  /**
   * A method to calculate the distance between two geographic points based on latitude and longitude
   * @param coordinates1 - A object/interface containing the longitude and latitude of the point of location
   * @param coordinates2 - An object/interface containing the longitude and the latittude of the point of reference
   * @returns The distance between these points in meters
   */
  calculateDistanceBetweenCoordinates = (
    coordinates1: Coordinates,
    coordinates2: Coordinates
  ): number => {
    let { latitude: lat1, longitude: long1 } = coordinates1;
    let { latitude: lat2, longitude: long2 } = coordinates2;
    let diffLat = this.degree2Radian(lat2 - lat1);
    let diffLong = this.degree2Radian(long2 - long1);
    let a =
      Math.sin(diffLat / 2) ** 2 +
      Math.cos(this.degree2Radian(lat1)) *
        Math.cos(this.degree2Radian(lat2)) *
        Math.sin(diffLong / 2) *
        Math.sin(diffLong / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = this.radiusOfEarth * c;
    return distance; // distance in meters
  };

  degree2Radian = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  /**
   * Validation Method to
   * @param userCoordinates
   * @param validationPoint
   * @param range
   * @returns True or false
   */
  validateLocation = async (
    userCoordinates: Coordinates,
    validationPoint: Coordinates,
    range: number
  ): Promise<ValidationMessage> => {
    const distanceBetweenUserandValidationPoint =
      this.calculateDistanceBetweenCoordinates(
        userCoordinates,
        validationPoint
      );

    if (userCoordinates === validationPoint) {
      return {
        result: true,
        message: 'Device Location validated',
      };
    } else if (
      userCoordinates === validationPoint ||
      distanceBetweenUserandValidationPoint <= range
    ) {
      return {
        result: true,
        message: 'Device Location validated',
      };
    } else {
      return {
        result: false,
        message: 'Device is not presently within the range of validation',
      };
    }
  };
}
