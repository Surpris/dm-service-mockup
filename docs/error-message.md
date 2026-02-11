# error message

## From the devtool of browsr

```plaintext
GraphView.tsx:52 [React Flow]: The React Flow parent container needs a width and a height to render the graph. Help: https://reactflow.dev/error#004
<ForwardRef(ReactFlow)>
GraphView	@	GraphView.tsx:52
<GraphView>
GraphContainerContent	@	GraphContainer.tsx:105
<GraphContainerContent>
GraphContainer	@	GraphContainer.tsx:123
<GraphContainer>
GraphPage	@	GraphPage.tsx:20
<GraphPage>
App	@	App.tsx:38
```

## details in the error#004

The React Flow parent container needs a width and a height to render the graph.
Under the hood, React Flow measures the parent DOM element to adjust the renderer. If you try to render React Flow in a regular div without a height, we cannot display the graph. If you encounter this warning, you need to make sure that your wrapper component has some CSS attached to it so that it gets a fixed height or inherits the height of its parent.

This will cause the warning:

```typescript
import { ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

function Flow(props) {
  return (
    <div>
      <ReactFlow {...props} />
    </div>
  );
}
```

Working example:

```typescript
import { ReactFlow } from '@xyflow/react';

function Flow(props) {
  return (
    <div style={{ height: 800 }}>
      <ReactFlow {...props} />
    </div>
  );
}
```
