import { checkSearchRelevant } from "@/utils/searchingUtils";

describe('checkSearchRelevant', () => {

    // Returns true when keyword contains query
    it('should return true when keyword contains query', () => {
      const keyword = "Hello World";
      const query = "World";
      const result = checkSearchRelevant(keyword, query);
      expect(result).toBe(true);
    });

    // Handles keyword and query with multiple spaces correctly
    it('should handle multiple spaces in keyword and query correctly', () => {
      const keyword = "  Hello   World  ";
      const query = "  World  ";
      const result = checkSearchRelevant(keyword, query);
      expect(result).toBe(true);
    });

    it('should do find match even when worods are differently formated', () => {
        const keyword = "  Hello World  ";
        const query = "    WoRLd  ";
        const result = checkSearchRelevant(keyword, query);
        expect(result).toBe(true);
      });
});
