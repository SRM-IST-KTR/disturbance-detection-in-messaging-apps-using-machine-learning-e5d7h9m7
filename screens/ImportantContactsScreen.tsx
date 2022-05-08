import * as React from 'react';
import { StyleSheet, FlatList, ActivityIndicator, BackHandler } from 'react-native';
import ChatListItem from "../components/ChatListItem";
import { ImportantChats, workmode } from "../atoms/WorkMode";
import { useRecoilState } from "recoil";
import Colors from "../constants/Colors";
import useColorScheme from '../hooks/useColorScheme';
import { TintColor } from "../atoms/HelperStates";
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { Text, View } from '../components/Themed';

export default function ImportantContactsScreen() {

  const colorScheme = useColorScheme()
  const navigation = useNavigation()
  const [workMode] = useRecoilState(workmode)
  const [impChats] = useRecoilState(ImportantChats)
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

  if(!workMode)
    return (
      <View style={[styles.container, {paddingHorizontal: 10}]}>
        <Text style={[styles.text, {marginBottom: '55%'}]}>{'Work Mode is OFF\nTurn it ON to view Contacts marked as \'Important\''}</Text>
      </View>
    );

  if(impChats[0] === 'empty')
    return(
      <View style={styles.container}>
        <ActivityIndicator size={'large'} color={colorScheme == 'light' ? Colors.customThemes[tintColor]['light'].tint : Colors.customThemes[tintColor].dark.tabs} style={styles.loading}/>
      </View>
    )

  return(
    <View style={[styles.container, {paddingHorizontal: impChats.length == 0 ? 10 : 0}]}>
      {impChats.length==0 && <Text style={[styles.text, {marginTop: '55%'}]}>{'No chats were marked as \'Important\''}</Text>}
      <FlatList
        data = {impChats}
        renderItem = {({item}) => <ChatListItem chatRoomUser={item} myID={item.userID} />}
        keyExtractor = {(item => item.chatRoom.id)}
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
    textAlign: 'center'
  },
  loading: {
    bottom: '15%'
  }
});
