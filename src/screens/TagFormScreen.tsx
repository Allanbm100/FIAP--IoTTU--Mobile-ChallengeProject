import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { createTag, updateTag } from '../services/api';
import { SPACING } from '../styles/Theme';
import { useTheme } from '../contexts/ThemeContext';
import { extractErrorMessage } from '../utils/errorHandler';

interface TagFormData {
    codigo_rfid_tag: string;
    ssid_wifi_tag: string;
    latitude_tag: string;
    longitude_tag: string;
}

export default function TagFormScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const { tag } = (route.params as any) || {};
    const isEditing = !!tag;
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const [formData, setFormData] = useState<TagFormData>({
        codigo_rfid_tag: '',
        ssid_wifi_tag: '',
        latitude_tag: '',
        longitude_tag: '',
    });

    const [errors, setErrors] = useState<Partial<TagFormData>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditing && tag) {
            setFormData({
                codigo_rfid_tag: tag.codigo_rfid_tag ?? tag.codigoRFID ?? '',
                ssid_wifi_tag: tag.ssid_wifi_tag ?? '',
                latitude_tag: (tag.latitude_tag ?? '').toString(),
                longitude_tag: (tag.longitude_tag ?? '').toString(),
            });
        }
    }, [isEditing, tag]);

    const validateForm = (): boolean => {
        const newErrors: Partial<TagFormData> = {};

        if (!formData.codigo_rfid_tag.trim()) {
            newErrors.codigo_rfid_tag = t('tag.rfidRequired');
        } else if (formData.codigo_rfid_tag.length < 5) {
            newErrors.codigo_rfid_tag = t('tag.rfidMinLength');
        }

        if (!formData.ssid_wifi_tag.trim()) {
            newErrors.ssid_wifi_tag = t('tag.ssidRequired');
        } else if (formData.ssid_wifi_tag.length < 2) {
            newErrors.ssid_wifi_tag = t('tag.ssidMinLength');
        }

        if (!formData.latitude_tag.trim()) {
            newErrors.latitude_tag = t('validation.latitudeRequired');
        } else if (isNaN(Number(formData.latitude_tag))) {
            newErrors.latitude_tag = t('validation.latitudeInvalid');
        } else if (Number(formData.latitude_tag) < -90 || Number(formData.latitude_tag) > 90) {
            newErrors.latitude_tag = t('validation.latitudeRange');
        }

        if (!formData.longitude_tag.trim()) {
            newErrors.longitude_tag = t('validation.longitudeRequired');
        } else if (isNaN(Number(formData.longitude_tag))) {
            newErrors.longitude_tag = t('validation.longitudeInvalid');
        } else if (Number(formData.longitude_tag) < -180 || Number(formData.longitude_tag) > 180) {
            newErrors.longitude_tag = t('validation.longitudeRange');
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
            const tagData = {
                codigo_rfid_tag: formData.codigo_rfid_tag,
                ssid_wifi_tag: formData.ssid_wifi_tag,
                latitude_tag: Number(formData.latitude_tag),
                longitude_tag: Number(formData.longitude_tag),
            };

            if (isEditing && (tag?.id || tag?.id_tag)) {
                await updateTag(Number(tag.id || tag.id_tag), tagData);
                await queryClient.invalidateQueries({ queryKey: ['tags'] });
                await queryClient.refetchQueries({ queryKey: ['tags'] });
                Alert.alert(t('common.success'), t('tag.updateSuccess'), [
                    { text: t('common.ok'), onPress: () => navigation.goBack() }
                ]);
            } else {
                await createTag(tagData);
                await queryClient.invalidateQueries({ queryKey: ['tags'] });
                await queryClient.refetchQueries({ queryKey: ['tags'] });
                Alert.alert(t('common.success'), t('tag.createSuccess'), [
                    { text: t('common.ok'), onPress: () => navigation.goBack() }
                ]);
            }
        } catch (error: any) {
            const errorMessage = extractErrorMessage(error);
            Alert.alert(t('common.error'), errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                <Text style={styles.title}>{isEditing ? t('tag.edit') : t('tag.createTitle')}</Text>
                
                <InputField
                    label={t('tag.rfid')}
                    value={formData.codigo_rfid_tag}
                    onChangeText={(text) => setFormData({ ...formData, codigo_rfid_tag: text })}
                    placeholder={t('tag.enterRfid')}
                    maxLength={50}
                    error={errors.codigo_rfid_tag}
                    fullWidth
                />

                <InputField
                    label={t('tag.ssid')}
                    value={formData.ssid_wifi_tag}
                    onChangeText={(text) => setFormData({ ...formData, ssid_wifi_tag: text })}
                    placeholder={t('tag.enterSsid')}
                    maxLength={50}
                    error={errors.ssid_wifi_tag}
                    fullWidth
                />

                <InputField
                    label={t('common.latitude')}
                    value={formData.latitude_tag}
                    onChangeText={(text) => setFormData({ ...formData, latitude_tag: text })}
                    placeholder={t('common.enterLatitude')}
                    keyboardType="numeric"
                    error={errors.latitude_tag}
                    fullWidth
                />

                <InputField
                    label={t('common.longitude')}
                    value={formData.longitude_tag}
                    onChangeText={(text) => setFormData({ ...formData, longitude_tag: text })}
                    placeholder={t('common.enterLongitude')}
                    keyboardType="numeric"
                    error={errors.longitude_tag}
                    fullWidth
                />

                <View style={styles.buttonContainer}>
                    <PrimaryButton
                        title={isEditing ? t('tag.update') : t('tag.create')}
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