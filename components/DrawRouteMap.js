import React, {useEffect, useState} from 'react';
import MapView from "react-native-maps";
import tw from "tailwind-react-native-classnames";
import {GOOGLE_MAPS_APIKEY} from "@env";
import MapViewDirections from "react-native-maps-directions";

function DrawRouteMap(props) {
    const [coords, setCoords] = useState([]);
    const [startLatLon, setStartLatLon] = useState({latitude: 0, longitude: 0});
    const [endLatLon, setEndLatLon] = useState({latitude: 0, longitude: 0});
    const [mapRef, setMapRef] = useState(null);

    useEffect(() => {
        const route = props.item;
        setCoords(route?.locationPoints || []);
        setStartLatLon({latitude: route?.startingLatitude, longitude: route?.startingLongitude});
        setEndLatLon({latitude: route?.endingLatitude, longitude: route?.endingLongitude});
    }, []);

    return (
        <MapView
            style={tw`flex-1`}
            ref={(ref) => {
                setMapRef(ref);
            }}
            onLayout={() => mapRef.fitToCoordinates(coords, {
                edgePadding: {top: 10, right: 10, bottom: 10, left: 10},
                animated: true
            })}
        >
            {coords.length > 2 && <MapViewDirections
                lineDashPattern={[1]}
                origin={startLatLon}
                destination={endLatLon}
                waypoints={(coords.length > 2) ? coords : null}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={4}
                strokeColor="#E6AD00"
                optimizeWaypoints={false}
                mode={'DRIVING'}
                onReady={result => {
                    console.log(`Distance: ${result.distance} km`)
                    console.log(`Duration: ${result.duration} min.`)

                    mapRef.fitToCoordinates(result.coordinates, {
                        edgePadding: {top: 10, right: 10, bottom: 10, left: 10},
                        animated: true
                    });
                }}
                onError={(errorMessage) => {
                    console.log('GOT AN ERROR', errorMessage);
                }}
            />}

        </MapView>
    );
}

export default DrawRouteMap;
