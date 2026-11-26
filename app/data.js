export const NATIONAL_YEAR = 2024;
export const COUNTRY = {
  name: 'Indonesia', provinces: 38, landArea: 1890179.78, islands: 17380,
  population: 281603800,
};

export const POPULATION = [
  { year: 2020, value: 270203900 },
  { year: 2022, value: 275773800 },
  { year: 2023, value: 278696200 },
  { year: 2024, value: 281603800 },
];

export const ECONOMY = [
  { year: 2020, growth: -2.07 },
  { year: 2021, growth: 3.70, inflation: 1.87, unemployment: 6.49 },
  { year: 2022, growth: 5.31, inflation: 5.51, unemployment: 5.86 },
  { year: 2023, growth: 5.05, inflation: 2.61, unemployment: 5.32 },
  { year: 2024, growth: 5.03, inflation: 1.57, unemployment: 4.91 },
];

export const ECONOMIC_FACTS = {
  year: 2024, gdpTrillion: 22139.0, gdpPerCapitaMillion: 78.6,
  gdpPerCapitaUSD: 4960.3, unemploymentFebruary: 4.82,
  workingAgeMillion: 215.37, labourForceMillion: 152.1,
};

export const POVERTY = {
  year: 2024,
  march: { rate: 9.03, peopleMillion: 25.22 },
  september: { rate: 8.57, peopleMillion: 24.06, urban: 6.66, rural: 11.34, line: 595242 },
};

export const HDI = [
  { year: 2020, value: 72.81 }, { year: 2022, value: 73.77 },
  { year: 2023, value: 74.39 }, { year: 2024, value: 75.02 },
];

export const HUMAN_DEVELOPMENT = {
  year: 2024, lifeExpectancy: 74.15, expectedSchooling: 13.21,
  meanSchooling: 8.85, expenditureMillion: 12.34,
  literacy: { overall: 96.67, male: 97.69, female: 95.66 },
};

export const AGE_STRUCTURE = {
  year: 2025, survey: 'SUPAS 2025', dependencyRatio: 45.05,
  groups: [
    { label: '0–14 tahun', value: 23.44, color: '#C98A1B', note: 'Usia muda' },
    { label: '15–64 tahun', value: 68.94, color: '#0B3D3A', note: 'Usia produktif' },
    { label: '65+ tahun', value: 7.62, color: '#83A7A0', note: 'Usia lanjut' },
  ],
};

export const GENERATIONS = [
  { label: 'Gen Z', value: 24.93, color: '#0B3D3A' },
  { label: 'Milenial', value: 24.34, color: '#2D7770' },
  { label: 'Gen X', value: 19.70, color: '#83A7A0' },
  { label: 'Post-Gen Z', value: 19.65, color: '#C98A1B' },
  { label: 'Baby Boomer', value: 10.31, color: '#E5BB70' },
  { label: 'Pre-Boomer', value: 1.07, color: '#D8DDD5' },
];

export const PROVINCES = [
  { name: 'Jawa Barat', population: 50345200, grdpPerCapita: 56.082, ipm: 74.92 },
  { name: 'Jawa Timur', population: 41814500, grdpPerCapita: 75.770, ipm: 75.35 },
  { name: 'Jawa Tengah', population: 37892300, grdpPerCapita: 47.970, ipm: 73.87 },
  { name: 'Sumatera Utara', population: 15588500, grdpPerCapita: 73.575, ipm: 75.76 },
  { name: 'Banten', population: 12431400, grdpPerCapita: 70.276, ipm: 76.35 },
  { name: 'DKI Jakarta', population: 10684900, grdpPerCapita: 344.383, ipm: 84.15 },
  { name: 'Sulawesi Selatan', population: 9463400, grdpPerCapita: 73.573, ipm: 75.18 },
  { name: 'Lampung', population: 9419600, grdpPerCapita: 51.387, ipm: 73.13 },
  { name: 'Sumatera Selatan', population: 8837300, grdpPerCapita: 75.132, ipm: 73.84 },
  { name: 'Riau', population: 6728100, grdpPerCapita: 165.350, ipm: 75.67 },
  { name: 'Sumatera Barat', population: 5836200, grdpPerCapita: 57.083, ipm: 76.43 },
  { name: 'Kalimantan Barat', population: 5695500, grdpPerCapita: 52.703, ipm: 71.19 },
  { name: 'Aceh', population: 5554800, grdpPerCapita: 43.782, ipm: 75.36 },
  { name: 'Bali', population: 4433300, grdpPerCapita: 67.318, ipm: 78.63 },
  { name: 'Kalimantan Selatan', population: 4273400, grdpPerCapita: 67.122, ipm: 75.19 },
  { name: 'Kalimantan Timur', population: 4045900, grdpPerCapita: 212.117, ipm: 78.79 },
  { name: 'DI Yogyakarta', population: 3759500, grdpPerCapita: 51.486, ipm: 81.62 },
  { name: 'Jambi', population: 3724300, grdpPerCapita: 86.775, ipm: 74.36 },
  { name: 'Sulawesi Tengah', population: 3121800, grdpPerCapita: 120.750, ipm: 72.24 },
  { name: 'Kalimantan Tengah', population: 2809700, grdpPerCapita: 79.320, ipm: 74.28 },
  { name: 'Papua', population: 1060000, grdpPerCapita: 81.009, ipm: 68.86 },
];

export const SOURCES = [
  { id: 'population', indicator: 'Penduduk nasional & geografi', publisher: 'BPS — Statistics Indonesia', publication: 'Proyeksi Penduduk Indonesia; Statistik Indonesia', year: '2020, 2022, 2023, 2024', note: 'Penduduk pertengahan tahun; geografi: 38 provinsi, luas daratan, dan jumlah pulau. Titik penduduk 2021 tidak disajikan.' },
  { id: 'economy', indicator: 'PDB, pertumbuhan & PDB per kapita', publisher: 'BPS — Statistics Indonesia', publication: 'Berita Resmi Statistik — Pertumbuhan Ekonomi Indonesia', year: '2020–2024', note: 'Pertumbuhan PDB tahunan; nilai PDB harga berlaku dan PDB per kapita yang ditampilkan hanya untuk 2024.' },
  { id: 'inflation', indicator: 'Inflasi', publisher: 'BPS — Statistics Indonesia', publication: 'Berita Resmi Statistik — Perkembangan Indeks Harga Konsumen', year: '2021–2024', note: 'Inflasi Desember terhadap Desember tahun sebelumnya, bukan rata-rata inflasi setahun.' },
  { id: 'labour', indicator: 'Ketenagakerjaan', publisher: 'BPS — Statistics Indonesia', publication: 'Berita Resmi Statistik — Keadaan Ketenagakerjaan Indonesia; Sakernas', year: '2021–2024', note: 'Seri TPT memakai Agustus. Nilai Februari 2024 disajikan terpisah; penduduk usia kerja dan angkatan kerja memakai Agustus 2024.' },
  { id: 'poverty', indicator: 'Kemiskinan', publisher: 'BPS — Statistics Indonesia', publication: 'Berita Resmi Statistik — Profil Kemiskinan di Indonesia; Susenas', year: 'Maret & September 2024', note: 'Jumlah dan persentase penduduk miskin, wilayah perkotaan/perdesaan, serta garis kemiskinan September 2024.' },
  { id: 'hdi', indicator: 'Pembangunan manusia', publisher: 'BPS — Statistics Indonesia', publication: 'Indeks Pembangunan Manusia 2024', year: '2020, 2022, 2023, 2024', note: 'IPM nasional dan provinsi; komponen umur harapan hidup, harapan lama sekolah, rata-rata lama sekolah, dan pengeluaran riil disesuaikan.' },
  { id: 'literacy', indicator: 'Angka melek huruf', publisher: 'BPS — Statistics Indonesia', publication: 'Statistik Pendidikan 2024; Susenas', year: '2024', note: 'Penduduk berusia 15 tahun ke atas, total dan menurut jenis kelamin.' },
  { id: 'age', indicator: 'Struktur umur & generasi', publisher: 'BPS — Statistics Indonesia', publication: 'Survei Penduduk Antar Sensus (SUPAS) 2025', year: '2025', note: 'Kelompok umur, rasio ketergantungan, dan komposisi generasi. Berbeda tahun rujukan dari indikator utama 2024.' },
  { id: 'provinces', indicator: 'Penduduk provinsi', publisher: 'BPS — Statistics Indonesia', publication: 'Statistik Indonesia 2025 — Proyeksi Penduduk Interim', year: '2024; publikasi 2025', note: 'Estimasi pertengahan tahun untuk provinsi yang tersedia. Papua memakai batas wilayah setelah pemekaran 2022.' },
  { id: 'grdp', indicator: 'PDRB per kapita provinsi', publisher: 'BPS — Statistics Indonesia', publication: 'PDRB Provinsi menurut Industri 2021–2025, Tabel 3', year: '2024 (tahun data)', note: 'Atas dasar harga berlaku; juta rupiah per orang per tahun. Bukan pendapatan rumah tangga atau ukuran daya beli.' },
];
