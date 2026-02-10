
import './App.css'
import {AdvancedMarker, APIProvider, Map, type MapCameraChangedEvent, Pin} from '@vis.gl/react-google-maps';

type Poi ={ key: string, location: google.maps.LatLngLiteral }
//ignore error if there is one on google.maps.LatLngLiteral, it is defined in the @types/googlemaps package which is a dependency of @vis.gl/react-google-maps
const locations: Poi[] = [
  {key: 'Warren Tower Lot', location: { lat: 42.349081937, lng: -71.103582919  }},
  {key: 'West Campus Lot', location: { lat: 42.352868, lng: -71.119654 }},
];

const PoiMarkers = (props: {pois: Poi[]}) => {
  return (
    <>
      {props.pois.map( (poi: Poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}>
        <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
        </AdvancedMarker>
      ))}
    </>
  );
};
export default function App() {

  return (
    <APIProvider apiKey={'AIzaSyAH_FqQQeVvbDPd3ZrQACiRGfdGu1SoYn4'} onLoad={() => console.log('Maps API has loaded.')}>
      <Map
          style={{ width: '100vw', height: '100vh' }}
          defaultZoom={15.5}
          mapId='5526f5efcd60758c2895a69f'
          defaultCenter={ { lat: 42.350876, lng: -71.106918 } }
          onCameraChanged={ (ev: MapCameraChangedEvent) =>
            console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
          }>
        <PoiMarkers pois={locations} />
      </Map>
    </APIProvider>
  )
}

