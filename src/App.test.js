import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

// Mock payment-heavy pages so the app smoke tests do not fail because of Stripe/Braintree setup.
jest.mock("./components/CheckoutPage.js", () => {
  return function MockCheckoutPage() {
    return <div>Checkout Page</div>;
  };
});

jest.mock("./components/PaymentSuccess.js", () => {
  return function MockPaymentSuccess() {
    return <div>Payment Success</div>;
  };
});

jest.mock("./components/PaymentCancel.js", () => {
  return function MockPaymentCancel() {
    return <div>Payment Cancelled</div>;
  };
});

describe("App", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/");
    localStorage.clear();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );

    window.scrollTo = jest.fn();
  });

  test("renders the app without crashing", () => {
    const App = require("./App").default;

    render(<App />);

    expect(document.body).toBeInTheDocument();
  });

  test("renders the main navigation", () => {
    const App = require("./App").default;

    render(<App />);

    expect(screen.getAllByText(/magestic/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/home/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/shop/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/contact/i).length).toBeGreaterThan(0);
  });

  test("renders the empty cart page", () => {
    window.history.pushState({}, "", "/cart");

    const App = require("./App").default;

    render(<App />);

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(screen.getByText(/continue shopping/i)).toBeInTheDocument();
  });

  test("renders the mocked checkout page route", () => {
    window.history.pushState({}, "", "/checkout");

    const App = require("./App").default;

    render(<App />);

    expect(screen.getByText(/checkout page/i)).toBeInTheDocument();
  });

  test("renders the mocked payment success route", () => {
    window.history.pushState({}, "", "/checkout/success");

    const App = require("./App").default;

    render(<App />);

    expect(screen.getByText(/payment success/i)).toBeInTheDocument();
  });
});