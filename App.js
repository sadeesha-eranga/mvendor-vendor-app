import React, {useEffect} from 'react';
import * as eva from '@eva-design/eva';
import AppNavigator from './navigation';
import {ApplicationProvider, IconRegistry} from "@ui-kitten/components";
import {EvaIconsPack} from "@ui-kitten/eva-icons";
import { setCurrentLocation } from './utils/constants';

export default function App() {

    useEffect(() => {
        (async () => {
            try {
                setCurrentLocation().then();
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
