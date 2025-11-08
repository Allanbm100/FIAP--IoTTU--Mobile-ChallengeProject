import { StyleSheet } from 'react-native';
import { BORDER_RADIUS, COLORS, SPACING } from './Theme';

export const GlobalStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    },
    
    mainContent: {
        flex: 1,
        padding: SPACING.medium,
    },

    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.TEXT_PRIMARY,
        marginBottom: SPACING.large,
        textAlign: 'center',
    },
    
    link: {
        color: COLORS.PRIMARY,
        fontSize: 14,
        fontWeight: '600',
    },

    shadowContainer: {
        backgroundColor: COLORS.CONTAINER_BG,
        borderRadius: BORDER_RADIUS * 2,
        padding: SPACING.xl,
        
        shadowColor: COLORS.SHADOW,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        
        elevation: 8, 
        borderWidth: 1,
        borderColor: COLORS.BORDER,
    },
});