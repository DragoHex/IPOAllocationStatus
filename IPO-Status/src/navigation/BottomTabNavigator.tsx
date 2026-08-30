import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { FetchScreen } from '../screens/FetchScreen';
import { StatusScreen } from '../screens/StatusScreen';
import { AccountsScreen } from '../screens/AccountsScreen';

const Tab = createBottomTabNavigator();

const TAB_GLYPHS: Record<string, string> = {
  Fetch: '⇩',
  Status: '☰',
  Accounts: '👤',
};

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => (
          <Text style={{ fontSize: size, color }}>{TAB_GLYPHS[route.name] ?? ''}</Text>
        ),
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { paddingBottom: 8, height: 60 },
      })}
    >
      <Tab.Screen name="Fetch" component={FetchScreen} />
      <Tab.Screen name="Status" component={StatusScreen} />
      <Tab.Screen name="Accounts" component={AccountsScreen} />
    </Tab.Navigator>
  );
};
