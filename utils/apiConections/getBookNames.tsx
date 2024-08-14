import  fetchUniqueValues  from   "@/utils/apiConections/fetchUniqueValues";

export const getBookNames = async () => {
    const bookNames = await fetchUniqueValues("name");
    return bookNames
}