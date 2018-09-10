/// <reference path="../../../node_modules/@types/googlemaps/index.d.ts" />

import { Component, AfterContentInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { GoogleApiService } from '../google-api.service'

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements AfterContentInit {
  @ViewChild('divGoogleMap') googleMapElement: any;
  @ViewChild('inputAddress') inputAddressElement: any;
  map: google.maps.Map;

  constructor(private cdr: ChangeDetectorRef,
    private ga: GoogleApiService) { }

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

  search() {
    this.ga.getLocation(this.inputAddressElement.nativeElement.value).then((location) => {
      this.initMap(location)
    }).catch((error) => {
      console.log(error);
    });
  }
}