'use client'
import { PrimaryButton } from '@/theme/buttons/Buttons';
import { Box, Typography } from '@mui/material';
import  { useState } from 'react';
import { Result } from '@zxing/library';

import BarcodeScannerComponent from 'react-qr-barcode-scanner';
// type Result = {
//     text: string;
//   };

  // make test barcode
  // load data from barcode
  // send the information to db
  // set up authentication
const Page = () => {
  const [scanning, setScanning] = useState(false);
  const [barcodeData, setBarcodeData] = useState('');

  const handleScan = (error: unknown, result?: Result | undefined): void => {
    if (result) {
      const supportedFormats = ['EAN_13', 'QR_CODE', 'CODE_128'];
      if (supportedFormats.includes(result.getBarcodeFormat())) {
        setBarcodeData(result.getText());
        setScanning(false);
      } else {
        console.warn('Unsupported barcode format:', result.getBarcodeFormat());
      }
    } else if (error) {
      console.error('Error scanning barcode:', error);
    }
  };

  return (
    <Box>
      <Typography variant='h1'>Checkout Page</Typography>
      <PrimaryButton onClick={() => setScanning(!scanning)}>
        {scanning ? 'Přestat nahrávat' : 'Nahrát čárový kód'}
      </PrimaryButton>
      {scanning && (
       <BarcodeScannerComponent
       width={500}
       height={500}
       onUpdate={(error, result) => handleScan(error, result)}
    //    options={{
    //      formatsToSupport: [
    //        'ean_13',
    //        'qr_code',
    //        'code_128',
    //        'code_39',
    //        'upc_a',
    //      ], // Add additional formats as needed
    //    }}
     />


      )}
      {barcodeData && <p>Scanned Barcode: {barcodeData}</p>}
    </Box>
  );
};

export default Page;