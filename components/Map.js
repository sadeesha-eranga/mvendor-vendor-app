import React, {useEffect, useState} from 'react';
import MapView from "react-native-maps";
import tw from "tailwind-react-native-classnames";
import {GOOGLE_MAPS_APIKEY} from "@env";
import MapViewDirections from "react-native-maps-directions";

function Map(props) {
    const [cords, setCords] = useState([]);
    const [startLatLon, setStartLatLon] = useState({latitude: 0, longitude: 0});
    const [endLatLon, setEndLatLon] = useState({latitude: 0, longitude: 0});
    const [mapRef, setMapRef] = useState(null);

    useEffect(() => {
        const vendor = props?.route?.params?.vendor;
        setCords(vendor?.locationPoints || []);
        setStartLatLon({latitude: vendor?.startLatitude, longitude: vendor?.startLongitude});
        setEndLatLon({latitude: vendor?.endLatitude, longitude: vendor?.endLongitude});
    }, []);

    return (
        <MapView
            style={tw`flex-1`}
            ref={(ref) => {
                setMapRef(ref);
            }}
            onLayout={() => mapRef.fitToCoordinates(cords, {
                edgePadding: {top: 10, right: 10, bottom: 10, left: 10},
                animated: true
            })}
        >
            {cords.length > 2 && <MapViewDirections
                lineDashPattern={[1]}
                origin={startLatLon}
                destination={endLatLon}
                waypoints={(cords.length > 2) ? cords : null}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={4}
                strokeColor="#E6AD00"
                optimizeWaypoints={false}
                mode={'WALKING'}
                onStart={(params) => {
                    console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                }}
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

export default Map;
