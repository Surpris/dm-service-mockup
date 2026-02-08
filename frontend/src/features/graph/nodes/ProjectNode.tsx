import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Folder } from 'lucide-react';

const ProjectNode = ({ data }: NodeProps) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-blue-500 min-w-[150px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex justify-center items-center bg-blue-100">
          <Folder size={16} className="text-blue-500" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold text-gray-700">{data.label}</div>
          {data.projectNumber && (
            <div className="text-xs text-gray-500">{data.projectNumber}</div>
          )}
        </div>
      </div>
      {/* Target handle on Top */}
      <Handle
        type="target"
        position={data.targetPosition || Position.Top}
        className="w-3 h-3 bg-blue-500"
      />
      {/* Source handle on Bottom */}
      <Handle
        type="source"
        position={data.sourcePosition || Position.Bottom}
        className="w-3 h-3 bg-blue-500"
      />
    </div>
  );
};

export default memo(ProjectNode);
