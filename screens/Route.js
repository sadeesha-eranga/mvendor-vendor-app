import React, { useEffect, useState } from 'react';
import tw from "tailwind-react-native-classnames";
import { List, Text } from "@ui-kitten/components";
import { Dimensions, StyleSheet, View } from "react-native";
import http from "../utils/http";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RouteListItem from "../components/RouteListItem";
import { TouchableOpacity } from "react-native-gesture-handler";
import { setCurrentLocation } from '../utils/constants';

export default function Route({navigation}) {

  const [routes, setRoutes] = useState([]);

  const fetchRoutes = async () => {
    const userId = await AsyncStorage.getItem('userId');
    try {
      const res = await http.get(`/api/v1/routes/vendors/${userId}`);
      if (res.data.success) {
        setRoutes(res.data.routes);
      }
    } catch (e) {
      console.log(e);
      if (e.response?.status === 401) {
        navigation.navigate('Login')
      }
    }
  };

  const checkActiveSchedule = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const {data} = await http.get('/api/v1/vendors/details/' + userId);
      if (data.success && data.body.activeScheduleId > 0) {
        console.log(data.body.activeScheduleId)
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    navigation.addListener('focus', () => fetchRoutes().then());
    (async () => {
      try {
        setCurrentLocation().then();
        checkActiveSchedule().then();
      } catch (e) {
        console.log('Current location fetching error');
      }
    })();
  }, []);

  const renderItem = ({item}) => (<RouteListItem navigation={navigation} item={item}/>);

  return (<View style={tw`bg-white`}>
    <View>
      <Text style={tw`p-5 ios:mt-10 android:pt-12 text-3xl font-bold tracking-tight`}>My Vendors</Text>
      <View style={[tw`pb-5 bg-white`, {height: Dimensions.get('window').height / 3 * 2}]}>
        <List
          style={[tw`h-full bg-white`]}
          data={routes}
          renderItem={renderItem}
        />
      </View>
      <View style={{height: Dimensions.get('window').height / 3}}>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('CreateRoute')}>
          <Text style={{color: 'black', fontWeight: 'bold'}}>Add New Route</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>);
}

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#FFC300',
    padding: 20,
    height: 60,
    margin: 20,
    marginTop: 20
  },
  backgroundImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 6,
  },
  container: {
    backgroundColor: 'transparent',
  },
});

