// export type Filter = {
//     name: string
//     value: string|boolean
// }
export  type Filters= {
    [key: string]: string | boolean;
  };
export type TruthyValues =  'yes'| 'true'| true| 1|'ano'
export const  isInTruthyValues = (value: string|boolean): boolean => {
    if (!value) {
        return  false
    }
    const lowerCaseValue = value.toString().toLowerCase();
    return ['yes', 'true', true,'ano', '1'].includes(lowerCaseValue)
  };