import { truthyValues } from "@/data/values";
import { v4 as uuidv4 } from "uuid";
export default function sanitizeBook(item: any) {
    return {
      id: item.id || uuidv4(), // Generate ID if not present
      name:
        typeof item.name === "string" || typeof item.name == "number"
          ? String(item.name).trim().substring(0, 255)
          : "",
      author:
        typeof item.author === "string"
          ? item.author.trim().substring(0, 255)
          : "",
      category:
        typeof item.category === "string"
          ? item.category
              .trim()
              .substring(0, 50)
              .toLowerCase()
              .replace(/^\w/, (c: string) => c.toUpperCase())
          : "",
      signatura:
        typeof item.signatura === "string"
          ? item.signatura
              .trim()
              .substring(0, 50)
              .toLowerCase()
              .replace(/^\w/, (c: string) => c.toUpperCase())
          : "",
      zpusob_ziskani:
        typeof item.zpusob_ziskani === "string"
          ? item.zpusob_ziskani.trim().substring(0, 100)
          : "",
      genres: Array.isArray(item.genres)
        ? item.genres
            .map((v: any) =>
              typeof v === "string" ? v.trim().substring(0, 50) : ""
            )
            .filter(Boolean)
        : [],
      formaturita: truthyValues.indexOf(item.formaturita) >= 0 ? true : false,
      available: truthyValues.indexOf(item.available) >= 0 ? true : false,
      rating:
        item.rating !== null &&
        !isNaN(Number(item.rating)) &&
        item.rating >= 0
          ? Number(item.rating)
          : null,
      isbn:
        typeof item.isbn === "number"
          ? String(item.isbn)
          : typeof item.isbn === "string" && /^\d+$/.test(item.isbn) // Checks for only digits in the string
          ? String(item.isbn)
          : "",
      createdat: item.createdat || new Date(),
      updatedat: new Date(),
    };
  }