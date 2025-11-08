import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Pressable,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SPACING } from '../styles/Theme';
import { useTheme } from '../contexts/ThemeContext';

export interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectDialogProps {
  label: string;
  value: string | number | '';
  options: SelectOption[];
  onSelect: (value: string | number) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function SelectDialog({
  label,
  value,
  options,
  onSelect,
  placeholder,
  error,
  disabled = false,
  fullWidth = true,
}: SelectDialogProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const defaultPlaceholder = placeholder || t('common.selectOption');
  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : defaultPlaceholder;

  const handleSelect = (selectedValue: string | number) => {
    onSelect(selectedValue);
    setModalVisible(false);
  };

  return (
    <View style={[styles.container, fullWidth && styles.fullWidth]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity
        style={[
          styles.selectButton,
          error && styles.selectButtonError,
          disabled && styles.selectButtonDisabled,
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
      >
        <Text
          style={[
            styles.selectButtonText,
            !selectedOption && styles.placeholderText,
            disabled && styles.disabledText,
          ]}
        >
          {displayText}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || t('common.select')}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    item.value === value && styles.optionItemSelected,
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.value === value && styles.optionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>{t('common.noOptionsAvailable')}</Text>
              }
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    marginBottom: SPACING.medium,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.TEXT_PRIMARY,
    marginBottom: SPACING.small,
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.CONTAINER_BG,
    borderWidth: 1,
    borderColor: colors.BORDER,
    borderRadius: 8,
    paddingHorizontal: SPACING.medium,
    paddingVertical: 12,
    minHeight: 48,
  },
  selectButtonError: {
    borderColor: colors.FAILURE,
  },
  selectButtonDisabled: {
    backgroundColor: colors.INPUT_BG,
    opacity: 0.6,
  },
  selectButtonText: {
    flex: 1,
    fontSize: 16,
    color: colors.TEXT_PRIMARY,
  },
  placeholderText: {
    color: colors.TEXT_SECONDARY,
  },
  disabledText: {
    color: colors.TEXT_SECONDARY,
  },
  arrow: {
    fontSize: 12,
    color: colors.TEXT_SECONDARY,
    marginLeft: SPACING.small,
  },
  errorText: {
    fontSize: 12,
    color: colors.FAILURE,
    marginTop: SPACING.small,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.CONTAINER_BG,
    borderRadius: 12,
    width: '85%',
    maxHeight: '70%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.large,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.TEXT_PRIMARY,
  },
  closeButton: {
    fontSize: 24,
    color: colors.TEXT_SECONDARY,
    fontWeight: 'bold',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.large,
    borderBottomWidth: 1,
    borderBottomColor: colors.BORDER,
  },
  optionItemSelected: {
    backgroundColor: colors.PRIMARY + '15',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: colors.TEXT_PRIMARY,
  },
  optionTextSelected: {
    color: colors.PRIMARY,
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 20,
    color: colors.PRIMARY,
    fontWeight: 'bold',
    marginLeft: SPACING.small,
  },
  emptyText: {
    textAlign: 'center',
    padding: SPACING.xl,
    color: colors.TEXT_SECONDARY,
    fontSize: 16,
  },
});
