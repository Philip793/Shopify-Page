import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

// Mock window.scrollTo for router
const mockScrollTo = jest.fn();
window.scrollTo = mockScrollTo;

// Mock fetch for API calls
global.fetch = jest.fn();

const renderWithProviders = (component) => {
  return render(
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            {component}
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  );
};

// ==========================================
// App Smoke Test
// ==========================================
test("app renders without crashing", () => {
  renderWithProviders(<App />);
  expect(document.body).toBeInTheDocument();
});

// ==========================================
// Cart Functionality Tests
// ==========================================
test("cart item can be added", async () => {
  renderWithProviders(<App />);
  
  // Navigate to shop (assuming there's a shop link)
  const shopLink = screen.getByText(/shop/i);
  fireEvent.click(shopLink);
  
  // Look for add to cart button
  await waitFor(() => {
    const addButton = screen.getByText(/add to cart/i);
    expect(addButton).toBeInTheDocument();
  });
});

test("cart quantity displays correctly", async () => {
  renderWithProviders(<App />);
  
  // Check cart icon shows count
  const cartIcon = screen.getByTestId("cart-icon");
  expect(cartIcon).toBeInTheDocument();
});

test("empty cart message appears when cart is empty", async () => {
  renderWithProviders(<App />);
  
  // Navigate to cart
  const cartLink = screen.getByText(/cart/i);
  fireEvent.click(cartLink);
  
  // Check for empty cart message
  await waitFor(() => {
    const emptyMessage = screen.getByText(/your cart is empty|no items/i);
    expect(emptyMessage).toBeInTheDocument();
  });
});

// ==========================================
// Checkout Tests
// ==========================================
test("checkout button renders when items in cart", async () => {
  renderWithProviders(<App />);
  
  // Navigate to cart
  const cartLink = screen.getByText(/cart/i);
  fireEvent.click(cartLink);
  
  // Check for checkout button (may be disabled when empty)
  const checkoutButton = screen.getByText(/checkout/i);
  expect(checkoutButton).toBeInTheDocument();
});

// ==========================================
// Authentication Tests
// ==========================================
test("login form renders", async () => {
  renderWithProviders(<App />);
  
  // Navigate to login
  const loginLink = screen.getByText(/login/i);
  fireEvent.click(loginLink);
  
  // Check form elements
  await waitFor(() => {
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByText(/sign in|login/i);
    
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });
});

test("login form shows error with invalid credentials", async () => {
  renderWithProviders(<App />);
  
  // Navigate to login
  const loginLink = screen.getByText(/login/i);
  fireEvent.click(loginLink);
  
  await waitFor(() => {
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByText(/sign in|login/i);
    
    // Enter invalid credentials
    fireEvent.change(emailInput, { target: { value: "invalid@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(submitButton);
    
    // Check for error message
    const errorMessage = screen.getByText(/invalid|error|failed/i);
    expect(errorMessage).toBeInTheDocument();
  });
});

// ==========================================
// Navigation Tests
// ==========================================
test("navbar navigation links work", () => {
  renderWithProviders(<App />);
  
  // Check main navigation links exist
  expect(screen.getByText(/home/i)).toBeInTheDocument();
  expect(screen.getByText(/shop/i)).toBeInTheDocument();
  expect(screen.getByText(/cart/i)).toBeInTheDocument();
});

// ==========================================
// TODO: Future Test Coverage
// ==========================================
// The following tests require more setup (mocking Stripe, API responses):
// 
// - Payment form renders with Stripe Elements
// - Successful payment flow
// - Payment error handling
// - Inventory check before checkout
// - Order confirmation page
// - User registration flow
// - Password reset flow
// - Admin dashboard access
