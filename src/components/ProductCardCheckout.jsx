import { Minus, Plus, Users } from 'lucide-react'

export default function ProductCardCheckout({ qty, onQtyChange, activeCount = 27 }) {
  return (
    <div className="bg-white mx-4 mt-4 rounded-xl p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <img
          src="/assets/mounjaro-box-Kea5pJJF.webp"
          alt="Mounjaro"
          className="w-20 h-20 object-contain rounded-lg bg-gray-50"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 leading-tight">
            Mounjaro™ 5 mg – Tirzepatida (caneta...
          </p>
          <p className="text-base font-extrabold text-[#2DB573] mt-1">R$ 67,92</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50"
            onClick={() => onQtyChange(Math.max(1, qty - 1))}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-5 text-center font-medium text-gray-900">{qty}</span>
          <button
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50"
            onClick={() => onQtyChange(qty + 1)}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-3 text-[#2DB573]">
        <Users className="w-4 h-4" />
        <span className="text-sm font-semibold">{activeCount} comprando agora</span>
      </div>
    </div>
  )
}
