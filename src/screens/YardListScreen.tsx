import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import DataList from '../components/DataList';
import PrimaryButton from '../components/PrimaryButton';
import { getYards, deleteYard, parseApiError } from '../services/api';
import { SPACING } from '../styles/Theme';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { extractErrorMessage } from '../utils/errorHandler';

interface Patio {
    id: string;
    cidade: string;
    estado: string;
}

export default function YardListScreen() {
    const navigation = useNavigation();
    const queryClient = useQueryClient();
    const { colors } = useTheme();
    const { user } = useAuth();
    const { t } = useTranslation();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const { data: patios = [], isLoading, isError, isFetching, refetch } = useQuery({
        queryKey: ['yards', user?.id_usuario],
        queryFn: async () => {
            const userId = user?.role === 'USER' ? user?.id_usuario : undefined;
            const data = await getYards(userId) as any[];
            return data.map((yard: any) => ({
                id: yard.id_patio.toString(),
                id_patio: yard.id_patio,
                capacidade_patio: yard.capacidade_patio,
                cep_patio: yard.cep_patio,
                numero_patio: yard.numero_patio,
                cidade_patio: yard.cidade_patio,
                estado_patio: yard.estado_patio,
                id_usuario: yard.id_usuario,
                cidade: yard.cidade_patio || 'N/A',
                estado: yard.estado_patio || 'N/A',
            }));
        },
        refetchOnMount: 'always',
        refetchOnWindowFocus: true,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteYard(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['yards'] });
            Alert.alert(t('common.success'), t('yard.deleteSuccess'));
        },
        onError: (error: any) => {
            const errorMessage = extractErrorMessage(error);
            Alert.alert(t('common.error'), errorMessage);
        },
    });

    const handleCreatePatio = () => {
        navigation.navigate('YardFormScreen' as never);
    };

    const handleEditPatio = (patio: Patio) => {
        (navigation as any).navigate('YardFormScreen', { patio });
    };

    const handleDeletePatio = async (patio: Patio) => {
        deleteMutation.mutate(Number(patio.id));
    };

    const renderPatio = (patio: Patio) => (
        <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>🏢 {t('yard.titleSingular')} #{patio.id}</Text>
            <Text style={styles.itemSubtitle}>{t('yard.city')}: {patio.cidade}</Text>
            <Text style={styles.itemSubtitle}>{t('yard.state')}: {patio.estado}</Text>
        </View>
    );

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <Text style={styles.title}>{t('yard.title')}</Text>
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
                    <Text style={styles.title}>{t('yard.title')}</Text>
                </View>
                <View style={styles.center}>
                    <Text style={styles.errorText}>{t('yard.loadError')}</Text>
                    <PrimaryButton title={t('common.tryAgain')} onPress={() => refetch()} size="small" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('yard.title')}</Text>
                <PrimaryButton
                    title={t('yard.create')}
                    onPress={handleCreatePatio}
                    size="small"
                />
            </View>
            
            <DataList
                data={patios}
                onEdit={handleEditPatio as (item: any) => void}
                onDelete={handleDeletePatio as (item: any) => void}
                renderItem={renderPatio as (item: any) => React.ReactNode}
                emptyMessage={t('yard.empty')}
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