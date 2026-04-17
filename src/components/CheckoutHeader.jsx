import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function CheckoutHeader({ title, progress }) {
  const navigate = useNavigate()

  const widthClass =
    progress === 1 ? 'w-1/3' : progress === 2 ? 'w-2/3' : 'w-full'

  return (
    <>
      <header className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100">
        <button className="p-1 -ml-1" onClick={() => navigate(-1)} aria-label="Voltar">
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
        </button>
        <h1 className="text-lg font-bold text-gray-900 flex-1">{title}</h1>
        <img src="/assets/cimed-logo-glMYtgQm.webp" alt="CIMED" className="h-7 w-auto object-contain" />
      </header>
      <div className="h-1 bg-gray-200 flex">
        <div className={`${widthClass} h-full`} style={{ backgroundColor: '#F5B800' }} />
      </div>
    </>
  )
}
