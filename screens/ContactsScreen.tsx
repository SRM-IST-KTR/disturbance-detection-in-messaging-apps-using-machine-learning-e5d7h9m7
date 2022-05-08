import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, BackHandler } from 'react-native';
import ContactListItem from "../components/ContactListItem";
import Colors from "../constants/Colors";
import useColorScheme from '../hooks/useColorScheme';
import { useNavigation } from "@react-navigation/native";

import EditScreenInfo from '../components/EditScreenInfo';
import { View, Text } from '../components/Themed';

import { Auth, API, graphqlOperation } from 'aws-amplify'
import { listUsers } from "../src/graphql/queries";
import { onCreateUser } from "../src/graphql/subscriptions";
import { useRecoilState } from "recoil";
import { TintColor } from "../atoms/HelperStates";

export default function ChatScreen() {

  const colorScheme = useColorScheme();
  const navigation = useNavigation()
  const[users, setUsers] = useState([])
  const [prompt, setPrompt] = useState(false)
  const [tintColor] = useRecoilState(TintColor)

  const handleBackButtonClick = () => {
    navigation.goBack()
    return true
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    };
  },[]);

  useEffect(() => {
    const fetchUsers = (async() => {
      try{
        const usersData = await API.graphql(graphqlOperation(listUsers))
        const myData = await Auth.currentAuthenticatedUser()
        const contacts = usersData.data.listUsers.items.filter((user) => user.id != myData.attributes.sub)
        contacts.sort((a,b) => ((a.name).toLowerCase().localeCompare((b.name).toLowerCase())))
        setPrompt(true)
        setUsers(contacts)
      }
      catch (e) { console.log(e) }
    })
    fetchUsers()
    var sub
    const subscribe = (async() => {
      const userInfo = await Auth.currentAuthenticatedUser()
      sub = API.graphql(graphqlOperation(onCreateUser)).subscribe({
        next: (data) => {
          fetchUsers()
        }
      })
    })()
    return () => sub.unsubscribe()
  },[])

  if(!prompt)
    return(<ActivityIndicator size={'large'} color={colorScheme == 'light' ? Colors.customThemes[tintColor]['light'].tint : Colors.customThemes[tintColor].dark.tabs} style={styles.loading}/>)

  return (
    <View style={styles.container}>
      {users.length==0 && prompt && <Text style={styles.text}>{'You are the only one :(\nShare the app to interact with others'}</Text>}
      <FlatList
        style={{width:'100%'}}
        data = {users}
        renderItem = {({item}) => <ContactListItem data={item} />}
        keyExtractor = {(item => item.id)}
      />
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
    marginTop: '60%'
  },
  loading: {
    top: '45%'
  }
});
