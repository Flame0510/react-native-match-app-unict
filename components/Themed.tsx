/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
    Text as DefaultText,
    View as DefaultView,
    TextInput as DefaultTextInput,
    TouchableOpacity as DefaultTouchableOpacity,
    StyleSheet,
} from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

type ThemeProps = {
    lightColor?: string;
    darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type TextInputProps = ThemeProps & DefaultTextInput["props"] & { title?: string };
export type TouchableOpacityProps = ThemeProps & DefaultTouchableOpacity["props"];

export function useThemeColor(
    props: { light?: string; dark?: string },
    colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
    const theme = useColorScheme() ?? "light";
    const colorFromProps = props[theme];

    if (colorFromProps) {
        return colorFromProps;
    } else {
        return Colors[theme][colorName];
    }
}

export function Text(props: TextProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

    return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "background"
    );

    return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function TouchableOpacity(props: TouchableOpacityProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const matchBackground = useThemeColor(
        { light: lightColor, dark: darkColor },
        "matchBackground"
    );

    return (
        <DefaultTouchableOpacity
            style={[{ borderColor: matchBackground }, style, styles.button]}
            {...otherProps}
        />
    );
}

export function TextInput(props: TextInputProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const borderColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "matchBackground"
    );

    return (
        <View style={styles.inputContainer}>
            <Text style={styles.inputTitle}>{props.title}</Text>
            <DefaultTextInput
                style={[{ borderColor }, style, styles.input]}
                {...otherProps}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        width: "100%",
    },
    inputTitle: {
        marginBottom: 4,
    },
    input: {
        padding: 8,

        borderWidth: 1,
        borderRadius: 4,
    },

    button: {
        padding: 16,

        borderWidth: 1,
        borderRadius: 8,
    },
});
