import type { NodeTypes } from '@xyflow/react';
import {
  CircleNode,
  OppositeDNode,
  RoundedRectangleNode,
} from './NodeShapes';

export const nodeTypes: NodeTypes = {
  circle: CircleNode,
  oppositeD: OppositeDNode,
  roundedRectangle: RoundedRectangleNode,
};

