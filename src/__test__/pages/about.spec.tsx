import { render, screen } from "@testing-library/react"
import AboutPage from "@/pages/about"
import { it } from "node:test"
import { describe } from "node:test"

describe("About Page", () => {
  it("renders about page correctly", () => {
    const { container } = render(<AboutPage />)
    
    const title = screen.getByTestId("title")
    expect(title.textContent).toBe("About Page")
    expect(container).toMatchSnapshot()
  })
})
