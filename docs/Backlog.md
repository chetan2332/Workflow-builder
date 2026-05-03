Add pin data feature
Add ai assistant, the agent in that assistant should be the ai workflow.
Add global variables

Nodes issues ->
1. type: to be changed from json -> some better thing
3. NodeDialogBox is not looking good, improve its UI and UX.

Priority ->
1. Node-Execution Api should only give nodeId as other things are already in the backend and saved. If saving needed -> save it, then call execute node else directly call execute node.
2. No need to validateOutputIsArray in runners/node-executor, enforce it using ts.
3. remove legacy types