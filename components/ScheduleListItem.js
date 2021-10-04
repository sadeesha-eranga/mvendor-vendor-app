import React from 'react';
import {StyleSheet} from "react-native";
import {Card, ListItem, Avatar, Icon} from "@ui-kitten/components";
import {TouchableOpacity} from "react-native-gesture-handler";
import moment from 'moment';

const ItemImage = () => {
  return (<Avatar
    shape='rounded'
    size='large'
    source={require('../assets/route-avatar.png')}
  />);
};

function ScheduleListItem({item, navigation}) {
  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={() => {
        console.log('View schedule details');
      }}>
        <ListItem
          style={styles.listItem}
          title={item.type === 'WEEKLY' ? item.dayOfWeek : item.dayOfMonth}
          description={`${moment(item.startTime, 'HH:mm:ss')
            .format('LT').toString()} - ${moment(item.endTime, 'HH:mm:ss')
            .format('LT').toString()}`}
          accessoryLeft={<ItemImage/>}
          accessoryRight={<Icon fill={'#FFC300'} name={"arrow-circle-right"}/>}
        />
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    marginHorizontal: 18,
    borderStyle: "solid",
    borderColor: '#E6AD00',
    backgroundColor: 'rgba(253,205,3,0.25)'
  },
  listItem: {
    margin: -8,
    backgroundColor: 'transparent',
  }
});

export default ScheduleListItem;
