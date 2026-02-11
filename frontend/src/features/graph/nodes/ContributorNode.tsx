import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';
import { User } from 'lucide-react';

type ContributorNodeData = {
  label: string;
  targetPosition?: Position;
  sourcePosition?: Position;
};

type ContributorNodeType = Node<ContributorNodeData, 'contributor'>;

const ContributorNode = ({ data }: NodeProps<ContributorNodeType>) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-purple-500 min-w-[150px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex justify-center items-center bg-purple-100">
          <User size={16} className="text-purple-500" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold text-gray-700">{data.label}</div>
        </div>
      </div>
      <Handle
        type="target"
        position={data.targetPosition || Position.Top}
        className="w-3 h-3 bg-purple-500"
      />
      <Handle
        type="source"
        position={data.sourcePosition || Position.Bottom}
        className="w-3 h-3 bg-purple-500"
      />
    </div>
  );
};

export default memo(ContributorNode);
