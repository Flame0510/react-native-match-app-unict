import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, ScrollView } from "react-native";

import { Text, useThemeColor, View, TouchableOpacity } from "./Themed";

import { MatchListType } from "@/types/match-list";

import { useRouter } from "expo-router";
import { Match } from "../types/match";
import { Filter } from "../types/filter";

import axios from "axios";
import Loader from "./Loader";
import { filters, getSportName } from "../filters";
import ErrorMessage from "./ErrorMessage";

export default function MatchList({ type }: MatchListType) {
    const router = useRouter();

    const matchBackground = useThemeColor({}, "matchBackground");
    const activeFilterColor = useThemeColor({}, "activeFilterColor");
    const tint = useThemeColor({}, "tint");

    const currentAuthor = 15;

    const [matches, setMatches] = useState<Match[]>([]);

    const [loading, setLoading] = useState<boolean>(true);

    const [selectedFilter, setSelectedFilter] = useState<Filter>();

    const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);

    const getMatches = () => {
        //API CALL DELAY - 1s
        setTimeout(async () => {
            try {
                const response = await axios.get("http://localhost:3000/matches");
                setMatches(response.data.matches);
            } finally {
                setLoading(false);
            }
        }, 1000);
    };

    useEffect(() => {
        getMatches();
    }, []);

    useEffect(() => {
        matches.length &&
            setFilteredMatches(
                matches.filter(({ sport, author, playersIn }) => {
                    let condition = true;

                    switch (type) {
                        case "yours":
                            condition = author === currentAuthor;
                            break;
                        case "joined":
                            condition = playersIn?.includes(currentAuthor);
                            break;
                    }

                    return (
                        condition &&
                        (selectedFilter?.value ? sport === selectedFilter?.value : true)
                    );
                })
            );
    }, [selectedFilter, matches]);

    const selectFilter = (filter: Filter) =>
        setSelectedFilter(filter.value !== selectedFilter?.value ? filter : undefined);

    const isFilterActive = (filter: Filter) => filter.value === selectedFilter?.value;

    //LOADER
    if (loading) return <Loader />;

    return (
        <View style={styles.container}>
            {/* MATCHES */}
            <View style={styles.matchesContainer}>
                {filteredMatches.length > 0 ? (
                    <FlatList
                        data={filteredMatches}
                        keyExtractor={(item) => String(item.id)}
                        contentContainerStyle={styles.matchesContentContainer}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.item,
                                    { backgroundColor: matchBackground },
                                ]}
                                onPress={() =>
                                    router.push(`/match-management?id=${item.id}`)
                                }
                            >
                                <Text>{item.title}</Text>
                                <Text>{getSportName(item.sport)}</Text>
                                <Text>Difficoltà: {item.difficulty}</Text>
                                <Text>Partecipanti: {item.playersIn?.length}</Text>
                                <Text>
                                    Data: {new Date(item.dateTime).toLocaleDateString()}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                ) : (
                    <ErrorMessage message="Non ci sono partite" />
                )}
            </View>

            {/* FILTERS */}
            <View>
                <ScrollView style={styles.scrollViewContainer}>
                    <View style={styles.filtersContainer}>
                        {filters.map((filter, index) => (
                            <TouchableOpacity
                                style={[
                                    styles.item,
                                    styles.filter,
                                    isFilterActive(filter) && {
                                        borderColor: tint,
                                        backgroundColor: tint,
                                    },
                                ]}
                                key={index}
                                onPress={() => selectFilter(filter)}
                            >
                                <Text
                                    style={
                                        isFilterActive(filter) && {
                                            color: activeFilterColor,
                                        }
                                    }
                                >
                                    {filter.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 8,

        width: "100%",
        height: "100%",

        padding: 16,
    },

    item: {
        padding: 16,
        borderRadius: 8,
    },

    //MATCHES
    matchesContainer: {
        flex: 1,
    },
    matchesContentContainer: {
        gap: 8,
    },

    //SCROLLVIEW

    //FILTERS
    filtersContainer: {
        flexDirection: "row",

        gap: 8,
    },
    scrollViewContainer: {
        flexDirection: "row",

        width: "100%",

        overflowY: "hidden",
    },
    filter: {
        flex: 1,

        borderWidth: 1,
    },
});
