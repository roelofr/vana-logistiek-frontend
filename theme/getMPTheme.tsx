import {PaletteMode, ThemeOptions} from '@mui/material/styles';
import {getDesignTokens} from './themePrimitives';
import {
    dataDisplayCustomizations,
    feedbackCustomizations,
    inputsCustomizations,
    navigationCustomizations,
} from './customizations';

export default function getMPTheme(mode: PaletteMode): ThemeOptions {
    return {
        ...getDesignTokens(mode),
        components: {
            ...inputsCustomizations,
            ...dataDisplayCustomizations,
            ...feedbackCustomizations,
            ...navigationCustomizations,
        },
    };
}
