Workflow Execution Application

Home Page -> List of all the Workflows + Create button to create new workflow
Editor -> Contains Node Library + Canva + Execution History + AI Assistant (this assistant will also show a plane.md file preview so that user can verify the plan created by the assistant before implementing)

Node Library -> Contains all the nodes with some shapes of their own.

Execution Engine

upload file to use in the doc node for LLM Node. (file will be uploaded to S3 bucket)
Chat Feature in the Editor
Workflow Execution history
Each Node with its state (Error, Warning, Idle)

Each node should have connectivity param, it can be connected to which other nodes. On click of any dummy node, all relevant nodes will be highlighted and others will be grayed out.
For each node, we should see the type of parent nodes

Code Refractoring ->
Check if context can be used to manage the state for nodes and the edges (effectively workflow state).

dummy Node ->
1. dummy node should also be movable like other nodes. (will be done in the next iteration of the project)

NodeActionDialog ->
1. add different tabs to the dialog box. Reduce scrolling.
2. add more parts to the NodeActionDialog (left -> input, center -> configs, right -> output)

TO DO ->
1. check dummy node implementation and why sepearately declaring that node is necessary. 

Node Details ->
include it can be connected to which all nodes, which all handles.
Add the property for every handle/node so that its easy to filter which nodes are eligible for a particular handle.
Understand the codebase.