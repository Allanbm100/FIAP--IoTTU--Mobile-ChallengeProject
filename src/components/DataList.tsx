import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, } from 'react-native';
import type { RefreshControlProps } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useTranslation } from 'react-i18next';
import { SPACING, BORDER_RADIUS } from '../styles/Theme';
import { useTheme } from '../contexts/ThemeContext';

interface DataItem {
    id: string | number;
    [key: string]: any;
}

interface DataListProps {
    data: DataItem[];
    onEdit: (item: DataItem) => void;
    onDelete: (item: DataItem) => void;
    renderItem: (item: DataItem) => React.ReactNode;
    emptyMessage?: string;
    keyExtractor?: (item: DataItem) => string;
    refreshControl?: React.ReactElement<RefreshControlProps>;
}

const VisibleItem = ({ item, onEdit, renderItem, styles }: {
    item: DataItem;
    onEdit: (item: DataItem) => void;
    renderItem: (item: DataItem) => React.ReactNode;
    styles: ReturnType<typeof createStyles>;
}) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => onEdit(item)} activeOpacity={0.7}>
        <View style={styles.itemContent}>{renderItem(item)}</View>
    </TouchableOpacity>
);

const HiddenItem = ({ item, onDelete, styles }: {
    item: DataItem;
    onDelete: (item: DataItem) => void;
    styles: ReturnType<typeof createStyles>;
}) => {
    const { t } = useTranslation();
    
    const handleDelete = () => {
        Alert.alert(
            t('common.confirmDelete'),
            t('common.confirmDeleteMessage'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                { text: t('common.delete'), style: 'destructive', onPress: () => onDelete(item) },
            ]
        );
    };

    return (
        <View style={styles.hiddenItemContainer}>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>🗑️</Text>
            </TouchableOpacity>
        </View>
    );
};

export default function DataList(
    { data, onEdit, onDelete, renderItem, emptyMessage, keyExtractor = (item) => item.id.toString(), refreshControl }: DataListProps) {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const defaultEmptyMessage = emptyMessage || t('common.noItemsFound');

    const renderVisibleItem = ({ item }: { item: DataItem }) => (
        <VisibleItem item={item} onEdit={onEdit} renderItem={renderItem} styles={styles} />
    );

    const renderHiddenItem = ({ item }: { item: DataItem }) => (
        <HiddenItem item={item} onDelete={onDelete} styles={styles} />
    );

    if (data.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{defaultEmptyMessage}</Text>
            </View>
        );
    }

    return (
        <SwipeListView
            data={data}
            keyExtractor={keyExtractor}
            renderItem={renderVisibleItem}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-80}
            rightActivationValue={-100}
            rightActionValue={-200}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            refreshControl={refreshControl}
        />
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    list: {
        flex: 1,
    },
    itemContainer: {
        backgroundColor: colors.CONTAINER_BG,
        borderRadius: BORDER_RADIUS,
        marginHorizontal: SPACING.medium,
        marginVertical: SPACING.small,
        shadowColor: colors.SHADOW,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemContent: {
        padding: SPACING.medium,
        backgroundColor: colors.CONTAINER_BG,
        borderRadius: BORDER_RADIUS,
    },
    hiddenItemContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginVertical: SPACING.small,
        marginRight: SPACING.medium,
    },
    deleteButton: {
        width: 80,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.FAILURE,
        borderRadius: BORDER_RADIUS,
    },
    deleteButtonText: {
        fontSize: 24,
        color: colors.BACKGROUND,
    },
    separator: {
        height: SPACING.small,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    emptyText: {
        fontSize: 16,
        color: colors.TEXT_MUTED,
        textAlign: 'center',
    },
});