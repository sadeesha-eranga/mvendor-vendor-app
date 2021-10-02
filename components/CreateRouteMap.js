import React, {useEffect, useState} from 'react';
import MapView, {Marker} from "react-native-maps";
import tw from "tailwind-react-native-classnames";
import {GOOGLE_MAPS_APIKEY} from "@env";
import MapViewDirections from "react-native-maps-directions";
import {Alert, StyleSheet, Text} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function CreateRouteMap({name, coords, distance, location, setCoords, setDistance, setLocation}) {

    const [mapRef, setMapRef] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const curLocationStr = await AsyncStorage.getItem('currentLocation');
                if (curLocationStr) {
                    const curLocation = JSON.parse(curLocationStr);
                    setLocation(curLocation);
                }
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);

    useEffect(() => {
        if (mapRef && location) {
            setTimeout(() => {
                mapRef.animateToRegion({
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.0030,
                    longitudeDelta: 0.0030,
                }, 300);
            }, 100)
        }
    }, [location, mapRef]);

    const onMapPress = (e) => {
        if (coords.length < 25) {
            setCoords([
                ...coords,
                e.nativeEvent.coordinate
            ]);
        } else {
            Alert.alert('Maximum waypoints count reached');
        }
    }

    return (
        (!!location) ? <MapView
            style={tw`flex-1`}
            ref={(ref) => {
                setMapRef(ref);
            }}
            onPress={onMapPress}
        >
            {coords.length > 1 && <MapViewDirections
                lineDashPattern={[1]}
                origin={coords[0]}
                destination={[...coords].pop()}
                waypoints={(coords.length > 1) ? coords : null}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={10}
                strokeColor="#E6AD00"
                optimizeWaypoints={false}
                mode={'WALKING'}
                onReady={result => {
                    setDistance(result.distance);
                    mapRef.fitToCoordinates(result.coordinates, {
                        edgePadding: {top: 10, right: 10, bottom: 10, left: 10},
                        animated: true
                    });
                }}
                onError={(errorMessage) => {
                    console.log('GOT AN ERROR', errorMessage);
                }}
            />}
            {coords.map((coordinate, i) => (
                <Marker
                    key={i}
                    coordinate={coordinate}
                    draggable={true}
                />
            ))}
        </MapView> : <MapView/>
    );
}

export default CreateRouteMap;
