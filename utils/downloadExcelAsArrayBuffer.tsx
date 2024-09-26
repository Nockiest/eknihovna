 const downloadExcelAsArrayBuffer = async (excelUrl:string) => {
    try {
      // Fetch the Excel file
      const response = await fetch(excelUrl);

      if (!response.ok) {
        throw new Error(`Failed to download Excel file. Status: ${response.status}`);
      }
      // Convert the response to ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();
      return arrayBuffer;
    } catch (error) {
      console.error("Error downloading Excel file:", error);
      throw error;
    }
  };
  export default downloadExcelAsArrayBuffer