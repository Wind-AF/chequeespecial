import { useNavigate } from 'react-router-dom'

export default function PresellPage() {
  const navigate = useNavigate()

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url("/assets/presell-bg.webp")',
        backgroundColor: '#F5C842',
      }}
    >
      <div className="w-full max-w-md transition-all duration-300 ease-out">
        {/* Logos header */}
        <div className="flex items-center justify-center gap-3 mb-1">
          <img src="/assets/cimed-logo.webp" alt="CIMED" className="h-7 object-contain" />
          <span className="text-gray-300 text-lg font-light">×</span>
          <img src="/assets/cbf-logo.webp" alt="Seleção Brasileira" className="h-9 object-contain" />
        </div>
        <p className="text-center text-[10px] font-semibold tracking-wide uppercase text-gray-400 mt-2 mb-5">
          CIMED patrocinadora oficial da Seleção Brasileira
        </p>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center gap-6">
          <img src="/assets/cimed-logo.webp" alt="CIMED" className="h-10 object-contain" />

          <p className="text-center text-lg leading-relaxed">
            <span className="font-extrabold text-gray-800">Você vai garantir nosso produto</span>{' '}
            <span className="text-gray-400">em condição especial.</span>
          </p>

          <div className="w-full border-2 border-amber-300 bg-amber-50 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <p className="text-sm text-gray-700 font-semibold">
              Restam apenas{' '}
              <span className="font-extrabold text-base" style={{ color: '#F5B800' }}>
                13
              </span>{' '}
              unidades em estoque
            </p>
          </div>

          <button
            className="w-full py-4 rounded-xl text-black font-extrabold text-xl transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
            style={{ backgroundColor: '#F5B800' }}
            onClick={() => navigate('/nome')}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  )
}
