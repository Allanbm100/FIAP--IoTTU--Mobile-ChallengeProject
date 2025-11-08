import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import DataList from '../components/DataList';
import PrimaryButton from '../components/PrimaryButton';
import { getAntennas, deleteAntenna, parseApiError } from '../services/api';
import { SPACING } from '../styles/Theme';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { extractErrorMessage } from '../utils/errorHandler';

interface Antena {
    id: string;
    codigo: string;
    estadoPatio: string;
}

export default function AntennaListScreen() {
    const navigation = useNavigation();
    const queryClient = useQueryClient();
    const { colors } = useTheme();
    const { user } = useAuth();
    const { t } = useTranslation();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const { data: antenas = [], isLoading, isError, isFetching, refetch } = useQuery({
        queryKey: ['antennas', user?.id_usuario],
        queryFn: async () => {
            const userId = user?.role === 'USER' ? user?.id_usuario : undefined;
            const data = await getAntennas(userId) as any[];
            return data.map((antenna: any) => ({
                id: antenna.id_antena?.toString?.() ?? String(antenna.id_antena),
                codigo: antenna.codigo_antena,
                estadoPatio: antenna?.id_patio?.estado_patio 
                    ? `${antenna.id_patio.cidade_patio}/${antenna.id_patio.estado_patio}`: 'N/A',
                _fullData: antenna,
            }));
        },
        refetchOnMount: 'always',
        refetchOnWindowFocus: true,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteAntenna(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['antennas'] });
            Alert.alert(t('common.success'), t('antenna.deleteSuccess'));
        },
        onError: (error: any) => {
            const errorMessage = extractErrorMessage(error);
            Alert.alert(t('common.error'), errorMessage);
        },
    });

    const handleCreateAntenna = () => {
        navigation.navigate('AntennaFormScreen' as never);
    };

    const handleEditAntenna = (antena: Antena) => {
        (navigation as any).navigate('AntennaFormScreen', { antena: (antena as any)._fullData });
    };

    const handleDeleteAntenna = async (antena: Antena) => {
        deleteMutation.mutate(Number(antena.id));
    };

    const renderAntenna = (antena: Antena) => (
        <View style={styles.itemContent}>
            <Text style={styles.itemTitle}>📡 {t('antenna.titleSingular')} #{antena.id}</Text>
            <Text style={styles.itemSubtitle}>{t('antenna.codeLabel')}: {antena.codigo}</Text>
            <Text style={styles.itemSubtitle}>{t('antenna.yardState')}: {antena.estadoPatio}</Text>
        </View>
    );

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <Text style={styles.title}>{t('antenna.title')}</Text>
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
                    <Text style={styles.title}>{t('antenna.title')}</Text>
                </View>
                <View style={styles.center}>
                    <Text style={styles.errorText}>{t('antenna.loadError')}</Text>
                    <PrimaryButton title={t('common.tryAgain')} onPress={() => refetch()} size="small" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('antenna.title')}</Text>
                <PrimaryButton
                    title={t('antenna.create')}
                    onPress={handleCreateAntenna}
                    size="small"
                />
            </View>

            <DataList
                data={antenas}
                onEdit={handleEditAntenna as (item: any) => void}
                onDelete={handleDeleteAntenna as (item: any) => void}
                renderItem={renderAntenna as (item: any) => React.ReactNode}
                emptyMessage={t('antenna.empty')}
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