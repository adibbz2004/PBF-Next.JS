import { render, screen, fireEvent } from "@testing-library/react"
import Navbar from "@/components/layouts/navbar"
import { signIn, signOut, useSession } from "next-auth/react"

jest.mock("next-auth/react")

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />
  },
}))

jest.mock("next/dist/client/script", () => ({
  __esModule: true,
  default: () => null,
}))

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>
const mockSignIn = signIn as jest.MockedFunction<typeof signIn>
const mockSignOut = signOut as jest.MockedFunction<typeof signOut>

describe("Navbar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders navbar correctly when user is not logged in", () => {
    mockUseSession.mockReturnValue({ data: null, status: "unauthenticated", update: jest.fn() })
    
    const { container } = render(<Navbar />)
    
    const navbar = screen.getByTestId("navbar")
    const navbarBrand = screen.getByTestId("navbar-brand")
    
    expect(navbar).toBeTruthy()
    expect(navbarBrand).toBeTruthy()
    
    const signInButton = screen.getByText("Sign In")
    expect(signInButton).toBeTruthy()
    
    expect(container).toMatchSnapshot()
  })

  it("renders navbar correctly when user is logged in", () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          fullname: "John Doe",
          email: "john@example.com",
          image: "https://example.com/avatar.jpg"
        },
        expires: "2099-01-01"
      },
      status: "authenticated",
      update: jest.fn()
    })
    
    render(<Navbar />)
    
    const welcomeText = screen.getByText(/Welcome, John Doe/)
    expect(welcomeText).toBeTruthy()
    
    const signOutButton = screen.getByText("Sign Out")
    expect(signOutButton).toBeTruthy()
  })

  it("calls signIn when Sign In button is clicked", () => {
    mockUseSession.mockReturnValue({ data: null, status: "unauthenticated", update: jest.fn() })
    
    render(<Navbar />)
    
    const signInButton = screen.getByText("Sign In")
    fireEvent.click(signInButton)
    
    expect(mockSignIn).toHaveBeenCalledTimes(1)
  })

  it("calls signOut when Sign Out button is clicked", () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          fullname: "John Doe",
          email: "john@example.com"
        },
        expires: "2099-01-01"
      },
      status: "authenticated",
      update: jest.fn()
    })
    
    render(<Navbar />)
    
    const signOutButton = screen.getByText("Sign Out")
    fireEvent.click(signOutButton)
    
    expect(mockSignOut).toHaveBeenCalledTimes(1)
  })

  it("renders user image when available", () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          fullname: "John Doe",
          email: "john@example.com",
          image: "https://example.com/avatar.jpg"
        },
        expires: "2099-01-01"
      },
      status: "authenticated",
      update: jest.fn()
    })
    
    render(<Navbar />)
    
    const userImage = screen.getByAltText("John Doe")
    expect(userImage).toBeTruthy()
    expect(userImage.getAttribute("src")).toBe("https://example.com/avatar.jpg")
  })

  it("does not render user image when not available", () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          fullname: "Jane Doe",
          email: "jane@example.com"
        },
        expires: "2099-01-01"
      },
      status: "authenticated",
      update: jest.fn()
    })
    
    render(<Navbar />)
    
    const userImage = screen.queryByAltText("Jane Doe")
    expect(userImage).toBeNull()
  })
})
