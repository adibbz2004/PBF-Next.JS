import { useRouter } from "next/router";

const halamanToko = () => {
  const { query } = useRouter();
  const slug = query.slug;

  return (
    <div>
      <h1>Halaman Toko</h1>
      <p>
        Kategori: {slug ? slug[0] : "Semua Kategori"}
      </p>
    </div>
  );
};

export default halamanToko;