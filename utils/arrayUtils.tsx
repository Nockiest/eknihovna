export const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };

  export const getRandomArrayElements = (options: any[], numResults:number = 10) => {
    const shuffled = [...options].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numResults);
  };
