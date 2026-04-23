import { useRouter } from "next/router";

const halamanToko = () => {
  const { query } = useRouter();
  const slug = query.slug as string[]; // Type casting untuk mempermudah akses array

  return (
    <div>
      <h1>Halaman Toko</h1>
      <p>
        {/* Validasi: Jika slug ada, ambil indeks pertama. Jika tidak, tampilkan default */}
        Kategori: {slug ? slug[0] : "Semua Kategori"}
      </p>
      <p>
        Toko: {Array.isArray(slug) ? slug.join("-") : "Toko Umum"}
      </p>
    </div>
  );
};

export default halamanToko;