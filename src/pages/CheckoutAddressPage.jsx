import { useNavigate } from 'react-router-dom'
import { Lock, Truck } from 'lucide-react'
import CheckoutHeader from '../components/CheckoutHeader'
import ProductCardCheckout from '../components/ProductCardCheckout'
import TrustBadges from '../components/TrustBadges'
import FooterLogos from '../components/FooterLogos'
import { useCheckout } from '../context/CheckoutContext'

const PRICE = 67.92

const SHIPPING_OPTIONS = [
  { id: 'gratis', logo: '/assets/full-logo-Dp-Wwk_5.webp', label: 'Frete Grátis', sub: 'Entrega em 10 a 12 dias', price: 0, priceLabel: 'Grátis' },
  { id: 'jadlog', logo: '/assets/jadlog-logo-Cu2OMO03.webp', label: 'JADLOG', sub: 'Entrega em até 5 dias úteis', price: 15.9, priceLabel: 'R$ 15,90' },
  { id: 'sedex', logo: '/assets/correios-logo-dDSW2VPd.webp', label: 'SEDEX 12', sub: 'Entrega de 12h a 24h', price: 29.9, priceLabel: 'R$ 29,90' },
]

const ADDRESS_FIELDS = [
  { label: 'CEP', key: 'cep', placeholder: '00000-000', inputMode: 'numeric', colSpan: 'full' },
  { label: 'Rua', key: 'rua', placeholder: 'Nome da rua', autoComplete: 'street-address', colSpan: 'full' },
  { label: 'Número', key: 'numero', placeholder: 'Nº', inputMode: 'numeric', colSpan: 'half' },
  { label: 'Complemento', key: 'complemento', placeholder: 'Opcional', colSpan: 'half' },
  { label: 'Bairro', key: 'bairro', placeholder: 'Nome do bairro', colSpan: 'full' },
  { label: 'Cidade', key: 'cidade', placeholder: 'Cidade', autoComplete: 'address-level2', colSpan: 'city' },
  { label: 'UF', key: 'uf', placeholder: 'UF', autoComplete: 'address-level1', maxLength: 2, colSpan: 'uf' },
]

export default function CheckoutAddressPage() {
  const navigate = useNavigate()
  const { quantity, update, address, updateAddress, shipping } = useCheckout()

  const shippingPrice = SHIPPING_OPTIONS.find(o => o.id === shipping)?.price ?? 0
  const total = (PRICE * quantity + shippingPrice).toFixed(2).replace('.', ',')

  const requiredKeys = ['cep', 'rua', 'numero', 'bairro', 'cidade', 'uf']
  const isValid = requiredKeys.every(k => address[k]?.trim().length > 0) && shipping !== ''

  const renderInput = ({ label, key, placeholder, inputMode, autoComplete, maxLength }) => (
    <div key={key}>
      <label className="block text-sm font-semibold text-gray-800 mb-2">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength}
        value={address[key]}
        onChange={e => updateAddress(key, e.target.value)}
        className="w-full px-4 py-4 rounded-xl border border-gray-200 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F5B800]/30 focus:border-[#F5B800] transition-all duration-200 bg-white shadow-sm"
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      <CheckoutHeader title="Endereço" progress={2} />

      <div className="flex-1 overflow-auto pb-28">
        <ProductCardCheckout qty={quantity} onQtyChange={q => update('quantity', q)} activeCount={29} />

        {/* Address form */}
        <div className="bg-white mx-4 mt-3 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Dados protegidos</span>
          </div>
          <div className="space-y-5">
            {renderInput(ADDRESS_FIELDS[0])}
            {renderInput(ADDRESS_FIELDS[1])}
            <div className="grid grid-cols-2 gap-4">
              {renderInput(ADDRESS_FIELDS[2])}
              {renderInput(ADDRESS_FIELDS[3])}
            </div>
            {renderInput(ADDRESS_FIELDS[4])}
            <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 100px' }}>
              {renderInput(ADDRESS_FIELDS[5])}
              {renderInput(ADDRESS_FIELDS[6])}
            </div>
          </div>
        </div>

        {/* Shipping options */}
        <div className="bg-white mx-4 mt-3 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">Escolha uma forma de entrega:</span>
          </div>
          <div className="space-y-3">
            {SHIPPING_OPTIONS.map(opt => (
              <button
                key={opt.id}
                className="w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-colors"
                style={{ borderColor: shipping === opt.id ? '#F5B800' : '#E5E7EB' }}
                onClick={() => update('shipping', opt.id)}
              >
                <div
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: shipping === opt.id ? '#F5B800' : '#D1D5DB' }}
                >
                  {shipping === opt.id && (
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#F5B800' }} />
                  )}
                </div>
                <img src={opt.logo} alt={opt.label} className="h-6 w-auto object-contain" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-gray-900">{opt.label}</p>
                  <p className="text-xs text-gray-500">{opt.sub}</p>
                </div>
                <span
                  className="text-sm font-bold"
                  style={{ color: opt.price === 0 ? '#2DB573' : '#374151' }}
                >
                  {opt.priceLabel}
                </span>
              </button>
            ))}
          </div>
        </div>

        <TrustBadges />
        <FooterLogos />
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed inset-x-0 bottom-0 bg-white border-t border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-xl font-extrabold" style={{ color: '#F5B800' }}>R$ {total}</p>
          </div>
          <button
            disabled={!isValid}
            onClick={() => navigate('/checkout/confirmacao')}
            className="px-12 py-3.5 rounded-lg font-semibold text-base transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            style={isValid ? { backgroundColor: '#F5B800', color: '#000' } : {}}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  )
}
