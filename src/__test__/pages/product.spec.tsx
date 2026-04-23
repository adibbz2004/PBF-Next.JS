import { render, screen } from "@testing-library/react"
import TampilanProduk from "@/views/product"

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />
  },
}))

// Mock Next.js Link component
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: any) => {
    return <a href={href}>{children}</a>
  },
}))

describe("Product Page", () => {
  const mockProducts = [
    {
      id: "1",
      name: "Product 1",
      price: 100000,
      image: "https://example.com/image1.jpg",
      category: "Category 1",
    },
    {
      id: "2",
      name: "Product 2",
      price: 200000,
      image: "https://example.com/image2.jpg",
      category: "Category 2",
    },
  ]

  it("renders product page correctly with products", () => {
    const { container } = render(<TampilanProduk products={mockProducts} />)
    
    // Test dengan getByTestId
    const productPage = screen.getByTestId("product-page")
    const productTitle = screen.getByTestId("product-title")
    
    expect(productPage).toBeTruthy()
    expect(productTitle).toBeTruthy()
    
    // Test dengan toBe
    expect(productTitle.textContent).toBe("Daftar Produk")
    
    // Snapshot test
    expect(container).toMatchSnapshot()
  })

  it("renders product items correctly", () => {
    render(<TampilanProduk products={mockProducts} />)
    
    // Test product names
    expect(screen.getByText("Product 1")).toBeTruthy()
    expect(screen.getByText("Product 2")).toBeTruthy()
    
    // Test categories
    expect(screen.getByText("Category 1")).toBeTruthy()
    expect(screen.getByText("Category 2")).toBeTruthy()
  })

  it("renders skeleton when no products", () => {
    render(<TampilanProduk products={[]} />)
    
    const skeletons = document.querySelectorAll(".produk__content__skeleton")
    expect(skeletons.length).toBe(3)
  })

  it("formats price correctly", () => {
    render(<TampilanProduk products={mockProducts} />)
    
    // Check if price is formatted with Indonesian locale
    const price1 = screen.getByText(/Rp 100\.000/)
    const price2 = screen.getByText(/Rp 200\.000/)
    
    expect(price1).toBeTruthy()
    expect(price2).toBeTruthy()
  })
})
