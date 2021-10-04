import React, {useEffect, useReducer, useState} from 'react';
import {BottomNavigation, BottomNavigationTab, Icon} from "@ui-kitten/components";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer} from '@react-navigation/native';
import Account from '../screens/Account';
import Notifications from "../screens/Notifications";
import Route from '../screens/Route';
import SignIn from "../screens/SignIn";
import SignUp from "../screens/SignUp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {AuthContext} from './context';
import {login, refreshTokens} from "../utils/requests";
import Loading from "../screens/Loading";
import RouteDetails from '../screens/RouteDetails';
import CreateRoute from '../screens/CreateRoute';
import {Platform, KeyboardAvoidingView} from "react-native";
import Schedules from '../screens/Schedules';

const Tabs = createBottomTabNavigator();
const RouteStack = createStackNavigator();
const NotificationsStack = createStackNavigator();
const AccountStack = createStackNavigator();
const AuthStack = createStackNavigator();

const BottomTabBar = ({navigation, state}) => (
    <BottomNavigation
        appearance={"noIndicator"}
        selectedIndex={state.index}
        onSelect={index => navigation.navigate(state.routeNames[index])}>
        <BottomNavigationTab title='Routes' icon={<Icon name='map'/>}/>
        <BottomNavigationTab title='Notifications' icon={<Icon name='bell'/>}/>
        <BottomNavigationTab title='Account' icon={<Icon name='person'/>}/>
    </BottomNavigation>
);

const NotificationStackScreen = () => (
    <NotificationsStack.Navigator>
        <NotificationsStack.Screen name="Notifications" component={Notifications}/>
    </NotificationsStack.Navigator>
);

const AccountStackScreen = () => (
    <AccountStack.Navigator>
        <AccountStack.Screen name="Account" component={Account}/>
    </AccountStack.Navigator>
);

const RouteStackScreen = () => (
    <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? -30 : 0}
    >
        <RouteStack.Navigator>
            <RouteStack.Screen name="Routes" component={Route} options={{headerShown: false}}/>
            <RouteStack.Screen name="CreateRoute" component={CreateRoute}/>
            <AuthStack.Screen name="Login" component={SignIn} options={{headerShown: false}}/>
            <RouteStack.Screen name="RouteDetails" component={RouteDetails}
                               options={({route}) => ({title: route.params.item.name})}/>
            <RouteStack.Screen name="Schedules" component={Schedules}/>
        </RouteStack.Navigator>
    </KeyboardAvoidingView>
);

const AuthStackScreen = () => (
    <AuthStack.Navigator>
        <AuthStack.Screen name="Login" component={SignIn} options={{headerShown: false}}/>
        <AuthStack.Screen name="SignUp" component={SignUp}/>
    </AuthStack.Navigator>
);

export default () => {

    const [isFetching, setIsFetching] = useState(false)

    const [state, dispatch] = useReducer(
        (prevState, action) => {
            switch (action.type) {
                case 'RESTORE':
                    return {
                        ...prevState,
                        accessToken: action.accessToken,
                        refreshToken: action.refreshToken,
                        userId: action.userId,
                        isLoading: false,
                    };
                case 'SIGN_IN':
                    return {
                        ...prevState,
                        isSignOut: false,
                        accessToken: action.accessToken,
                        refreshToken: action.refreshToken,
                        userId: action.userId,
                        isLoading: false,
                    };
                case 'SIGN_OUT':
                    return {
                        ...prevState,
                        isSignOut: true,
                        accessToken: null,
                        refreshToken: null,
                        userId: null,
                        isLoading: false
                    };
            }
        }, {
            isLoading: true,
            isSignOut: false,
            accessToken: null,
            refreshToken: null,
            userId: null
        }
    );

    const restoreTokens = async () => {
        console.log('restoring tokens')
        let accessToken, refreshToken, userId;
        try {
            accessToken = await AsyncStorage.getItem('accessToken');
            refreshToken = await AsyncStorage.getItem('refreshToken');
            userId = await AsyncStorage.getItem('userId');
        } catch (e) {
            console.log('Token restore error', e);
        }
        dispatch({
            type: 'RESTORE',
            accessToken,
            refreshToken,
            userId
        });
    }

    useEffect(() => {
        restoreTokens().then();
    }, []);

    const authContext = React.useMemo(
        () => ({
            signIn: async (username, password) => {
                let accessToken, refreshToken, userId;
                setIsFetching(true);
                try {
                    const res = await login(username, password);
                    const {access_token, refresh_token, user} = res.data;
                    accessToken = access_token;
                    refreshToken = refresh_token;
                    userId = user.userId.toString();
                    await AsyncStorage.setItem('accessToken', accessToken);
                    await AsyncStorage.setItem('refreshToken', refreshToken);
                    await AsyncStorage.setItem('userId', user.userId.toString());
                } catch (e) {
                    console.log(e);
                }
                dispatch({
                    type: 'SIGN_IN',
                    accessToken,
                    refreshToken,
                    userId
                });
                setIsFetching(false);
            },
            signOut: async () => {
                try {
                    await AsyncStorage.removeItem('accessToken');
                    await AsyncStorage.removeItem('refreshToken');
                    await AsyncStorage.removeItem('userId');
                } catch (e) {
                }
                dispatch({type: 'SIGN_OUT'})
            },
            signUp: async data => {
                console.log('signUp', data);
                const {access_token, refresh_token, user} = data;
                await AsyncStorage.setItem('accessToken', access_token);
                await AsyncStorage.setItem('refreshToken', refresh_token);
                await AsyncStorage.setItem('userId', user.userId.toString());
                dispatch({
                    type: 'SIGN_IN',
                    accessToken: access_token,
                    refreshToken: refresh_token,
                    userId: user.userId
                });
            },
            refresh: async () => {
                console.log('refreshing')
                try {
                    const refreshToken = await AsyncStorage.getItem('refreshToken');
                    const res = await refreshTokens(refreshToken);
                    console.log(res);
                    const {access_token, refresh_token, user} = res.data;
                    await AsyncStorage.setItem('accessToken', access_token);
                    await AsyncStorage.setItem('refreshToken', refresh_token);
                    await AsyncStorage.setItem('userId', user.userId.toString());
                } catch (e) {
                    console.log('Refresh token error', e);
                    await AsyncStorage.removeItem('accessToken');
                    await AsyncStorage.removeItem('refreshToken');
                    await AsyncStorage.removeItem('userId');
                }
            }
        }), []);

    return (
        <AuthContext.Provider value={authContext}>
            <NavigationContainer>
                {state.isLoading || isFetching ? <Loading/> : state.userId ?
                    <Tabs.Navigator tabBar={props => <BottomTabBar {...props} />}>
                        <Tabs.Screen name="RouteStack" component={RouteStackScreen} options={{headerShown: false}}/>
                        <Tabs.Screen name="NotificationsStack" component={NotificationStackScreen}
                                     options={{headerShown: false}}/>
                        <Tabs.Screen name="AccountStack" component={AccountStackScreen} options={{headerShown: false}}/>
                    </Tabs.Navigator> : <AuthStackScreen/>}
            </NavigationContainer>
        </AuthContext.Provider>
    );
};
