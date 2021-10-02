import React, {useEffect} from 'react';
import * as eva from '@eva-design/eva';
import AppNavigator from './navigation';
import {ApplicationProvider, IconRegistry} from "@ui-kitten/components";
import {EvaIconsPack} from "@ui-kitten/eva-icons";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {

    useEffect(() => {
        (async () => {
            try {
                let {status} = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.log('Permission to access location was denied');
                    return;
                }

                let location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Lowest
                });
                await AsyncStorage.setItem('currentLocation', JSON.stringify(location.coords));
            } catch (e) {
                console.log('Current location fetching error');
            }
        })();
    }, []);


    return (<>
        <IconRegistry icons={EvaIconsPack}/>
        <ApplicationProvider {...eva} theme={eva.light}>
            <AppNavigator/>
        </ApplicationProvider>
    </>);
}
