"use client"
import React, { Component, useEffect, useRef } from 'react'
import Quagga from 'quagga'



interface ScannerProps {
  onDetected: (result: any) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onDetected }) => {
  const scannerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scannerRef.current) {
      Quagga.init(
        {
          inputStream: {
            type: 'LiveStream',
            constraints: {
              width: 640,
              height: 320,
              facingMode: 'environment',
            },
          },
          locator: {
            halfSample: true,
            patchSize: 'large',
            debug: {
              showCanvas: true,
              showPatches: false,
              showFoundPatches: false,
              showSkeleton: false,
              showLabels: false,
              showPatchLabels: false,
              showRemainingPatchLabels: false,
              boxFromPatches: {
                showTransformed: true,
                showTransformedBox: true,
                showBB: true,
              },
            },
          },
          numOfWorkers: 4,
          decoder: {
            readers: ['code_128_reader'],
            debug: {
              drawBoundingBox: true,
              showFrequency: true,
              drawScanline: true,
              showPattern: true,
            },
          },
          locate: true,
        },
        function (err:any) {
          if (err) {
            console.log(err);
            return;
          }
          Quagga.start();
        }
      );

      Quagga.onDetected(onDetected);
    }

    return () => {
      Quagga.offDetected(onDetected);
    };
  }, [onDetected]);

  return <div id="interactive" className="viewport" ref={scannerRef} />;
};

export default Scanner;