import React, { useEffect, useState } from 'react';
import MapView, { Marker } from "react-native-maps";
import tw from "tailwind-react-native-classnames";
import { Image } from 'react-native';
import http from '../utils/http';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapViewDirections from 'react-native-maps-directions';
import {GOOGLE_MAPS_APIKEY} from "@env";

function OnRouteMap(props) {

  const [initialRegion, setInitialRegion] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [mapRef, setMapRef] = useState(null);
  const [coords, setCoords] = useState([]);
  const [startLatLon, setStartLatLon] = useState({latitude: 0, longitude: 0});
  const [endLatLon, setEndLatLon] = useState({latitude: 0, longitude: 0});

  const updateAwaitingCustomers = async () => {
    try {
      const {data} = await http.get('/api/v1/schedules/customers/' + props.schedule.id);
      setCustomers(data.customers);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        const parsedUser = JSON.parse(user);
        const {currentLatitude, currentLongitude} = parsedUser.userDetails;
        setInitialRegion({
          latitude: currentLatitude,
          longitude: currentLongitude,
          latitudeDelta: 0.0030,
          longitudeDelta: 0.0030
        });
      } catch (e) {
        console.log(e);
      }
    })();

    setCoords(props.item.locationPoints);
    setStartLatLon({latitude: props.item.startingLatitude, longitude: props.item.startingLongitude});
    setEndLatLon({latitude: props.item.endingLatitude, longitude: props.item.endingLongitude});

    const timer = setInterval(() => {
      updateAwaitingCustomers().then();
    }, 5000);

    return () => {
      clearInterval(timer);
      console.log('Cleared timer');
    };
  }, []);

  return (
    <MapView
      style={tw`flex-1`}
      showsUserLocation={true}
      initialRegion={initialRegion}
      ref={(ref) => {
        setMapRef(ref);
      }}
      onLayout={() => mapRef.fitToCoordinates(coords, {
        edgePadding: {top: 10, right: 10, bottom: 10, left: 10},
        animated: true
      })}
    >
      {coords.length > 2 && <MapViewDirections
        lineDashPattern={[1]}
        origin={startLatLon}
        destination={endLatLon}
        waypoints={(coords.length > 2) ? coords : null}
        apikey={GOOGLE_MAPS_APIKEY}
        strokeWidth={4}
        strokeColor="#E6AD00"
        optimizeWaypoints={false}
        mode={'DRIVING'}
        onReady={result => {
          console.log(`Distance: ${result.distance} km`)
          console.log(`Duration: ${result.duration} min.`)

          mapRef.fitToCoordinates(result.coordinates, {
            edgePadding: {top: 10, right: 10, bottom: 10, left: 10},
            animated: true
          });
        }}
        onError={(errorMessage) => {
          console.log('GOT AN ERROR', errorMessage);
        }}
      />}
      {customers.map((customer, index) => (<Marker
        key={index}
        coordinate={{
          latitude: customer.latitude,
          longitude: customer.longitude
        }}
        title={'Home'}
        identifier={'destination'}
      >
        <Image source={require('../assets/customer.png')} style={{height: 40, width: 35}}/>
      </Marker>))}
    </MapView>
  );
}

export default OnRouteMap;
