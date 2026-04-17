import { Star } from 'lucide-react'

export default function StarRating({ rating = 5, max = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4"
          fill={i < Math.round(rating) ? '#F59E0B' : 'none'}
          stroke="#F59E0B"
          strokeWidth={1.5}
        />
      ))}
    </div>
  )
}
