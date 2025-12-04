import GeneralMethods from '../../src/utils/general.methods';

describe('GeneralMethods', () => {
  describe('normalizeUrlExtraSlashes', () => {
    it('should remove double slashes in the path', () => {
      const input = 'http://example.com//path//to//page';
      const result = GeneralMethods.normalizeUrlExtraSlashes(input);
      expect(result).toBe('http://example.com/path/to/page');
    });

    it('should remove triple or more slashes in the path', () => {
      const input = 'http://example.com///path///to///page';
      const result = GeneralMethods.normalizeUrlExtraSlashes(input);
      expect(result).toBe('http://example.com/path/to/page');
    });

    it('should add http:// prefix if no protocol is provided', () => {
      const input = 'example.com/path/to/page';
      const result = GeneralMethods.normalizeUrlExtraSlashes(input);
      expect(result).toBe('http://example.com/path/to/page');
    });

    it('should preserve https:// protocol', () => {
      const input = 'https://example.com//path//to//page';
      const result = GeneralMethods.normalizeUrlExtraSlashes(input);
      expect(result).toBe('https://example.com/path/to/page');
    });

    it('should handle URL with query parameters', () => {
      const input = 'http://example.com//path?query=value';
      const result = GeneralMethods.normalizeUrlExtraSlashes(input);
      expect(result).toBe('http://example.com/path?query=value');
    });

    it('should handle URL with hash fragment', () => {
      const input = 'http://example.com//path#section';
      const result = GeneralMethods.normalizeUrlExtraSlashes(input);
      expect(result).toBe('http://example.com/path#section');
    });

    it('should handle URL with port number', () => {
      const input = 'http://example.com:8080//path//to//page';
      const result = GeneralMethods.normalizeUrlExtraSlashes(input);
      expect(result).toBe('http://example.com:8080/path/to/page');
    });

    it('should handle root path with double slashes', () => {
      const input = 'http://example.com//';
      const result = GeneralMethods.normalizeUrlExtraSlashes(input);
      expect(result).toBe('http://example.com/');
    });

    it('should handle URL without extra slashes', () => {
      const input = 'http://example.com/path/to/page';
      const result = GeneralMethods.normalizeUrlExtraSlashes(input);
      expect(result).toBe('http://example.com/path/to/page');
    });
  });
});
