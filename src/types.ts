export type StringedBool = "true" | "false";

export  type Filters= {
    name: string|null ;
    author: string[];
    category: string[];
    genres: string[];
    formaturita: StringedBool|null;
    available: StringedBool|null;
  };