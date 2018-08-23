import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleMapComponent } from './google-map.component';

describe('GoogleMapComponent', () => {
  let component: GoogleMapComponent;
  let fixture: ComponentFixture<GoogleMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GoogleMapComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  let geocoder;

  beforeEach(() => {
    let constructorSpy = spyOn(google.maps, 'Geocoder');
    geocoder = jasmine.createSpyObj('Geocoder', ['geocode']);

    constructorSpy.and.returnValue(geocoder);
  });

  it(`returns 'No result found' if geocoder.geocode returns no result`, () => {
    geocoder.geocode.and.callFake((request, callback) => {
      callback([], google.maps.GeocoderStatus.ZERO_RESULTS);
    });
    // Act
    component.getLocation("INVALID ADDRESS").then((result) => {
      // Assert
      expect(geocoder.geocode).toHaveBeenCalled();
      expect(result).toEqual("No result found");
    }).catch((error) => {
      expect(error).not.toEqual("Unknown error");
    });
  });
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