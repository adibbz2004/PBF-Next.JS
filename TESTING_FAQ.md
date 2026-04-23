# FAQ - Unit Testing

## 1. Mengapa unit testing penting sebelum production?

Unit testing sangat penting sebelum production karena beberapa alasan:

### a. Deteksi Bug Lebih Awal
- Menemukan bug saat development, bukan saat production
- Biaya perbaikan bug di development jauh lebih murah daripada di production
- Mencegah bug yang sama muncul kembali (regression)

### b. Dokumentasi Hidup
```typescript
// Test ini menjelaskan bagaimana komponen seharusnya bekerja
it("renders navbar correctly when user is logged in", () => {
  // Siapapun yang membaca test ini tahu bahwa:
  // - Navbar harus menampilkan welcome message
  // - Navbar harus menampilkan tombol Sign Out
  // - Navbar harus menampilkan gambar user jika ada
})
```

### c. Confidence untuk Refactoring
- Bisa mengubah kode dengan aman
- Test akan memberitahu jika ada yang rusak
- Memudahkan maintenance jangka panjang

### d. Kualitas Kode Lebih Baik
- Memaksa developer menulis kode yang testable
- Kode testable = kode yang modular dan loosely coupled
- Mengurangi technical debt

### e. Continuous Integration/Deployment
- Test otomatis berjalan setiap kali ada perubahan
- Mencegah kode yang rusak masuk ke production
- Mempercepat development cycle

### Contoh Real Case:
```typescript
// Tanpa test: Bug ini bisa lolos ke production
function calculateDiscount(price: number, discount: number) {
  return price - discount  // ❌ Bug: tidak handle persentase
}

// Dengan test: Bug terdeteksi segera
it("calculates percentage discount correctly", () => {
  expect(calculateDiscount(100, 10)).toBe(90)  // ✅ Test gagal, bug terdeteksi
})
```

---

## 2. Mengapa branch coverage sulit mencapai 100%?

Branch coverage sulit mencapai 100% karena beberapa alasan:

### a. Kompleksitas Kondisi
```typescript
// Banyak kombinasi kondisi yang harus ditest
function validateUser(user: User) {
  if (user.age > 18 && user.hasLicense && user.isVerified && !user.isBanned) {
    // Branch 1
  } else if (user.age > 16 && user.hasParentConsent) {
    // Branch 2
  } else if (user.isAdmin) {
    // Branch 3
  } else {
    // Branch 4
  }
  // Untuk 100% coverage, perlu test semua kombinasi!
}
```

### b. Edge Cases yang Sulit Direproduksi
```typescript
try {
  await fetchData()
} catch (error) {
  if (error.code === 'NETWORK_ERROR') {
    // Sulit di-test: perlu mock network failure
  } else if (error.code === 'TIMEOUT') {
    // Sulit di-test: perlu mock timeout
  } else if (error.code === 'UNKNOWN') {
    // Sangat sulit di-test: kondisi yang jarang terjadi
  }
}
```

### c. Third-Party Dependencies
```typescript
// Sulit test semua branch karena bergantung pada library eksternal
if (navigator.geolocation) {
  // Branch 1: browser support geolocation
} else {
  // Branch 2: browser tidak support
}
```

### d. Time-Based Logic
```typescript
function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"      // Perlu mock waktu pagi
  else if (hour < 18) return "Good afternoon" // Perlu mock waktu siang
  else return "Good evening"                 // Perlu mock waktu malam
}
```

### e. Diminishing Returns
- 80% coverage: Relatif mudah dicapai
- 90% coverage: Butuh effort 2x lipat
- 95% coverage: Butuh effort 4x lipat
- 100% coverage: Butuh effort 10x lipat (tidak praktis)

### Best Practice:
```
✅ Target realistis: 70-80% coverage
✅ Fokus pada critical path dan business logic
✅ Jangan obsesi dengan 100% coverage
❌ Jangan sacrifice code quality demi coverage
```

---

## 3. Apa itu Mocking?

Mocking adalah teknik untuk mengganti dependencies dengan versi palsu (fake) yang bisa dikontrol dalam test.

### Mengapa Perlu Mocking?

#### a. Isolasi Unit Test
```typescript
// ❌ Tanpa mocking: Test bergantung pada API eksternal
it("fetches user data", async () => {
  const data = await fetch("https://api.example.com/user")
  // Masalah:
  // - Lambat (network request)
  // - Tidak reliable (API bisa down)
  // - Tidak bisa test error cases
})

// ✅ Dengan mocking: Test terisolasi dan cepat
it("fetches user data", async () => {
  jest.mock("fetch")
  fetch.mockResolvedValue({ id: 1, name: "John" })
  
  const data = await getUserData()
  expect(data.name).toBe("John")
  // Cepat, reliable, dan bisa dikontrol
})
```

#### b. Test Error Scenarios
```typescript
// Bisa test berbagai skenario error
it("handles network error", async () => {
  fetch.mockRejectedValue(new Error("Network error"))
  
  await expect(getUserData()).rejects.toThrow("Network error")
})

it("handles timeout", async () => {
  fetch.mockRejectedValue(new Error("Timeout"))
  
  await expect(getUserData()).rejects.toThrow("Timeout")
})
```

### Jenis-Jenis Mocking:

#### 1. Function Mock
```typescript
const mockCallback = jest.fn()
mockCallback.mockReturnValue(42)

expect(mockCallback()).toBe(42)
expect(mockCallback).toHaveBeenCalled()
```

#### 2. Module Mock
```typescript
// Mock entire module
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: "/",
  })
}))
```

#### 3. Component Mock
```typescript
// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}))
```

#### 4. API Mock
```typescript
// Mock API calls
jest.mock("@/utils/api", () => ({
  fetchProducts: jest.fn().mockResolvedValue([
    { id: 1, name: "Product 1" }
  ])
}))
```

### Contoh dari Project Kita:

```typescript
// Mocking next-auth untuk test Navbar
jest.mock("next-auth/react")

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>

// Bisa kontrol return value sesuai kebutuhan test
mockUseSession.mockReturnValue({
  data: {
    user: { fullname: "John Doe" }
  },
  status: "authenticated"
})
```

---

## 4. Kapan Snapshot Test Digunakan?

Snapshot test digunakan untuk memverifikasi bahwa UI tidak berubah secara tidak sengaja.

### Kapan Menggunakan Snapshot Test:

#### ✅ 1. UI Components yang Stabil
```typescript
// Komponen yang jarang berubah
it("renders navbar correctly", () => {
  const { container } = render(<Navbar />)
  expect(container).toMatchSnapshot()
  // Jika UI berubah, test akan gagal dan minta review
})
```

#### ✅ 2. Complex Rendering Logic
```typescript
// Komponen dengan banyak conditional rendering
it("renders product list with various states", () => {
  const { container } = render(<ProductList products={mockProducts} />)
  expect(container).toMatchSnapshot()
  // Memastikan semua elemen render dengan benar
})
```

#### ✅ 3. Regression Testing
```typescript
// Mencegah perubahan UI yang tidak disengaja
it("maintains consistent layout", () => {
  const { container } = render(<Layout />)
  expect(container).toMatchSnapshot()
  // Jika ada yang berubah, developer harus review
})
```

#### ✅ 4. API Response Structure
```typescript
// Memastikan struktur data tidak berubah
it("returns correct data structure", async () => {
  const data = await fetchUserData()
  expect(data).toMatchSnapshot()
})
```

### Kapan TIDAK Menggunakan Snapshot Test:

#### ❌ 1. Dynamic Content
```typescript
// Jangan snapshot data yang selalu berubah
it("shows current time", () => {
  const { container } = render(<Clock />)
  expect(container).toMatchSnapshot()  // ❌ Akan selalu gagal
})
```

#### ❌ 2. Random Data
```typescript
// Jangan snapshot data random
it("generates random ID", () => {
  const id = generateId()
  expect(id).toMatchSnapshot()  // ❌ Tidak berguna
})
```

#### ❌ 3. Third-Party Components
```typescript
// Jangan snapshot komponen yang kita tidak kontrol
it("renders external library", () => {
  const { container } = render(<ExternalDatePicker />)
  expect(container).toMatchSnapshot()  // ❌ Bisa berubah saat library update
})
```

### Best Practices:

```typescript
// ✅ Good: Snapshot kecil dan fokus
it("renders product card", () => {
  const { container } = render(<ProductCard product={mockProduct} />)
  expect(container.firstChild).toMatchSnapshot()
})

// ❌ Bad: Snapshot terlalu besar
it("renders entire app", () => {
  const { container } = render(<App />)
  expect(container).toMatchSnapshot()  // Terlalu banyak detail
})
```

### Cara Update Snapshot:
```bash
# Jika perubahan UI memang disengaja
npm test -- -u

# Review snapshot changes di git diff sebelum commit
```

---

## 5. Apakah Semua File Harus Dites?

**Jawaban Singkat: TIDAK**

### File yang HARUS Dites (High Priority):

#### ✅ 1. Business Logic
```typescript
// utils/calculations.ts
export function calculateTotalPrice(items: Item[]) {
  // Logic penting yang mempengaruhi bisnis
  return items.reduce((total, item) => total + item.price, 0)
}
// ✅ HARUS dites: Bug di sini = kerugian finansial
```

#### ✅ 2. Critical User Flows
```typescript
// components/Checkout.tsx
export function Checkout() {
  // Flow pembayaran
  // ✅ HARUS dites: Bug di sini = user tidak bisa bayar
}
```

#### ✅ 3. Authentication & Authorization
```typescript
// middleware/withAuth.ts
export function withAuth(handler) {
  // Security logic
  // ✅ HARUS dites: Bug di sini = security breach
}
```

#### ✅ 4. Data Transformation
```typescript
// utils/formatters.ts
export function formatCurrency(amount: number) {
  // Format data yang ditampilkan ke user
  // ✅ HARUS dites: Bug di sini = user bingung
}
```

### File yang TIDAK Perlu Dites (Low Priority):

#### ❌ 1. Simple Configuration Files
```typescript
// next.config.js
module.exports = {
  reactStrictMode: true,
  // ❌ Tidak perlu dites: hanya konfigurasi
}
```

#### ❌ 2. Type Definitions
```typescript
// types/index.ts
export type User = {
  id: string
  name: string
}
// ❌ Tidak perlu dites: TypeScript sudah check
```

#### ❌ 3. Simple Presentational Components
```typescript
// components/Divider.tsx
export function Divider() {
  return <hr className="divider" />
}
// ❌ Tidak perlu dites: terlalu simple
```

#### ❌ 4. Third-Party Wrappers
```typescript
// lib/firebase.ts
import { initializeApp } from "firebase/app"
export const app = initializeApp(config)
// ❌ Tidak perlu dites: hanya wrapper library
```

### Prioritas Testing (Pyramid):

```
        /\
       /  \      Unit Tests (70%)
      /____\     - Business logic
     /      \    - Utils functions
    /        \   - Components
   /__________\  
   
   Integration Tests (20%)
   - API endpoints
   - User flows
   
   E2E Tests (10%)
   - Critical paths
   - Happy paths
```

### Decision Matrix:

| Kriteria | Test? | Alasan |
|----------|-------|--------|
| Banyak logic | ✅ Yes | High complexity = high risk |
| Sering berubah | ✅ Yes | Regression protection |
| Critical path | ✅ Yes | Business impact |
| Simple getter/setter | ❌ No | Low value |
| Pure UI (no logic) | ❌ No | Visual testing lebih cocok |
| Config files | ❌ No | No logic to test |

### Contoh dari Project Kita:

```typescript
// ✅ Dites: Navbar (ada logic authentication)
src/components/layouts/navbar/index.tsx

// ✅ Dites: Product view (ada conditional rendering)
src/views/product/index.tsx

// ❌ Tidak dites: Simple config
next.config.js

// ❌ Tidak dites: Type definitions
src/types/index.ts

// ⚠️ Optional: API routes (bisa integration test)
src/pages/api/register.ts
```

### Best Practice:

```
1. Mulai dari critical path
2. Test business logic dulu
3. Jangan kejar 100% coverage
4. Focus on value, not numbers
5. Test behavior, not implementation
```

### ROI (Return on Investment):

```
High ROI:
- Business logic: 1 jam test = save 10 jam debugging
- Critical flows: 1 jam test = prevent production issues

Low ROI:
- Simple components: 1 jam test = save 10 menit
- Config files: 1 jam test = waste of time
```

---

## Kesimpulan

1. **Unit testing penting** untuk quality assurance dan confidence
2. **100% branch coverage** tidak realistis dan tidak perlu
3. **Mocking** membantu isolasi test dan kontrol dependencies
4. **Snapshot test** untuk UI regression, tapi jangan overuse
5. **Tidak semua file perlu dites** - fokus pada high-value targets

### Golden Rule:
> "Test the behavior that matters to users and business, not the implementation details."

---

**Referensi:**
- Jest Documentation: https://jestjs.io/
- Testing Library: https://testing-library.com/
- Kent C. Dodds - Testing Best Practices
