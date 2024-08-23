'use client'
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button as PrimaryButton } from '@mui/material';

interface Chunk {
  headers: any[];
  chunk: any[][];
}

interface DataChunksTableProps {
  chunks: Chunk[];
  uploadProgress: number;
  handleUploadChunk: (index: number) => void;
}

const DataChunksTable: React.FC<DataChunksTableProps> = ({ chunks, uploadProgress, handleUploadChunk }) => {
const [enableUpload, setEnableUpload] = useState(true)
useEffect(() => {setEnableUpload(true) }
, [uploadProgress])

return (
    <Box className="mt-6 w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
      <Typography variant="h2" className="text-xl font-semibold mb-4 p-4">
        Data Chunks
      </Typography>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chunk</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rows</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {chunks.map((chunk, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`Chunk ${index + 1}`}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{chunk.chunk.length} rows</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <PrimaryButton
                  onClick={() => {
                    setEnableUpload(false)
                    handleUploadChunk(index)}}

                >
                  Upload
                </PrimaryButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

export default DataChunksTable;
