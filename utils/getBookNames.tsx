import { fetchUniqueValues } from "./fetchUniqueValues";

export const getBookNames = async () => {
    const bookNames = await fetchUniqueValues("name");
    return bookNames
}