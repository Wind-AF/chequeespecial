import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Copy, Clock, Loader, ShieldCheck, CheckCircle, XCircle } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useCheckout } from '../context/CheckoutContext'

const PRODUCT_HASH = 'prod_917b1a9356216a26'
const PRICE = 67.92
const SHIPPING_PRICES = { gratis: 0, jadlog: 15.9, sedex: 29.9 }
const UPSELL_PRICES = { canetas: 89.9, kit: 29.9, aula: 19.9 }

function gerarDadosCliente() {
  const nomes = ['Ana', 'Carlos', 'Maria', 'Pedro', 'Julia', 'Lucas', 'Fernanda', 'Rafael', 'Camila', 'Bruno']
  const sobrenomes = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Lima', 'Pereira', 'Costa', 'Ferreira', 'Almeida', 'Ribeiro']
  const ddds = ['11', '21', '31', '41', '51', '61', '71', '81', '85', '27']
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 8)
  const ddd = ddds[Math.floor(Math.random() * ddds.length)]
  return {
    name: `${nomes[Math.floor(Math.random() * nomes.length)]} ${sobrenomes[Math.floor(Math.random() * sobrenomes.length)]}`,
    email: `cliente_${timestamp}_${randomStr}@mail.com`,
    document: Array.from({ length: 11 }, () => Math.floor(Math.random() * 10)).join(''),
    phone: ddd + '9' + Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join(''),
  }
}

function capturarTracking() {
  const params = new URLSearchParams(window.location.search)
  const tracking = {}
  ;['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'src', 'sck'].forEach(campo => {
    const valor = params.get(campo)
    if (valor) tracking[campo] = valor
  })
  return Object.keys(tracking).length > 0 ? tracking : null
}

function useExpiryCountdown(expiresAt) {
  const [remaining, setRemaining] = useState(0)
  useEffect(() => {
    if (!expiresAt) return
    const target = new Date(expiresAt.replace(' ', 'T')).getTime()
    const calc = () => Math.max(0, Math.floor((target - Date.now()) / 1000))
    setRemaining(calc())
    const id = setInterval(() => setRemaining(calc()), 1000)
    return () => clearInterval(id)
  }, [expiresAt])
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

export default function CheckoutPixPage() {
  const navigate = useNavigate()
  const { quantity, personal, shipping, upsells } = useCheckout()

  const [pageStatus, setPageStatus] = useState('loading')
  const [pixCode, setPixCode] = useState('')
  const [transactionId, setTransactionId] = useState(null)
  const [expiresAt, setExpiresAt] = useState(null)
  const [copied, setCopied] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const pollingRef = useRef(null)
  const countdown = useExpiryCountdown(expiresAt)

  const shippingPrice = SHIPPING_PRICES[shipping] ?? 0
  const upsellTotal = upsells.reduce((sum, id) => sum + (UPSELL_PRICES[id] ?? 0), 0)
  const total = PRICE * quantity + shippingPrice + upsellTotal
  const amountCentavos = Math.round(total * 100)
  const totalFormatted = total.toFixed(2).replace('.', ',')

  useEffect(() => {
    criarTransacao()
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [])

  async function criarTransacao() {
    setPageStatus('loading')
    setErrorMsg('')
    try {
      const hasPersonal = personal.name && personal.email && personal.cpf && personal.phone
      const customer = hasPersonal
        ? {
            name: personal.name,
            email: personal.email,
            document: personal.cpf.replace(/\D/g, ''),
            phone: personal.phone.replace(/\D/g, ''),
          }
        : gerarDadosCliente()

      const reference = `REF-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
      const tracking = capturarTracking()

      const body = {
        amount: amountCentavos,
        description: 'Mounjaro™ 5mg – Tirzepatida',
        reference,
        productHash: PRODUCT_HASH,
        customer,
      }
      if (tracking) body.tracking = tracking

      const res = await fetch('/api/criar-transacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (data.status !== 'success') {
        setErrorMsg('Não foi possível gerar o PIX. Tente novamente.')
        setPageStatus('failed')
        return
      }

      setPixCode(data.qr_code)
      setTransactionId(data.transaction_id)
      setExpiresAt(data.expires_at)
      setPageStatus('ready')
      iniciarPolling(data.transaction_id)
    } catch {
      setErrorMsg('Erro de conexão. Verifique sua internet e tente novamente.')
      setPageStatus('failed')
    }
  }

  function iniciarPolling(txId) {
    if (pollingRef.current) clearInterval(pollingRef.current)
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/consultar-status?id=${txId}`)
        const data = await res.json()
        if (data.status === 'approved') {
          clearInterval(pollingRef.current)
          setPageStatus('approved')
        } else if (data.status === 'failed' || data.status === 'refunded') {
          clearInterval(pollingRef.current)
          setErrorMsg('Pagamento não concluído. Gere um novo código PIX.')
          setPageStatus('failed')
        }
      } catch {
        // silently retry
      }
    }, 2000)
    setTimeout(() => clearInterval(pollingRef.current), 15 * 60 * 1000)
  }

  const handleCopy = () => {
    navigator.clipboard?.writeText(pixCode).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (pageStatus === 'loading') {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col max-w-md mx-auto items-center justify-center gap-4">
        <Loader className="w-10 h-10 animate-spin" style={{ color: '#F5B800' }} />
        <p className="text-gray-600 font-medium">Gerando seu PIX...</p>
      </div>
    )
  }

  if (pageStatus === 'approved') {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col max-w-md mx-auto items-center justify-center gap-6 px-6 text-center">
        <CheckCircle className="w-20 h-20 text-emerald-500" />
        <h2 className="text-2xl font-bold text-gray-900">Pagamento Confirmado!</h2>
        <p className="text-gray-500">Seu pedido foi recebido e está sendo processado. Em breve você receberá mais informações.</p>
      </div>
    )
  }

  if (pageStatus === 'failed') {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex flex-col max-w-md mx-auto items-center justify-center gap-6 px-6 text-center">
        <XCircle className="w-20 h-20 text-red-400" />
        <h2 className="text-2xl font-bold text-gray-900">Falha no PIX</h2>
        <p className="text-gray-500">{errorMsg}</p>
        <button
          className="px-8 py-3 rounded-xl font-semibold text-black"
          style={{ backgroundColor: '#F5B800' }}
          onClick={criarTransacao}
        >
          Gerar novo PIX
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col max-w-md mx-auto">
      <header className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100">
        <button className="p-1 -ml-1" onClick={() => navigate(-1)} aria-label="Voltar">
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
        </button>
        <h1 className="text-lg font-bold text-gray-900 flex-1">Pagamento PIX</h1>
        <img src="/assets/cimed-logo-glMYtgQm.webp" alt="CIMED" className="h-7 w-auto object-contain" />
      </header>
      <div className="h-1 w-full" style={{ backgroundColor: '#F5B800' }} />

      <main className="flex-1 overflow-auto pb-8">
        <section className="mx-4 mt-4">
          <div
            className="rounded-2xl py-6 px-5 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #F5B800 0%, #FFD54F 100%)' }}
          >
            <p className="text-center text-black/70 text-xs font-medium tracking-wide uppercase">Valor a pagar</p>
            <p className="text-center text-4xl font-bold mt-1 tracking-tight text-black">R$ {totalFormatted}</p>
            <p className="text-center text-black/70 text-sm mt-1">{quantity} item{quantity > 1 ? 's' : ''}</p>
          </div>
        </section>

        <section className="bg-white mx-4 mt-4 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 pb-4">
            <p className="text-center text-gray-600 text-sm font-medium">
              Escaneie o QR Code com o app do seu banco
            </p>
            <div className="flex justify-center mt-4">
              <div className="rounded-xl p-3 border border-gray-100 bg-white shadow-sm">
                <QRCodeSVG value={pixCode} size={176} />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-gray-400 text-xs font-medium">ou copie o código</span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          <div className="p-5 pt-4">
            <button
              className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              style={{ backgroundColor: '#F5B800' }}
              onClick={handleCopy}
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copiado!' : 'Copiar código PIX'}
            </button>
            <p className="text-[10px] text-center text-gray-400 mt-3 break-all line-clamp-2 leading-relaxed px-2">
              {pixCode}
            </p>
          </div>
        </section>

        <section className="mx-4 mt-3 rounded-xl p-3.5 bg-amber-50 border border-amber-100">
          <div className="flex items-center justify-center gap-2 text-amber-700">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">O PIX expira em:</span>
            <span className="font-bold text-base tabular-nums">{countdown}</span>
          </div>
        </section>

        <section className="mx-4 mt-2 rounded-xl p-3.5 bg-blue-50 border border-blue-100">
          <div className="flex items-center justify-center gap-2 text-blue-600">
            <Loader className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">Aguardando confirmação do pagamento...</span>
          </div>
        </section>

        <section className="bg-white mx-4 mt-4 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-3">Como pagar:</h2>
          <ol className="space-y-2.5 text-sm text-gray-600">
            {[
              'Abra o app do seu banco',
              'Escolha pagar via PIX com QR Code ou código',
              'Escaneie ou cole o código copiado',
              'Confirme o pagamento no app do banco',
            ].map((step, i) => (
              <li key={i} className="flex gap-2.5 items-start">
                <span className="font-bold text-sm" style={{ color: '#F5B800' }}>{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="flex items-center justify-center gap-2 mt-5 pt-4 border-t border-gray-100">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-medium text-emerald-600">Pagamento 100% seguro</span>
          </div>
        </section>

        <div className="flex justify-center items-center gap-6 mt-6 mb-8 px-6">
          <img src="/assets/anvisa-logo-BA_Iz9Dd.webp" alt="ANVISA" className="h-10 w-auto object-contain opacity-40" />
          <img src="/assets/govbr-logo-BU03RmUx.webp" alt="gov.br" className="h-8 w-auto object-contain opacity-40" />
        </div>
      </main>
    </div>
  )
}
