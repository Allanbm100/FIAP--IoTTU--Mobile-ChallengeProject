import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import DataList from '../components/DataList';
import PrimaryButton from '../components/PrimaryButton';
import { getTags, deleteTag, parseApiError } from '../services/api';
import { SPACING } from '../styles/Theme';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { extractErrorMessage } from '../utils/errorHandler';

interface Tag {
    id: string;
    codigoRFID: string;
    emUso: boolean;
}

export default function TagListScreen() {
    const navigation = useNavigation();
    const queryClient = useQueryClient();
    const { colors } = useTheme();
    const { user } = useAuth();
    const { t } = useTranslation();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const { data: tags = [], isLoading, isError, isFetching, refetch } = useQuery({
        queryKey: ['tags', user?.id_usuario],
        queryFn: async () => {
            const userId = user?.role === 'USER' ? user?.id_usuario : undefined;
            const data = await getTags(userId) as any[];
            return data.map((tag: any) => ({
                id: tag.id_tag.toString(),
                codigoRFID: tag.codigo_rfid_tag,
                emUso: tag.em_uso === true,
                _fullData: tag,
            }));
        },
        refetchOnMount: 'always',
        refetchOnWindowFocus: true,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteTag(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            Alert.alert(t('common.success'), t('tag.deleteSuccess'));
        },
        onError: (error: any) => {
            const errorMessage = extractErrorMessage(error);
            Alert.alert(t('common.error'), errorMessage);
        },
    });

    const handleCreateTag = () => {
        navigation.navigate('TagFormScreen' as never);
    };

    const handleEditTag = (tag: Tag) => {
        (navigation as any).navigate('TagFormScreen', { tag: (tag as any)._fullData });
    };

    const handleDeleteTag = async (tag: Tag) => {
        deleteMutation.mutate(Number(tag.id));
    };

    const renderTag = (tag: Tag) => (
        <View style={styles.itemContent}>
            <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>🏷️ {t('tag.titleSingular')} #{tag.id}</Text>
                <View style={[styles.statusBadge, tag.emUso ? styles.statusInUse : styles.statusAvailable]}>
                    <Text style={[styles.statusText, tag.emUso ? styles.statusTextInUse : styles.statusTextAvailable]}>
                        {tag.emUso ? t('tag.inUse') : t('tag.available')}
                    </Text>
                </View>
            </View>
            <Text style={styles.itemSubtitle}>{t('tag.rfidCode')}: {tag.codigoRFID}</Text>
        </View>
    );

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <Text style={styles.title}>{t('tag.title')}</Text>
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
                    <Text style={styles.title}>{t('tag.title')}</Text>
                </View>
                <View style={styles.center}>
                    <Text style={styles.errorText}>{t('tag.loadError')}</Text>
                    <PrimaryButton title={t('common.tryAgain')} onPress={() => refetch()} size="small" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('tag.title')}</Text>
                <PrimaryButton
                    title={t('tag.create')}
                    onPress={handleCreateTag}
                    size="small"
                />
            </View>
            
            <DataList
                data={tags}
                onEdit={handleEditTag as (item: any) => void}
                onDelete={handleDeleteTag as (item: any) => void}
                renderItem={renderTag as (item: any) => React.ReactNode}
                emptyMessage={t('tag.empty')}
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
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.small,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.TEXT_PRIMARY,
        flex: 1,
    },
    itemSubtitle: {
        fontSize: 14,
        color: colors.TEXT_SECONDARY,
        marginBottom: 4,
    },
    statusBadge: {
        paddingHorizontal: SPACING.small,
        paddingVertical: 4,
        borderRadius: 4,
        marginLeft: SPACING.small,
    },
    statusInUse: {
        backgroundColor: '#fee',
        borderWidth: 1,
        borderColor: '#f44',
    },
    statusAvailable: {
        backgroundColor: '#efe',
        borderWidth: 1,
        borderColor: '#4a4',
    },
    statusText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    statusTextInUse: {
        color: '#c00',
    },
    statusTextAvailable: {
        color: '#080',
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