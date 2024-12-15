import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Image, FlatList } from "react-native";

import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    useThemeColor,
} from "@/components/Themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Match } from "../types/match";
import Loader from "../components/Loader";
import { filters, getSportName } from "../filters";
import ErrorMessage from "../components/ErrorMessage";
import { Picker } from "@react-native-picker/picker";

import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

export default function MatchManagement() {
    const router = useRouter();

    const currentAuthor = 15;

    const matchBackground = useThemeColor({}, "matchBackground");

    const { id } = useLocalSearchParams();

    const [loading, setLoading] = useState<boolean>(true);

    const [match, setMatch] = useState<Match>();

    const [title, setTitle] = useState<string>();
    const [address, setAddress] = useState<string>();
    const [selectedSport, setSelectedSport] = useState<string>(filters[0].value);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const createMatch = async () => {
        try {
            await axios.post("http://localhost:3000/matches", {
                author: 15,
                sport: selectedSport,
                title: title || "Non inserito",
                imgUrl: "https://www.instituteforgovernment.org.uk/sites/default/files/styles/16_9_desktop/public/2023-03/premier-league-football-1504x846px.jpg?h=dd1b06b1&itok=3dihrnpr",
                dateTime: selectedDate.toISOString(),
                address: address || "Non inserito",
                difficulty: Math.floor(Math.random() * 10) + 1,
                playerAvailable: 1,
                pendingPlayers: [],
                playersIn: [15],
            });

            router.replace(`/yours`);
        } catch (error) {
            console.log(error);
        }
    };

    const join = async () => {
        if (!match) return;

        try {
            await axios.put(`http://localhost:3000/matches/${match.id}`, {
                ...match,
                playersIn: [...match.playersIn, currentAuthor],
            });

            console.log({
                ...match,
                playersIn: [...match.playersIn, currentAuthor],
            });

            router.replace(`/joined`);
        } catch (error) {
            console.log(error);
        }
    };

    const isButtonDisabled: boolean = match
        ? match.playersIn.includes(currentAuthor)
        : false;

    const setDate = (event: DateTimePickerEvent, date: Date) => setSelectedDate(date);

    const getMatch = () => {
        //API CALL DELAY - 1s
        setTimeout(async () => {
            try {
                const response = await axios.get(`http://localhost:3000/matches/${id}`);
                setMatch(response.data);
            } finally {
                setLoading(false);
            }
        }, 1000);
    };

    useEffect(() => {
        if (id) getMatch();
        else setLoading(false);
    }, []);

    //LOADER
    if (loading) return <Loader />;

    return (
        <View style={styles.container}>
            {/* Use a light status bar on iOS to account for the black space above the modal */}
            <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />

            {match ? (
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>{match.title}</Text>
                    <Text>{getSportName(match.sport)}</Text>
                    <Text>Difficoltà: {match.difficulty}</Text>
                    <Text>Indirizzo: {match.address}</Text>
                    <Text>Data: {new Date(match.dateTime).toLocaleDateString()}</Text>
                    <Image source={{ uri: match.imgUrl }} style={styles.image} />

                    <Text>Partecipanti:</Text>
                    <FlatList
                        data={match.playersIn}
                        keyExtractor={(_, index) => String(index)}
                        renderItem={({ item }) => (
                            <Text>
                                {item} {item === currentAuthor ? "(tu)" : ""}
                            </Text>
                        )}
                    />
                </View>
            ) : id ? (
                <ErrorMessage message="Errore durante il caricamento della partita" />
            ) : (
                <View style={styles.contentContainer}>
                    {/* TITLE */}
                    <TextInput
                        placeholder="Title"
                        title="Titolo"
                        onChange={({ nativeEvent: { text } }) => setTitle(text)}
                    />

                    <TextInput
                        placeholder="Indirizzo"
                        title="Indirizzo"
                        onChange={({ nativeEvent: { text } }) => setAddress(text)}
                    />

                    {/* SPORT */}
                    <Picker
                        style={[styles.picker, { borderColor: matchBackground }]}
                        selectedValue={selectedSport}
                        onValueChange={(itemValue) => setSelectedSport(itemValue)}
                    >
                        {filters.map(({ name, value }, index) => (
                            <Picker.Item label={name} value={value} key={index} />
                        ))}
                    </Picker>

                    {/* DATE */}
                    <DateTimePicker
                        value={new Date()}
                        style={styles.datePicker}
                        onChange={setDate}
                    />
                </View>
            )}

            {/* CTA */}
            <TouchableOpacity
                style={styles.button}
                onPress={match ? join : createMatch}
                disabled={isButtonDisabled}
            >
                <Text style={isButtonDisabled ? styles.buttonDisabled : {}}>
                    {match ? "Partecipa" : "Crea"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",

        width: "100%",

        padding: 8,
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

    contentContainer: {
        flex: 1,
        alignItems: "center",

        width: "100%",

        gap: 8,
    },

    //IMAGE
    image: {
        maxWidth: 200,
        maxHeight: 200,
        width: "100%",
        height: "100%",

        borderRadius: 4,
    },

    //PICKER
    picker: {
        width: "100%",

        borderWidth: 1,

        borderRadius: 4,
    },

    //DAT PICKER
    datePicker: {
        marginHorizontal: "auto",
    },

    //BUTTON
    button: {
        marginBottom: 16,
    },
    buttonDisabled: {
        color: "gray",
    },
});
