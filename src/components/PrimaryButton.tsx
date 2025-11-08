import React, { useMemo } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { SPACING, BORDER_RADIUS } from '../styles/Theme';
import { useTheme } from '../contexts/ThemeContext';

interface PrimaryButtonProps extends TouchableOpacityProps {
    title: string;
    onPress: () => void;
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
}

export default function PrimaryButton(
    { title, onPress, size = 'medium', loading = false, disabled = false, fullWidth = false, style, ...props }: PrimaryButtonProps) {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const buttonStyle = [
        styles.button,
        styles[size],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
    ];

    const textStyle = [
        styles.text,
        styles[`${size}Text`],
        disabled && styles.disabledText,
    ];

    return (
        <TouchableOpacity style={buttonStyle} onPress={onPress} disabled={disabled || loading} activeOpacity={0.8} {...props}>
            {loading ? (
                <ActivityIndicator
                    color={colors.BACKGROUND}
                    size="small"
                />
            ) : (
                <Text style={textStyle}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BORDER_RADIUS,
        backgroundColor: colors.PRIMARY,
        marginHorizontal: SPACING.small,
    },
    small: {
        paddingVertical: SPACING.small,
        paddingHorizontal: SPACING.medium,
        minHeight: 36,
    },
    medium: {
        paddingVertical: SPACING.medium,
        paddingHorizontal: SPACING.large,
        minHeight: 48,
    },
    large: {
        paddingVertical: SPACING.large,
        paddingHorizontal: SPACING.xl,
        minHeight: 56,
    },
    disabled: {
        backgroundColor: colors.INPUT_BG,
    },
    fullWidth: {
        width: '100%',
        marginHorizontal: 0,
    },
    text: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'System',
        color: colors.BACKGROUND,
    },
    smallText: {
        fontSize: 14,
    },
    mediumText: {
        fontSize: 16,
    },
    largeText: {
        fontSize: 18,
    },
    disabledText: {
        color: colors.TEXT_MUTED,
    },
});