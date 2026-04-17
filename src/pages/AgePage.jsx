import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCheckout } from '../context/CheckoutContext'

export default function AgePage() {
  const [age, setAge] = useState('')
  const navigate = useNavigate()
  const { update } = useCheckout()

  const parsedAge = parseInt(age, 10)
  const isValid = age !== '' && !isNaN(parsedAge) && parsedAge >= 18 && parsedAge <= 120

  const handleContinue = () => {
    if (!isValid) return
    update('userAge', parsedAge)
    navigate('/produto')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url("/assets/pressell.webp")',
        backgroundColor: '#F5C842',
      }}
    >
      <div className="w-full max-w-md transition-all duration-300 ease-out">
        <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center gap-6">
          <h2 className="text-2xl font-extrabold text-gray-800 text-center">Confirme sua idade</h2>
          <p className="text-base text-gray-400 text-center">
            Este produto é destinado apenas para maiores de 18 anos.
          </p>

          <input
            type="number"
            placeholder="Digite sua idade"
            className="w-full bg-gray-100 rounded-xl py-4 px-5 text-base font-semibold border-none outline-none transition-all placeholder:text-gray-400 placeholder:font-normal"
            min="18"
            max="120"
            value={age}
            onChange={e => setAge(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleContinue()}
          />

          <button
            onClick={handleContinue}
            disabled={!isValid}
            className="w-full py-4 rounded-xl text-black font-extrabold text-xl transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed"
            style={{ backgroundColor: isValid ? '#F5B800' : 'rgb(209,213,219)' }}
          >
            Continuar
          </button>

          <img
            src="/assets/Cimed logo.webp"
            alt="CIMED"
            className="h-8 object-contain opacity-30 mt-2"
          />
        </div>
      </div>
    </div>
  )
}
