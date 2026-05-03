import type { PanelConfig } from './field';

/**
 * UI configuration for node dialog
 */
export type UIConfig = {
  layout: 'two-column' | 'three-column';
  leftPanel: PanelConfig;
  centerPanel?: PanelConfig;  // Optional - null for two-column layout
  rightPanel: PanelConfig;
};
