import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

// Mock window.scrollTo for router
window.scrollTo = jest.fn();

// Mock fetch for API calls
global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

const AllProviders = ({ children }) => (
  <HelmetProvider>
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  </HelmetProvider>
);

// ==========================================
// 1. App renders without crashing
// ==========================================
test("app renders without crashing", () => {
  render(<App />, { wrapper: AllProviders });

  expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /shop/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /cart/i })).toBeInTheDocument();
});

// ==========================================
// 2. Cart empty state appears
// ==========================================
test("cart empty state appears", async () => {
  render(<App />, { wrapper: AllProviders });

  fireEvent.click(screen.getByRole("link", { name: /cart/i }));

  await waitFor(() => {
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });
  expect(
    screen.getByRole("button", { name: /continue shopping/i }),
  ).toBeInTheDocument();
});

// ==========================================
// 3. Cart page shows added items
// ==========================================
test("cart page shows added items", async () => {
  render(<App />, { wrapper: AllProviders });

  // Navigate to shop
  fireEvent.click(screen.getByRole("link", { name: /shop/i }));
  await waitFor(() => {
    expect(screen.getByText(/shop all board games/i)).toBeInTheDocument();
  });

  // Click first product card (navigates to product page)
  fireEvent.click(screen.getByText(/cat's eye/i));

  // Wait for product page and click Add to Cart
  await waitFor(() => {
    expect(
      screen.getByRole("button", { name: /add to cart/i }),
    ).toBeInTheDocument();
  });
  fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));

  // Popup appears — click View Cart
  await waitFor(() => {
    expect(screen.getByText(/added to cart/i)).toBeInTheDocument();
  });
  fireEvent.click(screen.getByRole("button", { name: /view cart/i }));

  // Verify item appears in cart with correct price
  await waitFor(() => {
    expect(screen.getByText(/cat's eye/i)).toBeInTheDocument();
  });
  expect(
    screen.getByRole("button", { name: /proceed to checkout/i }),
  ).toBeInTheDocument();
});

// ==========================================
// 4. Order summary starts checkout
// ==========================================
test("order summary starts checkout", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      clientSecret: "pi_test_secret",
      orderSummary: {
        total: 24.99,
        items: [{ id: 1, quantity: 1 }],
      },
    }),
  });

  render(<App />, { wrapper: AllProviders });

  // Add item to cart via shop -> product -> add to cart
  fireEvent.click(screen.getByRole("link", { name: /shop/i }));
  await waitFor(() => {
    expect(screen.getByText(/shop all board games/i)).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText(/cat's eye/i));
  await waitFor(() => {
    expect(
      screen.getByRole("button", { name: /add to cart/i }),
    ).toBeInTheDocument();
  });
  fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));

  await waitFor(() => {
    expect(screen.getByText(/added to cart/i)).toBeInTheDocument();
  });
  fireEvent.click(screen.getByRole("button", { name: /view cart/i }));

  // On cart page, proceed to order summary
  await waitFor(() => {
    expect(
      screen.getByRole("button", { name: /proceed to checkout/i }),
    ).toBeInTheDocument();
  });
  fireEvent.click(
    screen.getByRole("button", { name: /proceed to checkout/i }),
  );

  // On order summary page, click the checkout button to trigger fetch
  await waitFor(() => {
    expect(screen.getByText(/order summary/i)).toBeInTheDocument();
  });
  fireEvent.click(
    screen.getByRole("button", { name: /proceed to checkout/i }),
  );

  // Verify backend was called with cart items
  await waitFor(() => {
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:4242/create-checkout-session",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: expect.stringContaining("cartItems"),
      }),
    );
  });
});

// ==========================================
// 5. Login form shows validation errors
// ==========================================
test("login form shows validation errors", async () => {
  render(<App />, { wrapper: AllProviders });

  // Navigate to login page
  fireEvent.click(screen.getByRole("link", { name: /login/i }));

  await waitFor(() => {
    expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();
  });

  const submitButton = screen.getByRole("button", { name: /sign in/i });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(
      screen.getByText(/email and password are required/i),
    ).toBeInTheDocument();
  });
});
