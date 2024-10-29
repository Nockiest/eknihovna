import { emptyBook } from "@/data/values";
import { Book } from "@/types/types";
import {v4 as uuidv4} from 'uuid'
 
/**
 * Updates a specific property of a book based on the provided parameters.
 * If the book is null, creates a new book with a unique ID.
 * @param name - The name of the property to update.
 * @param value - The new value for the property.
 * @param type - The type of the property.
 * @param checked - Indicates if a checkbox property is checked.
 * @param book - The book object to update or null if creating a new book.
 * @returns The updated book object with the specified property modified.
 */
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