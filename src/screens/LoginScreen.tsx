import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../contexts/AuthContext';
import { SPACING } from '../styles/Theme';
import { useTheme } from '../contexts/ThemeContext';

export default function LoginScreen() {
    const navigation = useNavigation<any>();
    const { signIn } = useAuth();
    const { colors } = useTheme();
    const { t } = useTranslation();
    const styles = useMemo(() => createStyles(colors), [colors]);
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert(t('common.warning'), t('auth.emailRequired'));
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            Alert.alert(t('common.warning'), t('auth.invalidEmail'));
            return;
        }

        setLoading(true);
        try {
            await signIn({
                email_usuario: email,
                senha_usuario: password,
            });
        } catch (error: any) {
            let errorMessage = t('auth.loginFailed');
            
            if (error.message) {
                errorMessage = error.message;
            } else if (error.response?.data) {
                const data = error.response.data;
                errorMessage = data.message || data.detail || data.error || errorMessage;
                
                if (typeof errorMessage !== 'string') {
                    errorMessage = t('auth.loginFailed');
                }
            }
            
            Alert.alert(t('common.error'), errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView 
                style={styles.scrollView} 
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <Text style={styles.title}>{t('home.title')}</Text>
                    <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
                </View>

                <View style={styles.form}>
                    <InputField
                        label={t('auth.email')}
                        value={email}
                        onChangeText={setEmail}
                        placeholder={t('auth.enterEmail')}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        fullWidth
                    />

                    <InputField
                        label={t('auth.password')}
                        value={password}
                        onChangeText={setPassword}
                        placeholder={t('auth.enterPassword')}
                        secureTextEntry
                        fullWidth
                    />

                    <View style={styles.buttonContainer}>
                        <PrimaryButton
                            title={t('auth.login')}
                            onPress={handleLogin}
                            loading={loading}
                            fullWidth
                        />
                    </View>

                    <TouchableOpacity 
                        style={styles.registerButton}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text style={styles.registerText}>
                            {t('auth.noAccount')} <Text style={styles.registerTextBold}>{t('auth.signUp')}</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.BACKGROUND,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: SPACING.large,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xl * 2,
    },
    logo: {
        fontSize: 80,
        marginBottom: SPACING.medium,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.PRIMARY,
        marginBottom: SPACING.small,
    },
    subtitle: {
        fontSize: 16,
        color: colors.TEXT_SECONDARY,
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    buttonContainer: {
        marginTop: SPACING.large,
    },
    registerButton: {
        marginTop: SPACING.xl,
        alignItems: 'center',
    },
    registerText: {
        fontSize: 14,
        color: colors.TEXT_SECONDARY,
    },
    registerTextBold: {
        color: colors.PRIMARY,
        fontWeight: 'bold',
    },
});