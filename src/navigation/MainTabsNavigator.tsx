import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from './types';
import HomeDashboardScreen from '../screens/HomeDashboardScreen';
import FindMechanicsScreen from '../screens/FindMechanicsScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../utils/theme';
import { Text, TouchableOpacity } from 'react-native';
import { navigationRef } from './navigationRef';

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 11, fontWeight: focused ? '700' : '500', color: focused ? colors.primary : colors.muted }}>
      {label}
    </Text>
  );
}

export default function MainTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { color: colors.text, fontWeight: '700' },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeDashboardScreen}
        options={{ tabBarLabel: ({ focused }) => <TabLabel label="Home" focused={focused} /> }}
      />
      <Tab.Screen
        name="Find"
        component={FindMechanicsScreen}
        options={{
          title: 'Find mechanics',
          tabBarLabel: ({ focused }) => <TabLabel label="Find" focused={focused} />,
          headerRight: () => (
            <TouchableOpacity onPress={() => navigationRef.navigate('Map')} style={{ marginRight: 16 }}>
              <Text style={{ color: colors.primary, fontWeight: '800' }}>Map</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={MyBookingsScreen}
        options={{
          title: 'My bookings',
          tabBarLabel: ({ focused }) => <TabLabel label="Bookings" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: 'Notifications',
          tabBarLabel: ({ focused }) => <TabLabel label="Alerts" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: ({ focused }) => <TabLabel label="Profile" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}
