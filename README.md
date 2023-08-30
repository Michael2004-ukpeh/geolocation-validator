# Address Based Geolocation Validator

A set of methods created to validate the location of a device from it's point of validation

## Installation

```sh
npm install geolocation-validator --save
yarn add geolocation-validator
bower install geolocation-validator  --save
```

## Usage

```Javascript
import {GeoLocationValidator} from 'geolocation-validatior'

const geoLocator =  new GeoLocationValidator();

const myCoordinates:Coordinates =  {
    latitude: 4.825979675576107,
    longitude: 7.05675985088703
}

const pointOfValidaton: Coordinates =  {
    latitude:7.05675985088703,
    longitude:4.825979675576107
}

const validated =  await geoLocator.validateLocation(myCoordinates, pointofValidation, 0);

```

```sh
Output:
 {
   result:false
   message: 'Device is not presently within the range of validation'
}
```

For more documentation: Check out the <a href='https://michael2004-ukpeh.github.io/geolocation-validator/'>docs</a>
