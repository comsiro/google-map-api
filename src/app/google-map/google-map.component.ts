/// <reference path="../../../node_modules/@types/googlemaps/index.d.ts" />

import { Component, AfterContentInit, ViewChild, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements AfterContentInit {
  @ViewChild('divGoogleMap') googleMapElement: any;
  @ViewChild('inputAddress') inputAddressElement: any;
  map: google.maps.Map;

  constructor(private cdr: ChangeDetectorRef) { }

  ngAfterContentInit() {
    this.search();
  }

  initMap(location) {
    if (navigator.onLine) {
      let mapProp = {
        center: location,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
      };

      this.map = new google.maps.Map(this.googleMapElement.nativeElement, mapProp);

      let infowindow = new google.maps.InfoWindow(
        {
          content: '<b>' + this.inputAddressElement.nativeElement.value + '</b>'
        });

      let marker = new google.maps.Marker({
        position: location,
        map: this.map
      });

      infowindow.open(this.map, marker);

      this.cdr.detectChanges();
    } else {
      alert("Your internet connection is unstable.");
    }
  }

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

  search() {
    this.getLocation(this.inputAddressElement.nativeElement.value).then((location) => {
      this.initMap(location)
    }).catch((error) => {
      console.log(error);
    });
  }
}