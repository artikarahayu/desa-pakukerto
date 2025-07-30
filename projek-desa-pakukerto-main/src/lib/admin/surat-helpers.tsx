import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { UseMutationResult } from "@tanstack/react-query";

// Common helper functions for admin surat pages

/**
 * Handles updating nomor surat for any surat type
 */
export const handleUpdateNomor = (
  selectedSurat: any,
  nomorSurat: string,
  updateMutation: UseMutationResult<
    any,
    Error,
    { id: string; data: any },
    unknown
  >
) => {
  if (!selectedSurat) return;

  updateMutation.mutate({
    id: selectedSurat.id,
    data: {
      nomorSurat,
    },
  });
};

/**
 * Handles updating status for any surat type
 */
export const handleUpdateStatus = (
  selectedSurat: any,
  newStatus: "pending" | "finish",
  updateMutation: UseMutationResult<
    any,
    Error,
    { id: string; data: any },
    unknown
  >
) => {
  if (!selectedSurat) return;

  updateMutation.mutate({
    id: selectedSurat.id,
    data: {
      status: newStatus,
    },
  });
};

/**
 * Handles updating nomor surat for detail pages (without id parameter)
 */
export const handleUpdateNomorDetail = (
  nomorSurat: string,
  updateMutation: UseMutationResult<any, Error, { data: any }, unknown>
) => {
  updateMutation.mutate({
    data: { nomorSurat },
  });
};

/**
 * Handles updating status for detail pages (without id parameter)
 */
export const handleUpdateStatusDetail = (
  newStatus: "pending" | "finish",
  updateMutation: UseMutationResult<any, Error, { data: any }, unknown>
) => {
  updateMutation.mutate({
    data: { status: newStatus },
  });
};

/**
 * Creates a WhatsApp contact handler for any surat type
 */
export const createWhatsAppContactHandler = (surat: any, suratType: string) => {
  return () => {
    if (!surat || !surat.data) return;

    // Ensure nomorWhatsApp exists and is a string
    const whatsappNumber = surat.wa || "";
    if (!whatsappNumber) {
      toast.error("Nomor WhatsApp tidak tersedia");
      return;
    }

    // Format the phone number (replace leading 0 with 62)
    const phoneNumber = whatsappNumber.toString().replace(/^0/, "62");

    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };
};

/**
 * Legacy function for backward compatibility
 */
export const handleWhatsAppContact = (surat: any, suratType: string) => {
  return createWhatsAppContactHandler(surat, suratType)();
};

/**
 * Formats timestamp to Indonesian date format
 */
export const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Returns status badge component for any status
 */
export const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    case "finish":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Selesai
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
