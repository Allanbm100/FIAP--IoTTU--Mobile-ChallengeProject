import React, { useMemo, useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { SPACING, BORDER_RADIUS } from '../styles/Theme';
import { useTheme } from '../contexts/ThemeContext';

interface InputFieldProps extends TextInputProps {
    label: string;
    maxLength?: number;
    error?: string;
    fullWidth?: boolean;
}

export default function InputField({ label, maxLength, error, fullWidth = false, style, ...props }: InputFieldProps) {
    const [isFocused, setIsFocused] = useState(false);
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const containerStyle = [
        styles.container,
        fullWidth && styles.fullWidth,
        style,
    ];

    const inputStyle = [
        styles.input,
        isFocused ? styles.inputFocused : styles.inputUnfocused,
        error && styles.inputError,
    ];

    const labelStyle = [
        styles.label,
        isFocused ? styles.labelFocused : styles.labelUnfocused,
        error && styles.labelError,
    ];

    return (
        <View style={containerStyle}>
            <Text style={labelStyle}>{label}</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={inputStyle}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    maxLength={maxLength}
                    placeholderTextColor={colors.TEXT_MUTED}
                    {...props}
                />
                {maxLength && (
                    <Text style={styles.counter}>
                        {props.value?.length || 0}/{maxLength}
                    </Text>
                )}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const createStyles = (colors: any) => StyleSheet.create({
    container: {
        marginVertical: SPACING.small,
    },
    fullWidth: {
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: SPACING.small,
        marginLeft: SPACING.small,
    },
    labelFocused: {
        color: colors.PRIMARY,
    },
    labelUnfocused: {
        color: colors.TEXT_SECONDARY,
    },
    labelError: {
        color: colors.FAILURE,
    },
    inputContainer: {
        position: 'relative',
    },
    input: {
        backgroundColor: colors.BACKGROUND,
        borderRadius: BORDER_RADIUS,
        borderWidth: 2,
        paddingVertical: SPACING.medium,
        paddingHorizontal: SPACING.medium,
        fontSize: 16,
        color: colors.TEXT_PRIMARY,
        fontFamily: 'System',
    },
    inputFocused: {
        borderColor: colors.PRIMARY,
    },
    inputUnfocused: {
        borderColor: colors.BORDER,
    },
    inputError: {
        borderColor: colors.FAILURE,
    },
    counter: {
        position: 'absolute',
        right: SPACING.medium,
        top: SPACING.medium,
        fontSize: 12,
        color: colors.TEXT_MUTED,
    },
    errorText: {
        fontSize: 12,
        color: colors.FAILURE,
        marginTop: SPACING.small,
        marginLeft: SPACING.small,
    },
});