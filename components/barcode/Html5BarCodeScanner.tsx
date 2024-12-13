"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

const HTML5BarCodeScanner = ({
  onScanSuccess,
  onScanFailure,
}: {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (error: string) => void;
}) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader", // ID of the HTML element to render the scanner
      {
        fps: 10, // Frames per second
        qrbox: { width: 250, height: 250 }, // Size of the scanning box
      },
      false // verbose mode off
    );

    scanner.render(
      (decodedText, decodedResult) => {
        // Handle successful scan
        console.log("Decoded text:", decodedText);
        onScanSuccess(decodedText);
      },
      (errorMessage) => {
        // Handle scan failure
        console.warn("Error message:", errorMessage);
        if (onScanFailure) onScanFailure(errorMessage);
      }
    );

    // Cleanup the scanner when the component unmounts
    return () => {
      scanner.clear().catch((error) => {
        console.error("Failed to clear scanner.", error);
      });
    };
  }, [onScanSuccess, onScanFailure]);

  return (
    <div
      id="reader"
      style={{ width: "100%", maxWidth: "500px", margin: "auto" }}
    />
  );
};

export default HTML5BarCodeScanner;
