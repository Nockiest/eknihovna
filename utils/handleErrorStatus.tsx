export default function handleErrorStatus(statusCode: number| undefined, errorMessage: string): void {
    if (!statusCode){
      console.error("Unexpected status code:", statusCode);
      alert(`Neočekávaný stavový kód: ${statusCode}`);
      return
    }

    if (statusCode >= 400 && statusCode < 500) {
      console.error("Client error:", errorMessage);
      alert(`Chyba na straně klienta: ${errorMessage}`);
    } else if (statusCode >= 500) {
      console.error("Server error:", errorMessage);
      alert(`Chyba na straně serveru: ${errorMessage}`);
    }
  }