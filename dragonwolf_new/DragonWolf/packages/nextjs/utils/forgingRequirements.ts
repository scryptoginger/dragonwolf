export const forgingRequirements: { [key: number]: number[] } = {
  3: [0, 1], // To forge token 3, burn one each of tokens 0 and 1
  4: [1, 2], // To forge token 4, burn one each of tokens 1 and 2
  5: [0, 2], // To forge token 5, burn one each of tokens 0 and 2
  6: [0, 1, 2], // To forge token 6, burn one each of tokens 0, 1, and 2
};
