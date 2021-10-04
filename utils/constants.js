import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SERVER_BASE_URL = 'http://192.168.1.5:8080/mvendor';
// export const SERVER_BASE_URL = 'http://52.90.2.195/mvendor';


export const setCurrentLocation = async () => {
  let {status} = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    console.log('Permission to access location was denied');
    return;
  }

  let location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Lowest
  });
  await AsyncStorage.setItem('currentLocation', JSON.stringify(location.coords));
  return location.coords;
}
