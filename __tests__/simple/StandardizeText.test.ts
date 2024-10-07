import { standardizeText } from "@/utils/searchingUtils";

describe('standardizeText', () => {

    // Converts text to lowercase
    it('should convert all characters to lowercase when given mixed case input', () => {
      const input = "HeLLo WoRLD";
      const expectedOutput = "hello world";
      const result = standardizeText(input);
      expect(result).toBe(expectedOutput);
    });

    // Handles empty string input
    it('should return an empty string when given an empty string', () => {
      const input = "";
      const expectedOutput = "";
      const result = standardizeText(input);
      expect(result).toBe(expectedOutput);
    });
});
