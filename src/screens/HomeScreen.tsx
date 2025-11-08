import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { SPACING } from '../styles/Theme';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function HomeScreen() {
    const { user, signOut } = useAuth();
    const { colors, isDark, toggleTheme } = useTheme();
    const { t, i18n } = useTranslation();

    const currentLanguage = i18n.language;

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    const handleLogout = () => {
        Alert.alert(
            t('auth.logout'),
            t('auth.logoutConfirm'),
            [
                {
                    text: t('common.cancel'),
                    style: 'cancel',
                },
                {
                    text: t('auth.logout'),
                    style: 'destructive',
                    onPress: signOut,
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
            <Text style={[styles.title, { color: colors.PRIMARY }]}>{t('home.title')}</Text>
            <Text style={[styles.subtitle, { color: colors.TEXT_SECONDARY }]}>{t('home.subtitle')}</Text>
            
            <View style={[styles.content, { backgroundColor: colors.CONTAINER_BG }]}>
                <Text style={[styles.welcomeText, { color: colors.TEXT_PRIMARY }]}>
                    {t('home.welcome', { name: user?.nome_usuario })}{'\n\n'}
                    {t('home.navigation')}
                </Text>

                <View style={[styles.userInfo, { borderTopColor: colors.BORDER }]}>
                    <Text style={[styles.userRole, { color: colors.TEXT_PRIMARY }]}>
                        {user?.role === 'ADMIN' ? t('home.admin') : t('home.user')}
                    </Text>
                    <Text style={[styles.userEmail, { color: colors.TEXT_SECONDARY }]}>{user?.email_usuario}</Text>
                </View>

                <View style={[styles.themeToggle, { borderTopColor: colors.BORDER }]}>
                    <Text style={[styles.themeLabel, { color: colors.TEXT_PRIMARY }]}>
                        {isDark ? t('home.darkMode') : t('home.lightMode')}
                    </Text>
                    <Switch
                        value={isDark}
                        onValueChange={toggleTheme}
                        trackColor={{ false: '#767577', true: colors.PRIMARY }}
                        thumbColor={isDark ? '#00FF99' : '#f4f3f4'}
                    />
                </View>

                <View style={[styles.languageSelector, { borderTopColor: colors.BORDER }]}>
                    <Text style={[styles.languageLabel, { color: colors.TEXT_PRIMARY }]}>
                        🌍 Idioma / Language / Idioma
                    </Text>
                    <View style={styles.languageButtons}>
                        <TouchableOpacity
                            style={[
                                styles.languageButton,
                                { 
                                    backgroundColor: currentLanguage === 'pt' ? colors.PRIMARY : colors.INPUT_BG,
                                    borderColor: colors.BORDER 
                                }
                            ]}
                            onPress={() => changeLanguage('pt')}
                        >
                            <Text style={[
                                styles.languageButtonText,
                                { color: currentLanguage === 'pt' ? '#000' : colors.TEXT_PRIMARY }
                            ]}>
                                🇧🇷 PT
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.languageButton,
                                { 
                                    backgroundColor: currentLanguage === 'en' ? colors.PRIMARY : colors.INPUT_BG,
                                    borderColor: colors.BORDER 
                                }
                            ]}
                            onPress={() => changeLanguage('en')}
                        >
                            <Text style={[
                                styles.languageButtonText,
                                { color: currentLanguage === 'en' ? '#000' : colors.TEXT_PRIMARY }
                            ]}>
                                🇺🇸 EN
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.languageButton,
                                { 
                                    backgroundColor: currentLanguage === 'es' ? colors.PRIMARY : colors.INPUT_BG,
                                    borderColor: colors.BORDER 
                                }
                            ]}
                            onPress={() => changeLanguage('es')}
                        >
                            <Text style={[
                                styles.languageButtonText,
                                { color: currentLanguage === 'es' ? '#000' : colors.TEXT_PRIMARY }
                            ]}>
                                🇪🇸 ES
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.FAILURE }]} onPress={handleLogout}>
                <Text style={styles.logoutText}>🚪 {t('auth.logout')}</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.large,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: SPACING.small,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: SPACING.xl,
    },
    content: {
        borderRadius: 12,
        padding: SPACING.large,
        width: '100%',
    },
    welcomeText: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    userName: {
        fontWeight: 'bold',
    },
    userInfo: {
        marginTop: SPACING.large,
        paddingTop: SPACING.medium,
        borderTopWidth: 1,
        alignItems: 'center',
    },
    userRole: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: SPACING.small,
    },
    userEmail: {
        fontSize: 12,
    },
    themeToggle: {
        marginTop: SPACING.large,
        paddingTop: SPACING.medium,
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    themeLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
    languageSelector: {
        marginTop: SPACING.large,
        paddingTop: SPACING.medium,
        borderTopWidth: 1,
    },
    languageLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: SPACING.medium,
        textAlign: 'center',
    },
    languageButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: SPACING.small,
    },
    languageButton: {
        flex: 1,
        paddingVertical: SPACING.medium,
        paddingHorizontal: SPACING.small,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
    },
    languageButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    logoutButton: {
        marginTop: SPACING.xl,
        paddingVertical: SPACING.medium,
        paddingHorizontal: SPACING.xl,
        borderRadius: 8,
    },
    logoutText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});