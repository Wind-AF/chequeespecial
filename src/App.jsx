import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CheckoutProvider } from './context/CheckoutContext'
import PresellPage from './pages/PresellPage'
import NamePage from './pages/NamePage'
import AgePage from './pages/AgePage'
import ProductPage from './pages/ProductPage'
import CheckoutDataPage from './pages/CheckoutDataPage'
import CheckoutAddressPage from './pages/CheckoutAddressPage'
import CheckoutConfirmPage from './pages/CheckoutConfirmPage'
import CheckoutPixPage from './pages/CheckoutPixPage'

export default function App() {
  return (
    <CheckoutProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PresellPage />} />
          <Route path="/nome" element={<NamePage />} />
          <Route path="/idade" element={<AgePage />} />
          <Route path="/produto" element={<ProductPage />} />
          <Route path="/checkout/dados" element={<CheckoutDataPage />} />
          <Route path="/checkout/endereco" element={<CheckoutAddressPage />} />
          <Route path="/checkout/confirmacao" element={<CheckoutConfirmPage />} />
          <Route path="/checkout/pix" element={<CheckoutPixPage />} />
        </Routes>
      </BrowserRouter>
    </CheckoutProvider>
  )
}
