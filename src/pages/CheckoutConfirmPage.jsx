import { useNavigate } from 'react-router-dom'
import { ChevronRight, Check, Minus, Plus } from 'lucide-react'
import CheckoutHeader from '../components/CheckoutHeader'
import TrustBadges from '../components/TrustBadges'
import FooterLogos from '../components/FooterLogos'
import { useCheckout } from '../context/CheckoutContext'

const PRICE = 67.92

const SHIPPING_LABELS = {
  gratis: { label: 'Frete Grátis', sub: 'Entrega em 10 a 12 dias', price: 0, priceLabel: 'Grátis' },
  jadlog: { label: 'JADLOG', sub: 'Entrega em até 5 dias úteis', price: 15.9, priceLabel: 'R$ 15,90' },
  sedex: { label: 'SEDEX 12', sub: 'Entrega de 12h a 24h', price: 29.9, priceLabel: 'R$ 29,90' },
}

const UPSELLS = [
  {
    id: 'canetas',
    image: '/assets/canetas.webp',
    title: '+2 Canetas Aplicadoras Premium',
    badge: 'MAIS VENDIDO',
    sub: 'Continue seu tratamento sem interrupções',
    originalPrice: 'R$ 129,90',
    price: 89.9,
    priceLabel: 'R$ 89,90',
    discount: '-31%',
  },
  {
    id: 'kit',
    image: '/assets/kit-transporte.webp',
    title: 'Kit Transporte Refrigerado',
    badge: null,
    sub: 'Bolsa térmica para levar aonde for',
    originalPrice: 'R$ 49,90',
    price: 29.9,
    priceLabel: 'R$ 29,90',
    discount: '-40%',
  },
  {
    id: 'aula',
    image: '/assets/aula-play.webp',
    title: 'Aula Exclusiva de Aplicação',
    badge: null,
    sub: 'Aprenda a aplicar como um profissional',
    originalPrice: 'R$ 39,90',
    price: 19.9,
    priceLabel: 'R$ 19,90',
    discount: '-50%',
  },
]

export default function CheckoutConfirmPage() {
  const navigate = useNavigate()
  const { quantity, update, personal, address, shipping, upsells, toggleUpsell } = useCheckout()

  const shippingInfo = SHIPPING_LABELS[shipping] ?? SHIPPING_LABELS.gratis
  const upsellTotal = upsells.reduce((sum, id) => {
    const item = UPSELLS.find(u => u.id === id)
    return sum + (item?.price ?? 0)
  }, 0)
  const total = (PRICE * quantity + shippingInfo.price + upsellTotal).toFixed(2).replace('.', ',')

  const fullAddress = address.rua
    ? `${address.rua}, ${address.numero}`
    : '—'
  const addressLine2 = address.bairro
    ? `${address.bairro} • ${address.cidade}, ${address.uf}`
    : '—'

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      <CheckoutHeader title="Confirmação" progress={3} />

      <div className="flex-1 overflow-auto pb-28">
        {/* Items */}
        <div className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Itens do pedido</h2>
          <div className="flex items-start gap-3">
            <img src="/assets/mounjaro-box.webp" alt="Mounjaro" className="w-16 h-16 object-contain rounded-lg bg-gray-50" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 leading-tight">
                Mounjaro™ 5 mg – Tirzepatida (caneta...
              </p>
              <p className="text-base font-bold text-[#2DB573] mt-1">R$ 67,92</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500"
                onClick={() => update('quantity', Math.max(1, quantity - 1))}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-5 text-center font-medium text-gray-900">{quantity}</span>
              <button
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500"
                onClick={() => update('quantity', quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Buyer */}
        <button
          className="bg-white mx-4 mt-3 rounded-xl p-4 shadow-sm w-[calc(100%-2rem)] text-left flex items-center justify-between hover:bg-gray-50"
          onClick={() => navigate('/checkout/dados')}
        >
          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-1">Comprador</h2>
            <p className="text-sm text-gray-600">{personal.name || '—'}</p>
            <p className="text-sm text-gray-500">{personal.phone || '—'}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        {/* Address */}
        <button
          className="bg-white mx-4 mt-3 rounded-xl p-4 shadow-sm w-[calc(100%-2rem)] text-left flex items-center justify-between hover:bg-gray-50"
          onClick={() => navigate('/checkout/endereco')}
        >
          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-1">Endereço de entrega</h2>
            <p className="text-sm text-gray-600">{fullAddress}</p>
            <p className="text-sm text-gray-500">{addressLine2}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        {/* Shipping */}
        <button
          className="bg-white mx-4 mt-3 rounded-xl p-4 shadow-sm w-[calc(100%-2rem)] text-left flex items-center justify-between hover:bg-gray-50"
          onClick={() => navigate('/checkout/endereco')}
        >
          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-1">Forma de entrega</h2>
            <p className="text-sm text-gray-600">{shippingInfo.label}</p>
            <p className="text-sm text-gray-500">{shippingInfo.sub}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-700">{shippingInfo.priceLabel}</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </button>

        {/* Upsells */}
        <div className="bg-white mx-4 mt-3 rounded-xl p-4 shadow-sm">
          <h2 className="text-base font-bold text-[#2DB573] mb-4">Adicione ao seu pedido</h2>
          <div className="space-y-3">
            {UPSELLS.map(item => {
              const selected = upsells.includes(item.id)
              return (
                <button
                  key={item.id}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-colors text-left"
                  style={{ borderColor: selected ? '#2DB573' : '#E5E7EB' }}
                  onClick={() => toggleUpsell(item.id)}
                >
                  <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg bg-gray-50 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                    {item.badge && (
                      <span className="text-[9px] font-bold text-[#2DB573] bg-[#E8F5E9] px-1.5 py-0.5 rounded inline-block mt-0.5">
                        {item.badge}
                      </span>
                    )}
                    <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400 line-through">{item.originalPrice}</span>
                      <span className="text-sm font-bold text-[#2DB573]">{item.priceLabel}</span>
                      <span className="text-[10px] font-bold text-[#2DB573] bg-[#E8F5E9] px-1.5 py-0.5 rounded">
                        {item.discount}
                      </span>
                    </div>
                  </div>
                  <div
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{
                      borderColor: selected ? '#2DB573' : '#D1D5DB',
                      backgroundColor: selected ? '#2DB573' : 'transparent',
                    }}
                  >
                    {selected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white mx-4 mt-3 rounded-xl p-4 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-3">Forma de pagamento</h2>
          <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-[#2DB573] bg-[#F0FDF4]">
            <img src="/assets/pix-logo.webp" alt="PIX" className="h-6 w-auto object-contain" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">Pix</p>
              <p className="text-xs text-gray-500">Aprovação imediata</p>
            </div>
            <div className="w-6 h-6 rounded-full bg-[#2DB573] flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
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
            <p className="text-xl font-bold" style={{ color: '#F5B800' }}>R$ {total}</p>
          </div>
          <button
            className="px-16 py-3.5 rounded-lg font-semibold text-base text-white hover:opacity-90 transition-opacity flex items-center gap-2"
            style={{ backgroundColor: '#F5B800' }}
            onClick={() => navigate('/checkout/pix')}
          >
            Pagar
          </button>
        </div>
      </div>
    </div>
  )
}
