/**
 * Learn more about createMainTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { MaterialIcons, Entypo, AntDesign } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ChatScreen from '../screens/ChatScreen';
import ImportantContactsScreen from '../screens/ImportantContactsScreen';
import ImportantMessagesScreen from "../screens/ImportantMessagesScreen";
import { MainTabParamList } from '../types';
import { useRecoilState } from "recoil";
import { TintColor } from "../atoms/HelperStates";

const MainTab = createMaterialTopTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const colorScheme = useColorScheme();
  const [tintColor] = useRecoilState(TintColor)
  return (
    <MainTab.Navigator
      initialRouteName="Chats"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Colors.customThemes[tintColor][colorScheme].tint,
        },
        tabBarIndicatorStyle: {
          backgroundColor: Colors.customThemes[tintColor][colorScheme].tabs,
          height: 4
        },
        tabBarShowIcons: true,
      }}>
      <MainTab.Screen
        name="Chats"
        component={ChatScreen}
        options = {{
          tabBarIcon: ({focused}) => <Entypo name="chat" size={24} color={colorScheme == 'light' ? Colors.customThemes[tintColor].light.tabs : focused ? Colors.customThemes[tintColor].dark.tabs : '#D0D3D4'} />,
          tabBarLabel: () => null
        }}
      />
      <MainTab.Screen
        name="ImportantContacts"
        component={ImportantContactsScreen}
        options = {{
          tabBarIcon: ({focused}) => <AntDesign name="contacts" size={24} color={colorScheme == 'light' ? Colors.customThemes[tintColor].light.tabs : focused ? Colors.customThemes[tintColor].dark.tabs : '#D0D3D4'} />,
          tabBarLabel: () => null
        }}
      />
      <MainTab.Screen
        name="ImportantMessages"
        component={ImportantMessagesScreen}
        options = {{
          tabBarIcon: ({focused}) => <MaterialIcons name="message" size={24} color={colorScheme == 'light' ? Colors.customThemes[tintColor].light.tabs : focused ? Colors.customThemes[tintColor].dark.tabs : '#D0D3D4'} />,
          tabBarLabel: () => null
        }}
      />
    </MainTab.Navigator>
  );
}
