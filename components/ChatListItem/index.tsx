import React, { useEffect, useState }  from "react";
import { View, Text, Image } from "react-native";
import { ChatListItemProps } from "../../types";
import styles from "./style";
import moment from "moment";
import { Storage } from "aws-amplify";
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { TouchableRipple } from "react-native-paper";
import Toast from 'react-native-root-toast';
import { useRecoilState } from "recoil";
import { ImportantChats, UnimportantChats, workmode, ImportantMessages } from "../../atoms/WorkMode";
import { UserUpdate, TintColor, UserData } from "../../atoms/HelperStates";

import { API, graphqlOperation } from "aws-amplify";
import { onUserUpdatedByUserID } from "../../src/graphql/subscriptions";
import { updateChatRoomUser } from "../../src/graphql/mutations";

const ChatListItem = (props: ChatListItemProps) => {
  const { chatRoomUser, myID } = props
  const chatRoom = chatRoomUser.chatRoom
  const [user, setUser] = useState(null)
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [importantChats, setImportantChats] = useRecoilState(ImportantChats)
  const [unImpChats, setUnImpChats] = useRecoilState(UnimportantChats)
  const [workMode] = useRecoilState(workmode)
  const [important, toggleImp] = useState(chatRoomUser.isImportant)
  const [impMsgs] = useRecoilState(ImportantMessages)
  const [imgDisplay, setImgDisplay] = useState('none')
  const [userUpdate, setUserUpdate] = useRecoilState(UserUpdate)
  const [tintColor] = useRecoilState(TintColor)
  const [avatar, setAvatar] = useState('none')
  const [userData, setUserData] = useRecoilState(UserData)
  const [vdoCats, setVdoCats] = useState(userData.vdoCats)

  useEffect(() => {
    const fetchAvatar = (async() => {
      if(user && user.imageUri != 'none'){
        const url = await Storage.get(user.imageUri)
        setAvatar(url)
      }
    })()
  },[user])

  useEffect(() => {
    const otherUser = chatRoom.chatRoomUser.items.filter((elem) => (elem.user.id != myID))
    setUser(otherUser[0].user)
    const sub = API.graphql({
      query: onUserUpdatedByUserID,
      variables: { id: otherUser[0].user.id }
    }).subscribe({
      next: (data) => {
        setUser(data.value.data.onUserUpdatedByUserID)
        setUserUpdate(true)
      }
    })
    return () => sub.unsubscribe()
  },[])

  if(!user) { return null }

  const onClick = () => {
    const users = chatRoom.chatRoomUser.items.filter((elem) => elem.user.id !== myID)
    navigation.navigate('ChatRoom',{id: chatRoom.id, users, name: user.name, isImportant: important, chatRoomUser, recentImpMsgs: [], userID: myID })
  }

  const displayTime = () => {
    const diff = moment().diff(chatRoom.lastMessage.createdAt, 'days')
    if(diff > 1) return moment(chatRoom.lastMessage.createdAt).format('Do MMM \'YY');
    else if (diff == 1) return 'Yesterday'
    else return moment(chatRoom.lastMessage.createdAt).format('h:mm a')
  }

  const isBlockedVideo = () => {
    if(chatRoom.lastMessage.videoCats == null) return false
    var blockedCats = vdoCats
    blockedCats = blockedCats.filter(cat => chatRoom.lastMessage.videoCats.indexOf(cat.toLowerCase()) == -1)
    return blockedCats.length != vdoCats.length
  }

  const handleSpam = () => {
    const isSpam = chatRoom.lastMessage.isSpam
    return (isSpam != null && isSpam) || (isSpam == null && isBlockedVideo())
  }

  const displayMessage = () => {
    return workMode && !important && !impMsgs.includes(chatRoom.lastMessage.id) && handleSpam() ? 'Message flagged as Distracting' : chatRoom.lastMessage.isImage ? ' Photo' : chatRoom.lastMessage.content
  }

  const toggleImportant = () => {
    const prevStatus = important
    toggleImp(!important)
    const keyword = prevStatus ? 'Unimportant' : 'Important'
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
    var newChatRoomUser = Object.assign({}, chatRoomUser)
    newChatRoomUser.isImportant = !prevStatus
    if(prevStatus){
      setImportantChats(importantChats.filter((item) => item.id !== chatRoomUser.id))
      const chats = [...unImpChats, newChatRoomUser]
      chats.sort((a,b) => (new Date(a.chatRoom.lastMessage.createdAt) < new Date(b.chatRoom.lastMessage.createdAt)))
      setUnImpChats(chats)
    }
    else{
      setUnImpChats(unImpChats.filter((item) => item.id !== chatRoomUser.id))
      const chats = [...importantChats, newChatRoomUser]
      chats.sort((a,b) => (new Date(a.chatRoom.lastMessage.createdAt) < new Date(b.chatRoom.lastMessage.createdAt)))
      setImportantChats(chats)
    }
    API.graphql(graphqlOperation(updateChatRoomUser, {
      input: {
        id: chatRoomUser.id,
        isImportant: !prevStatus
      }
    }))
  }

  return(
    <TouchableRipple onPress={onClick} onLongPress={toggleImportant} rippleColor={Colors[colorScheme].rippleColor} style={{backgroundColor: important ? Colors.customThemes[tintColor][colorScheme].important : 'transparent'}}>
      <View style={styles.container}>

          <View style={styles.leftContainer}>

            {avatar != 'none' && <Image source={{uri: avatar}} style={[styles.avatar, { display: imgDisplay }]} onLoad={() => setImgDisplay('flex')}/>}
            {(avatar == 'none' || imgDisplay == 'none') &&
              <View style={[styles.avatar, {backgroundColor: Colors[colorScheme].contactBackground}]}>
                <Ionicons name="person" size={30} color={colorScheme == 'light' ? Colors.customThemes[tintColor].light.tint : Colors.customThemes[tintColor].dark.tabs} />
              </View>
            }

            <View style={styles.midContainer}>

              <View style={styles.upperContainer}>
                <Text numberOfLines={1} ellipsizeMode={'tail'} style={[styles.username,{color: Colors[colorScheme].text}]}>{user.name}</Text>
                <Text style={[styles.time, {color: colorScheme == 'light' ? 'grey' : '#d0d3d4'}]}>{displayTime()}</Text>
              </View>

              <View style={styles.messageContainer}>
              {chatRoom.lastMessage.user.id === myID && <Text style={[styles.lastMessage, {color: colorScheme == 'light' ? 'grey' : '#d0d3d4'}]}>You: </Text>}
                {!(workMode && !important && !impMsgs.includes(chatRoom.lastMessage.id) && handleSpam()) && chatRoom.lastMessage.isImage && <FontAwesome name="photo" size={16} color={colorScheme == 'light' ? 'grey' : '#d0d3d4'} />}
                <Text numberOfLines={1} ellipsizeMode={'tail'} style={workMode && !important && !impMsgs.includes(chatRoom.lastMessage.id) && handleSpam() ? [styles.lastMessage,{flex: 1, fontStyle: 'italic', color: colorScheme == 'light' ? 'grey' : '#d0d3d4'}] : [styles.lastMessage,{flex: 1, color: colorScheme == 'light' ? 'grey' : '#d0d3d4'}]}>{displayMessage()}</Text>
              </View>
            </View>

          </View>
      </View>
    </TouchableRipple>
  )
}

export default ChatListItem;
