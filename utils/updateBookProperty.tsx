import { emptyBook } from "@/data/values";
import { Book } from "@/types/types";
import {v4 as uuidv4} from 'uuid'
const updateBookProperty = (name: string, value: string, type: string, checked: boolean, book: Book | null): Book => {
    let newValue: string | string[] | boolean | number = value;

    if (type === "checkbox") {
      newValue = checked;
    } else if (name === "genres") {
      newValue = value.split(",").map((v) => v.trim());
    } else if (type === "number") {
      newValue = value ? parseInt(value, 10) : -1;
    }

    if (!book) {
      const newBook: Book = { ...emptyBook, id: uuidv4() };
      return newBook;
    } else {
      return {
        ...book,
        [name]: newValue,
        id: name === "id" ? String(newValue) : book.id ? book.id : uuidv4(),
      };
    }
  };

export default updateBookProperty