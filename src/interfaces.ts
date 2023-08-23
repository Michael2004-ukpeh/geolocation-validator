export interface FetchCoordinatesResult {
  /**
   * Latitude of device
   */
  latitude: number;
  /**
   * Longitude of device
   */
  longitude: number;
  /**
   * Altitude of device
   */
  altitude: number;
}

export interface Coordinates {
  /**
   * Latitude of Coordinate
   */
  latitude: number;
  /**
   * Longitude of Coordinate
   */
  longitude: number;
}

export interface ValidationMessage {
  /**
   * Status of device geolocation validation
   */
  result: boolean;
  /**
   * validation message
   */
  message: String;
}
