import React, { useEffect, useState } from 'react';
import MapView from "react-native-maps";
import tw from "tailwind-react-native-classnames";
import * as Location from 'expo-location';

function OnRouteMap(props) {
  const [coords, setCoords] = useState([]);
  const [startLatLon, setStartLatLon] = useState({latitude: 0, longitude: 0});
  const [endLatLon, setEndLatLon] = useState({latitude: 0, longitude: 0});
  const [mapRef, setMapRef] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);

  useEffect(() => {
    const route = props.item;
    setCoords(route?.locationPoints || []);
    setStartLatLon({latitude: route?.startingLatitude, longitude: route?.startingLongitude});
    setEndLatLon({latitude: route?.endingLatitude, longitude: route?.endingLongitude});

    (async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
      }
    })();

    updateLocation().then();
  }, []);

  const updateLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Lowest
      });
      setInitialRegion({
        ...location.coords,
        latitudeDelta: 0.0030,
        longitudeDelta: 0.0030
      });
      mapRef.animateToRegion({
        ...initialRegion
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <MapView
      style={tw`flex-1`}
      ref={(ref) => {
        setMapRef(ref);
      }}
      showsUserLocation={true}
      initialRegion={initialRegion}
      onRegionChangeComplete={updateLocation}
    >

    </MapView>
  );
}

export default OnRouteMap;
