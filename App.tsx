import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox } from "react-native";
import { RecoilRoot } from "recoil"

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import Amplify, { Auth, API, graphqlOperation } from 'aws-amplify'
import { getUser } from "./src/graphql/queries";
import { createUser } from "./src/graphql/mutations";
import config from './aws-exports'
import { RootSiblingParent } from 'react-native-root-siblings';
Amplify.configure(config)

import { withAuthenticator } from 'aws-amplify-react-native'

const App = () => {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [user, setUser] = useState(null)
  LogBox.ignoreLogs(['Setting a timer', 'Non-serializable values were found in the navigation state']);

  //run this snippet only when App is first mounted
  useEffect(() => {
    const fetchUser = (async() => {
      //get authenticated user from Auth
      const userInfo = await Auth.currentAuthenticatedUser()
      if(userInfo){
        //get user from Backend with the user ID from auth
        const userData = await API.graphql(graphqlOperation(getUser, {
          id: userInfo.attributes.sub
        }))
        const userDetails = userData.data.getUser
        if(userDetails){
          setUser({
            id: userDetails.id,
            name: userDetails.name,
            imageUri: userDetails.imageUri,
            status: userDetails.status,
            vdoCats: userDetails.videoCats == undefined ? [] : userDetails.videoCats
          })
          console.log('User is already present in database')
          return
        }

        //if there is no user with ID in db, then create one
        const newUser = {
          id: userInfo.attributes.sub,
          name: userInfo.username.charAt(0).toUpperCase() + userInfo.username.slice(1),
          imageUri: 'none',
          status: 'Focusing',
          videoCats: ['Games', 'Sports', 'Entertainment'] // allowing only educational YT videos by default
        }
        setUser(newUser)
        await API.graphql(graphqlOperation(createUser, {
          input: newUser
        }))
      }
    })()
  }, [])

  if (!isLoadingComplete || !user) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <RootSiblingParent>
          <RecoilRoot>
            <Navigation colorScheme={colorScheme} userData={user}/>
          </RecoilRoot>
          <StatusBar style={'light'}/>
        </RootSiblingParent>
      </SafeAreaProvider>
    );
  }
}

export default withAuthenticator(App)
