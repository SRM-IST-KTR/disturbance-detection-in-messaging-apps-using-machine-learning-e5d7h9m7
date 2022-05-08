import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, BackHandler } from 'react-native';
import ChatListItem from "../components/ChatListItem";
import NewMessageButton from "../components/NewMessageButton";
import Colors from "../constants/Colors";
import useColorScheme from '../hooks/useColorScheme';
import { useFocusEffect } from '@react-navigation/native';

import { Auth, API, graphqlOperation } from 'aws-amplify'
import { getChatListItem } from "../src/graphql/queries";
import { onMessageCreatedByChatRoomID, onChatRoomUserCreatedByUserID } from "../src/graphql/subscriptions";
import { ImportantChats, UnimportantChats, workmode, Refresh, StarLock, ImportantMessages } from "../atoms/WorkMode";
import { UserUpdate, TintColor, UserData } from "../atoms/HelperStates";
import { useRecoilState } from "recoil";


import EditScreenInfo from '../components/EditScreenInfo';
import { View, Text } from '../components/Themed';

export default function ChatScreen() {

  const colorScheme = useColorScheme();
  const [chatRooms, setChatRooms] = useState([])
  const [prompt, setPrompt] = useState(false)
  const [impChats, setImpChats] = useRecoilState(ImportantChats)
  const [unImpChats, setUnImpChats] = useRecoilState(UnimportantChats)
  const [workMode] = useRecoilState(workmode)
  const [refresh, setRefresh] = useRecoilState(Refresh)
  const [starLock, setStarLock] = useRecoilState(StarLock)
  const [impMsgs, setImpMsgs] = useRecoilState(ImportantMessages)
  const [userUpdate, setUserUpdate] = useRecoilState(UserUpdate)
  const [userData, setUserData] = useRecoilState(UserData)
  const [vdoCats, setVdoCats] = useState(userData.vdoCats)
  const subscriptions = []
  const [tintColor] = useRecoilState(TintColor)

  const fetchChatRooms = (async() => {
     try{
       const userInfo = await Auth.currentAuthenticatedUser()
       const userData = await API.graphql(graphqlOperation(getChatListItem, {
         id: userInfo.attributes.sub
       }))
       const chats = userData.data.getUser.chatRoomUser.items.filter((item) => (item.chatRoom.lastMessage))
       chats.sort((a,b) => (new Date(a.chatRoom.lastMessage.createdAt) < new Date(b.chatRoom.lastMessage.createdAt)))
       setChatRooms(chats)
       setImpMsgs(userData.data.getUser.impMessages != undefined ? userData.data.getUser.impMessages : [])
       setImpChats(chats.filter((item) => item.isImportant))
       setUnImpChats(chats.filter((item) => !item.isImportant))
       setPrompt(true)
       return userData.data.getUser.chatRoomUser.items
     }
     catch(e) { console.log(e) }
  })

  const handleBackButtonClick = () => {
    BackHandler.exitApp()
    return true
  }

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
      };
    }, [])
  );

  useEffect(() => {
    if(prompt && (userData.vdoCats != vdoCats)){
      setPrompt(false)
      setVdoCats(userData.vdoCats)
      fetchChatRooms()
    }
  }, [userData])

  useEffect(() => {
    if(userUpdate){
      setUserUpdate(false)
      fetchChatRooms()
    }
  },[userUpdate])

  useEffect(() => {
    if(prompt && !workMode){
      setPrompt(false)
      fetchChatRooms()
    }
  },[workMode])

  useEffect(() => {
    if(prompt){
      setPrompt(false)
      fetchChatRooms().then(() => setStarLock(true))
    }
  },[refresh])

  useEffect(() => {
    const subscribe = (async() => {
      const chatRoomUsers = await fetchChatRooms()
      chatRoomUsers.forEach(element => {
        subscriptions.push(API.graphql({
          query: onMessageCreatedByChatRoomID,
          variables: { chatRoomID: element.chatRoom.id }
        }).subscribe({
          next: (data) => {
            fetchChatRooms()
          }
        })
       )
     })
   })()
   return () => { subscriptions.forEach(element => { element.unsubscribe() })}
 },[])

 useEffect(() => {
   var sub
   const subscribe = (async() => {
     const userInfo = await Auth.currentAuthenticatedUser()
     sub = API.graphql({
       query: onChatRoomUserCreatedByUserID,
       variables: { userID: userInfo.attributes.sub }
     }).subscribe({
       next: (data) => {
         subscriptions.push(API.graphql({
           query: onMessageCreatedByChatRoomID,
           variables: { chatRoomID: data.value.data.onChatRoomUserCreatedByUserID.chatRoom.id }
         }).subscribe({
           next: (data) => {
             fetchChatRooms()
           }
         })
        )
       }
     })
   })()
   return () => sub.unsubscribe()
  },[])

 if(!prompt)
   return(
     <View style={styles.container}>
       <ActivityIndicator size={'large'} color={colorScheme == 'light' ? Colors.customThemes[tintColor]['light'].tint : Colors.customThemes[tintColor].dark.tabs} style={styles.loading}/>
     </View>
   )

 return (
    <View style={[styles.container, {paddingHorizontal: chatRooms.length == 0 && prompt ? 10 : 0}]}>
      {chatRooms.length==0 && prompt && <Text style={styles.text}>{'No existing chats\nOpen contacts to start a conversation'}</Text>}
      {workMode && chatRooms.length!==0 && unImpChats.length==0 && <Text style={styles.text}>{'All chats are marked as \'Important\'\nSwipe Right !!!'}</Text>}
      <FlatList
        data = {workMode ? unImpChats : chatRooms}
        renderItem = {({item}) => <ChatListItem chatRoomUser={item} myID={item.userID} />}
        keyExtractor = {(item => item.chatRoom.id)}
      />
      <NewMessageButton/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    color: 'grey',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: '53%'
  },
  loading: {
    bottom: '15%'
  }
});
