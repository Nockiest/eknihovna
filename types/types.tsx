
export type Book = {
    id: string
    name: string
    author?: string
    category: string
    genres?:string[]
    rating?: number
    available?: boolean
    formaturita?: boolean
    zpusob_ziskani?: string
    signatura?:string
    isbn?:string
    createdat?: Date
    updatedat?: Date
}

export type NavButton = {
    URL: string;
    label: string;
  }

export type StringedBool = "true" | "false";

export  type Filters= {
  name: string|null ;
  author?: string[];
  category?: string[];
  genres?: string[];
  formaturita?: boolean|null;
  id?: string|null;
  available?: boolean|null;
  // rating: number;

};

  export type FiltringValues = {
    category: string[];
    genres: string[];
    author: string[];
    name: string[] ;
  };

 export  interface QueueItem {
    value: string;
    id: string;
  }
// export type UploadJsonData = {
//   headers: string[];
//   rows: any[];
// }