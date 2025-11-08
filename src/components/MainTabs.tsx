import React, { useMemo } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';

import HomeScreen from "../screens/HomeScreen";
import AntennaListScreen from "../screens/AntennaListScreen";
import MotoListScreen from "../screens/MotorcycleListScreen";
import PatioListScreen from "../screens/YardListScreen";
import TagListScreen from "../screens/TagListScreen";
import { useTheme } from "../contexts/ThemeContext";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const screenOptions = useMemo(() => ({
        tabBarActiveTintColor: colors.PRIMARY,
        tabBarInactiveTintColor: colors.TEXT_MUTED,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: {
            backgroundColor: colors.CONTAINER_BG,
            borderTopColor: colors.BORDER,
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
        },
    }), [colors]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.BACKGROUND }} edges={['bottom']}>
            <Tab.Navigator 
            screenOptions={({ route }) => ({
                ...screenOptions,
                tabBarIcon: ({ color, size }) => {
                    switch (route.name) {
                        case "AntennaListScreen":
                            return <MaterialCommunityIcons name="antenna" size={size} color={color} />;
                        case "MotoListScreen":
                            return <FontAwesome5 name="motorcycle" size={size} color={color} />;
                        case "HomeScreen":
                            return <FontAwesome name="home" size={size} color={color} />;
                        case "PatioListScreen":
                            return <FontAwesome5 name="parking" size={size} color={color} />;
                        case "TagListScreen":
                            return <FontAwesome name="tag" size={size} color={color} />;
                        default:
                            return <FontAwesome name="home" size={size} color={color} />;
                    }
                }
            })}
        >
            <Tab.Screen 
                name="AntennaListScreen" 
                component={AntennaListScreen} 
                options={{ 
                    title: t('antenna.antennas'),
                    headerShown: false
                }} 
            />
            <Tab.Screen 
                name="MotoListScreen" 
                component={MotoListScreen} 
                options={{ 
                    title: t('motorcycle.motorcycles'),
                    headerShown: false
                }} 
            />
                <Tab.Screen 
                    name="HomeScreen" 
                    component={HomeScreen} 
                    options={{ 
                        title: t('common.home'), 
                        headerShown: false
                    }} 
                />
            <Tab.Screen 
                name="PatioListScreen" 
                component={PatioListScreen} 
                options={{ 
                    title: t('yard.yards'),
                    headerShown: false
                }} 
            />
            <Tab.Screen 
                name="TagListScreen" 
                component={TagListScreen} 
                options={{ 
                    title: t('tag.tags'),
                    headerShown: false
                }} 
            />
        </Tab.Navigator>
        </SafeAreaView>
    );
}