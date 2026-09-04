import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import OrdersPage from './pages/OrdersPage';
import './App.css';

/**
 * Main Application Router
 * Maps browser URL paths to their corresponding page components.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Storefront Catalog */}
        <Route path="/" element={<HomePage />} />

        {/* Dynamic Product Details & Mutual Fund EMI Selector */}
        <Route path="/products/:slug" element={<ProductDetailPage />} />

        {/* Live Order Tracking, BlueDart Timeline & GST Invoice */}
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrdersPage />} />

        {/* Fallback: redirect any unknown URL back to store home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
