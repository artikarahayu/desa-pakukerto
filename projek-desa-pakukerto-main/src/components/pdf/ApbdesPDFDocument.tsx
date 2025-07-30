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
import { Apbdes } from "@/schemas/apbdes.schema";

// Register fonts if needed
// Font.register({
//   family: 'Roboto',
//   src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
// });

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID").format(amount);
};

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    marginBottom: 20,
  },
  headerLeft: {
    width: "25%",
  },
  headerRight: {
    width: "75%",
    textAlign: "center",
    justifyContent: "center",
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
  logo: {
    width: 70,
    height: 70,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  table: {
    display: "flex",
    width: "auto",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableRowNoBorder: {
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
  },
  tableHeaderCell: {
    padding: 5,
    fontWeight: "bold",
    fontSize: 10,
  },
  tableCell: {
    padding: 5,
    fontSize: 9,
  },
  col1: {
    width: "50%",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  col2: {
    width: "25%",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  col3: {
    width: "25%",
  },
  col50: {
    width: "50%",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  col50Last: {
    width: "50%",
  },
  colKategori: {
    width: "40%",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  colUraian: {
    width: "35%",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  colJumlah: {
    width: "25%",
  },
  colPembiayaan: {
    width: "75%",
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  colPembiayaanJumlah: {
    width: "25%",
  },
  bold: {
    fontWeight: "bold",
  },
  right: {
    textAlign: "right",
  },
  center: {
    textAlign: "center",
  },
  indent1: {
    paddingLeft: 10,
  },
  indent2: {
    paddingLeft: 20,
  },
  totalRow: {
    backgroundColor: "#f0f0f0",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#666",
  },
});

interface ApbdesPDFDocumentProps {
  data: Apbdes;
}

const ApbdesPDFDocument: React.FC<ApbdesPDFDocumentProps> = ({ data }) => {
  const currentDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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
            <Text style={styles.headerTitle}>PEMERINTAH DESA PAKUKERTO</Text>
            <Text style={styles.headerAddress}>
              Alamat : Jl. Tirto agung No .01 Kemiri, Email :
              desapakukerto@gmail.com, Kode pos : 67161
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Document Title */}
        <View style={styles.section}>
          <Text style={styles.documentTitle}>
            ANGGARAN PENDAPATAN DAN BELANJA DESA PAKUKERTO TAHUN {data.tahun}
          </Text>
        </View>

        {/* Ringkasan APBDes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ringkasan APBDes</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.col50}>
                <Text style={styles.tableHeaderCell}>Keterangan</Text>
              </View>
              <View style={styles.col50Last}>
                <Text style={[styles.tableHeaderCell, styles.right]}>
                  Jumlah (Rp)
                </Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.col50}>
                <Text style={styles.tableCell}>Total Pendapatan</Text>
              </View>
              <View style={styles.col50Last}>
                <Text style={[styles.tableCell, styles.right]}>
                  {formatCurrency(data.ringkasan.totalPendapatan)}
                </Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.col50}>
                <Text style={styles.tableCell}>Total Belanja</Text>
              </View>
              <View style={styles.col50Last}>
                <Text style={[styles.tableCell, styles.right]}>
                  {formatCurrency(data.ringkasan.totalBelanja)}
                </Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.col50}>
                <Text style={styles.tableCell}>Penerimaan Pembiayaan</Text>
              </View>
              <View style={styles.col50Last}>
                <Text style={[styles.tableCell, styles.right]}>
                  {formatCurrency(data.ringkasan.totalPembiayaan.penerimaan)}
                </Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.col50}>
                <Text style={styles.tableCell}>Pengeluaran Pembiayaan</Text>
              </View>
              <View style={styles.col50Last}>
                <Text style={[styles.tableCell, styles.right]}>
                  {formatCurrency(data.ringkasan.totalPembiayaan.pengeluaran)}
                </Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.totalRow]}>
              <View style={styles.col50}>
                <Text style={[styles.tableCell, styles.bold]}>
                  Surplus / Defisit
                </Text>
              </View>
              <View style={styles.col50Last}>
                <Text
                  style={[
                    styles.tableCell,
                    styles.right,
                    styles.bold,
                    data.ringkasan.surplus >= 0
                      ? { color: "green" }
                      : { color: "red" },
                  ]}
                >
                  {data.ringkasan.surplus >= 0 ? "+" : ""}
                  {formatCurrency(data.ringkasan.surplus)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Rincian Pendapatan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rincian Pendapatan</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.colKategori}>
                <Text style={styles.tableHeaderCell}>Kategori Pendapatan</Text>
              </View>
              <View style={styles.colUraian}>
                <Text style={styles.tableHeaderCell}>Uraian</Text>
              </View>
              <View style={styles.colJumlah}>
                <Text style={[styles.tableHeaderCell, styles.right]}>
                  Jumlah (Rp)
                </Text>
              </View>
            </View>

            {data.pendapatan.rincian.map((rincian, index) => (
              <React.Fragment key={rincian.id || index}>
                {/* Kategori row */}
                <View style={styles.tableRow}>
                  <View style={styles.colKategori}>
                    <Text style={[styles.tableCell, styles.bold]}>
                      {rincian.kategori}
                    </Text>
                  </View>
                  <View style={styles.colUraian}>
                    <Text style={styles.tableCell}></Text>
                  </View>
                  <View style={styles.colJumlah}>
                    <Text style={styles.tableCell}></Text>
                  </View>
                </View>

                {/* Sub-rincian rows */}
                {rincian.subRincian.map((subRincian, subIndex) => (
                  <View style={styles.tableRow} key={subRincian.id || subIndex}>
                    <View style={styles.colKategori}>
                      <Text style={styles.tableCell}></Text>
                    </View>
                    <View style={styles.colUraian}>
                      <Text style={styles.tableCell}>{subRincian.uraian}</Text>
                    </View>
                    <View style={styles.colJumlah}>
                      <Text style={[styles.tableCell, styles.right]}>
                        {formatCurrency(subRincian.jumlah)}
                      </Text>
                    </View>
                  </View>
                ))}

                {/* Sub total for this category */}
                <View style={[styles.tableRow, { backgroundColor: "#f9f9f9" }]}>
                  <View style={styles.colKategori}>
                    <Text style={[styles.tableCell, styles.indent1]}>
                      Sub Total
                    </Text>
                  </View>
                  <View style={styles.colUraian}>
                    <Text style={styles.tableCell}></Text>
                  </View>
                  <View style={styles.colJumlah}>
                    <Text style={[styles.tableCell, styles.right, styles.bold]}>
                      {formatCurrency(rincian.jumlah)}
                    </Text>
                  </View>
                </View>
              </React.Fragment>
            ))}

            {/* Total Pendapatan */}
            <View style={[styles.tableRow, styles.totalRow]}>
              <View style={styles.colKategori}>
                <Text style={[styles.tableCell, styles.bold]}>
                  Total Pendapatan
                </Text>
              </View>
              <View style={styles.colUraian}>
                <Text style={styles.tableCell}></Text>
              </View>
              <View style={styles.colJumlah}>
                <Text style={[styles.tableCell, styles.right, styles.bold]}>
                  {formatCurrency(data.pendapatan.total)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Rincian Belanja */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rincian Belanja</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.colKategori}>
                <Text style={styles.tableHeaderCell}>Kategori Belanja</Text>
              </View>
              <View style={styles.colUraian}>
                <Text style={styles.tableHeaderCell}>Uraian</Text>
              </View>
              <View style={styles.colJumlah}>
                <Text style={[styles.tableHeaderCell, styles.right]}>
                  Jumlah (Rp)
                </Text>
              </View>
            </View>

            {data.belanja.rincian.map((rincian, index) => (
              <React.Fragment key={rincian.id || index}>
                {/* Kategori row */}
                <View style={styles.tableRow}>
                  <View style={styles.colKategori}>
                    <Text style={[styles.tableCell, styles.bold]}>
                      {rincian.kategori}
                    </Text>
                  </View>
                  <View style={styles.colUraian}>
                    <Text style={styles.tableCell}></Text>
                  </View>
                  <View style={styles.colJumlah}>
                    <Text style={styles.tableCell}></Text>
                  </View>
                </View>

                {/* Sub-rincian rows */}
                {rincian.subRincian.map((subRincian, subIndex) => (
                  <View style={styles.tableRow} key={subRincian.id || subIndex}>
                    <View style={styles.colKategori}>
                      <Text style={styles.tableCell}></Text>
                    </View>
                    <View style={styles.colUraian}>
                      <Text style={styles.tableCell}>{subRincian.uraian}</Text>
                    </View>
                    <View style={styles.colJumlah}>
                      <Text style={[styles.tableCell, styles.right]}>
                        {formatCurrency(subRincian.jumlah)}
                      </Text>
                    </View>
                  </View>
                ))}

                {/* Sub total for this category */}
                <View style={[styles.tableRow, { backgroundColor: "#f9f9f9" }]}>
                  <View style={styles.colKategori}>
                    <Text style={[styles.tableCell, styles.indent1]}>
                      Sub Total
                    </Text>
                  </View>
                  <View style={styles.colUraian}>
                    <Text style={styles.tableCell}></Text>
                  </View>
                  <View style={styles.colJumlah}>
                    <Text style={[styles.tableCell, styles.right, styles.bold]}>
                      {formatCurrency(rincian.jumlah)}
                    </Text>
                  </View>
                </View>
              </React.Fragment>
            ))}

            {/* Total Belanja */}
            <View style={[styles.tableRow, styles.totalRow]}>
              <View style={styles.colKategori}>
                <Text style={[styles.tableCell, styles.bold]}>
                  Total Belanja
                </Text>
              </View>
              <View style={styles.colUraian}>
                <Text style={styles.tableCell}></Text>
              </View>
              <View style={styles.colJumlah}>
                <Text style={[styles.tableCell, styles.right, styles.bold]}>
                  {formatCurrency(data.belanja.total)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Pembiayaan - Penerimaan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Penerimaan Pembiayaan</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.colPembiayaan}>
                <Text style={styles.tableHeaderCell}>Kategori Pembiayaan</Text>
              </View>
              <View style={styles.colPembiayaanJumlah}>
                <Text style={[styles.tableHeaderCell, styles.right]}>
                  Jumlah (Rp)
                </Text>
              </View>
            </View>

            {data.pembiayaan.penerimaan.rincian.map((item, index) => (
              <View style={styles.tableRow} key={item.id || index}>
                <View style={styles.colPembiayaan}>
                  <Text style={styles.tableCell}>{item.kategori}</Text>
                </View>
                <View style={styles.colPembiayaanJumlah}>
                  <Text style={[styles.tableCell, styles.right]}>
                    {formatCurrency(item.jumlah)}
                  </Text>
                </View>
              </View>
            ))}

            {/* Total Penerimaan */}
            <View style={[styles.tableRow, styles.totalRow]}>
              <View style={styles.colPembiayaan}>
                <Text style={[styles.tableCell, styles.bold]}>
                  Total Penerimaan
                </Text>
              </View>
              <View style={styles.colPembiayaanJumlah}>
                <Text style={[styles.tableCell, styles.right, styles.bold]}>
                  {formatCurrency(data.pembiayaan.penerimaan.total)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Pembiayaan - Pengeluaran */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pengeluaran Pembiayaan</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.colPembiayaan}>
                <Text style={styles.tableHeaderCell}>Kategori Pembiayaan</Text>
              </View>
              <View style={styles.colPembiayaanJumlah}>
                <Text style={[styles.tableHeaderCell, styles.right]}>
                  Jumlah (Rp)
                </Text>
              </View>
            </View>

            {data.pembiayaan.pengeluaran.rincian.length > 0 ? (
              data.pembiayaan.pengeluaran.rincian.map((item, index) => (
                <View style={styles.tableRow} key={item.id || index}>
                  <View style={styles.colPembiayaan}>
                    <Text style={styles.tableCell}>{item.kategori}</Text>
                  </View>
                  <View style={styles.colPembiayaanJumlah}>
                    <Text style={[styles.tableCell, styles.right]}>
                      {formatCurrency(item.jumlah)}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <View style={styles.colPembiayaan}>
                  <Text style={styles.tableCell}>-</Text>
                </View>
                <View style={styles.colPembiayaanJumlah}>
                  <Text style={[styles.tableCell, styles.right]}>0</Text>
                </View>
              </View>
            )}

            {/* Total Pengeluaran */}
            <View style={[styles.tableRow, styles.totalRow]}>
              <View style={styles.colPembiayaan}>
                <Text style={[styles.tableCell, styles.bold]}>
                  Total Pengeluaran
                </Text>
              </View>
              <View style={styles.colPembiayaanJumlah}>
                <Text style={[styles.tableCell, styles.right, styles.bold]}>
                  {formatCurrency(data.pembiayaan.pengeluaran.total)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Dokumen ini dicetak pada {currentDate}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ApbdesPDFDocument;
