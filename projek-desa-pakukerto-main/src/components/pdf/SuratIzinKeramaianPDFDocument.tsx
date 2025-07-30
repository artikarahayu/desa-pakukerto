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
import { SuratIzinKeramaian } from "@/schemas/surat-izin-keramaian.schema";

// Register fonts (you might need to add custom fonts to public/fonts)
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
    marginTop: 6,
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
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 3,
    marginBottom: 2,
    lineHeight: 1.2,
  },
  signature: {
    marginTop: 16,
    flexDirection: "column",
  },
  signatureHeader: {
    alignItems: "center",
    marginBottom: 10,
  },
  signatureDate: {
    fontSize: 11,
    textAlign: "right",
  },
  signatureKnowledge: {
    fontSize: 11,
    textAlign: "center",
    marginBottom: 5,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  signatureColumn: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 5,
  },
  signatureTitle: {
    fontSize: 10,
    textAlign: "center",
    marginBottom: 30,
  },
  signatureLine: {
    borderBottom: 1,
    borderBottomColor: "#000",
    width: 80,
    marginBottom: 5,
  },
  signatureName: {
    fontSize: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  signatureApplicantName: {
    fontSize: 10,
    textAlign: "center",
  },
  kepalaDesaSection: {
    marginTop: 5,
    marginBottom: 8,
  },
  kepalaDesaRow: {
    flexDirection: "row",
    marginBottom: 1,
    fontSize: 11,
    lineHeight: 1.2,
  },
  kepalaDesaLabel: {
    width: 130,
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
  notesList: {
    marginTop: 8,
    marginBottom: 8,
  },
  noteItem: {
    flexDirection: "row",
    marginBottom: 2,
    fontSize: 11,
    lineHeight: 1.2,
  },
  noteNumber: {
    width: 15,
    fontSize: 11,
  },
  noteText: {
    flex: 1,
    fontSize: 11,
  },
});

interface SuratIzinKeramaianPDFProps {
  data: SuratIzinKeramaian;
}

export const SuratIzinKeramaianPDFDocument: React.FC<
  SuratIzinKeramaianPDFProps
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

  const formatTime = (timeString: string) => {
    return `${timeString} WIB`;
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
        <Text style={styles.documentTitle}>
          SURAT PERMOHONAN IZIN KERAMAIAN
        </Text>
        <Text style={styles.documentNumber}>
          Nomor : {data.nomorSurat || "470/    /424.320.02/2025"}
        </Text>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.paragraph}>
            Yang bertanda tangan dibawah ini Kepala Desa Pakukerto Kec.Sukorejo
            Kab.Pasuruan
          </Text>
          <Text style={styles.paragraph}>
            Menerangkan dengan sebenarnya bahwa :
          </Text>

          {/* Pemohon Data */}
          <View style={styles.dataSection}>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Nama</Text>
              <Text style={styles.dataColon}>:</Text>
              <Text style={styles.dataValue}>{data.data.nama}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Tempat,Tgl Lahir</Text>
              <Text style={styles.dataColon}>:</Text>
              <Text style={styles.dataValue}>
                {data.data.tempatTanggalLahir}
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
              <Text style={styles.dataLabel}>NIK</Text>
              <Text style={styles.dataColon}>:</Text>
              <Text style={styles.dataValue}>{data.data.nik}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Alamat</Text>
              <Text style={styles.dataColon}>:</Text>
              <Text style={styles.dataValue}>{data.data.alamat}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Nomor HP</Text>
              <Text style={styles.dataColon}>:</Text>
              <Text style={styles.dataValue}>{data.data.nomorHP}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Pelaksanaan</Text>
          <View style={styles.dataSection}>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Hari</Text>
              <Text style={styles.dataColon}>:</Text>
              <Text style={styles.dataValue}>{data.data.hari}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Tanggal</Text>
              <Text style={styles.dataColon}>:</Text>
              <Text style={styles.dataValue}>
                {formatDate(data.data.tanggal)}
              </Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Jam</Text>
              <Text style={styles.dataColon}>:</Text>
              <Text style={styles.dataValue}>
                {formatTime(data.data.jamMulai)} -{" "}
                {formatTime(data.data.jamSelesai)}
              </Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Jenis Keramaian</Text>
              <Text style={styles.dataColon}>:</Text>
              <Text style={styles.dataValue}>{data.data.jenisKeramaian}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Keperluan</Text>
              <Text style={styles.dataColon}>:</Text>
              <Text style={styles.dataValue}>{data.data.keperluan}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Lokasi</Text>
              <Text style={styles.dataColon}>:</Text>
              <Text style={styles.dataValue}>{data.data.lokasi}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Dengan Catatan</Text>
          <View style={styles.notesList}>
            <View style={styles.noteItem}>
              <Text style={styles.noteNumber}>1</Text>
              <Text style={styles.noteText}>Mentaati peraturan yang ada</Text>
            </View>
            <View style={styles.noteItem}>
              <Text style={styles.noteNumber}>2</Text>
              <Text style={styles.noteText}>
                Menghentikan pelaksanaan pada saat ada kegiatan keagamaan
              </Text>
            </View>
            <View style={styles.noteItem}>
              <Text style={styles.noteNumber}>3</Text>
              <Text style={styles.noteText}>
                Menjaga ketertiban & stabilitas keamanan lingkungan
              </Text>
            </View>
            <View style={styles.noteItem}>
              <Text style={styles.noteNumber}>4</Text>
              <Text style={styles.noteText}>
                Mengatur jalan yang di lewati agar tidak menghambat perjalanan
                kendaraan
              </Text>
            </View>
          </View>

          <Text style={styles.paragraph}>
            Demikian permohonan ijin dijajukan untuk dipergunakan sebagaimana
            mestinya.
          </Text>

          {/* Signature */}
          <View style={styles.signature}>
            <View style={styles.signatureHeader}>
              <Text style={styles.signatureDate}>
                Pakukerto, {getCurrentDate()}
              </Text>
            </View>

            <View style={styles.signatureRow}>
              <View style={styles.signatureColumn}>
                <Text style={styles.signatureKnowledge}>Hormat Kami,</Text>
              </View>
              <View style={styles.signatureColumn}>
                <Text style={styles.signatureKnowledge}>Mengetahui,</Text>
              </View>
            </View>

            {/* First Row of Signatures */}
            <View style={styles.signatureRow}>
              <View style={styles.signatureColumn}>
                <Text style={styles.signatureTitle}>KETUA RT</Text>
                <View style={styles.signatureLine}></View>
              </View>
              <View style={styles.signatureColumn}>
                <Text style={styles.signatureTitle}>KETUA RW</Text>
                <View style={styles.signatureLine}></View>
              </View>
              <View style={styles.signatureColumn}>
                <Text style={styles.signatureTitle}>KEPALA DUSUN</Text>
                <View style={styles.signatureLine}></View>
              </View>
              <View style={styles.signatureColumn}>
                <Text style={styles.signatureTitle}>PEMOHON</Text>
                <Text style={styles.signatureApplicantName}>
                  {data.data.nama}
                </Text>
              </View>
            </View>

            {/* Mengetahui Text */}
            <Text style={styles.signatureKnowledge}>Mengetahui,</Text>

            {/* Second Row of Signatures */}
            <View style={styles.signatureRow}>
              <View style={styles.signatureColumn}>
                <Text style={styles.signatureTitle}>BABINKAMTIBMAS</Text>
                <Text style={styles.signatureName}>BRIPKA EKO WIJI</Text>
              </View>
              <View style={styles.signatureColumn}>
                <Text style={styles.signatureTitle}>BABINSA</Text>
                <Text style={styles.signatureName}>SERTU ABDUL KHALIM</Text>
              </View>
              <View style={styles.signatureColumn}>
                <Text style={styles.signatureTitle}>KEPALA DESA PAKUKERTO</Text>
                <Text style={styles.signatureName}>H SURATEMAN</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
