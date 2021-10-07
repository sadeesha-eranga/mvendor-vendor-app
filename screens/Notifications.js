import * as React from 'react';
import { useEffect, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { List, Text } from "@ui-kitten/components";
import http from '../utils/http';
import NotificationListItem from '../components/NotificationListItem';
import { View } from 'react-native';
import tw from 'tailwind-react-native-classnames';

export default function Notifications({navigation}) {

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications().then();
  }, []);

  const loadNotifications = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const {data} = await http.get('/api/v1/notifications/vendors/' + userId);
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (e) {
      console.log(e);
      if (e.response?.status === 401) {
        navigation.navigate('Login');
      }
    }
  }

  const renderItem = ({item, index}) => (
    <NotificationListItem navigation={navigation} item={item} index={index}/>
  );

  return (<View style={tw`bg-white h-full`}>
    {notifications.length > 0 ? <List
      style={[tw`h-full bg-white`]}
      data={notifications}
      renderItem={renderItem}
    /> : <View style={tw`items-center pt-20`}><Text>No notifications</Text></View>}
  </View>);
}
