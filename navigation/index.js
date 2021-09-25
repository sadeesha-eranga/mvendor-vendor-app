import React from 'react';
import {BottomNavigation, BottomNavigationTab, Icon} from "@ui-kitten/components";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer} from '@react-navigation/native';
import Account from '../screens/Account';
import Notifications from "../screens/Notifications";
import Route from '../screens/Route';

const Tabs = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const RouteStack = createStackNavigator();
const NotificationsStack = createStackNavigator();
const AccountStack = createStackNavigator();

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
        <NotificationsStack.Screen name="Notifications" component={Notifications} />
    </NotificationsStack.Navigator>
);

const AccountStackScreen = () => (
    <AccountStack.Navigator>
        <AccountStack.Screen name="Account" component={Account} />
    </AccountStack.Navigator>
);

const RouteStackScreen = () => (
    <RouteStack.Navigator>
        <RouteStack.Screen name="Routes" component={Route} />
    </RouteStack.Navigator>
);

export default () => (
    <NavigationContainer>
        <Tabs.Navigator tabBar={props => <BottomTabBar {...props} />}>
            <Tabs.Screen name="RouteStack" component={RouteStackScreen} options={{ headerShown: false }}/>
            <Tabs.Screen name="NotificationsStack" component={NotificationStackScreen} options={{ headerShown: false }}/>
            <Tabs.Screen name="AccountStack" component={AccountStackScreen} options={{ headerShown: false }}/>
        </Tabs.Navigator>
    </NavigationContainer>
);
