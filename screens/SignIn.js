import * as React from 'react';
import {useContext, useState} from 'react';
import {Dimensions, ImageBackground, StyleSheet, Text, View} from 'react-native';
import {Icon, Input,} from "@ui-kitten/components";
import {TouchableOpacity} from "react-native-gesture-handler";
import {TouchableWithoutFeedback} from "@ui-kitten/components/devsupport";
import {AuthContext} from "../navigation/context";

export default function SignIn({navigation}) {

    const [email, setEmail] = useState('pns@gmail.com');
    const [password, setPassword] = useState('Vendor@123');
    const [secureTextEntry, setSecureTextEntry] = React.useState(true);

    const {signIn} = useContext(AuthContext);

    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    const renderIcon = (props) => (
        <TouchableWithoutFeedback onPress={toggleSecureEntry}>
            <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'}/>
        </TouchableWithoutFeedback>
    );

    return (
        <ImageBackground source={require('../assets/background-1-yellow.png')}
                         style={styles.backgroundImage}>
            <View style={styles.container}>
                <Text style={styles.title}>Login to Account</Text>
                <Input autoCapitalize={'none'}
                       size={'large'}
                       status={'basic'}
                       style={styles.input}
                       placeholder={'Email'}
                       onChangeText={setEmail}/>
                <Input size={'large'}
                       status={'basic'}
                       style={styles.input}
                       placeholder={'Password'}
                       onChangeText={setPassword}
                       accessoryRight={renderIcon}
                       secureTextEntry={secureTextEntry}/>
                <TouchableOpacity style={styles.btn} onPress={() => signIn(email, password)}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>Login</Text>
                </TouchableOpacity>
                <View style={styles.flexContainer}>
                    <Text style={styles.item}>Not yet registered?</Text>
                    <TouchableOpacity style={styles.item} onPress={() => navigation.push('SignUp')}>
                        <Text style={styles.linkText}>Go to Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>

    );
}


const styles = StyleSheet.create({
    container: {
        marginTop: 100,
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
