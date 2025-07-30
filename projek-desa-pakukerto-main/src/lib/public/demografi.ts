import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { Demografi } from "@/schemas/demografi.schema";

/**
 * Interface for public demographic data
 */
export interface DemografiPublicData {
  id: string;
  tahun: number;
  dataGlobal: {
    totalPenduduk: number;
    jumlahKepalaKeluarga: number;
    jumlahLakiLaki: number;
    jumlahPerempuan: number;
  };
  dataKelompokDusun: Array<{
    kelompokDusun: string;
    lakiLaki: number;
    perempuan: number;
    total: number;
  }>;
  dataDusun: Array<{
    namaDusun: string;
    jumlah: number;
  }>;
  dataPendidikan: Array<{
    tingkatPendidikan: string;
    jumlah: number;
  }>;
  dataPekerjaan: Array<{
    jenisPekerjaan: string;
    jumlah: number;
  }>;
  dataWajibPilih: Array<{
    tahunPilih: number;
    jumlah: number;
  }>;
  dataPerkawinan: Array<{
    statusPerkawinan: string;
    jumlah: number;
  }>;
  dataAgama: Array<{
    namaAgama: string;
    jumlah: number;
  }>;
  lastUpdated: any;
}

/**
 * Get the latest demographic data
 * @returns Latest DemografiPublicData or null if not found
 */
export const getLatestDemografi =
  async (): Promise<DemografiPublicData | null> => {
    try {
      // Query for the latest demographic data by lastUpdated
      const demografiQuery = query(
        collection(db, "demografi_penduduk"),
        orderBy("tahun", "desc"),
        limit(1)
      );

      const demografiSnapshot = await getDocs(demografiQuery);

      if (demografiSnapshot.empty) {
        return null;
      }

      const doc = demografiSnapshot.docs[0];
      const data = doc.data() as Omit<DemografiPublicData, "id">;

      return {
        id: doc.id,
        tahun: data.tahun,
        dataGlobal: data.dataGlobal,
        dataKelompokDusun: data.dataKelompokDusun,
        dataDusun: data.dataDusun,
        dataPendidikan: data.dataPendidikan,
        dataPekerjaan: data.dataPekerjaan,
        dataWajibPilih: data.dataWajibPilih,
        dataPerkawinan: data.dataPerkawinan,
        dataAgama: data.dataAgama,
        lastUpdated: data.lastUpdated,
      };
    } catch (error) {
      console.error("Error fetching latest demografi data:", error);
      return null;
    }
  };

/**
 * Get demographic data by year
 * @param year The year to fetch data for
 * @returns DemografiPublicData for the specified year or null if not found
 */
export const getDemografiByYear = async (
  year: number
): Promise<DemografiPublicData | null> => {
  try {
    // Query for the demographic data with matching year
    const demografiQuery = query(
      collection(db, "demografi_penduduk"),
      orderBy("tahun", "desc")
    );

    const demografiSnapshot = await getDocs(demografiQuery);

    if (demografiSnapshot.empty) {
      return null;
    }

    // Find the document with the matching year
    const matchingDoc = demografiSnapshot.docs.find(
      (doc) => doc.data().tahun === year
    );

    if (!matchingDoc) {
      return null;
    }

    const data = matchingDoc.data() as Omit<DemografiPublicData, "id">;

    return {
      id: matchingDoc.id,
      tahun: data.tahun,
      dataGlobal: data.dataGlobal,
      dataKelompokDusun: data.dataKelompokDusun,
      dataDusun: data.dataDusun,
      dataPendidikan: data.dataPendidikan,
      dataPekerjaan: data.dataPekerjaan,
      dataWajibPilih: data.dataWajibPilih,
      dataPerkawinan: data.dataPerkawinan,
      dataAgama: data.dataAgama,
      lastUpdated: data.lastUpdated,
    };
  } catch (error) {
    console.error(`Error fetching demografi data for year ${year}:`, error);
    return null;
  }
};

/**
 * Get all available demographic data years
 * @returns Array of years for which demographic data is available
 */
export const getAvailableDemografiYears = async (): Promise<number[]> => {
  try {
    const demografiQuery = query(
      collection(db, "demografi_penduduk"),
      orderBy("tahun", "desc")
    );

    const demografiSnapshot = await getDocs(demografiQuery);

    if (demografiSnapshot.empty) {
      return [];
    }

    const years: number[] = [];

    demografiSnapshot.forEach((doc) => {
      const data = doc.data();
      years.push(data.tahun);
    });

    return years;
  } catch (error) {
    console.error("Error fetching available demografi years:", error);
    return [];
  }
};
