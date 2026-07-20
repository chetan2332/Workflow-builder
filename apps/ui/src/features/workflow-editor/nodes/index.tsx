import { NodeShape } from '@n8n-project/shared';
import { CircleNode, OppositeDNode, RoundedRectangleNode, RectangleWithTextNode, DNode } from './NodeShapes';
import { DummyNode } from './DummyNode';

export const nodeTypes = {
  [NodeShape.CIRCLE]:               CircleNode,
  [NodeShape.OPPOSITE_D]:           OppositeDNode,
  [NodeShape.ROUNDED_RECTANGLE]:    RoundedRectangleNode,
  [NodeShape.RECTANGLE_WITH_TEXT]:  RectangleWithTextNode,
  [NodeShape.D]:                    DNode,
  dummy:                            DummyNode,
};
