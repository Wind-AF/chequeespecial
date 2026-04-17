import { ShieldCheck, Lock } from 'lucide-react'

export default function TrustBadges() {
  return (
    <div className="flex items-center justify-center gap-6 mt-6 px-4">
      <div className="flex items-center gap-1.5 text-gray-500">
        <ShieldCheck className="w-4 h-4 text-[#2DB573]" />
        <span className="text-xs font-medium">Compra Segura</span>
      </div>
      <div className="flex items-center gap-1.5 text-gray-500">
        <Lock className="w-4 h-4 text-gray-400" />
        <span className="text-xs font-medium">SSL Ativo</span>
      </div>
      <div className="flex items-center gap-1.5 text-gray-500">
        <ShieldCheck className="w-4 h-4 text-[#2DB573]" />
        <span className="text-xs font-medium">Garantia</span>
      </div>
    </div>
  )
}
