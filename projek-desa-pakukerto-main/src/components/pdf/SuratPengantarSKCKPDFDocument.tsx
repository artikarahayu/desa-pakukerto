import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { SuratPengantarSKCK } from "@/schemas/surat-pengantar-skck.schema";

// Register fonts
Font.register({
  family: "Times-Roman",
  src: "https://fonts.gstatic.com/s/timesnewroman/v1/Times_New_Roman.ttf",
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Times-Roman",
    fontSize: 11,
    padding: 30,
    lineHeight: 1.2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    borderBottom: 3,
    borderBottomColor: "#000",
    paddingBottom: 8,
  },
  headerLeft: {
    width: 70,
    alignItems: "center",
  },
  logo: {
    width: 70,
    height: 70,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 0,
    lineHeight: 1.1,
  },
  headerTitleBold: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 0,
    lineHeight: 1.1,
  },
  headerAddress: {
    fontSize: 9,
    textAlign: "center",
    marginTop: 3,
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 2,
    textDecoration: "underline",
    lineHeight: 1.1,
  },
  documentNumber: {
    fontSize: 11,
    textAlign: "center",
    marginBottom: 15,
  },
  content: {
    marginTop: 8,
    lineHeight: 1.2,
  },
  paragraph: {
    marginBottom: 5,
    fontSize: 11,
    lineHeight: 1.2,
  },
  dataSection: {
    marginTop: 3,
    marginBottom: 3,
  },
  dataRow: {
    flexDirection: "row",
    marginBottom: 1,
    fontSize: 11,
    lineHeight: 1.2,
  },
  dataLabel: {
    width: 130,
    fontSize: 11,
  },
  dataColon: {
    width: 10,
    fontSize: 11,
  },
  dataValue: {
    flex: 1,
    fontSize: 11,
  },
  kepalaDesaSection: {
    marginTop: 3,
    marginBottom: 8,
  },
  kepalaDesaRow: {
    flexDirection: "row",
    marginBottom: 1,
    fontSize: 11,
    lineHeight: 1.2,
  },
  kepalaDesaLabel: {
    width: 80,
    fontSize: 11,
  },
  kepalaDesaColon: {
    width: 10,
    fontSize: 11,
  },
  kepalaDesaValue: {
    flex: 1,
    fontSize: 11,
  },
  signature: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  signatureText: {
    fontSize: 11,
    textAlign: "center",
    marginBottom: 3,
  },
  signatureName: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
  },
  signatureTitle: {
    fontSize: 11,
    textAlign: "center",
    textDecoration: "underline",
  },
});

interface SuratPengantarSKCKPDFProps {
  data: SuratPengantarSKCK;
}

export const SuratPengantarSKCKPDFDocument: React.FC<
  SuratPengantarSKCKPDFProps
> = ({ data }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getCurrentDate = () => {
    const now = new Date();
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image src="/logos/logo.png" style={styles.logo} />
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>KABUPATEN PASURUAN</Text>
            <Text style={styles.headerTitle}>KECAMATAN SUKOREJO</Text>
            <Text style={styles.headerTitleBold}>
              PEMERINTAH DESA PAKUKERTO
            </Text>
            <Text style={styles.headerAddress}>
              Alamat : Jl. Tirto agung No .01 Kemiri, Email :
              desapakukerto@gmail.com, Kode pos : 67161
            </Text>
          </View>
        </View>

        {/* Document Title */}
        <Text style={styles.documentTitle}>SURAT PENGANTAR SKCK</Text>
        <Text style={styles.documentNumber}>
          Nomor : {data.nomorSurat || "470/    /424.320.02./2025"}
        </Text>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.paragraph}>
            Yang bertanda tangan dibawah ini :
          </Text>

          {/* Kepala Desa Info */}
          <View style={styles.kepalaDesaSection}>
            <View style={styles.kepalaDesaRow}>
              <Text style={styles.kepalaDesaLabel}>Nama</Text>
              <Text style={styles.kepalaDesaColon}>:</Text>
              <Text style={styles.kepalaDesaValue}>H SURATEMAN</Text>
            </View>
            <View style={styles.kepalaDesaRow}>
              <Text style={styles.kepalaDesaLabel}>Jabatan</Text>
              <Text style={styles.kepalaDesaColon}>:</Text>
              <Text style={styles.kepalaDesaValue}>Kepala Desa Pakukerto</Text>
            </View>
          </View>

          <Text style={styles.paragraph}>Dengan ini menerangkan bahwa :</Text>

          {/* Pemohon Data */}
          <View style={styles.dataSection}>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Nama Lengkap</Text>
              <Text style={styles.dataColon}>:</Text>
              <Text style={styles.dataValue}>{data.data.namaLengkap}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>NIK</Text>
              <Text style={styles.dataColon}>:</Text>
              <Text style={styles.dataValue}>{data.data.nik}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Tempat/Tanggal Lahir</Text>
              <Text style={styles.dataColon}>:</Text>
              <Text style={styles.dataValue}>
                {data.data.tempatLahir}, {formatDate(data.data.tanggalLahir)}
              </Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Jenis Kelamin</Text>
              <Text style={styles.dataColon}>:</Text>
              <Text style={styles.dataValue}>{data.data.jenisKelamin}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Agama</Text>
              <Text style={styles.dataColon}>:</Text>
              <Text style={styles.dataValue}>{data.data.agama}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Status Perkawinan</Text>
              <Text style={styles.dataColon}>:</Text>
              <Text style={styles.dataValue}>{data.data.statusPerkawinan}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Pekerjaan</Text>
              <Text style={styles.dataColon}>:</Text>
              <Text style={styles.dataValue}>{data.data.pekerjaan}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Alamat</Text>
              <Text style={styles.dataColon}>:</Text>
              <Text style={styles.dataValue}>{data.data.alamat}</Text>
            </View>
          </View>

          <Text style={styles.paragraph}>
            Adalah benar-benar warga Desa Pakukerto, Kecamatan Sukorejo,
            Kabupaten Pasuruan yang berkelakuan baik dan tidak pernah terlibat
            dalam kegiatan yang dapat mengganggu keamanan dan ketertiban
            masyarakat.
          </Text>

          <Text style={styles.paragraph}>
            Surat pengantar ini dibuat untuk keperluan:{" "}
            <Text style={{ fontWeight: "bold" }}>{data.data.keperluan}</Text>
          </Text>

          <Text style={styles.paragraph}>
            Demikian surat pengantar ini dibuat dengan sebenarnya untuk dapat
            dipergunakan sebagaimana mestinya.
          </Text>

          {/* Signature */}
          <View style={styles.signature}>
            <Text style={styles.signatureText}>
              Pakukerto, {getCurrentDate()}
            </Text>
            <Text style={styles.signatureText}>Kepala Desa Pakukerto</Text>
            <Text style={styles.signatureName}>H SURATEMAN</Text>
            <Text style={styles.signatureTitle}>Kepala Desa Pakukerto</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
