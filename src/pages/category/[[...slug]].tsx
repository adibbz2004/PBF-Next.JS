import { useRouter } from "next/router";

const CategoryPage = () => {
  const { query } = useRouter();
  const slug = query.slug as string[];

  return (
    <div>
      <h1>Halaman Kategori</h1>
      <ul>
        {/* Melakukan mapping array slug ke dalam bentuk list <li> */}
        {slug ? (
          slug.map((item, index) => (
            <li key={index}>Parameter ke-{index + 1}: {item}</li>
          ))
        ) : (
          <li>Memuat parameter...</li>
        )}
      </ul>
    </div>
  );
};

export default CategoryPage;