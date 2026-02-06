import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Database } from 'lucide-react';

const DatasetNode = ({ data }: NodeProps) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-green-500 min-w-[150px]">
      <div className="flex items-center">
        <div className="rounded-full w-8 h-8 flex justify-center items-center bg-green-100">
          <Database size={16} className="text-green-500" />
        </div>
        <div className="ml-2">
          <div className="text-sm font-bold text-gray-700">{data.label}</div>
          {data.datasetNo !== undefined && (
            <div className="text-xs text-gray-500">No. {data.datasetNo}</div>
          )}
        </div>
      </div>
      <Handle
        type="target"
        position={data.targetPosition || Position.Top}
        className="w-3 h-3 bg-green-500"
      />
      <Handle
        type="source"
        position={data.sourcePosition || Position.Bottom}
        className="w-3 h-3 bg-green-500"
      />
    </div>
  );
};

export default memo(DatasetNode);
