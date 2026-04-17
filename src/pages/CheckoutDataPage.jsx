import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import CheckoutHeader from '../components/CheckoutHeader'
import ProductCardCheckout from '../components/ProductCardCheckout'
import TrustBadges from '../components/TrustBadges'
import FooterLogos from '../components/FooterLogos'
import { useCheckout } from '../context/CheckoutContext'

const PRICE = 67.92

const FIELDS = [
  { label: 'Nome completo', key: 'name', type: 'text', placeholder: 'Digite seu nome', autoComplete: 'name' },
  { label: 'E-mail', key: 'email', type: 'email', placeholder: 'seu@email.com', autoComplete: 'email', inputMode: 'email' },
  { label: 'Telefone', key: 'phone', type: 'tel', placeholder: '(00) 00000-0000', autoComplete: 'tel', inputMode: 'tel' },
  { label: 'CPF', key: 'cpf', type: 'text', placeholder: '000.000.000-00', inputMode: 'numeric' },
]

export default function CheckoutDataPage() {
  const navigate = useNavigate()
  const { quantity, update, personal, updatePersonal } = useCheckout()

  const subtotal = (PRICE * quantity).toFixed(2).replace('.', ',')
  const isValid = Object.values(personal).every(v => v.trim().length > 0)

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      <CheckoutHeader title="Dados pessoais" progress={1} />

      <div className="flex-1 overflow-auto pb-28">
        {/* Estoque interno banner */}
        <div className="mx-4 mt-4">
          <img
            src="/assets/estoque-interno-E_0mQyBq.webp"
            alt="Estoque interno de funcionários liberado ao público"
            className="w-full rounded-xl shadow-sm"
          />
          <p className="text-[10px] text-gray-500 text-center mt-2 px-2 leading-tight">
            Este valor é mais baixo porque este lote fazia parte do estoque interno destinado a
            funcionários da CIMED. Como restaram algumas unidades, a empresa decidiu liberar o
            último lote ao público mantendo o mesmo valor interno de R$ 67,92.
          </p>
        </div>

        <ProductCardCheckout qty={quantity} onQtyChange={q => update('quantity', q)} activeCount={27} />

        {/* Personal data form */}
        <div className="bg-white mx-4 mt-3 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Dados protegidos</span>
          </div>
          <div className="space-y-5">
            {FIELDS.map(({ label, key, type, placeholder, autoComplete, inputMode }) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-800 mb-2">{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  autoComplete={autoComplete}
                  inputMode={inputMode}
                  value={personal[key]}
                  onChange={e => updatePersonal(key, e.target.value)}
                  className="w-full px-4 py-4 rounded-xl border border-gray-200 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F5B800]/30 focus:border-[#F5B800] transition-all duration-200 bg-white shadow-sm"
                />
              </div>
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
            <p className="text-xs text-gray-500">Subtotal</p>
            <p className="text-xl font-extrabold" style={{ color: '#F5B800' }}>R$ {subtotal}</p>
          </div>
          <button
            disabled={!isValid}
            onClick={() => navigate('/checkout/endereco')}
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
