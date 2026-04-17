import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Copy, Clock, Loader, ShieldCheck } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useCheckout } from '../context/CheckoutContext'

const DEMO_PIX_CODE =
  '00020101021226330014br.gov.bcb.pix0111demo000000015204000053039865405' +
  '67.925802BR5920CIMED OFICIAL LTDA6009SAO PAULO62070503***6304A1B2'

function useCountdown(initialSeconds) {
  const [remaining, setRemaining] = useState(initialSeconds)
  useEffect(() => {
    const id = setInterval(() => setRemaining(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [])
  return `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`
}

export default function CheckoutPixPage() {
  const navigate = useNavigate()
  const { quantity } = useCheckout()
  const [copied, setCopied] = useState(false)
  const countdown = useCountdown(899)

  const handleCopy = () => {
    navigator.clipboard?.writeText(DEMO_PIX_CODE).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100">
        <button className="p-1 -ml-1" onClick={() => navigate(-1)} aria-label="Voltar">
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
        </button>
        <h1 className="text-lg font-bold text-gray-900 flex-1">Pagamento PIX</h1>
        <img src="/assets/cimed-logo-glMYtgQm.webp" alt="CIMED" className="h-7 w-auto object-contain" />
      </header>
      <div className="h-1 w-full" style={{ backgroundColor: '#F5B800' }} />

      <main className="flex-1 overflow-auto pb-8">
        {/* Value Banner */}
        <section className="mx-4 mt-4">
          <div
            className="rounded-2xl py-6 px-5 text-black shadow-lg"
            style={{ background: 'linear-gradient(135deg, #F5B800 0%, #FFD54F 100%)' }}
          >
            <p className="text-center text-black/70 text-xs font-medium tracking-wide uppercase">
              Valor a pagar
            </p>
            <p className="text-center text-4xl font-bold mt-1 tracking-tight text-black">R$ 67,92</p>
            <p className="text-center text-black/70 text-sm mt-1">{quantity} item{quantity > 1 ? 's' : ''}</p>
          </div>
        </section>

        {/* QR Code Card */}
        <section className="bg-white mx-4 mt-4 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 pb-4">
            <p className="text-center text-gray-600 text-sm font-medium">
              Escaneie o QR Code com o app do seu banco
            </p>
            <div className="flex justify-center mt-4">
              <div className="rounded-xl p-3 border border-gray-100 bg-white shadow-sm">
                <QRCodeSVG value={DEMO_PIX_CODE} size={176} />
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
              {DEMO_PIX_CODE}
            </p>
          </div>
        </section>

        {/* Expiry timer */}
        <section className="mx-4 mt-3 rounded-xl p-3.5 bg-amber-50 border border-amber-100">
          <div className="flex items-center justify-center gap-2 text-amber-700">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">O PIX expira em:</span>
            <span className="font-bold text-base tabular-nums">{countdown}</span>
          </div>
        </section>

        {/* Waiting */}
        <section className="mx-4 mt-2 rounded-xl p-3.5 bg-blue-50 border border-blue-100">
          <div className="flex items-center justify-center gap-2 text-blue-600">
            <Loader className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">Aguardando confirmação do pagamento...</span>
          </div>
        </section>

        {/* How to pay */}
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

        {/* Footer logos */}
        <div className="flex justify-center items-center gap-6 mt-6 mb-8 px-6">
          <img src="/assets/anvisa-logo-BA_Iz9Dd.webp" alt="ANVISA" className="h-10 w-auto object-contain opacity-40" />
          <img src="/assets/govbr-logo-BU03RmUx.webp" alt="gov.br" className="h-8 w-auto object-contain opacity-40" />
        </div>
      </main>
    </div>
  )
}
