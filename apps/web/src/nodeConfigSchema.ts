export type NodeType = 'TRIGGER' | 'CODE' | 'CONDITION' | 'OTHER';

export type NodeShape = 'circle' | 'oppositeD' | 'roundedRectangle';

export type HandleSide = 'left' | 'right' | 'top' | 'bottom';

export type HandleKind = 'input' | 'output';

export type HandleConfig = {
  id: string;
  side: HandleSide;
  kind: HandleKind;
  type: string;
  label?: string;
};

export type ActionFieldType = 'string' | 'number' | 'textarea' | 'select';

export type ActionField = {
  id: string;
  label: string;
  type: ActionFieldType;
  defaultValue?: string | number;
  required?: boolean;
};

export type NodeActionConfig = {
  title: string;
  description?: string;
  fields: ActionField[];
};

export type NodeTemplateConfig = {
  nodeId: string;
  name: string;
  nodeType: NodeType;
  description: string;
  shape: NodeShape;
  handles: HandleConfig[];
  action?: NodeActionConfig;
};

