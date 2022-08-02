import { ColumnSpecsUtil } from "common/dataTable/columnSpecsUtil/ColumnSpecsUtil";

describe('Column Specs Util', () => {
  describe('calcColumnSpecs', () => {
    it('should return correctly for one column', () => {
      const expectedOutput = ['calc(100% - 24px)', '24px'].map((value) => ({
        width: value,
      }));
      expect(ColumnSpecsUtil.calcColumnSpecs(1)).toEqual(expectedOutput);
    });

    it('should return correctly for four column', () => {
      const expectedOutput = [
        'calc(25% - 6px)',
        'calc(25% - 6px)',
        'calc(25% - 6px)',
        'calc(25% - 6px)',
        '24px',
      ].map((value) => ({
        width: value,
      }));
      expect(ColumnSpecsUtil.calcColumnSpecs(4)).toEqual(expectedOutput);
    });
  });
});
