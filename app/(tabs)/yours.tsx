import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/MatchList";
import { Text, View } from "@/components/Themed";
import MatchList from "@/components/MatchList";

export default function Yours() {
    return (
        <View style={styles.container}>
            <MatchList type="yours" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: "80%",
    },
});
