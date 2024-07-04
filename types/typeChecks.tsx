import { StringedBool } from "@/types/types";

export function isStringedBool(value: any): value is StringedBool{
    return value === 'true' || value === 'false';
}

export function isBool(value: any): value is StringedBool{
    return value ===  true  || value ===  false ;
}