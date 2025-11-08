import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DARK_COLORS, LIGHT_COLORS } from '../styles/Theme';
import i18n from '../i18n';

type ThemeMode = 'dark' | 'light';

interface ThemeColors {
    PRIMARY: string;
    BACKGROUND: string;
    CONTAINER_BG: string;
    TEXT_PRIMARY: string;
    TEXT_SECONDARY: string;
    TEXT_MUTED: string;
    BORDER: string;
    INPUT_BG: string;
    SHADOW: string;
    SUCCESS: string;
    FAILURE: string;
}

interface ThemeContextData {
    theme: ThemeMode;
    colors: ThemeColors;
    toggleTheme: () => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<ThemeMode>('dark');

    useEffect(() => {
        loadTheme();
    }, []);

    async function loadTheme() {
        try {
            const storedTheme = await AsyncStorage.getItem('@iottu:theme');
            if (storedTheme === 'light' || storedTheme === 'dark') {
                setTheme(storedTheme);
            }
        } catch (error) {
            
        }
    }

    async function toggleTheme() {
        try {
            const newTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
            await AsyncStorage.setItem('@iottu:theme', newTheme);
            setTheme(newTheme);
        } catch (error) {
            
        }
    }

    const colors = theme === 'dark' ? DARK_COLORS : LIGHT_COLORS;

    return (
        <ThemeContext.Provider
            value={{
                theme,
                colors,
                toggleTheme,
                isDark: theme === 'dark',
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(i18n.t('common.useThemeError'));
    }

    return context;
}
