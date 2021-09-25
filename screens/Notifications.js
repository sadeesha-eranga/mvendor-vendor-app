import * as React from 'react';
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "tailwind-react-native-classnames";
import {List, Text} from "@ui-kitten/components";

export default function Notifications() {

    const [notifications, setNotifications] = useState([]);

    const loadNotifications = async () => {
        try {
            const notifications = await AsyncStorage.getItem('@notifications');
            setNotifications(JSON.parse(notifications || []));
        } catch (e) {
        }
    }

    useEffect(() => {
        loadNotifications();
    }, []);
    return (
        <Text>Hello</Text>
    );
}

