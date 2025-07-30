import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { Apbdes } from "@/schemas/apbdes.schema";

/**
 * Interface for public APBDes data
 */
export interface APBDesPublicData {
  id: string;
  tahun: number;
  ringkasan: {
    totalPendapatan: number;
    totalBelanja: number;
    totalPembiayaan: {
      penerimaan: number;
      pengeluaran: number;
    };
    surplus: number;
  };
  pendapatan: {
    total: number;
    rincian: Array<{
      id?: string;
      kategori: string;
      jumlah: number;
      subRincian: Array<{
        id?: string;
        uraian: string;
        jumlah: number;
      }>;
    }>;
  };
  belanja: {
    total: number;
    rincian: Array<{
      id?: string;
      kategori: string;
      jumlah: number;
      subRincian: Array<{
        id?: string;
        uraian: string;
        jumlah: number;
      }>;
    }>;
  };
  pembiayaan: {
    penerimaan: {
      total: number;
      rincian: Array<{
        id?: string;
        kategori: string;
        jumlah: number;
      }>;
    };
    pengeluaran: {
      total: number;
      rincian: Array<{
        id?: string;
        kategori: string;
        jumlah: number;
      }>;
    };
    surplus: number;
  };
  lastUpdated: any;
}

/**
 * Get the latest APBDes data
 * @returns Latest APBDesPublicData or null if not found
 */
export const getLatestAPBDes = async (): Promise<APBDesPublicData | null> => {
  try {
    // Query for the latest APBDes data by tahun
    const apbdesQuery = query(
      collection(db, "apbdes"),
      orderBy("tahun", "desc"),
      limit(1)
    );

    const apbdesSnapshot = await getDocs(apbdesQuery);

    if (apbdesSnapshot.empty) {
      return null;
    }

    const doc = apbdesSnapshot.docs[0];
    const data = doc.data() as Omit<APBDesPublicData, "id">;

    return {
      id: doc.id,
      tahun: data.tahun,
      ringkasan: data.ringkasan,
      pendapatan: data.pendapatan,
      belanja: data.belanja,
      pembiayaan: data.pembiayaan,
      lastUpdated: data.lastUpdated,
    };
  } catch (error) {
    console.error("Error fetching latest APBDes data:", error);
    return null;
  }
};

/**
 * Get APBDes data by year
 * @param year The year to fetch data for
 * @returns APBDesPublicData for the specified year or null if not found
 */
export const getAPBDesByYear = async (
  year: number
): Promise<APBDesPublicData | null> => {
  try {
    // Query for the APBDes data with matching year
    const apbdesQuery = query(
      collection(db, "apbdes"),
      orderBy("tahun", "desc")
    );

    const apbdesSnapshot = await getDocs(apbdesQuery);

    if (apbdesSnapshot.empty) {
      return null;
    }

    // Find the document with the matching year
    const matchingDoc = apbdesSnapshot.docs.find(
      (doc) => doc.data().tahun === year
    );

    if (!matchingDoc) {
      return null;
    }

    const data = matchingDoc.data() as Omit<APBDesPublicData, "id">;

    return {
      id: matchingDoc.id,
      tahun: data.tahun,
      ringkasan: data.ringkasan,
      pendapatan: data.pendapatan,
      belanja: data.belanja,
      pembiayaan: data.pembiayaan,
      lastUpdated: data.lastUpdated,
    };
  } catch (error) {
    console.error(`Error fetching APBDes data for year ${year}:`, error);
    return null;
  }
};

/**
 * Get all available APBDes data years
 * @returns Array of years for which APBDes data is available
 */
export const getAvailableAPBDesYears = async (): Promise<number[]> => {
  try {
    const apbdesQuery = query(
      collection(db, "apbdes"),
      orderBy("tahun", "desc")
    );

    const apbdesSnapshot = await getDocs(apbdesQuery);

    if (apbdesSnapshot.empty) {
      return [];
    }

    const years: number[] = [];

    apbdesSnapshot.forEach((doc) => {
      const data = doc.data();
      years.push(data.tahun);
    });

    return years;
  } catch (error) {
    console.error("Error fetching available APBDes years:", error);
    return [];
  }
};

/**
 * Interface for year-by-year APBDes summary data
 */
export interface APBDesYearlyComparisonData {
  tahun: number;
  pendapatan: number;
  belanja: number;
}

/**
 * Get Pendapatan and Belanja data for all available years
 * @returns Array of yearly comparison data with pendapatan and belanja values
 */
export const getAPBDesYearlyComparison = async (): Promise<
  APBDesYearlyComparisonData[]
> => {
  try {
    const apbdesQuery = query(
      collection(db, "apbdes"),
      orderBy("tahun", "asc")
    );

    const apbdesSnapshot = await getDocs(apbdesQuery);

    if (apbdesSnapshot.empty) {
      return [];
    }

    const yearlyData: APBDesYearlyComparisonData[] = [];

    apbdesSnapshot.forEach((doc) => {
      const data = doc.data() as Apbdes;
      yearlyData.push({
        tahun: data.tahun,
        pendapatan: data.ringkasan.totalPendapatan,
        belanja: data.ringkasan.totalBelanja,
      });
    });

    return yearlyData;
  } catch (error) {
    console.error("Error fetching APBDes yearly comparison data:", error);
    return [];
  }
};
