# refactor: Migrate from reactflow to @xyflow/react for React 19

## Overview

Currently, because you're using `reactflow` (v11) in a React 19 environment, the following warning appears in the console every time a component renders.

> [React Flow]: It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't for your purpose, please define the nodeTypes/edgeTypes outside of the component or memoize them.

Since the warning persists even when you memoize `nodeTypes` with `useMemo`, this is likely a compatibility issue between React 19 and `reactflow` v11 (a false positive due to Strict Mode or differences in rendering behavior).

To resolve this issue, we will be migrating to the successor package `@xyflow/react`, which officially supports React 19.

## Changes

### 1. Package Dependencies Updated

- Removed `reactflow`
- Added `@xyflow/react`

### 2. Source Code Modifications

Modify the import statements and CSS load paths in the following files:

- **Main Component**
- `src/.../GraphView.tsx`
- Change the `import` source to `@xyflow/react`
- Change CSS to `@xyflow/react/dist/style.css`
- Move the `nodeTypes` definition out of the component (or remove `useMemo` and revert to the standard implementation)

- **Custom Node Component**
- `src/.../nodes/DatasetNode.tsx`
- `src/.../nodes/ProjectNode.tsx`
- `src/.../nodes/ContributorNode.tsx`
- Change the import source of `Handle`, `Position`, `NodeProps`, etc. to `@xyflow/react`

## Completion Conditions

- Start the application with `npm run dev` and the graph should be displayed.
- There should be no `[React Flow]`-related warnings (warnings about regenerating nodeTypes) in the browser console.
- Existing graph operations (dragging nodes, connecting them, changing layout, etc.) should work properly.

## References

- [React Flow Migration Guide (v11 to v12)](https://reactflow.dev/learn/troubleshooting/migrate-to-v12)
