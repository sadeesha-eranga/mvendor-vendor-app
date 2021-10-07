import * as React from 'react';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { IndexPath, Input, Select, SelectItem } from "@ui-kitten/components";
import { TouchableOpacity } from "react-native-gesture-handler";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import http from '../utils/http';

export default function CreateSchedule(props) {

  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);
  const [startTimeText, setStartTimeText] = useState('Set start time');
  const [endTimeText, setEndTimeText] = useState('Set end time');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const changeStartTime = (time) => {
    const curTime = moment(time).format('HH:mm');
    console.log(curTime);
    setValues({...values, startTime: curTime});
    setStartTimeText(`Start time: ${moment(time).format('LT')}`);
    hideStartTimePicker();
  };

  const changeEndTime = (time) => {
    const curTime = moment(time).format('HH:mm');
    console.log(curTime);
    setValues({...values, endTime: curTime});
    setEndTimeText(`End time: ${moment(time).format('LT')}`);
    hideEndTimePicker();
  };

  const submit = async () => {
    if (Object.entries(values).length !== 3) {
      alert('Please fill the form');
      return;
    }
    const dayOfWeek = daysOfWeek[selectedIndex.row];
    try {
      const {data} = await http.post('/api/v1/schedules', {
        startTime: values.startTime,
        endTime: values.endTime,
        dayOfWeek,
        specialNote: values.specialNote,
        routeId: props.route.params.routeId,
        scheduleType: 'WEEKLY'
      });
      if (data.success) {
        alert('Schedule created successfully');
        setValues({});
        setStartTimeText('Set start time');
        setEndTimeText('Set end time');
        props.navigation.goBack();
      } else {
        alert('Failed to create schedule');
      }
    } catch (e) {
      console.log('Create schedule error', e);
      alert('Something went wrong!');
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
  }
  const displayValue = daysOfWeek.map(c => c)[selectedIndex.row];

  const renderOption = (dayOfWeek, i) => (
    <SelectItem key={i} title={dayOfWeek}/>
  );

  const showStartTimePicker = () => {
    setShowStartTime(true);
  }

  const hideStartTimePicker = () => {
    setShowStartTime(false);
  }

  const showEndTimePicker = () => {
    setShowEndTime(true);
  }

  const hideEndTimePicker = () => {
    setShowEndTime(false);
  }

  return (
    <KeyboardAvoidingView
      style={[tw`bg-white`, {flex: 1}]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? -30 : 0}
    >
      <ScrollView>
        <View style={tw`m-5 mt-1`}>
          <Select
            style={styles.input}
            placeholder='Schedule Type'
            size={'large'}
            status='basic'
            value={displayValue}
            selectedIndex={selectedIndex}
            onSelect={index => setSelectedIndex(index)}>
            {daysOfWeek.map(renderOption)}
          </Select>

          <TouchableOpacity style={styles.timePickerBtn} onPress={showStartTimePicker}>
            <Text style={{color: 'black', fontWeight: 'bold'}}>{startTimeText}</Text>
            <DateTimePickerModal
              isVisible={showStartTime}
              mode="time"
              onConfirm={changeStartTime}
              onCancel={hideStartTimePicker}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.timePickerBtn} onPress={showEndTimePicker}>
            <Text style={{color: 'black', fontWeight: 'bold'}}>{endTimeText}</Text>
            <DateTimePickerModal
              isVisible={showEndTime}
              mode="time"
              onConfirm={changeEndTime}
              onCancel={hideEndTimePicker}
            />
          </TouchableOpacity>
          <Input autoCapitalize={'none'}
                 autoCorrect={false}
                 size={'large'}
                 multiline={true}
                 status={errors.address ? 'danger' : 'basic'}
                 style={styles.input}
                 textStyle={{minHeight: 64}}
                 placeholder={'Special note'}
                 onChangeText={value => handleInputChange('specialNote', value)}/>

          <TouchableOpacity style={styles.btn} onPress={() => submit()}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>Save Schedule</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
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
  },
  timePickerBtn: {
    backgroundColor: 'rgba(236,238,242,0.58)',
    alignItems: 'flex-start',
    padding: 15,
    height: 50,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: 'rgba(209,209,209,0.51)',
    borderStyle: 'solid',
    borderWidth: 1
  }
});
