import { TestBed, inject } from '@angular/core/testing';

import { GoogleApiService } from './google-api.service';

describe('GoogleApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleApiService]
    });
  });

  it('should be created', inject([GoogleApiService], (service: GoogleApiService) => {
    expect(service).toBeTruthy();
  }));

  let geocoder;

  beforeEach(() => {
    let constructorSpy = spyOn(google.maps, 'Geocoder');
    geocoder = jasmine.createSpyObj('Geocoder', ['geocode']);

    constructorSpy.and.returnValue(geocoder);
  });

  it(`returns 'No result found' if geocoder.geocode returns no result`, inject([GoogleApiService], (service: GoogleApiService) => {
    geocoder.geocode.and.callFake((request, callback) => {
      callback([], google.maps.GeocoderStatus.ZERO_RESULTS);
    });
    // Act
    service.getLocation("INVALID ADDRESS").then((result) => {
      // Assert
      expect(geocoder.geocode).toHaveBeenCalled();
      expect(result).toEqual("No result found");
    }).catch((error) => {
      expect(error).not.toEqual("Unknown error");
    });
  })
  );
});

window['google'] = {
  maps: {
    Marker: function () {
    },
    InfoWindow: function () {
    },
    LatLng: function (lat, lng) {
      return [lat, lng];
    },
    Map: function (obj) {

    },
    Geocoder: function (obj) {
      return {
        geocode: function (request, callback) {
        }
      };
    },
    GeocoderStatus: { OK: true, ZERO_RESULTS: false },
    MapTypeId: { ROADMAP: true }
  }
};