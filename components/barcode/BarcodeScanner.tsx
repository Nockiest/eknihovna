"use client"
import React, { Component, useState } from 'react'
import Scanner from './Scanner'
import ArrowBack from '@mui/icons-material/ArrowBack'
import Link from 'next/link'
import { Fab, Paper, TextareaAutosize } from '@mui/material'

interface BarcodeScannerProps {
  scanning: boolean;
  setScanning: React.Dispatch<React.SetStateAction<boolean>>;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ scanning, setScanning }) => {
  const [results, setResults] = useState<any[]>([]);

  const handleScanToggle = () => {
    setScanning(!scanning);
  };

  const handleDetected = (result: any) => {
    setResults([result]);
  };

  return (
    <div>
      <Link href="/">
        <Fab style={{ marginRight: 10 }} color="secondary">
          <ArrowBack />
        </Fab>
      </Link>
      <span>Barcode Scanner</span>

      <Paper variant="outlined" style={{ marginTop: 30, width: 640, height: 320 }}>
        <Scanner onDetected={handleDetected} />
      </Paper>

      <TextareaAutosize
        style={{ fontSize: 32, width: 320, height: 100, marginTop: 30 }}
        // rowsMax={4}
        defaultValue={'No data scanned'}
        value={results[0] ? results[0].codeResult.code : 'No data scanned'}
      />
    </div>
  );
};

export default BarcodeScanner;