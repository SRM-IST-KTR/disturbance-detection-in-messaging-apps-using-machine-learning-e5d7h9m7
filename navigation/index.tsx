/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import { ColorSchemeName, View, StyleSheet, AsyncStorage } from 'react-native';
import { TouchableRipple } from "react-native-paper";
import { useRecoilState } from "recoil";
import { API, graphqlOperation } from "aws-amplify";
import useColorScheme from '../hooks/useColorScheme';

import NotFoundScreen from '../screens/NotFoundScreen';
import ChatRoomScreen from "../screens/ChatRoomScreen";
import ContactsScreen from "../screens/ContactsScreen";
import ImageFullScreen from "../screens/ImageFullScreen";
import SettingsScreen from "../screens/SettingsScreen";
import TintColorScreen from "../screens/TintColorScreen";
import EditDetailsScreen from "../screens/EditDetailsScreen";
import { RootStackParamList } from '../types';
import MainTabNavigator from './MainTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import Colors from '../constants/Colors';
import { Octicons, MaterialCommunityIcons, MaterialIcons, Fontisto, Ionicons } from "@expo/vector-icons";
import { workmode, ImportantChats, UnimportantChats, Refresh, StarLock, isImportant, SentMessages, ImportantMessages, ImpLock} from "../atoms/WorkMode";
import { Emoji, UserData, TintColor, AvatarLock } from "../atoms/HelperStates";
import Toast from 'react-native-root-toast';
import { updateChatRoomUser, updateUser } from "../src/graphql/mutations";

export default function Navigation({ colorScheme, userData }: { colorScheme: ColorSchemeName }) {

  const [, setUserData] = useRecoilState(UserData)
  useEffect(() => {
    setUserData(userData)
  },[])

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {

  const [color, setColor] = useState()
  const [icon, setIcon] = useState()
  const [globalWorkMode, setGlobalWorkMode] = useRecoilState(workmode)
  const [imp, setImp] = useRecoilState(isImportant)
  const [loaded, setLoaded] = useState(false)
  const [starLock, setStarLock] = useRecoilState(StarLock)
  const [, setSentMsgs] = useRecoilState(SentMessages)
  const [impMsgs, setImpMsgs] = useRecoilState(ImportantMessages)
  const [impLock] = useRecoilState(ImpLock)
  const [avatarLock] = useRecoilState(AvatarLock)
  const [emoji, setEmoji] = useRecoilState(Emoji)
  const colorScheme = useColorScheme()
  const [tintColor] = useRecoilState(TintColor)

  AsyncStorage.getItem('workmode').then(data => {
    const savedColor = data === 'ON' ? 'orange' : 'lightgreen'
    const savedIcon = data === 'ON' ? 'work' : 'work-off'
    const savedMode = data === 'ON' ? true : false
    setColor(savedColor)
    setIcon(savedIcon)
    setGlobalWorkMode(savedMode)
    setLoaded(true)
  });

  AsyncStorage.getItem('emoji').then(data => {
    if(data === 'true') setEmoji(true)
  });

  const toggleWorkmode = () => {
    const newColor = color === 'lightgreen' ? 'orange' : 'lightgreen'
    const newIcon = icon === 'work-off' ? 'work' : 'work-off'
    setColor(newColor)
    setIcon(newIcon)
    setGlobalWorkMode(!globalWorkMode)
    const keyword = newColor === 'orange' ? 'Enabled' : 'Disabled'
    Toast.show('Work Mode '+keyword+' !!!',{
      duration: 1000,
      position: -100,
      shadow: true,
      animation: true,
      backgroundColor: colorScheme == 'light' ? '#ffffff' : '#4D5656',
      textColor: Colors[colorScheme].text,
      shadowColor: colorScheme == 'light' ? 'black' : '#d0d3d4',
      opacity: 0.95
    })
    const value = newColor === 'orange' ? 'ON' : 'OFF'
    AsyncStorage.setItem('workmode', value);
  }

  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: Colors.customThemes[tintColor][colorScheme].tint,
        shadowOpacity: 0,
        elevation: 0
      },
      headerTintColor: Colors.light.background
    }}>
    <Stack.Screen name="Root" component={MainTabNavigator}
      options = {({ navigation }) => ({
        title: 'Deep Chat',
        headerTitleStyle: {
          color: colorScheme == 'light' ? 'white' : '#D0D3D4'
        },
        headerRight: () => (
          <View style={styles.rootHeader}>
            {loaded && <TouchableRipple onPress={toggleWorkmode} rippleColor={'#cccccc42'} >
              <View style={styles.headerButton}>
                <MaterialIcons name={icon} size={24} color={color} />
              </View>
            </TouchableRipple>}
            <Octicons name='search' size={22} color={colorScheme == 'light' ? 'white' : '#D0D3D4'}/>
            <TouchableRipple onPress={() => navigation.navigate('Settings')} rippleColor={'#cccccc42'}>
              <View style={styles.headerButton}>
                <Ionicons name='md-settings-sharp' size={23} color={colorScheme == 'light' ? 'white' : '#D0D3D4'}/>
              </View>
            </TouchableRipple>
          </View>
        )
      })}
    />
    <Stack.Screen
      name="ChatRoom"
      component={ChatRoomScreen}
      options={({ route, navigation }) => ({
        title: route.params.name,
        headerTitleStyle: {
          maxWidth: 195,
        },
        headerLeft: () => (
          <HeaderBackButton tintColor={'white'} onPress={() => {
              if(!impLock){
                if(route.params.recentImpMsgs.length > 0){
                  setImpMsgs(impMsgs.concat(route.params.recentImpMsgs))
                  API.graphql(graphqlOperation(updateUser, {
                    input: {
                      id: route.params.userID,
                      impMessages: impMsgs.concat(route.params.recentImpMsgs)
                    }
                  }))
                }
                navigation.navigate(!globalWorkMode ? 'Chats' : route.params.isImportant ? 'ImportantContacts' : 'Chats')
                setSentMsgs({})
              }
            }}
          />
        ),
        headerRight: () => {
          const [buttonColor, setButtonColor] = useState(route.params.isImportant ? 'gold' : 'white')
          const [importantChats, setImportantChats] = useRecoilState(ImportantChats)
          const [unImpChats, setUnImpChats] = useRecoilState(UnimportantChats)
          const [refresh, setRefresh] = useRecoilState(Refresh)
          const toggleImp = () => {
            if(!globalWorkMode) setStarLock(false)
            const newColor = buttonColor === 'gold' ? 'white' : 'gold'
            API.graphql(graphqlOperation(updateChatRoomUser, {
              input: {
                id: route.params.chatRoomUser.id,
                isImportant: newColor === 'gold'
              }
            }))
            if(route.params.chatRoomUser.chatRoom.lastMessage && globalWorkMode){
              var newChatRoomUser = Object.assign({}, route.params.chatRoomUser)
              newChatRoomUser.isImportant = newColor === 'gold'
              if(newColor === 'white'){
                setImportantChats(importantChats.filter((item) => item.id !== route.params.chatRoomUser.id))
                const chats = [...unImpChats, newChatRoomUser]
                chats.sort((a,b) => (new Date(a.chatRoom.lastMessage.createdAt) < new Date(b.chatRoom.lastMessage.createdAt)))
                setUnImpChats(chats)
              }
              else{
                setUnImpChats(unImpChats.filter((item) => item.id !== route.params.chatRoomUser.id))
                const chats = [...importantChats, newChatRoomUser]
                chats.sort((a,b) => (new Date(a.chatRoom.lastMessage.createdAt) < new Date(b.chatRoom.lastMessage.createdAt)))
                setImportantChats(chats)
              }
            }
            if(!globalWorkMode) setRefresh(!refresh)
            setButtonColor(newColor)
            route.params.isImportant = newColor === 'gold' ? true : false
            setImp(newColor === 'gold')
            const keyword = newColor === 'white' ? 'Unimportant' : 'Important'
            Toast.show('Contact marked as ' + keyword,{
              duration: 1000,
              position: -100,
              shadow: true,
              animation: true,
              backgroundColor: colorScheme == 'light' ? '#ffffff' : '#4D5656',
              textColor: Colors[colorScheme].text,
              shadowColor: colorScheme == 'light' ? 'black' : '#d0d3d4',
              opacity: 0.95
            })
          }
          return(
            <View style={{flexDirection: 'row', width: 120, justifyContent: 'space-between', marginRight: 10, alignItems: 'center'}}>
              <Fontisto name="star" size={22} color={buttonColor} onPress={globalWorkMode ? toggleImp : starLock ? toggleImp : () => {}}/>
              {loaded && <TouchableRipple onPress={toggleWorkmode} rippleColor={'#cccccc42'} >
                <View style={styles.workButton}>
                  <MaterialIcons name={icon} size={24} color={color} />
                </View>
              </TouchableRipple>}
              <MaterialCommunityIcons name='dots-vertical' size={24} color={'white'} />
            </View>
          )}
      })}
    />
    <Stack.Screen
      name="Contacts"
      component={ContactsScreen}
    />
    <Stack.Screen
      name="ImageFullScreen"
      component={ImageFullScreen}
      options={() => ({
        headerShown: false
      })}
    />
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
    />
    <Stack.Screen
      name="TintColorScreen"
      component={TintColorScreen}
      options={() => ({
        title: 'Tint Color'
      })}
    />
    <Stack.Screen
      name="EditDetailsScreen"
      component={EditDetailsScreen}
      options={({ navigation }) => ({
        title: 'Edit Profile',
        headerLeft: () => (
          <HeaderBackButton tintColor={'white'} onPress={() => {
              if(!avatarLock){
                navigation.goBack()
              }
            }}
          />
        )
      })}
    />
    <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  rootHeader: {
    flexDirection: 'row',
    width: 130,
    justifyContent: 'space-between',
    marginRight: 10,
    alignItems: 'center'
  },
  headerButton: {
    borderRadius: 50,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
