import React, { useEffect, useState } from 'react';
import MapView, { Marker } from "react-native-maps";
import tw from "tailwind-react-native-classnames";
import { Image } from 'react-native';
import http from '../utils/http';
import AsyncStorage from '@react-native-async-storage/async-storage';

function OnRouteMap(props) {
  const [initialRegion, setInitialRegion] = useState(null);
  const [customers, setCustomers] = useState([]);

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
    >
      {customers.map(customer => (<Marker
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
