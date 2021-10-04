import React from 'react';
import {StyleSheet} from "react-native";
import {Card, ListItem, Avatar, Icon} from "@ui-kitten/components";
import {TouchableOpacity} from "react-native-gesture-handler";

const ItemImage = () => {
  return (<Avatar
    shape='rounded'
    size='large'
    source={require('../assets/route-avatar.png')}
  />);
};

function NotificationListItem({item, navigation}) {

  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={() => {
        navigation.navigate('RouteDetails', {item: item});
      }}>
        <ListItem
          style={styles.listItem}
          title={item.title}
          description={item.message}
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

export default NotificationListItem;
