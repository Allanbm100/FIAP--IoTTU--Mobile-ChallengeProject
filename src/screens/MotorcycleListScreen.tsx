import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import DataList from '../components/DataList';
import PrimaryButton from '../components/PrimaryButton';
import { getMotorcycles, deleteMotorcycle, parseApiError } from '../services/api';
import { SPACING } from '../styles/Theme';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { extractErrorMessage } from '../utils/errorHandler';

interface Moto {
    id: string;
    placa: string;
    estado: string;
}

export default function MotorcycleListScreen() {
    const navigation = useNavigation();
    const queryClient = useQueryClient();
    const { colors } = useTheme();
    const { user } = useAuth();
    const { t } = useTranslation();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const { data: motos = [], isLoading, isError, isFetching, refetch } = useQuery({
        queryKey: ['motorcycles', user?.id_usuario],
        queryFn: async () => {
            const userId = user?.role === 'USER' ? user?.id_usuario : undefined;
            const data = await getMotorcycles(userId) as any[];
            return data.map((motorcycle: any) => ({
                id: motorcycle.id_moto?.toString?.() ?? String(motorcycle.id_moto),
                placa: motorcycle.placa_moto,
                estado: motorcycle?.id_status?.descricao_status || 'Desconhecido',
                _fullData: motorcycle,
            }));
        },
        refetchOnMount: 'always',
        refetchOnWindowFocus: true,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteMotorcycle(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['motorcycles'] });
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            Alert.alert(t('common.success'), t('motorcycle.deleteSuccess'));
        },
        onError: (error: any) => {
            const errorMessage = extractErrorMessage(error);
            Alert.alert(t('common.error'), errorMessage);
        },
    });

    const handleCreateMoto = () => {
        navigation.navigate('MotorcycleFormScreen' as never);
    };

    const handleEditMoto = (moto: Moto) => {
        (navigation as any).navigate('MotorcycleFormScreen', { moto: (moto as any)._fullData });
    };

    const handleDeleteMoto = async (moto: Moto) => {
        deleteMutation.mutate(Number(moto.id));
    };

    const renderMoto = (moto: Moto) => (
        <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>🏍️ {t('motorcycle.titleSingular')} #{moto.id}</Text>
            <Text style={styles.itemSubtitle}>{t('motorcycle.plate')}: {moto.placa}</Text>
            <Text style={styles.itemSubtitle}>{t('motorcycle.status')}: {moto.estado}</Text>
        </View>
    );

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <Text style={styles.title}>{t('motorcycle.title')}</Text>
                </View>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.PRIMARY} />
                </View>
            </SafeAreaView>
        );
    }

    if (isError) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <Text style={styles.title}>{t('motorcycle.title')}</Text>
                </View>
                <View style={styles.center}>
                    <Text style={styles.errorText}>{t('motorcycle.loadError')}</Text>
                    <PrimaryButton title={t('common.tryAgain')} onPress={() => refetch()} size="small" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('motorcycle.title')}</Text>
                <PrimaryButton
                    title={t('motorcycle.create')}
                    onPress={handleCreateMoto}
                    size="small"
                />
            </View>
            
            <DataList
                data={motos}
                onEdit={handleEditMoto as (item: any) => void}
                onDelete={handleDeleteMoto as (item: any) => void}
                renderItem={renderMoto as (item: any) => React.ReactNode}
                emptyMessage={t('motorcycle.empty')}
                refreshControl={
                    <RefreshControl
                        refreshing={isFetching}
                        onRefresh={refetch}
                        tintColor={colors.PRIMARY}
                        colors={[colors.PRIMARY]}
                    />
                }
            />
        </SafeAreaView>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.BACKGROUND,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.medium,
        paddingBottom: SPACING.medium,
        borderBottomWidth: 1,
        borderBottomColor: colors.BORDER,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.TEXT_PRIMARY,
    },
    itemContent: {
        padding: SPACING.small,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.TEXT_PRIMARY,
        marginBottom: SPACING.small,
    },
    itemSubtitle: {
        fontSize: 14,
        color: colors.TEXT_SECONDARY,
        marginBottom: 4,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: SPACING.medium,
    },
    errorText: {
        fontSize: 16,
        color: colors.TEXT_SECONDARY,
        marginBottom: SPACING.medium,
    },
});