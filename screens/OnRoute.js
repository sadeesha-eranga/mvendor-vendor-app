import React, { useEffect, useState } from 'react';
import tw from "tailwind-react-native-classnames";
import { Alert, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import OnRouteMap from '../components/OnRouteMap';
import http from '../utils/http';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnRoute(props) {

  const [stopped, setStopped] = useState(false);

  const updateLocation = async () => {
    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Lowest
    });
    console.log('updating location',  location.coords);
    const vendorId = await AsyncStorage.getItem('userId');

    http.put('/api/v1/vendors/location/', {
      id: vendorId,
      ...location.coords
    }).then().catch(e => console.log(e));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      updateLocation().then();
    }, 5000);

    return () => {
      clearInterval(timer);
      console.log('Cleared timer');
    };
  }, []);

  useEffect(() => {
    props.navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      if (!stopped) {
        setStopped(true);
        Alert.alert('Stop routing?', 'Do you want to stop current routing session?', [
          {
            text: 'Cancel', style: 'cancel', onPress: () => {console.log('Cancelled')}
          },
          {
            text: 'Yes', 'style': 'destructive', onPress: async () => {
              await stopRouting();
              props.navigation.dispatch(e.data.action);
            }
          }
        ]);
      }
    });
  }, [props.navigation]);

  const stopRouting = async () => {
    try {
      const {data} = await http.patch('/api/v1/schedules', {
        id: props.route.params.schedule.id,
        status: 'PENDING'
      });
      if (data.success) {
        alert('Routing stopped');
      } else {
        alert('Something went wrong');
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View>
      <View style={tw`h-5/6`}>
        <OnRouteMap item={props.route.params.item} schedule={props.route.params.schedule}/>
      </View>
      <View style={tw`h-1/6 bg-white`}>
        <TouchableOpacity style={styles.btn}
                          onPress={props.navigation.goBack}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Stop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#ff0000',
    padding: 20,
    height: 60,
    margin: 10,
    marginTop: 20
  }
});

