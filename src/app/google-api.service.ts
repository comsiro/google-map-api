/// <reference path="../../node_modules/@types/googlemaps/index.d.ts" />

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {

  constructor() { }

  getLocation(address: string) {
    return new Promise((resolve, reject) => {
      if (navigator.onLine) {
        let geocoder = new google.maps.Geocoder();
        if (geocoder) {
          geocoder.geocode({ 'address': address }, (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
              resolve(new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng()));
            }
            else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
              resolve("No result found");
            } else {
              reject("Unknown error");
            }
          });
        }
      }
      else {
        alert("Your internet connection is unstable.");
      }
    });
  }
}
