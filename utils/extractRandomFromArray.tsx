const getRandomOptions = (options: any[], numResults:number = 10) => {
    const shuffled = [...options].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numResults);
  };
  export default getRandomOptions