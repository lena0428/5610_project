import React from "react";
import { render } from "@testing-library/react";
import Message from "../components/Message";
import { Alert } from "react-bootstrap";

describe("Message Component", () => {
  test("renders Message component with correct variant and content", () => {
    const messageText = "This is a test message";
    const { getByText, rerender } = render(<Message>{messageText}</Message>);

    // Check if Alert component is rendered
    const alertElement = getByText(messageText);
    expect(alertElement).toBeInTheDocument();

    // Check if Alert component has correct variant
    expect(alertElement).toHaveClass("alert-info");

    // Rerender with different variant
    rerender(<Message variant="danger">{messageText}</Message>);

    // Check if Alert component has updated variant
    expect(alertElement).toHaveClass("alert-danger");
  });

  test("renders Message component with default variant if not provided", () => {
    const messageText = "This is a test message";
    const { getByText } = render(<Message>{messageText}</Message>);

    // Check if Alert component is rendered
    const alertElement = getByText(messageText);
    expect(alertElement).toBeInTheDocument();

    // Check if Alert component has default variant
    expect(alertElement).toHaveClass("alert-info");
  });
});
