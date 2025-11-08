import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import InputField from '../components/InputField';
import SelectDialog, { SelectOption } from '../components/SelectDialog';
import PrimaryButton from '../components/PrimaryButton';
import { createMotorcycle, updateMotorcycle, getYards, getTags, getMotorcycles, getMotorcycleById } from '../services/api';
import { SPACING } from '../styles/Theme';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { extractErrorMessage } from '../utils/errorHandler';

interface MotorcycleFormData {
    id_status: number | '';
    id_patio: number | '';
    placa_moto: string;
    chassi_moto: string;
    nr_motor_moto: string;
    modelo_moto: string;
    selected_tag_id: number | '';
}

export default function MotorcycleFormScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const params = (route.params as any) || {};
    const moto = params.moto;
    const isEditing = !!moto;
    const { colors } = useTheme();
    const { t } = useTranslation();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const [formData, setFormData] = useState<MotorcycleFormData>({
        id_status: '',
        id_patio: '',
        placa_moto: '',
        chassi_moto: '',
        nr_motor_moto: '',
        modelo_moto: '',
        selected_tag_id: '',
    });

    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);
    
    const statusOptions: SelectOption[] = [
        { label: t('motorcycle.statusAvailable'), value: 1 },
        { label: t('motorcycle.statusUnavailable'), value: 2 },
        { label: t('motorcycle.statusMaintenance'), value: 3 },
    ];

    const [yardOptions, setYardOptions] = useState<SelectOption[]>([]);
    const [tagOptions, setTagOptions] = useState<SelectOption[]>([]);

    useEffect(() => {
        loadData();
        
        if (isEditing && moto) {
            setFormData({
                id_status: moto?.id_status?.id_status ?? moto?.status?.id_status ?? moto?.id_status ?? '',
                id_patio: moto?.id_patio?.id_patio ?? moto?.yard?.id_patio ?? moto?.id_patio ?? '',
                placa_moto: moto?.placa_moto ?? '',
                chassi_moto: moto?.chassi_moto ?? '',
                nr_motor_moto: moto?.nr_motor_moto ?? '',
                modelo_moto: moto?.modelo_moto ?? '',
                selected_tag_id: moto?.tags?.[0]?.id_tag ?? '',
            });
        }
    }, []);

    const loadData = async () => {
        try {
            const userId = user?.role === 'USER' ? user?.id_usuario : undefined;
            const yards = await getYards(userId) as any[];
            
            const yardOpts: SelectOption[] = yards.map(yard => ({
                label: `${yard.cidade_patio} (ID: ${yard.id_patio})`,
                value: yard.id_patio,
            }));
            setYardOptions(yardOpts);

            const tags = await getTags(userId) as any[];
            const motorcycles = await getMotorcycles(userId) as any[];
            
            const usedTagIds = new Set<number>();
            motorcycles.forEach((m: any) => {
                if (m.tags && Array.isArray(m.tags)) {
                    m.tags.forEach((tag: any) => {
                        if (!isEditing || m.id_moto !== moto?.id_moto) {
                            usedTagIds.add(tag.id_tag);
                        }
                    });
                }
            });
            
            const availableTags = tags.filter((tag: any) => !usedTagIds.has(tag.id_tag));
            
            const tagOpts: SelectOption[] = availableTags.map(tag => ({
                label: `${tag.codigo_rfid_tag} (ID: ${tag.id_tag})`,
                value: tag.id_tag,
            }));
            setTagOptions(tagOpts);
        } catch (error) {
            Alert.alert(t('common.warning'), t('motorcycle.loadDataError'));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: any = {};

        if (!formData.id_status) {
            newErrors.id_status = t('motorcycle.statusRequired');
        }

        if (!formData.id_patio) {
            newErrors.id_patio = t('motorcycle.yardRequired');
        }

        if (!formData.placa_moto.trim()) {
            newErrors.placa_moto = t('motorcycle.plateRequired');
        } else if (formData.placa_moto.length < 7) {
            newErrors.placa_moto = t('motorcycle.plateMinLength');
        }

        if (!formData.chassi_moto.trim()) {
            newErrors.chassi_moto = t('motorcycle.chassisRequired');
        } else if (formData.chassi_moto.length < 17) {
            newErrors.chassi_moto = t('motorcycle.chassisMinLength');
        }

        if (!formData.nr_motor_moto.trim()) {
            newErrors.nr_motor_moto = t('motorcycle.engineNumberRequired');
        } else if (formData.nr_motor_moto.length < 5) {
            newErrors.nr_motor_moto = t('motorcycle.engineNumberMinLength');
        }

        if (!formData.modelo_moto.trim()) {
            newErrors.modelo_moto = t('motorcycle.modelRequired');
        } else if (formData.modelo_moto.length < 2) {
            newErrors.modelo_moto = t('motorcycle.modelMinLength');
        }

        if (!formData.selected_tag_id) {
            newErrors.selected_tag_id = t('motorcycle.tagRequired');
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
            const motorcycleData = {
                id_status: Number(formData.id_status),
                id_patio: Number(formData.id_patio),
                placa_moto: formData.placa_moto,
                chassi_moto: formData.chassi_moto,
                nr_motor_moto: formData.nr_motor_moto,
                modelo_moto: formData.modelo_moto,
                selected_tag_id: formData.selected_tag_id ? Number(formData.selected_tag_id) : null,
            };

            if (isEditing && moto) {
                await updateMotorcycle(moto.id_moto, motorcycleData);
                await queryClient.invalidateQueries({ queryKey: ['motorcycles'] });
                await queryClient.invalidateQueries({ queryKey: ['tags'] });
                await queryClient.refetchQueries({ queryKey: ['motorcycles'] });
                Alert.alert(t('common.success'), t('motorcycle.updateSuccess'), [
                    { text: t('common.ok'), onPress: () => navigation.goBack() }
                ]);
            } else {
                await createMotorcycle(motorcycleData);
                await queryClient.invalidateQueries({ queryKey: ['motorcycles'] });
                await queryClient.invalidateQueries({ queryKey: ['tags'] });
                await queryClient.refetchQueries({ queryKey: ['motorcycles'] });
                Alert.alert(t('common.success'), t('motorcycle.createSuccess'), [
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
                <Text style={styles.title}>{isEditing ? t('motorcycle.edit') : t('motorcycle.createTitle')}</Text>
                
                <InputField
                    label={t('motorcycle.model')}
                    value={formData.modelo_moto}
                    onChangeText={(text) => setFormData({ ...formData, modelo_moto: text })}
                    placeholder={t('motorcycle.enterModel')}
                    maxLength={50}
                    error={errors.modelo_moto}
                    fullWidth
                />

                <InputField
                    label={t('motorcycle.plate')}
                    value={formData.placa_moto}
                    onChangeText={(text) => setFormData({ ...formData, placa_moto: text.toUpperCase() })}
                    placeholder={t('motorcycle.enterPlate')}
                    maxLength={10}
                    error={errors.placa_moto}
                    fullWidth
                />

                <InputField
                    label={t('motorcycle.chassis')}
                    value={formData.chassi_moto}
                    onChangeText={(text) => setFormData({ ...formData, chassi_moto: text.toUpperCase() })}
                    placeholder={t('motorcycle.enterChassis')}
                    maxLength={20}
                    error={errors.chassi_moto}
                    fullWidth
                />

                <InputField
                    label={t('motorcycle.engineNumber')}
                    value={formData.nr_motor_moto}
                    onChangeText={(text) => setFormData({ ...formData, nr_motor_moto: text })}
                    placeholder={t('motorcycle.enterEngineNumber')}
                    maxLength={50}
                    error={errors.nr_motor_moto}
                    fullWidth
                />

                <SelectDialog
                    label={t('motorcycle.status')}
                    value={formData.id_status}
                    options={statusOptions}
                    onSelect={(value) => setFormData({ ...formData, id_status: value as number })}
                    placeholder={t('motorcycle.selectStatus')}
                    error={errors.id_status}
                    fullWidth
                />

                <SelectDialog
                    label={t('motorcycle.yard')}
                    value={formData.id_patio}
                    options={yardOptions}
                    onSelect={(value) => setFormData({ ...formData, id_patio: value as number })}
                    placeholder={t('motorcycle.selectYard')}
                    error={errors.id_patio}
                    fullWidth
                />

                <SelectDialog
                    label={t('motorcycle.tag')}
                    value={formData.selected_tag_id}
                    options={tagOptions}
                    onSelect={(value) => setFormData({ ...formData, selected_tag_id: value as number })}
                    placeholder={t('motorcycle.selectTag')}
                    error={errors.selected_tag_id}
                    fullWidth
                />

                <View style={styles.buttonContainer}>
                    <PrimaryButton
                        title={isEditing ? t('motorcycle.update') : t('motorcycle.create')}
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