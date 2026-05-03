import type { NodeTypes } from '@xyflow/react';
import {
  CircleNode,
  OppositeDNode,
  RoundedRectangleNode,
  RectangleWithTextNode,
} from './NodeShapes';
import { DummyNode } from './DummyNode';

export const nodeTypes: NodeTypes = {
  circle: CircleNode,
  oppositeD: OppositeDNode,
  roundedRectangle: RoundedRectangleNode,
  rectangleWithText: RectangleWithTextNode,
  dummy: DummyNode,
};

