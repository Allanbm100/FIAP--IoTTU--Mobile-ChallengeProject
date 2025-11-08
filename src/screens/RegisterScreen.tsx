import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { createUser } from '../services/api';
import { SPACING } from '../styles/Theme';
import { useTheme } from '../contexts/ThemeContext';

interface UserFormData {
    nome_usuario: string;
    email_usuario: string;
    senha_usuario: string;
}

export default function RegisterScreen() {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const { t } = useTranslation();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const [formData, setFormData] = useState<UserFormData>({
        nome_usuario: '',
        email_usuario: '',
        senha_usuario: '',
    });

    const [errors, setErrors] = useState<Partial<UserFormData>>({});
    const [loading, setLoading] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: Partial<UserFormData> = {};

        if (!formData.nome_usuario.trim()) {
            newErrors.nome_usuario = t('user.nameRequired');
        } else if (formData.nome_usuario.length < 3) {
            newErrors.nome_usuario = t('user.nameMinLength');
        }

        if (!formData.email_usuario.trim()) {
            newErrors.email_usuario = t('user.emailRequired');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_usuario)) {
            newErrors.email_usuario = t('user.emailInvalid');
        }

        if (!formData.senha_usuario.trim()) {
            newErrors.senha_usuario = t('user.passwordRequired');
        } else if (formData.senha_usuario.length < 6) {
            newErrors.senha_usuario = t('user.passwordMinLength');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            await createUser(formData);
            Alert.alert(t('common.success'), t('auth.registerSuccess'), [
                { text: t('common.ok'), onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            let errorMessage = t('auth.registerFailed');
            
            if (error.response?.data) {
                const data = error.response.data;
                errorMessage = data.message || data.detail || data.error || data;
                
                if (typeof errorMessage !== 'string') {
                    errorMessage = t('auth.registerFailed');
                }
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            Alert.alert(t('common.error'), errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                <Text style={styles.title}>{t('user.registerTitle')}</Text>
                
                <InputField
                    label={t('auth.name')}
                    value={formData.nome_usuario}
                    onChangeText={(text) => setFormData({ ...formData, nome_usuario: text })}
                    placeholder={t('auth.enterName')}
                    maxLength={100}
                    error={errors.nome_usuario}
                    fullWidth
                />

                <InputField
                    label={t('auth.email')}
                    value={formData.email_usuario}
                    onChangeText={(text) => setFormData({ ...formData, email_usuario: text })}
                    placeholder={t('auth.enterEmail')}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    maxLength={100}
                    error={errors.email_usuario}
                    fullWidth
                />

                <InputField
                    label={t('auth.password')}
                    value={formData.senha_usuario}
                    onChangeText={(text) => setFormData({ ...formData, senha_usuario: text })}
                    placeholder={t('auth.passwordMinLength')}
                    secureTextEntry
                    maxLength={100}
                    error={errors.senha_usuario}
                    fullWidth
                />

                <View style={styles.buttonContainer}>
                    <PrimaryButton
                        title={t('auth.register')}
                        onPress={handleSubmit}
                        loading={loading}
                        fullWidth
                    />
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
        padding: SPACING.large,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.TEXT_PRIMARY,
        marginBottom: SPACING.xl,
        textAlign: 'center',
    },
    buttonContainer: {
        marginTop: SPACING.xl,
    },
});