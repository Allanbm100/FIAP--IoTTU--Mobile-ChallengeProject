import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import InputField from '../components/InputField';
import SelectDialog, { SelectOption } from '../components/SelectDialog';
import PrimaryButton from '../components/PrimaryButton';
import { createYard, updateYard, getUsers } from '../services/api';
import { SPACING } from '../styles/Theme';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { extractErrorMessage } from '../utils/errorHandler';

interface YardFormData {
    id_usuario: number | '';
    cep_patio: string;
    numero_patio: string;
    cidade_patio: string;
    estado_patio: string;
    capacidade_patio: string;
}

export default function YardFormScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const { patio } = route.params as { patio?: any } || {};
    const isEditing = !!patio;
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const [formData, setFormData] = useState<YardFormData>({
        id_usuario: '',
        cep_patio: '',
        numero_patio: '',
        cidade_patio: '',
        estado_patio: '',
        capacidade_patio: '',
    });

    const [errors, setErrors] = useState<Partial<YardFormData>>({});
    const [loading, setLoading] = useState(false);
    const [userOptions, setUserOptions] = useState<SelectOption[]>([]);
    
    const { user: currentUser } = useAuth();
    const currentUserRole = currentUser?.role || 'USER';
    const currentUserId = currentUser?.id_usuario || 0;

    useEffect(() => {
        const loadData = async () => {
            await loadUsers();
            
            if (isEditing && patio) {
                const userId = patio?.id_usuario?.id_usuario || patio?.user?.id_usuario || patio?.id_usuario || '';
                setFormData({
                    id_usuario: userId,
                    cep_patio: patio.cep_patio || '',
                    numero_patio: patio.numero_patio || '',
                    cidade_patio: patio.cidade_patio || '',
                    estado_patio: patio.estado_patio || '',
                    capacidade_patio: patio.capacidade_patio?.toString() || '',
                });
            } else if (currentUserRole === 'USER') {
                setFormData(prev => ({ ...prev, id_usuario: currentUserId }));
            }
        };
        
        loadData();
    }, [isEditing, patio]);

    const loadUsers = async () => {
        try {
            const users = await getUsers() as any[];
            const options: SelectOption[] = users.map(user => ({
                label: `${user.nome_usuario} (ID: ${user.id_usuario})`,
                value: user.id_usuario,
            }));
            setUserOptions(options);
            
            if (!isEditing && users.length > 0 && currentUserRole === 'ADMIN') {
                setFormData(prev => ({ ...prev, id_usuario: users[0].id_usuario }));
            }
        } catch (error) {
            Alert.alert(t('common.warning'), t('yard.loadUsersError'));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: any = {};

        if (!formData.id_usuario) {
            newErrors.id_usuario = t('yard.userRequired');
        }

        if (!formData.cep_patio.trim()) {
            newErrors.cep_patio = t('yard.cepRequired');
        } else if (formData.cep_patio.replace(/\D/g, '').length !== 8) {
            newErrors.cep_patio = t('yard.cepInvalid');
        }

        if (!formData.numero_patio.trim()) {
            newErrors.numero_patio = t('yard.numberRequired');
        }

        if (!formData.cidade_patio.trim()) {
            newErrors.cidade_patio = t('yard.cityRequired');
        } else if (formData.cidade_patio.length < 2) {
            newErrors.cidade_patio = t('yard.cityMinLength');
        }

        if (!formData.estado_patio.trim()) {
            newErrors.estado_patio = t('yard.stateRequired');
        } else if (formData.estado_patio.length !== 2) {
            newErrors.estado_patio = t('yard.stateInvalid');
        }

        if (!formData.capacidade_patio.trim()) {
            newErrors.capacidade_patio = t('yard.capacityRequired');
        } else if (isNaN(Number(formData.capacidade_patio))) {
            newErrors.capacidade_patio = t('yard.capacityInvalid');
        } else if (Number(formData.capacidade_patio) < 0) {
            newErrors.capacidade_patio = t('yard.capacityMinValue');
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
            const yardData = {
                id_usuario: Number(formData.id_usuario),
                cep_patio: formData.cep_patio.replace(/\D/g, ''),
                numero_patio: formData.numero_patio,
                cidade_patio: formData.cidade_patio,
                estado_patio: formData.estado_patio.toUpperCase(),
                capacidade_patio: Number(formData.capacidade_patio),
            };

            if (isEditing) {
                const idToUpdate = patio?.id_patio ?? patio?.id;
                await updateYard(Number(idToUpdate), yardData);
                await queryClient.invalidateQueries({ queryKey: ['yards'] });
                await queryClient.refetchQueries({ queryKey: ['yards'] });
                Alert.alert(t('common.success'), t('yard.updateSuccess'), [
                    { text: t('common.ok'), onPress: () => navigation.goBack() }
                ]);
            } else {
                await createYard(yardData);
                await queryClient.invalidateQueries({ queryKey: ['yards'] });
                await queryClient.refetchQueries({ queryKey: ['yards'] });
                Alert.alert(t('common.success'), t('yard.createSuccess'), [
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
                <Text style={styles.title}>{isEditing ? t('yard.edit') : t('yard.createTitle')}</Text>
                
                <SelectDialog
                    label={t('user.user')}
                    value={formData.id_usuario}
                    options={userOptions}
                    onSelect={(value) => setFormData({ ...formData, id_usuario: value as number })}
                    placeholder={t('user.selectUser')}
                    error={errors.id_usuario as string}
                    disabled={currentUserRole === 'USER'}
                    fullWidth
                />

                <InputField
                    label={t('yard.cep')}
                    value={formData.cep_patio}
                    onChangeText={(text) => setFormData({ ...formData, cep_patio: text })}
                    placeholder={t('yard.enterCep')}
                    keyboardType="numeric"
                    maxLength={8}
                    error={errors.cep_patio}
                    fullWidth
                />

                <InputField
                    label={t('yard.number')}
                    value={formData.numero_patio}
                    onChangeText={(text) => setFormData({ ...formData, numero_patio: text })}
                    placeholder={t('yard.enterNumber')}
                    maxLength={10}
                    error={errors.numero_patio}
                    fullWidth
                />

                <InputField
                    label={t('yard.city')}
                    value={formData.cidade_patio}
                    onChangeText={(text) => setFormData({ ...formData, cidade_patio: text })}
                    placeholder={t('yard.enterCity')}
                    maxLength={50}
                    error={errors.cidade_patio}
                    fullWidth
                />

                <InputField
                    label={t('yard.state')}
                    value={formData.estado_patio}
                    onChangeText={(text) => setFormData({ ...formData, estado_patio: text.toUpperCase() })}
                    placeholder={t('yard.enterState')}
                    maxLength={2}
                    error={errors.estado_patio}
                    fullWidth
                />

                <InputField
                    label={t('yard.capacity')}
                    value={formData.capacidade_patio}
                    onChangeText={(text) => setFormData({ ...formData, capacidade_patio: text })}
                    placeholder={t('yard.enterCapacity')}
                    keyboardType="numeric"
                    error={errors.capacidade_patio}
                    fullWidth
                />

                <View style={styles.buttonContainer}>
                    <PrimaryButton
                        title={isEditing ? t('yard.update') : t('yard.create')}
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