import React, { useEffect } from 'react';
import tw from "tailwind-react-native-classnames";
import { StyleSheet, View } from "react-native";
import { Button, Icon, Layout, Text } from '@ui-kitten/components';
import moment from 'moment';

export default function ScheduleDetails(props) {

  useEffect(() => {
    console.log(props);
  }, []);

  return (
    <View>
      <View style={tw`h-3/4 bg-white`}>
        <Text style={[{margin: 20}]} category={'h2'}>{props.route.params._route.name}</Text>
        {/*<View style={{ flexDirection: 'row' }}>*/}
        {/*  <Icon name={"clock-outline"}/>*/}
        {/*  */}
        {/*</View>*/}
        <Text style={[{marginLeft: 20, marginBottom: 10}]} category={'h6'}>{props.route.params.item.dayOfWeek}</Text>
        <Text style={[{marginLeft: 20, marginBottom: 10}]} category={'h6'}>{`${moment(props.route.params.item.startTime, 'HH:mm:ss')
          .format('LT').toString()} - ${moment(props.route.params.item.endTime, 'HH:mm:ss')
          .format('LT').toString()}`}</Text>
        <Text style={[{marginLeft: 20, marginBottom: 10}]} category={'s1'}>{props.route.params.item.specialNote}</Text>
      </View>
      <View style={tw`h-1/4 bg-white`}>
        <Button appearance='outline' status={'primary'} style={[{margin: 20, marginBottom: 0, height: 60}]}
                onPress={() => console.log(props)}>
          Edit schedule
        </Button>

        <Layout style={styles.container} level='1'>
          <Button status={'danger'} style={[{width: '48%', height: 60,}]}>Cancel</Button>
          <Button status={'success'} style={[{width: '48%', height: 60,}]}>Start</Button>
        </Layout>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#FFC300',
    padding: 20,
    height: 60,
    margin: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20
  },
});

