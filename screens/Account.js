import * as React from 'react';
import {useContext} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from "react-native-gesture-handler";
import {AuthContext} from "../navigation/context";


export default function Account() {

    const {signOut} = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.btn} onPress={() => signOut()}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>Sign out</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 20
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 30
    },
    input: {
        borderStyle: 'solid',
        borderColor: 'gray',
        marginBottom: 20,
        borderRadius: 5,
    },
    btn: {
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: 'black',
        padding: 20,
        height: 60,
    },
    backgroundImage: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height / 2,
    },
    flexContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        marginTop: 30,
        marginLeft: 30
    },
    item: {
        fontWeight: "bold",
        marginRight: 10
    },
    linkText: {
        fontWeight: "bold",
        color: '#2e78b7',
    },
});
