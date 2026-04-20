import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, AlertCircle } from 'lucide-react'
import CheckoutHeader from '../components/CheckoutHeader'
import ProductCardCheckout from '../components/ProductCardCheckout'
import TrustBadges from '../components/TrustBadges'
import FooterLogos from '../components/FooterLogos'
import { useCheckout } from '../context/CheckoutContext'

const PRICE = 67.92

function validarNome(v) {
  const partes = v.trim().split(/\s+/)
  return partes.length >= 2 && partes.every(p => p.length >= 2)
}

function validarEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
}

function validarTelefone(v) {
  const nums = v.replace(/\D/g, '')
  return nums.length >= 10 && nums.length <= 11
}

function validarCPF(v) {
  const nums = v.replace(/\D/g, '')
  if (nums.length !== 11 || /^(.)\1+$/.test(nums)) return false
  let sum = 0
  for (let i = 0; i < 9; i++) sum += parseInt(nums[i]) * (10 - i)
  let r = (sum * 10) % 11
  if (r === 10 || r === 11) r = 0
  if (r !== parseInt(nums[9])) return false
  sum = 0
  for (let i = 0; i < 10; i++) sum += parseInt(nums[i]) * (11 - i)
  r = (sum * 10) % 11
  if (r === 10 || r === 11) r = 0
  return r === parseInt(nums[10])
}

const FIELDS = [
  {
    label: 'Nome completo',
    key: 'name',
    type: 'text',
    placeholder: 'Nome e sobrenome',
    autoComplete: 'name',
    validate: validarNome,
    errorMsg: 'Informe pelo menos nome e sobrenome',
  },
  {
    label: 'E-mail',
    key: 'email',
    type: 'email',
    placeholder: 'seu@email.com',
    autoComplete: 'email',
    inputMode: 'email',
    validate: validarEmail,
    errorMsg: 'E-mail inválido',
  },
  {
    label: 'Telefone',
    key: 'phone',
    type: 'tel',
    placeholder: '(00) 00000-0000',
    autoComplete: 'tel',
    inputMode: 'tel',
    validate: validarTelefone,
    errorMsg: 'Telefone inválido — informe DDD + número (ex: 11 99999-9999)',
  },
  {
    label: 'CPF',
    key: 'cpf',
    type: 'text',
    placeholder: '000.000.000-00',
    inputMode: 'numeric',
    validate: validarCPF,
    errorMsg: 'CPF inválido',
  },
]

export default function CheckoutDataPage() {
  const navigate = useNavigate()
  const { quantity, update, personal, updatePersonal } = useCheckout()
  const [touched, setTouched] = useState({})
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const subtotal = (PRICE * quantity).toFixed(2).replace('.', ',')

  const errors = Object.fromEntries(
    FIELDS.map(({ key, validate }) => [key, !validate(personal[key])])
  )
  const isValid = Object.values(errors).every(e => !e)

  const showError = (key) => (touched[key] || submitAttempted) && errors[key]

  const handleBlur = (key) => setTouched(prev => ({ ...prev, [key]: true }))

  const handleContinue = () => {
    if (!isValid) {
      setSubmitAttempted(true)
      return
    }
    navigate('/checkout/endereco')
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      <CheckoutHeader title="Dados pessoais" progress={1} />

      <div className="flex-1 overflow-auto pb-28">
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

        <div className="bg-white mx-4 mt-3 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Dados protegidos</span>
          </div>
          <div className="space-y-5">
            {FIELDS.map(({ label, key, type, placeholder, autoComplete, inputMode, errorMsg }) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-800 mb-2">{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  autoComplete={autoComplete}
                  inputMode={inputMode}
                  value={personal[key]}
                  onChange={e => updatePersonal(key, e.target.value)}
                  onBlur={() => handleBlur(key)}
                  className={`w-full px-4 py-4 rounded-xl border text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 bg-white shadow-sm ${
                    showError(key)
                      ? 'border-red-400 focus:ring-red-200 focus:border-red-400'
                      : 'border-gray-200 focus:ring-[#F5B800]/30 focus:border-[#F5B800]'
                  }`}
                />
                {showError(key) && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                    <p className="text-xs text-red-500">{errorMsg}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <TrustBadges />
        <FooterLogos />
      </div>

      <div className="fixed inset-x-0 bottom-0 bg-white border-t border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Subtotal</p>
            <p className="text-xl font-extrabold" style={{ color: '#F5B800' }}>R$ {subtotal}</p>
          </div>
          <button
            onClick={handleContinue}
            className="px-12 py-3.5 rounded-lg font-semibold text-base transition-colors"
            style={{ backgroundColor: isValid ? '#F5B800' : 'rgb(209,213,219)', color: isValid ? '#000' : '#9CA3AF' }}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  )
}
