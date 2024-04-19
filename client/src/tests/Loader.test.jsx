import React from "react";
import { render } from "@testing-library/react";
import Loader from "../components/Loader";
import { Spinner } from "react-bootstrap";

describe("Loader Component", () => {
  test("renders Spinner component with correct props and styling", () => {
    const { container } = render(<Loader />);

    // Check if Spinner component is rendered
    const spinnerElement = container.querySelector(".spinner-border");
    expect(spinnerElement).toBeInTheDocument();

    // Check if Spinner has correct role prop
    expect(spinnerElement).toHaveAttribute("role", "status");

    // Check if Spinner has correct inline styling
    expect(spinnerElement).toHaveStyle({
      width: "100px",
      height: "100px",
      margin: "auto",
      display: "block",
    });
  });
});
