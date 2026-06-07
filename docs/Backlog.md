Add pin data feature
Add ai assistant, the agent in that assistant should be the ai workflow.
Add global variables

Nodes issues ->
1. type: to be changed from json -> some better thing: Done

Priority ->
1. Add Error handling in frontend for get workflow and save workflow api.
2. Add common validation for node/workflow execution and workflow save.
3. config fields of a node are once added then can not be changed just with definition.
1. Node-Execution Api should only expect nodeId as other things are already in the backend and saved. If saving needed -> save it, then call execute node else directly call execute node.

add tanstack query's query client instead of global _token (setToken and getToken)