import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, ActivityIndicator, FlatList, BackHandler } from 'react-native';
import { ImportantMessages, workmode } from "../atoms/WorkMode";
import { useRecoilState } from "recoil";
import { Auth, API, graphqlOperation } from 'aws-amplify'
import { batchGetMessages } from "../src/graphql/queries";
import ChatMessage from "../components/ChatMessage";
import Colors from "../constants/Colors";
import useColorScheme from '../hooks/useColorScheme';
import { TintColor } from "../atoms/HelperStates";
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { Text, View } from '../components/Themed';

export default function ImportantMessagesScreen() {

  const colorScheme = useColorScheme()
  const navigation = useNavigation()
  const [importantMessages] = useRecoilState(ImportantMessages)
  const [myID, setMyID] = useState(null)
  const [messages, setMessages] = useState(['empty'])
  const [workMode] = useRecoilState(workmode)
  const active = useRef({current: true})
  const [tintColor] = useRecoilState(TintColor)

  const handleBackButtonClick = () => {
    navigation.navigate('Chats', { screen: 'ChatScreen'})
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
    const getID = (async() => {
      const userInfo = await Auth.currentAuthenticatedUser()
      setMyID(userInfo.attributes.sub)
    })()
  },[])

  useEffect(() => {
    if(!active.current){
      active.current = true
      return
    }
    if(importantMessages.length == 0 || importantMessages[0] !== 'empty'){
      if(importantMessages.length > 0){
        const getMessages = (async() => {
          const msgs = await API.graphql(graphqlOperation(batchGetMessages, {
            ids: importantMessages
          }))
          const orderedMsgs = msgs.data.batchGetMessages.sort((a,b) => (new Date(a.createdAt) < new Date(b.createdAt)))
          setMessages(orderedMsgs)
        })()
      }
      else setMessages([])
    }
  },[importantMessages])

  const renderSeparator = () => (
    <View style={[styles.separator, {backgroundColor: Colors[colorScheme].separator}]}/>
  );

  const removeMsg = (id) => {
    active.current = false
    setTimeout(() => {
      setMessages(messages.filter(msg => msg.id !== id))
    }, 500);
  }

  if(!workMode)
    return (
      <View style={[styles.container, {paddingHorizontal: 10}]}>
        <Text style={styles.text}>{'Work Mode is OFF\nTurn it ON to view Messages marked as \'Important\''}</Text>
      </View>
    );

  if(messages[0] === 'empty')
    return(
      <View style={styles.container}>
        <ActivityIndicator size={'large'} color={colorScheme == 'light' ? Colors.customThemes[tintColor]['light'].tint : Colors.customThemes[tintColor].dark.tabs} style={styles.loading}/>
      </View>
    )

  return(
    <View style={messages.length==0 ? [styles.container, {paddingHorizontal: 10}] : {flex: 1, paddingVertical: 10}}>
      {messages.length==0 && <Text style={[styles.text, {marginTop: '55%'}]}>{'No messages were marked as \'Important\''}</Text>}
      <FlatList
        data = {myID!==null ? messages : []}
        renderItem = {({item}) => <ChatMessage message={item} id={myID} removeMsg={removeMsg}/>}
        keyExtractor={(item) => item.user.name + item.createdAt}
        ItemSeparatorComponent={renderSeparator}
      />
    </View>
  )
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
    marginBottom: '55%'
  },
  loading: {
    bottom: '15%'
  },
  separator: {
    height: 1.5,
    margin: 5
  }
});
