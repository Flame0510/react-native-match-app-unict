import { Filter } from "./types/filter";

export const filters: Filter[] = [
    { name: "Calcio", value: "football" },
    { name: "Basket", value: "basket" },
    { name: "Baseball", value: "baseball" },
    { name: "Tennis", value: "tennis" },
    { name: "Volleyball", value: "volleyball" },
    { name: "Hockey", value: "hockey" },
];

export const getSportName = (filterValue: string) =>
    filters.find(({ value }) => value === filterValue)?.name;
