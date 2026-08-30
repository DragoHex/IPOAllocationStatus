import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { FetchScreen } from '../screens/FetchScreen';
import { StatusScreen } from '../screens/StatusScreen';
import { AccountsScreen } from '../screens/AccountsScreen';

const Tab = createBottomTabNavigator();

export const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          if (route.name === 'Fetch') {
            iconName = 'cloud-search';
          } else if (route.name === 'Status') {
            iconName = 'format-list-checks';
          } else if (route.name === 'Accounts') {
            iconName = 'account-group';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Fetch" component={FetchScreen} />
      <Tab.Screen name="Status" component={StatusScreen} />
      <Tab.Screen name="Accounts" component={AccountsScreen} />
    </Tab.Navigator>
  );
};
