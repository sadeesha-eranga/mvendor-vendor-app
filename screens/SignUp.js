import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import {Alert, SafeAreaView, StyleSheet, Text, View} from 'react-native';

import tw from 'tailwind-react-native-classnames';
import {Icon, IndexPath, Input, Select, SelectItem} from "@ui-kitten/components";
import {TouchableWithoutFeedback} from "@ui-kitten/components/devsupport";
import {TouchableOpacity} from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {createAccount, getVendorCategories} from '../utils/requests';
import {AuthContext} from "../navigation/context";

export default function SignUp({navigation}) {

    const [values, setValues] = useState({});
    const [secureTextEntry, setSecureTextEntry] = React.useState(true);
    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));

    useEffect(() => {
        (async () => {
            try {
                const res = await getVendorCategories();
                if (res.data.success) {
                    setCategories(res.data.categories);
                }
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);

    const {signUp} = useContext(AuthContext);

    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    const renderIcon = (props) => (
        <TouchableWithoutFeedback onPress={toggleSecureEntry}>
            <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'}/>
        </TouchableWithoutFeedback>
    );

    const submit = async () => {
        if (Object.entries(values).length !== 7) {
            Alert.alert('Please fill the form');
            return;
        }
        if (!(values.password && values.password === values.confirmPassword)) {
            Alert.alert("Passwords doesn't match");
            return;
        }
        const category = categories[selectedIndex.row];
        try {
            const data = {
                ...values,
                categoryId: category.id
            }
            console.log(data)
            // const res = await createAccount(data);
            // signUp(res.data);
        } catch (e) {
            console.log('Create account error', e);
            Alert.alert('Something went wrong!');
        }
    }

    const handleInputChange = (input, value) => {
        setValues({
            ...values,
            [input]: value
        })
        setErrors({
            ...errors,
            [input]: (!value || value.trim() === '')
        });
        if (input === 'confirmPassword') {
            setErrors({
                ...errors,
                [input]: !((value && value.trim() !== '') && value === values.password)
            });
        }
    }
    const displayValue = categories.map(c => c.name)[selectedIndex.row];

    const renderOption = (category) => (
        <SelectItem title={category.name}/>
    );

    return (
        <SafeAreaView style={tw`bg-white h-full`}>
            <Text style={tw`p-5 ios:pt-2 android:pt-10 bg-white text-2xl`}>Create New
                Account</Text>
            <View style={tw`m-5`}>

                <Input autoCapitalize={'none'}
                       autoCorrect={false}
                       size={'large'}
                       status={errors.name ? 'danger' : 'basic'}
                       style={styles.input}
                       placeholder={'Name'}
                       onChangeText={value => handleInputChange('name', value)}/>
                <Input autoCapitalize={'none'}
                       autoCorrect={false}
                       size={'large'}
                       status={errors.email ? 'danger' : 'basic'}
                       style={styles.input}
                       placeholder={'Email'}
                       onChangeText={value => handleInputChange('email', value)}/>
                <Input autoCapitalize={'none'}
                       autoCorrect={false}
                       size={'large'}
                       status={errors.email ? 'danger' : 'basic'}
                       style={styles.input}
                       placeholder={'Mobile'}
                       onChangeText={value => handleInputChange('mobile', value)}/>
                <Input size={'large'}
                       status={errors.password ? 'danger' : 'basic'}
                       style={styles.input}
                       placeholder={'Password'}
                       onChangeText={value => handleInputChange('password', value)}
                       accessoryRight={renderIcon}
                       secureTextEntry={secureTextEntry}/>
                <Input size={'large'}
                       status={errors.confirmPassword ? 'danger' : 'basic'}
                       style={styles.input}
                       placeholder={'Confirm Password'}
                       onChangeText={value => handleInputChange('confirmPassword', value)}
                       accessoryRight={renderIcon}
                       secureTextEntry={secureTextEntry}/>
                <Input autoCapitalize={'none'}
                       autoCorrect={false}
                       size={'large'}
                       status={errors.vehicleNo ? 'danger' : 'basic'}
                       style={styles.input}
                       placeholder={'Vehicle No'}
                       onChangeText={value => handleInputChange('vehicleNo', value)}/>
                <Input autoCapitalize={'none'}
                       autoCorrect={false}
                       size={'large'}
                       multiline={true}
                       status={errors.address ? 'danger' : 'basic'}
                       style={styles.input}
                       textStyle={{minHeight: 64}}
                       placeholder={'Description'}
                       onChangeText={value => handleInputChange('description', value)}/>

                <Select
                    style={styles.input}
                    placeholder='Category'
                    size={'large'}
                    status='basic'
                    value={displayValue}
                    selectedIndex={selectedIndex}
                    onSelect={index => setSelectedIndex(index)}>
                    {categories.map(renderOption)}
                </Select>


                <TouchableOpacity style={styles.btn} onPress={() => submit()}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>Create Account</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    input: {
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
    locationBtn: {
        marginBottom: 10,
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#FDCD03',
        padding: 20,
        height: 60,
    }
});
