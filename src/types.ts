export type Filter = {
    name: string
    type?: 'boolean'
    value: string
}

export type TruthyValues =  'yes'| 'true'| true| 1|'ano'
export const  isInTruthyValues = (value: string|boolean): string => {
    if (!value) {
        return 'false'
    }
    const lowerCaseValue = value.toString().toLowerCase();
    return ['yes', 'true', true,'ano', '1'].includes(lowerCaseValue).toString();
  };