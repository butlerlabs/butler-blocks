import { ButlerColorSet } from 'documentLabeler/color/ColorUtils';
import { MockDocumentLabelerData } from 'documentLabeler/MockDocumentLabelerData.stories';
import { DocumentLabelerReducerUtils } from 'documentLabeler/state/DocumentLabelerReducerUtils';

describe('getAllColoredFields', () => {
  it('should correctly map colors for both fields and tables', () => {
    const expectedFieldColors = ButlerColorSet.slice(0, 4);
    const expectedTableColors = ButlerColorSet.slice(4, 5);
    const { fields, tables } = DocumentLabelerReducerUtils.getAllColoredFields(
      MockDocumentLabelerData.documentLabelerData,
    );
    const outputFieldColors = fields.map((field) => field.color);
    expect(outputFieldColors).toMatchObject(expectedFieldColors);
    const outputTableColors = tables.map((table) => table.color);
    expect(outputTableColors).toMatchObject(expectedTableColors);
  });
});
