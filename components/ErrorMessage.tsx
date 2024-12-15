import { StyleSheet, View } from "react-native";

import { Text } from "./Themed";

const ErrorMessage = ({ message }: { message: string }) => {
    return (
        <View style={styles.container}>
            <Text>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default ErrorMessage;
