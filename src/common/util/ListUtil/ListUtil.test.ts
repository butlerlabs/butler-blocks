import { ListUtil } from "common/util/ListUtil/ListUtil";

const startArray = [1, 2, 3];

describe('ListUtil', () => {
  describe('replaceElementAtIndex', () => {
    it('should correctly replace for index 0', () => {
      const index0splice = ListUtil.replaceElementAtIndex(0, 0, startArray);
      expect(index0splice).toMatchObject([0, 2, 3]);
    });
    it('should correctly replace for an index in the middle of the array', () => {
      const index2splice = ListUtil.replaceElementAtIndex(1.5, 1, startArray);
      expect(index2splice).toMatchObject([1, 1.5, 3]);
    });
    it('should correctly replace for the last index of the array', () => {
      const index3splice = ListUtil.replaceElementAtIndex(0, 2, startArray);
      expect(index3splice).toMatchObject([1, 2, 0]);
    });
    it('should insert the item at the end of the array if the index is the array length', () => {
      const index3splice = ListUtil.replaceElementAtIndex(4, 3, startArray);
      expect(index3splice).toMatchObject([1, 2, 3, 4]);
    });
    it('should throw an error for negative indices', () => {
      expect(() => ListUtil.replaceElementAtIndex(0, -1, startArray)).toThrow();
    });
    it('should throw an error for indices larger than the array length', () => {
      expect(() => ListUtil.replaceElementAtIndex(4, 4, startArray)).toThrow();
    });
    it('should work for one element', () => {
      const oneItemSplice = ListUtil.replaceElementAtIndex(1, 0, [0]);
      expect(oneItemSplice).toMatchObject([1]);
    })
  });
});
