import React from 'react';
import tw from "tailwind-react-native-classnames";
import { StyleSheet, Text, View } from "react-native";
import DrawRouteMap from "../components/DrawRouteMap";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function RouteDetails(props) {
  return (
    <View>
      <View style={tw`h-5/6`}>
        <DrawRouteMap route={props.route.params.item}/>
      </View>
      <View style={tw`h-1/6 bg-white`}>
        <TouchableOpacity style={styles.btn}
                          onPress={() => props.navigation.navigate('Schedules', {
                            item: props.route.params.item
                          })}>
          <Text style={{color: 'black', fontWeight: 'bold'}}>View Schedules</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#FFC300',
    padding: 20,
    height: 60,
    margin: 10,
    marginTop: 20
  }
});

