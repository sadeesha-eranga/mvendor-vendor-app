import React from 'react';
import tw from "tailwind-react-native-classnames";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import OnRouteMap from '../components/OnRouteMap';
import http from '../utils/http';

export default function OnRoute(props) {

  const stopRouting = async () => {
    try {
      const {data} = await http.patch('/api/v1/schedules', {
        id: props.route.params.item.id,
        status: 'PENDING'
      });
      if (data.success) {
        alert('Routing stopped');
        props.navigation.goBack();
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
        <OnRouteMap item={props.route.params.item}/>
      </View>
      <View style={tw`h-1/6 bg-white`}>
        <TouchableOpacity style={styles.btn}
                          onPress={stopRouting}>
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

