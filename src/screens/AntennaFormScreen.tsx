import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import InputField from '../components/InputField';
import SelectDialog, { SelectOption } from '../components/SelectDialog';
import PrimaryButton from '../components/PrimaryButton';
import { createAntenna, updateAntenna, getYards } from '../services/api';
import { SPACING } from '../styles/Theme';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { extractErrorMessage } from '../utils/errorHandler';

interface AntennaFormData {
    id_patio: number | '';
    codigo_antena: string;
    latitude_antena: string;
    longitude_antena: string;
}

export default function AntennaFormScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const { antena } = route.params as { antena?: any } || {};
    const isEditing = !!antena;
    const { colors } = useTheme();
    const { t } = useTranslation();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const [formData, setFormData] = useState<AntennaFormData>({
        id_patio: '',
        codigo_antena: '',
        latitude_antena: '',
        longitude_antena: '',
    });

    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [yardOptions, setYardOptions] = useState<SelectOption[]>([]);

    useEffect(() => {
        loadYards();
        if (isEditing && antena) {
            setFormData({
                id_patio: antena?.id_patio?.id_patio || antena?.id_patio || '',
                codigo_antena: antena.codigo_antena || '',
                latitude_antena: antena.latitude_antena?.toString() || '',
                longitude_antena: antena.longitude_antena?.toString() || '',
            });
        }
    }, [isEditing, antena]);

    const loadYards = async () => {
        try {
            const userId = user?.role === 'USER' ? user?.id_usuario : undefined;
            const yards = await getYards(userId) as any[];
            
            const options: SelectOption[] = yards.map(yard => {
                const label = `${yard.cidade_patio} (ID: ${yard.id_patio})`;
                return {
                    label,
                    value: yard.id_patio,
                };
            });
            setYardOptions(options);
        } catch (error) {
            Alert.alert(t('common.warning'), t('antenna.loadYardsError'));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: any = {};

        if (!formData.id_patio) {
            newErrors.id_patio = t('antenna.yardRequired');
        }

        if (!formData.codigo_antena.trim()) {
            newErrors.codigo_antena = t('antenna.codeRequired');
        } else if (formData.codigo_antena.length < 3) {
            newErrors.codigo_antena = t('antenna.codeMinLength');
        }

        if (!formData.latitude_antena.trim()) {
            newErrors.latitude_antena = t('antenna.latitudeRequired');
        } else if (isNaN(Number(formData.latitude_antena))) {
            newErrors.latitude_antena = t('antenna.latitudeInvalid');
        } else if (Number(formData.latitude_antena) < -90 || Number(formData.latitude_antena) > 90) {
            newErrors.latitude_antena = t('antenna.latitudeRange');
        }

        if (!formData.longitude_antena.trim()) {
            newErrors.longitude_antena = t('antenna.longitudeRequired');
        } else if (isNaN(Number(formData.longitude_antena))) {
            newErrors.longitude_antena = t('antenna.longitudeInvalid');
        } else if (Number(formData.longitude_antena) < -180 || Number(formData.longitude_antena) > 180) {
            newErrors.longitude_antena = t('antenna.longitudeRange');
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
            const antennaData = {
                id_patio: Number(formData.id_patio),
                codigo_antena: formData.codigo_antena,
                latitude_antena: Number(formData.latitude_antena),
                longitude_antena: Number(formData.longitude_antena),
            };

            if (isEditing) {
                await updateAntenna(Number(antena.id || antena.id_antena), antennaData);
                await queryClient.invalidateQueries({ queryKey: ['antennas'] });
                await queryClient.refetchQueries({ queryKey: ['antennas'] });
                Alert.alert(t('common.success'), t('antenna.updateSuccess'), [
                    { text: t('common.ok'), onPress: () => navigation.goBack() }
                ]);
            } else {
                await createAntenna(antennaData);
                await queryClient.invalidateQueries({ queryKey: ['antennas'] });
                await queryClient.refetchQueries({ queryKey: ['antennas'] });
                Alert.alert(t('common.success'), t('antenna.createSuccess'), [
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
                <Text style={styles.title}>{isEditing ? t('antenna.edit') : t('antenna.createTitle')}</Text>
                
                <SelectDialog
                    label={t('antenna.yard')}
                    value={formData.id_patio}
                    options={yardOptions}
                    onSelect={(value) => setFormData({ ...formData, id_patio: value as number })}
                    placeholder={t('antenna.selectYard')}
                    error={errors.id_patio}
                    fullWidth
                />

                <InputField
                    label={t('antenna.code')}
                    value={formData.codigo_antena}
                    onChangeText={(text) => setFormData({ ...formData, codigo_antena: text })}
                    placeholder={t('antenna.enterCode')}
                    maxLength={50}
                    error={errors.codigo_antena}
                    fullWidth
                />

                <InputField
                    label={t('antenna.latitude')}
                    value={formData.latitude_antena}
                    onChangeText={(text) => setFormData({ ...formData, latitude_antena: text })}
                    placeholder={t('antenna.enterLatitude')}
                    keyboardType="numeric"
                    error={errors.latitude_antena}
                    fullWidth
                />

                <InputField
                    label={t('antenna.longitude')}
                    value={formData.longitude_antena}
                    onChangeText={(text) => setFormData({ ...formData, longitude_antena: text })}
                    placeholder={t('antenna.enterLongitude')}
                    keyboardType="numeric"
                    error={errors.longitude_antena}
                    fullWidth
                />

                <View style={styles.buttonContainer}>
                    <PrimaryButton
                        title={isEditing ? t('antenna.update') : t('antenna.create')}
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