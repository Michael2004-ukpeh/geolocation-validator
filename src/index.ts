import { FetchCoordinatesResult } from './interfaces';

class GeoLocationValidator {
  private googleMapApi: string;
  private radiusOfEarth = 6371000; //meters

  constructor(googleMapAPIKey: string) {
    this.googleMapApi = googleMapAPIKey;
  }
  /**
   * Fetches coordinates using HTML5G Geolocation API
   */
  fetchCoordinates = (): FetchCoordinatesResult | any => {
    try {
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
      throw error.message;
    }
  };
  //    Bocker canot find a reliable map service
  /**
   *
   * @param address - Pass in the physical address of a location to
   */
  geoCodeAddress = async (address: string) => {};

  /**
   * A method to calculate the distance between two geographic points based on latitude and longitude
   * @param lat1 -  latitude of first coordinate
   * @param long1 - longitude of second coordinate
   * @param lat2 - latitude of first coordinate
   * @param long2 -longitude of second coordinate
   * @returns The distance between these points
   */
  calculateDistanceBetweenCoordinates = (
    lat1: number,
    long1: number,
    lat2: number,
    long2: number
  ): number => {
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

  validateLocation = () => {};
}
