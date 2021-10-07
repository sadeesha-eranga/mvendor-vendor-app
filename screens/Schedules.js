import React, {useEffect, useState} from 'react';
import tw from "tailwind-react-native-classnames";
import {List, Text} from "@ui-kitten/components";
import {Dimensions, StyleSheet, View} from "react-native";
import http from "../utils/http";
import {TouchableOpacity} from "react-native-gesture-handler";
import ScheduleListItem from '../components/ScheduleListItem';

export default function Schedules(props) {

  const [schedules, setSchedules] = useState([]);

  const fetchSchedules = async () => {
    try {
      const routeId = props.route.params.item.id;
      const {data} = await http.get(`/api/v1/schedules/${routeId}`);
      if (data.success) {
        setSchedules(data.schedules);
      }
    } catch (e) {
      console.log(e);
      if (e.response?.status === 401) {
        props.navigation.navigate('Login');
      }
    }
  };

  useEffect(() => {
    props.navigation.addListener('focus', () => fetchSchedules().then());
  }, []);

  const renderItem = ({item, index}) => (
    <ScheduleListItem navigation={props.navigation} item={item} index={index}/>
  );

  return (<View style={tw`bg-white`}>
    <View>
      <View style={[tw`pb-5 mt-3 bg-white`, {height: Dimensions.get('window').height / 3 * 2}]}>
        <List
          style={[tw`h-full bg-white`]}
          data={schedules}
          renderItem={renderItem}
        />
      </View>
      <View style={{height: Dimensions.get('window').height / 3}}>
        <TouchableOpacity style={styles.btn} onPress={() => props.navigation.navigate('CreateSchedule', {routeId: props.route.params.item.id})}>
          <Text style={{color: 'black', fontWeight: 'bold'}}>Add New Schedule</Text>
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

