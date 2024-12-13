// 'use client'
// import React, { useState } from 'react';
// import { QrReader } from 'react-qr-reader';


// interface TestProps {
//   // Define any props if needed
// }

// const Page: React.FC<TestProps> = (props) => {
//   const [data, setData] = useState<string>('No result');

//   return (
//     <>
//       <QrReader
//         onResult={(result: any, error: Error | null|undefined) => {
//           if (result) {
//             setData(result?.text);
//           }

//           if (error) {
//             console.info(error);
//           }
//         }}
//         scanDelay={2000}
//         constraints={{facingMode: 'user'}}
//         // style={{ width: '100%' }}
//       />
//       <p>{data}</p>
//     </>
//   );
// };

// export default Page;

'use client'
import { PrimaryButton } from '@/theme/buttons/Buttons';
import { Box, Typography } from '@mui/material';
import  { useState } from 'react';
import { Result } from '@zxing/library';

import BarcodeScannerComponent from 'react-qr-barcode-scanner';
// import BarcodeScanner from '@/components/barcode/BarcodeScanner';
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

//   const handleScan = (error: unknown, result?: Result | undefined): void => {
//     if (result) {
//       const supportedFormats = ['EAN_13', 'QR_CODE', 'CODE_128'];
//       if (supportedFormats.includes(result.getBarcodeFormat())) {
//         setBarcodeData(result.getText());
//         setScanning(false);
//       } else {
//         console.warn('Unsupported barcode format:', result.getBarcodeFormat());
//       }
//     } else if (error) {
//       console.error('Error scanning barcode:', error);
//     }
//   };

  return (
    <Box>

      <Typography variant='h1'>Checkout Page</Typography>
      <PrimaryButton onClick={() => setScanning(!scanning)}>
        {scanning ? 'Přestat nahrávat' : 'Nahrát čárový kód'}
      </PrimaryButton>
      {/* {scanning && (
    //    <BarcodeScanner
    //    scanning={scanning}
    //     setScanning={setScanning}
    //    />
      )} */}



    {scanning && (
         <BarcodeScannerComponent
        //  width={500}
        //  height={500}
         onUpdate={(err, result) => {
            console.log(err,result)
           if (result) setBarcodeData(result.getText());
           else setBarcodeData("Not Found");
         }}
         onError={ (error:any) =>
            console.error(error)
         }
         torch={true}
       />
    //     <BarcodeScannerComponent
    //       width={500}
    //       height={500}
    //       onUpdate={handleScan}
    //     />
      )}
      {barcodeData && <p>Scanned Barcode: {barcodeData}</p>}
    </Box>
  );
};

export default Page;

// 'use client'
// import HTML5BarCodeScanner from '@/components/barcode/Html5BarCodeScanner';
// import React, { useState } from 'react';
// import useScanDetection from 'use-scan-detection';

// const Page = () => {
//     const [value, setValue] = useState("");

//     // useScanDetection({
//     //     onComplete: setValue,
//     //     minLength: 13 // EAN13
//     // });

//     return (
//         <>
//         <HTML5BarCodeScanner />
//         </>
//         // <input
//         //     value={value}
//         //     type="text"
//         // />
//     );
// };

// export default Page

// 'use client';

// import HTML5BarCodeScanner from "@/components/barcode/Html5BarCodeScanner";
// import { useState } from "react";

// const Page = () => {
//   const [scannedCode, setScannedCode] = useState<string | null>(null);

//   const handleScanSuccess = (decodedText: string) => {
//     console.log("Scanned code:", decodedText);
//     setScannedCode(decodedText);
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <h1>Scan a Barcode</h1>
//       <HTML5BarCodeScanner onScanSuccess={handleScanSuccess} />
//       {scannedCode && (
//         <div>
//           <h2>Scanned Code:</h2>
//           <p>{scannedCode}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Page;
