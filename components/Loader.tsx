import { StyleSheet, View } from "react-native";

import { Text } from "./Themed";

const Loader = () => {
    return (
        <View style={styles.container}>
            <Text>Caricamento...</Text>
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

export default Loader;
