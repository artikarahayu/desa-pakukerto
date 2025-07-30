import React, { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import ApbdesPDFDocument from '@/components/pdf/ApbdesPDFDocument';
import { Apbdes } from '@/schemas/apbdes.schema';

interface ApbdesPDFDownloadButtonProps {
  apbdes: Apbdes;
}

const ApbdesPDFDownloadButton: React.FC<ApbdesPDFDownloadButtonProps> = ({ apbdes }) => {
  const [isClient, setIsClient] = useState(false);

  // Use useEffect to ensure we're on the client side
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Menyiapkan PDF...
      </Button>
    );
  }

  return (
    <PDFDownloadLink
      document={<ApbdesPDFDocument data={apbdes} />}
      fileName={`APBDes-${apbdes.tahun}.pdf`}
      className="no-underline"
    >
      {({ blob, url, loading, error }) => (
        <Button
          variant="outline"
          size="sm"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyiapkan PDF...
            </>
          ) : (
            <>
              <FileDown className="mr-2 h-4 w-4" />
              Download PDF
            </>
          )}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default ApbdesPDFDownloadButton;
