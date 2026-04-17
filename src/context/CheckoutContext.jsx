import { createContext, useContext, useState } from 'react'

const CheckoutContext = createContext(null)

export function CheckoutProvider({ children }) {
  const [state, setState] = useState({
    userName: '',
    userAge: null,
    quantity: 1,
    personal: { name: '', email: '', phone: '', cpf: '' },
    address: { cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '' },
    shipping: 'gratis',
    upsells: [],
  })

  const update = (key, value) =>
    setState(prev => ({ ...prev, [key]: value }))

  const updatePersonal = (field, value) =>
    setState(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }))

  const updateAddress = (field, value) =>
    setState(prev => ({ ...prev, address: { ...prev.address, [field]: value } }))

  const toggleUpsell = (id) =>
    setState(prev => ({
      ...prev,
      upsells: prev.upsells.includes(id)
        ? prev.upsells.filter(u => u !== id)
        : [...prev.upsells, id],
    }))

  return (
    <CheckoutContext.Provider value={{ ...state, update, updatePersonal, updateAddress, toggleUpsell }}>
      {children}
    </CheckoutContext.Provider>
  )
}

export const useCheckout = () => useContext(CheckoutContext)
