import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Truck, Loader, AlertCircle, CheckCircle2 } from 'lucide-react'
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

export default function CheckoutAddressPage() {
  const navigate = useNavigate()
  const { quantity, update, address, updateAddress, shipping } = useCheckout()

  const [cepStatus, setCepStatus] = useState('idle') // idle | loading | found | error
  const [cepError, setCepError] = useState('')

  const shippingPrice = SHIPPING_OPTIONS.find(o => o.id === shipping)?.price ?? 0
  const total = (PRICE * quantity + shippingPrice).toFixed(2).replace('.', ',')

  const requiredKeys = ['cep', 'rua', 'numero', 'bairro', 'cidade', 'uf']
  const isValid = requiredKeys.every(k => address[k]?.trim().length > 0) && shipping !== ''

  const handleCepChange = async (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 8)
    const masked = digits.length > 5 ? digits.slice(0, 5) + '-' + digits.slice(5) : digits
    updateAddress('cep', masked)
    setCepError('')

    if (digits.length === 8) {
      setCepStatus('loading')
      try {
        const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
        const data = await res.json()
        if (data.erro) {
          setCepStatus('error')
          setCepError('CEP não encontrado. Verifique e tente novamente.')
          updateAddress('rua', '')
          updateAddress('bairro', '')
          updateAddress('cidade', '')
          updateAddress('uf', '')
        } else {
          updateAddress('rua', data.logradouro || '')
          updateAddress('bairro', data.bairro || '')
          updateAddress('cidade', data.localidade || '')
          updateAddress('uf', data.uf || '')
          setCepStatus('found')
        }
      } catch {
        setCepStatus('error')
        setCepError('Erro ao buscar CEP. Verifique sua conexão.')
      }
    } else {
      setCepStatus('idle')
    }
  }

  const inputClass = (hasError) =>
    `w-full px-4 py-4 rounded-xl border text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 bg-white shadow-sm ${
      hasError
        ? 'border-red-400 focus:ring-red-200 focus:border-red-400'
        : 'border-gray-200 focus:ring-[#F5B800]/30 focus:border-[#F5B800]'
    }`

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      <CheckoutHeader title="Endereço" progress={2} />

      <div className="flex-1 overflow-auto pb-28">
        <ProductCardCheckout qty={quantity} onQtyChange={q => update('quantity', q)} activeCount={29} />

        <div className="bg-white mx-4 mt-3 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Dados protegidos</span>
          </div>

          <div className="space-y-5">
            {/* CEP */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">CEP</label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="00000-000"
                  maxLength={9}
                  value={address.cep}
                  onChange={handleCepChange}
                  className={inputClass(cepStatus === 'error') + ' pr-10'}
                />
                {cepStatus === 'loading' && (
                  <Loader className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-gray-400" />
                )}
                {cepStatus === 'found' && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                )}
                {cepStatus === 'error' && (
                  <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                )}
              </div>
              {cepStatus === 'error' && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                  <p className="text-xs text-red-500">{cepError}</p>
                </div>
              )}
            </div>

            {/* Rua */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Rua</label>
              <input
                type="text"
                placeholder="Nome da rua"
                autoComplete="street-address"
                value={address.rua}
                onChange={e => updateAddress('rua', e.target.value)}
                className={inputClass(false)}
              />
            </div>

            {/* Número + Complemento */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Número</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Nº"
                  value={address.numero}
                  onChange={e => updateAddress('numero', e.target.value)}
                  className={inputClass(false)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Complemento</label>
                <input
                  type="text"
                  placeholder="Opcional"
                  value={address.complemento}
                  onChange={e => updateAddress('complemento', e.target.value)}
                  className={inputClass(false)}
                />
              </div>
            </div>

            {/* Bairro */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Bairro</label>
              <input
                type="text"
                placeholder="Nome do bairro"
                value={address.bairro}
                onChange={e => updateAddress('bairro', e.target.value)}
                className={inputClass(false)}
              />
            </div>

            {/* Cidade + UF */}
            <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 100px' }}>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Cidade</label>
                <input
                  type="text"
                  placeholder="Cidade"
                  autoComplete="address-level2"
                  value={address.cidade}
                  onChange={e => updateAddress('cidade', e.target.value)}
                  className={inputClass(false)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">UF</label>
                <input
                  type="text"
                  placeholder="UF"
                  autoComplete="address-level1"
                  maxLength={2}
                  value={address.uf}
                  onChange={e => updateAddress('uf', e.target.value.toUpperCase())}
                  className={inputClass(false)}
                />
              </div>
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
                <span className="text-sm font-bold" style={{ color: opt.price === 0 ? '#2DB573' : '#374151' }}>
                  {opt.priceLabel}
                </span>
              </button>
            ))}
          </div>
        </div>

        <TrustBadges />
        <FooterLogos />
      </div>

      <div className="fixed inset-x-0 bottom-0 bg-white border-t border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-xl font-extrabold" style={{ color: '#F5B800' }}>R$ {total}</p>
          </div>
          <button
            disabled={!isValid}
            onClick={() => navigate('/checkout/confirmacao')}
            className="px-12 py-3.5 rounded-lg font-semibold text-base transition-colors disabled:cursor-not-allowed"
            style={{ backgroundColor: isValid ? '#F5B800' : 'rgb(209,213,219)', color: isValid ? '#000' : '#9CA3AF' }}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  )
}
