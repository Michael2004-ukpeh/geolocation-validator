import axios from 'axios';
import IPData from 'ipdata';
import express from 'express';
import {
  Coordinates,
  FetchCoordinatesResult,
  ValidationMessage,
} from './interfaces';

export { Coordinates, FetchCoordinatesResult, ValidationMessage };

/**
 * A geolocation validation middleware to based on Ip address
 */
export class GeoLocationValidator {
  /** Radius of the earth in meters */
  radiusOfEarth = 6371000; //meters
  /**
   * A geolocation validation middleware to based on Ip address
   */

  /**
   * Fetches the geographic coordinates of device based on Ip
   * @param ipDataAPIKey - Check out https://ipdata.co/
   * @param abstractAPIKey - check out https://www.abstractapi.com/api/ip-geolocation-api
   * @returns - Geographic coordinates of device
   */
  fetchIpCoordinatesClient = async (
    ipDataAPIKey: string,
    abstractAPIKey: string
  ): Promise<Coordinates> => {
    try {
      let { data } = await axios.get(
        `https://ipgeolocation.abstractapi.com/v1/?api_key=${
          abstractAPIKey as string
        }`
      );
      let ipAddress = data.ip_address;

      const ipData = new IPData(ipDataAPIKey);
      let geo = await ipData.lookup(ipAddress);
      let { latitude, longitude } = geo;

      return {
        latitude,
        longitude,
      };
    } catch (error: any) {
      throw error.message;
    }
  };

  /**
   * Fetches the ip address of the client making the HTTP request
   * @param req - The req object of the HTTP request
   * @param ipDataAPIKey -  Check out https://ipdata.co/
   * @returns - Geographic coordinates of device based on http request to be validated on backend application
   */
  fetchIpBasedReq = async (
    req: any,
    ipDataAPIKey: string
  ): Promise<Coordinates> => {
    try {
      const ipAddress = req.ip;
      console.log(ipAddress);
      const ipData = new IPData(ipDataAPIKey);
      let geo = await ipData.lookup(ipAddress);
      let { latitude, longitude } = geo;

      return {
        latitude,
        longitude,
      };
    } catch (error: any) {
      throw error.message;
    }
  };

  /**
   * Fetches coordinates using IP Geolocation API on
   */
  fetchCoordinatesHtml5Geolocation = (): FetchCoordinatesResult | any => {
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
   * @param address - Pass in the physical address of a location to be gp
   */
  geoCodeAddressAzure = async (
    address: string,
    azureMapAPIKey: string
  ): Promise<Coordinates> => {
    try {
      let addressQuerystring = `https://atlas.microsoft.com/fuzzy/address/json?subscription-key=${azureMapAPIKey}&api-version=1.0&query=${encodeURIComponent(
        address
      )}`;
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
   * using Google Map services, a physical address can be passed to give its coordinates
   * @param address - Pass in the physical address of a location to be geocoded
   * @param googleMapAPIKey  - API key of Google Geocoding API
   */
  geoCodeAddressGoogle = async (
    address: string,
    googleMapAPIKey: string
  ): Promise<Coordinates> => {
    try {
      let addressQuerystring = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${googleMapAPIKey}`;
      let { data } = await axios.get(addressQuerystring);
      console.log(data);
      let coordinates = data.results[0].geometry.location;
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
  /**
   * Converts degrees to radians
   * @param deg
   * @returns
   */
  degree2Radian = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  /**
   * Validation Method to check location of device
   * @param userCoordinates -  Geographic coordinates of device
   * @param validationPoint -  Geographic coordinates of validation point
   * @param range - Acceptable distance between the device and validation point in meters
   * @returns  Validation message True or false
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
