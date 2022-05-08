import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, StatusBar, Pressable, BackHandler, Text, View, Animated, Platform } from 'react-native';
import { useRoute, useNavigation } from "@react-navigation/native";
import { HeaderBackButton } from "@react-navigation/stack";
import { PinchGestureHandler, State } from 'react-native-gesture-handler';
import { downloadToFolder } from "expo-file-dl";
import * as Notifications from "expo-notifications";
import { AndroidImportance, AndroidNotificationVisibility, NotificationChannel, NotificationChannelInput, NotificationContentInput } from "expo-notifications";
import { Feather } from '@expo/vector-icons';
import moment from "moment";
import { Storage } from "aws-amplify";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  }),
});

const channelId = "DownloadInfo"

export default function ImageFullScreen() {

  const route = useRoute()
  const navigation = useNavigation()
  const [visibility, setVisibility] = useState(false)
  const [downloading, setDownloading] = useState(false)

  async function setNotificationChannel() {
    const loadingChannel: NotificationChannel | null = await Notifications.getNotificationChannelAsync(
      channelId
    );

    if (loadingChannel == null) {
      const channelOptions: NotificationChannelInput = {
        name: channelId,
        importance: AndroidImportance.HIGH,
        lockscreenVisibility: AndroidNotificationVisibility.PUBLIC,
        sound: "default",
        vibrationPattern: [250],
        enableVibrate: true,
      };
      await Notifications.setNotificationChannelAsync(
        channelId,
        channelOptions
      );
    }
  }

  useEffect(() => {
    setNotificationChannel();
  },[]);

  const scale = new Animated.Value(1);

  const onPinchEvent = Animated.event([{ nativeEvent: { scale }}], {
    useNativeDriver: true,
  });

  const onPinchStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 1,
      }).start();
    }
  };

  function handleBackButtonClick() {
    StatusBar.setHidden(false)
    StatusBar.setBarStyle('light-content')
    StatusBar.setBackgroundColor('transparent', true)
    navigation.navigate('ChatRoom')
    return true;
  }

  const hasNotch = () => {
    if (Platform.OS === 'android') {
      return StatusBar.currentHeight > 24
    }
    return true
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    };
  },[]);

  useEffect(() => {
    if(!hasNotch()) StatusBar.setHidden(visibility)
    StatusBar.setBarStyle('light-content')
    StatusBar.setBackgroundColor('#00000080', true)
  },[visibility])

  const download = async() => {
    if(!downloading){
      setDownloading(true)
      const downloadURL = route.params.key == '' ? route.params.img : await Storage.get(route.params.key)
      await downloadToFolder(downloadURL, 'MIM-'+moment.now()+'.jpg', "MIM App", channelId)
      setDownloading(false)
    }
  }

  return (
    <Pressable onPress={() => setVisibility(!visibility)} style={styles.image}>
      <View style={styles.container}>
        <PinchGestureHandler
          onGestureEvent={onPinchEvent}
          onHandlerStateChange={onPinchStateChange}
        >
          <Animated.Image source={{uri: route.params.img}} style={[styles.image,{transform: [{ scale }]}]} />
        </PinchGestureHandler>
      </View>
      {!visibility && (
        <View style={[styles.header, {top: StatusBar.currentHeight}]}>
          <HeaderBackButton onPress={handleBackButtonClick} style={{fontSize: 20}} tintColor={'white'}/>
          <View style={{flex: 1}}>
            <Text style={styles.name}>{route.params.name}</Text>
            <Text style={styles.timestamp}>{route.params.timestamp}</Text>
          </View>
          <Pressable onPress={download}>
            <Feather name="download" size={30} color="white" style={{marginRight: 15}}/>
          </Pressable>
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black'
  },
  image: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain'
  },
  header: {
    paddingTop: 10,
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#00000080',
    padding: 5,
    alignItems: 'center'
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  },
  timestamp: {
    color: 'white',
    fontSize: 16
  }
});
