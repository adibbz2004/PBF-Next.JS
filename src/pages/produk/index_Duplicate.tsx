import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type ProductType = {
  id: string;
  name: string;
  price: number;
  size: string;
  category: string; // Tugas 2
};

const kategori = () => {
  // const [isLogin, setIsLogin] = useState(false);
  // const { push } = useRouter();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Opsional: untuk indikator loading

  // Fungsi untuk mengambil data dari API (Tugas 3)
  const fetchData = () => {
    setIsLoading(true);
    fetch("/api/produk")
      .then((response) => response.json())
      .then((responsedata) => {
        setProducts(responsedata.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching produk:", error);
        setIsLoading(false);
      });
  };

  // useEffect(() => {
  //   if (!isLogin) {
  //     push("/auth/login");
  //   }
  // }, []);

  // Memanggil data saat pertama kali mount
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Daftar Produk</h1>

      {/* Tombol Refresh Data (Tugas 3) */}
      <button 
        onClick={fetchData} 
        disabled={isLoading}
        style={{
          marginBottom: "20px",
          padding: "8px 16px",
          cursor: "pointer",
          backgroundColor: isLoading ? "#ccc" : "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "4px"
        }}
      >
        {isLoading ? "Memperbarui..." : "Refresh Data"}
      </button>

      <hr />

      {products.length > 0 ? (
        products.map((product: ProductType) => (
          <div key={product.id} style={{ borderBottom: "1px solid #eee", padding: "10px 0" }}>
            <h2>{product.name}</h2>
            <p>Harga: {product.price}</p>
            <p>Ukuran: {product.size}</p>
            <p>Kategori: {product.category}</p> {/* Tugas 2 */}
          </div>
        ))
      ) : (
        <p>Tidak ada data produk.</p>
      )}
    </div>
  );
};

export default kategori;