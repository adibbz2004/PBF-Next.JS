import fetcher from "@/utils/swr/fetcher";
import { useRouter } from "next/router";
import useSWR from "swr";
import DetailProduk from "../../views/DetailProduct";
import { ProductType } from "@/types/Product.type";
import { retrieveProducts, retrieveDataByID } from "../../utils/db/servicefirebase";

const HalamanProduk = ({ product }: { product: ProductType }) => {
  //saat deploy tidak bisa menggunakan server-side rendering, karena tidak bisa melakukan fetch data dari localhost, maka digunakan sataic-site generation
  //{/digunakan client-side rendering/}
  // const { query } = useRouter();
  // const { data, isLoading } = useSWR(
  //   `/api/produk/${query.produk}`,
  //   fetcher,
  // );
  // return (
  //   <div>
  //     <DetailProduk products={isLoading ? [] : data.data} />
  //   </div>
  // )
  
  return (
    <div>
      <DetailProduk products={product} />
    </div>
  )
};

//saat deploy tidak bisa menggunakan server-side rendering, karena tidak bisa melakukan fetch data dari localhost, maka digunakan sataic-site generation
// {/digunakan static-site generation/}
// export async function getStaticPaths() {
//   const products = await retrieveProducts("products") as ProductType[];
//   const paths = products.map((product: ProductType) => ({
//     params: { produk: product.id }
//   }))
//   return {
//     paths,
//     fallback: false
//   }
// }

//saat deploy tidak bisa menggunakan server-side rendering, karena tidak bisa melakukan fetch data dari localhost, maka digunakan sataic-site generationS
// export async function getStaticProps({ params }: { params: { produk: string } }) {
//   const data = await retrieveDataByID("products", params.produk);
//   return {
//     props: {
//       product: data,
//     }
//   }
// }

export default HalamanProduk;
{/digunakan server-side rendering/}
export async function getServerSideProps({ params }: { params: { produk: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/produk/${params?.produk}`);
  const respone = await res.json();
  return {
    props: {
      product: respone.data,
    },
  };
}