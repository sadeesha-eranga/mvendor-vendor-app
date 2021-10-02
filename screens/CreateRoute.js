import React, {useState} from 'react';
import tw from "tailwind-react-native-classnames";
import {Alert, Platform, StyleSheet, View} from "react-native";
import CreateRouteMap from "../components/CreateRouteMap";
import {Button, Input, Layout} from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import http from "../utils/http";

export default function CreateRoute(props) {

    const [name, setName] = useState(null);
    const [coords, setCoords] = useState([]);
    const [location, setLocation] = useState(null);
    const [distance, setDistance] = useState(0);
    const [nameRef, setNameRef] = useState(null);

    const saveRoute = () => {
        if (coords.length < 2) {
            Alert.alert('Please mark the route properly');
            return;
        }
        if (!name || name.trim() === '') {
            Alert.alert('Please enter a valid route name');
            return;
        }
        Alert.alert(
            "Are your sure?",
            "Do you want to submit the changes?",
            [
                {
                    text: "Yes",
                    onPress: async () => {
                        const userId = await AsyncStorage.getItem('userId');
                        const {0: startingCoordinate, [coords.length - 1]: endingCoordinate} = coords;
                        const data = {
                            vendorId: userId,
                            name,
                            startingLatitude: startingCoordinate.latitude,
                            startingLongitude: startingCoordinate.longitude,
                            endingLatitude: endingCoordinate.latitude,
                            endingLongitude: endingCoordinate.longitude,
                            distance,
                            locationPointList: coords
                        }

                        try {
                            const res = await http.post('/api/v1/routes', data);

                            if (res.data.success) {
                                Alert.alert('Route created successfully');
                                reset();
                            } else {
                                Alert.alert('Something went wrong');
                            }
                        } catch (e) {
                            console.log(e);
                            Alert.alert('Something went wrong');
                        }
                    },
                },
                {text: "No"},
            ]
        );
    }

    const reset = () => {
        setCoords([]);
        setName(null);
        nameRef.clear();
    }

    const undo = () => {
        if (coords.length > 0) {
            setCoords(coords.slice(0, -1));
        }
    }

    return (
        <View>
            <View style={tw`h-5/6 bg-white`}>
                <CreateRouteMap
                    coords={coords}
                    location={location}
                    setCoords={setCoords}
                    setLocation={setLocation}
                    setDistance={setDistance}
                />
            </View>
            <View style={[tw`h-1/6 bg-white`]}>
                <Input autoCapitalize={'none'}
                       autoCorrect={false}
                       size={'large'}
                       status={'basic'}
                       style={styles.input}
                       placeholder={'Enter route name'}
                       ref={nameRef => setNameRef(nameRef)}
                       onChangeText={setName}/>
                <Layout style={[styles.container]} level='1'>
                    <Button style={styles.button}
                            status={'danger'}
                            appearance='outline'
                            onPress={reset}
                    >
                        Reset
                    </Button>
                    <Button style={styles.button}
                            status={'warning'}
                            onPress={undo}
                            appearance='outline'>
                        Remove last marker
                    </Button>
                    <Button style={styles.button}
                            onPress={saveRoute}
                            appearance='filled'>
                        Save Route
                    </Button>
                </Layout>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        borderStyle: 'solid',
        borderColor: 'gray',
        borderRadius: 5,
        margin: 20,
        marginTop: 10,
        marginBottom: 0
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    button: {
        margin: 2,
    },
});

