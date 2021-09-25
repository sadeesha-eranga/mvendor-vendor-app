import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import {Button, Icon} from "@ui-kitten/components";

const StarIcon = (props) => (
    <Icon {...props} name='star'/>
);

export default function Account(props) {

    return (
        <View style={tw`bg-white h-full`}>
            <Button style={styles.button} appearance='ghost' accessoryLeft={StarIcon}>
                <Text style={styles.buttonText}>PRIMARY</Text>
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    button: {
        margin: 2,
    },
    indicator: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'black'
    }
});
