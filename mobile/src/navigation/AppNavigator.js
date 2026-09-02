import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { HomeScreen } from '../screens/HomeScreen';
import { SalonDetailScreen } from '../screens/SalonDetailScreen';
import { BookingScreen } from '../screens/BookingScreen';
import { MyBookingsScreen } from '../screens/MyBookingsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#be185d' }}>
    <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Explore' }} />
    <Tab.Screen name="MyBookings" component={MyBookingsScreen} options={{ title: 'Bookings' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
  </Tab.Navigator>
);

export const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Main" component={MainTabs} />
    <Stack.Screen name="SalonDetail" component={SalonDetailScreen} options={{ headerShown: true, title: 'Salon Details' }} />
    <Stack.Screen name="Booking" component={BookingScreen} options={{ headerShown: true, title: 'Book Appointment' }} />
  </Stack.Navigator>
);
