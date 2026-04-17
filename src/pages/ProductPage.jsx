import { Fragment, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShoppingCart, Menu, Search, ChevronLeft, ChevronRight,
  Heart, Zap, Ticket, MapPin, Truck, Shield, Check,
} from 'lucide-react'
import StarRating from '../components/StarRating'

const PRODUCT_IMAGES = [
  { src: '/assets/produto-monja-1-e5tyeQu4.webp', alt: 'Mounjaro™️ 5 mg — Caneta injetável' },
  { src: '/assets/produto-monja-2-IMb4xCQn.webp', alt: 'Embalagem do Mounjaro™️ com QR code' },
  { src: '/assets/produto-monja-3-DRKb6ldi.webp', alt: 'Mounjaro™️ 5 mg — Vista lateral' },
  { src: '/assets/produto-monja-4-CkFhT0gf.webp', alt: 'Mounjaro™️ 5 mg — Produto na mão' },
]

const REVIEWS = [
  {
    id: 1, name: 'Carlos Silva', avatar: '/assets/avatar-carlos-n_2VD3Gw.webp', rating: 5,
    text: 'Eu pesava 103kg quando comecei em outubro, hj to com 84kg!! Meu médico ficou impressionado com meus exames, glicemia voltou ao normal. To me sentindo outra pessoa, sério. Melhor coisa q fiz na vida 🙏',
    proof: '/assets/prova-monja-1-HJJjj9Eh.webp',
  },
  {
    id: 2, name: 'Ana Santos', avatar: '/assets/avatar-ana-Bj8kySLK.webp', rating: 5,
    text: 'Já perdi 14kg em 2 meses e meio de uso, comecei com 89kg e to com 75!! Minha pressão normalizou tbm. A aplicação é tranquila, no começo dá um nervoso mas dps acostuma kkk recomendo demais',
    proof: '/assets/prova-monja-2-BSnAvTTC.webp',
  },
  {
    id: 3, name: 'João Pereira', avatar: '/assets/avatar-joao-DbvtMuja.webp', rating: 5,
    text: 'Terceira compra aqui já. Perdi 18kg no total desde q comecei o tratamento, saí de 112kg pra 94kg. Preço muito melhor q na farmácia e chega lacrado certinho. Minha endócrino que indicou esse site',
    proof: null,
  },
  {
    id: 4, name: 'Fernanda Lima', avatar: '/assets/avatar-fernanda-Do1r3bK5.webp', rating: 5,
    text: 'To no terceiro mês e já eliminei 15kg, de 97kg fui pra 82kg! Nem acredito quando me olho no espelho. Minha autoestima voltou, to usando roupas que não vestia há anos. Não passo fome em nenhum momento',
    proof: null,
  },
  {
    id: 5, name: 'Roberto Mendes', avatar: '/assets/avatar-roberto-CNAaqPeU.webp', rating: 4,
    text: 'Comecei pesando 108kg e hj to com 89kg, quase 20kg em 3 meses!! Entrega foi rápida e bem embalada. Minha esposa viu meu resultado e já comprou pra ela tbm kkk obrigado Slim Health',
    proof: '/assets/prova-monja-3-BiQwIsPO.webp',
  },
  {
    id: 6, name: 'Márcia Oliveira', avatar: '/assets/avatar-marcia-DySENKag.webp', rating: 5,
    text: 'Tô chocada com meu resultado!! Comecei com 95kg e já tô com 79kg em menos de 3 meses. Meu marido não acreditou quando viu a balança kkk. Além de emagrecer minha disposição melhorou demais, não sinto mais aquele cansaço o dia todo. Vale muito a pena!! 💪',
    proof: null,
  },
]

const DETAILS = [
  ['Produto', 'Mounjaro™️ 5 mg – Tirzepatida'],
  ['Princípio Ativo', 'Tirzepatida 5 mg'],
  ['Indicação', 'Diabetes tipo 2'],
  ['Apresentação', 'Caneta injetável'],
  ['Frequência', 'Aplicação semanal'],
]

function useCountdown(initialSeconds) {
  const [secs, setSecs] = useState(initialSeconds)
  useEffect(() => {
    const id = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [])
  return {
    h: String(Math.floor(secs / 3600)).padStart(2, '0'),
    m: String(Math.floor((secs % 3600) / 60)).padStart(2, '0'),
    s: String(secs % 60).padStart(2, '0'),
  }
}

export default function ProductPage() {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showTerms, setShowTerms] = useState(false)
  const scrollRef = useRef(null)
  const { h, m, s } = useCountdown(525)

  useEffect(() => {
    window.ttq?.track('ViewContent', {
      value: 67.92,
      currency: 'BRL',
      content_type: 'product',
      contents: [{ content_id: 'mounjaro-5mg', content_name: 'Mounjaro™ 5mg – Tirzepatida', quantity: 1, price: 67.92 }],
    })
  }, [])

  const goToSlide = (idx) => {
    setCurrentSlide(idx)
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: scrollRef.current.offsetWidth * idx, behavior: 'smooth' })
    }
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      setCurrentSlide(Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-[140px]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-2.5">
          <img src="/assets/cimed-logo-glMYtgQm.webp" alt="CIMED" className="h-7 object-contain" />
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-5 h-5 text-gray-600" strokeWidth={1.8} />
            <Menu className="w-5 h-5 text-gray-600" strokeWidth={1.8} />
          </div>
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5">
            <Search className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Buscar na CIMED</span>
          </div>
        </div>
      </header>

      <main>
        {/* Image Carousel */}
        <section className="relative bg-white">
          <div
            ref={scrollRef}
            className="overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth no-scrollbar flex"
            onScroll={handleScroll}
          >
            {PRODUCT_IMAGES.map((img, idx) => (
              <div key={idx} className="basis-full shrink-0 snap-center aspect-square bg-white">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-contain p-4"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-1.5 pb-3">
            {PRODUCT_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className="rounded-full transition-all"
                style={{
                  width: currentSlide === idx ? '20px' : '8px',
                  height: '8px',
                  backgroundColor: currentSlide === idx ? '#F5B800' : '#D1D5DB',
                }}
              />
            ))}
          </div>

          {currentSlide > 0 && (
            <button
              className="absolute left-2 top-[45%] -translate-y-1/2 p-1.5 rounded-full bg-white/90 shadow-md active:scale-95 transition"
              onClick={() => goToSlide(currentSlide - 1)}
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}
          {currentSlide < PRODUCT_IMAGES.length - 1 && (
            <button
              className="absolute right-2 top-[45%] -translate-y-1/2 p-1.5 rounded-full bg-white/90 shadow-md active:scale-95 transition"
              onClick={() => goToSlide(currentSlide + 1)}
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <button className="absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-sm">
            <Heart className="w-5 h-5 text-gray-400" strokeWidth={1.8} />
          </button>
        </section>

        {/* Product Info */}
        <section className="bg-white mt-2 px-4 py-4">
          <h1 className="text-lg font-bold text-gray-900 leading-snug">
            Mounjaro™️ 5 mg – Tirzepatida (caneta injetável)
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <StarRating rating={4} />
            <span className="text-sm font-semibold text-gray-700">4.9</span>
            <span className="text-sm text-gray-400">(6 avaliações)</span>
            <span className="text-sm text-gray-400">• 39.8k vendidos</span>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-gray-400 line-through">R$ 1.789,87</span>
              <span
                className="text-xs font-bold text-black px-1.5 py-0.5 rounded"
                style={{ backgroundColor: '#F5B800' }}
              >
                -96%
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-gray-900">R$ 67</span>
              <span className="text-lg font-extrabold text-gray-900">,92</span>
            </div>
          </div>
        </section>

        {/* Flash Sale */}
        <section className="bg-white mt-2">
          <div className="mx-4 rounded-xl overflow-hidden" style={{ backgroundColor: '#FFF8E7' }}>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" fill="#F5B800" style={{ color: '#F5B800' }} />
                <div>
                  <span className="font-bold text-sm" style={{ color: '#F5B800' }}>Oferta Relâmpago</span>
                  <p className="text-xs text-gray-600">Aproveite <b>agora!</b></p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-gray-800 rounded-lg px-2.5 py-1.5">
                <span className="text-white text-sm font-bold">{h}h</span>
                <span className="text-white text-sm font-bold">{m}m</span>
                <span className="text-white text-sm font-bold">{s}s</span>
              </div>
            </div>
          </div>
        </section>

        {/* Coupon Banner */}
        <section className="bg-white mt-2 px-4 py-3">
          <div
            className="flex items-center justify-between rounded-xl border border-dashed border-amber-200 px-3 py-2.5"
            style={{ backgroundColor: '#FFFBEB' }}
          >
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4" style={{ color: '#F5B800' }} />
              <span className="text-sm font-semibold" style={{ color: '#F5B800' }}>
                Compre R$ 39 e ganhe 10% de desconto
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" strokeWidth={1.6} />
          </div>
        </section>

        {/* Shipping */}
        <section className="bg-white mt-2 px-4 py-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-gray-500" strokeWidth={1.8} />
            <span className="text-sm text-gray-500 underline">Insira seu CEP</span>
          </div>
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-green-600" />
                <span className="text-sm font-bold text-green-700 whitespace-nowrap">Frete grátis</span>
              </div>
              <p className="text-sm text-gray-600 pl-6">Receba de 24 de abril até 26 de abril</p>
              <p className="text-xs text-gray-400 pl-6">
                Taxa de envio: <span className="line-through">R$ 9,60</span>
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 mt-1" strokeWidth={1.6} />
          </div>
        </section>

        {/* Customer Protection */}
        <section className="bg-white mt-2 px-4 py-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4" style={{ color: '#F5B800' }} strokeWidth={1.8} />
            <span className="font-semibold text-sm text-gray-900">Proteção do cliente</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[13px] text-gray-600">
            {['Devolução gratuita', 'Reembolso automático', 'Pagamento seguro', 'Cupom por atraso'].map(item => (
              <div key={item} className="flex items-start gap-1.5">
                <span className="text-green-500 font-bold">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <div className="h-2" />
        <div className="bg-white">
          <section className="px-3 py-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-bold text-gray-900">
                Avaliações dos clientes{' '}
                <span className="text-gray-400 font-normal">(6)</span>
              </h2>
              <button className="flex items-center gap-1 text-gray-400 text-[12px]">
                Ver mais <ChevronRight className="w-4 h-4" strokeWidth={1.6} />
              </button>
            </div>
            <div className="mt-1 flex items-center gap-2 text-[13px]">
              <span className="font-semibold">4.9</span>
              <span className="text-gray-400">/ 5</span>
              <StarRating rating={5} />
            </div>

            {REVIEWS.map(review => (
              <article key={review.id} className="mt-4">
                <div className="flex items-center gap-2">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-8 h-8 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div className="text-[14px] font-semibold text-gray-900">{review.name}</div>
                  <span className="inline-flex items-center gap-1 text-[11px] text-green-600 font-medium px-2 py-0.5 rounded bg-green-50">
                    <Check className="w-3 h-3" strokeWidth={2.5} />
                    Compra confirmada
                  </span>
                </div>
                <div className="mt-1.5">
                  <StarRating rating={review.rating} />
                </div>
                <p className="mt-2 text-[13px] text-gray-800 leading-relaxed">{review.text}</p>
                {review.proof && (
                  <div className="mt-2">
                    <img
                      src={review.proof}
                      alt="Prova social"
                      className="w-28 h-28 rounded-lg object-cover cursor-pointer active:opacity-80 transition"
                      loading="lazy"
                    />
                  </div>
                )}
              </article>
            ))}
          </section>
        </div>

        <div className="h-2" />

        {/* Seller */}
        <section className="bg-white px-4 py-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Vendido por</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/assets/cimed-logo-glMYtgQm.webp"
                alt="CIMED"
                className="w-12 h-12 rounded-full object-contain ring-1 ring-gray-200 bg-white p-1"
              />
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[15px] text-gray-900">CIMED Oficial</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 48 48">
                    <polygon fill="#42a5f5" points="29.62,3 33.053,8.308 39.367,8.624 39.686,14.937 44.997,18.367 42.116,23.995 45,29.62 39.692,33.053 39.376,39.367 33.063,39.686 29.633,44.997 24.005,42.116 18.38,45 14.947,39.692 8.633,39.376 8.314,33.063 3.003,29.633 5.884,24.005 3,18.38 8.308,14.947 8.624,8.633 14.937,8.314 18.367,3.003 23.995,5.884" />
                    <polygon fill="#fff" points="21.396,31.255 14.899,24.76 17.021,22.639 21.428,27.046 30.996,17.772 33.084,19.926" />
                  </svg>
                </div>
                <div className="text-xs text-gray-400">427K vendido(s)</div>
              </div>
            </div>
            <button className="px-4 py-1.5 rounded-full text-sm font-semibold border border-gray-200 text-gray-700">
              Visitar
            </button>
          </div>
        </section>

        <div className="h-2" />

        {/* About Product */}
        <section className="bg-white px-4 py-4">
          <h2 className="text-base font-bold text-gray-900">Sobre este produto</h2>
          <div className="mt-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Detalhes</p>
            <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2.5 text-[13px]">
              {DETAILS.map(([label, value]) => (
                <Fragment key={label}>
                  <div className="text-gray-400">{label}</div>
                  <div className="text-gray-800">{value}</div>
                </Fragment>
              ))}
            </div>
          </div>
          <div className="my-4 h-px bg-gray-100" />
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Descrição do Produto</p>
            <div className="mt-3 text-[13px] text-gray-700 space-y-3 leading-relaxed">
              <p><b>Mounjaro™️ 5mg – Tirzepatida (caneta injetável)</b></p>
              <p>Mounjaro™️ é um medicamento injetável de aplicação subcutânea que contém tirzepatida 5mg, indicado para o tratamento de adultos com diabetes tipo 2, como adjuvante à dieta e exercícios físicos.</p>
              <p>A tirzepatida atua como um agonista duplo dos receptores GIP e GLP-1, hormônios envolvidos na regulação da glicose e do apetite, contribuindo para o controle glicêmico e podendo auxiliar na redução de peso como efeito secundário do tratamento.</p>
              <p><b>Características do produto</b></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Caneta aplicadora de dose única, pronta para uso</li>
                <li>Administração subcutânea</li>
                <li>Dosagem: 5mg (conforme prescrição médica)</li>
                <li>Uso semanal</li>
              </ul>
              <p>O dispositivo foi desenvolvido para facilitar a aplicação, oferecendo praticidade e precisão na administração da dose.</p>
              <p><b>Aviso importante</b></p>
              <p>Tratamento de medicamento de prescrição médica. O uso deve ser feito somente sob orientação de um profissional de saúde.</p>
            </div>
          </div>
        </section>

        {/* Terms accordion */}
        <div className="bg-white px-4 py-4 mt-2">
          <button
            className="text-[10px] text-gray-300 hover:text-gray-500 w-full text-center"
            onClick={() => setShowTerms(v => !v)}
          >
            Termos de Uso {showTerms ? '▲' : '▼'}
          </button>
          {showTerms && (
            <div className="mt-2 text-[11px] text-gray-400 leading-relaxed">
              Este produto é vendido mediante prescrição médica. Consulte um profissional de saúde antes de utilizar. O uso indevido deste medicamento é prejudicial à saúde. Leia a bula. Preços e disponibilidade sujeitos a alterações sem aviso prévio.
            </div>
          )}
        </div>
      </main>

      {/* Fixed Bottom Bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-screen-sm mx-auto px-4 pt-3 pb-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs text-gray-400 line-through">R$ 1.789,87</span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-extrabold text-gray-900">R$ 67,92</span>
              </div>
            </div>
            <span
              className="text-xs font-bold text-black px-2 py-0.5 rounded"
              style={{ backgroundColor: '#F5B800' }}
            >
              -96%
            </span>
          </div>
          <div className="flex gap-2">
            <button
              className="flex-1 h-12 rounded-xl border-2 font-bold text-sm transition-all active:scale-[0.98]"
              style={{ borderColor: '#F5B800', color: '#F5B800' }}
            >
              Adicionar ao carrinho
            </button>
            <button
              className="flex-1 h-12 rounded-xl text-black font-bold text-sm transition-all active:scale-[0.98]"
              style={{ backgroundColor: '#F5B800' }}
              onClick={() => navigate('/checkout/dados')}
            >
              Comprar Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
