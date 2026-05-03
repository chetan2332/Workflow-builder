"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWorkflowDto = exports.SaveEdgeDto = exports.SaveNodeDto = void 0;
class SaveNodeDto {
    id;
    templateId;
    label;
    positionX;
    positionY;
    actionState;
}
exports.SaveNodeDto = SaveNodeDto;
class SaveEdgeDto {
    id;
    sourceNodeId;
    targetNodeId;
    sourceHandle;
    targetHandle;
}
exports.SaveEdgeDto = SaveEdgeDto;
class UpdateWorkflowDto {
    name;
    description;
    status;
    nodes;
    edges;
}
exports.UpdateWorkflowDto = UpdateWorkflowDto;
//# sourceMappingURL=save-workflow.dto.js.map