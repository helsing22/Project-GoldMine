'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  X,
  CreditCard,
  QrCode,
  ExternalLink,
  Flame,
  AlertCircle,
  ChevronUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useCartStore } from '@/lib/cart-store'
import { MENU_DATA } from '@/data/menu'
import type { MenuCategory, MenuItem, CartItem } from '@/lib/types'

/* ─── helpers ─── */
function formatPrice(value: number) {
  return `${value.toLocaleString('es-CU')} CUP`
}

/* ─── Category icons mapped by id ─── */
const CATEGORY_EMOJI: Record<string, string> = {
  Pastas: '🍝',
  pizzas: '🍕',
  Bebidas: '🥤',
  Postres: '🍮',
  Special: '⭐',
  Hamb: '🍔',
}

/* ─── Payment method config ─── */
const PAYMENT_METHODS = [
  { method: 'zelle', label: 'Zelle', color: 'bg-purple-600' },
  { method: 'paypal', label: 'PayPal', color: 'bg-blue-600' },
  { method: 'visa', label: 'Visa', color: 'bg-sky-700' },
  { method: 'transfermovil', label: 'Transfermóvil', color: 'bg-orange-600' },
] as const

/* ─── Sold out overlay ─── */
function SoldOutOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/70 backdrop-blur-[2px]">
      <span className="rotate-[-12deg] rounded-lg border-2 border-red-400 bg-red-50 px-3 py-1 text-sm font-bold text-red-500 shadow-sm">
        Agotado
      </span>
    </div>
  )
}

/* ─── Menu Card ─── */
function MenuCard({ item, categoryEmoji, onAdd }: { item: MenuItem; categoryEmoji: string; onAdd: (item: MenuItem) => void }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const isInView = useInView(imgRef)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.08)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`group relative flex gap-3 rounded-xl border border-gray-100 bg-white p-3 transition-shadow ${
        item.soldOut ? 'pointer-events-none opacity-80' : ''
      }`}
    >
      {item.soldOut && <SoldOutOverlay />}

      {/* Image */}
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gradient-to-b from-gray-50 to-white">
        {item.imageUrl && !imgError ? (
          <>
            {(isInView || imgLoaded) && (
              <img
                ref={imgRef}
                src={item.imageUrl}
                alt={item.name}
                loading="lazy"
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
                className={`h-full w-full object-cover transition-all duration-500 ${
                  imgLoaded ? 'scale-100 blur-0' : 'scale-105 blur-sm'
                }`}
              />
            )}
            {!imgLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gray-100" />
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl">
            {categoryEmoji || '🍽️'}
          </div>
        )}
        {item.popular && !item.soldOut && (
          <Badge className="absolute -top-1.5 -right-1.5 gap-0.5 bg-orange-500 px-1.5 py-0 text-[10px] font-bold text-white shadow-sm">
            <Flame className="size-3" />
            Popular
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-1">
        <div>
          <h3 className="text-sm font-semibold leading-tight text-gray-900 line-clamp-2">
            {item.name}
          </h3>
          {item.description && (
            <p className="mt-0.5 text-xs leading-relaxed text-gray-400 line-clamp-2">
              {item.description}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-orange-500">{formatPrice(item.price)}</p>
          <Button
            size="sm"
            onClick={() => onAdd(item)}
            disabled={item.soldOut}
            className="h-7 gap-1 rounded-lg bg-gradient-to-b from-orange-500 to-orange-600 px-2.5 text-xs font-semibold text-white shadow-md shadow-orange-200 transition-all hover:shadow-lg hover:shadow-orange-200 active:scale-95 disabled:opacity-40"
          >
            <Plus className="size-3" />
            Agregar
          </Button>
        </div>
      </div>
    </motion.article>
  )
}

/* ─── Intersection observer hook ─── */
function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref])
  return inView
}

/* ─── Section observer for active category ─── */
function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string>('')
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-120px 0px -50% 0px', threshold: 0 }
    )
    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [sectionIds])
  return activeId
}

/* ─── Cart Drawer (Sheet-like) ─── */
function CartDrawer({
  open,
  onClose,
  onCheckout,
}: {
  open: boolean
  onClose: () => void
  onCheckout: () => void
}) {
  const items = useCartStore((s) => s.items)
  const incrementItem = useCartStore((s) => s.incrementItem)
  const decrementItem = useCartStore((s) => s.decrementItem)
  const removeItem = useCartStore((s) => s.removeItem)
  const totalPrice = useCartStore((s) => s.totalPrice())

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-gray-100 bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <h2 className="text-lg font-bold text-gray-900">Tu pedido</h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
                aria-label="Cerrar carrito"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Items */}
            <ScrollArea className="flex-1 px-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-16 text-gray-300">
                  <ShoppingCart className="size-12" />
                  <p className="text-sm font-medium">Tu carrito está vacío</p>
                  <p className="text-xs">Agrega algo del menú</p>
                </div>
              ) : (
                <div className="divide-y divide-dashed divide-gray-100 py-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">{formatPrice(item.price)} c/u</p>
                      </div>
                      {/* Quantity controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => decrementItem(item.id)}
                          className="flex size-7 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-orange-300 hover:bg-orange-50 hover:text-orange-500"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-gray-800">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => incrementItem(item.id)}
                          className="flex size-7 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-orange-300 hover:bg-orange-50 hover:text-orange-500"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      {/* Subtotal */}
                      <p className="w-20 text-right text-sm font-bold text-orange-500">
                        {formatPrice(item.price * item.qty)}
                      </p>
                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="rounded-lg p-1 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-4 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total</span>
                  <span className="text-lg font-bold text-gray-900">{formatPrice(totalPrice)}</span>
                </div>
                <Button
                  onClick={onCheckout}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 py-5 text-base font-bold text-white shadow-lg shadow-orange-200 transition-all hover:shadow-xl hover:shadow-orange-300 active:scale-[0.98]"
                >
                  Comprar
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ─── Payment Modal ─── */
function PaymentModal({
  open,
  onClose,
  onSelectMethod,
}: {
  open: boolean
  onClose: () => void
  onSelectMethod: (method: string) => void
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-5 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Método de pago</h3>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="flex flex-col gap-2.5">
                {PAYMENT_METHODS.map((pm) => (
                  <button
                    key={pm.method}
                    onClick={() => onSelectMethod(pm.method)}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 text-left transition-all hover:border-orange-200 hover:bg-orange-50/50 hover:shadow-md active:scale-[0.98]"
                  >
                    <div
                      className={`flex size-10 items-center justify-center rounded-lg ${pm.color} text-white`}
                    >
                      {pm.method === 'transfermovil' ? (
                        <QrCode className="size-5" />
                      ) : (
                        <CreditCard className="size-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{pm.label}</p>
                    </div>
                    <ExternalLink className="size-4 text-gray-300" />
                  </button>
                ))}
              </div>
              <p className="mt-3 text-center text-xs text-gray-400">
                El monto se copió al portapapeles automáticamente.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ─── QR Modal ─── */
function QRModal({
  open,
  onClose,
  qrUrl,
  staff,
  total,
}: {
  open: boolean
  onClose: () => void
  qrUrl: string
  staff: string
  total: number
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-5 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Transfermóvil</h3>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="flex flex-col items-center gap-3">
                <p className="text-sm text-gray-500">Escanea el QR para pagar:</p>
                <div className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <img
                    src={qrUrl}
                    alt="QR Transfermóvil"
                    className="h-56 w-56 object-contain"
                  />
                </div>
                <p className="text-xs text-gray-400">
                  Total: {formatPrice(total)} · Turno: {staff}
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ─── Toast notification ─── */
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-24 left-1/2 z-[60] rounded-xl border border-orange-200 bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-200"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function Home() {
  const [cartOpen, setCartOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [qrOpen, setQrOpen] = useState(false)
  const [qrData, setQrData] = useState({ url: '', staff: '' })
  const [toast, setToast] = useState({ message: '', visible: false })
  const [scrollToTopVisible, setScrollToTopVisible] = useState(false)

  const addItem = useCartStore((s) => s.addItem)
  const items = useCartStore((s) => s.items)
  const totalItems = useCartStore((s) => s.totalItems())
  const totalPrice = useCartStore((s) => s.totalPrice())
  const clearCart = useCartStore((s) => s.clearCart)

  const sectionIds = MENU_DATA.map((cat) => `section-${cat.id}`)
  const activeSection = useActiveSection(sectionIds)

  /* Scroll to top detection */
  useEffect(() => {
    const handleScroll = () => {
      setScrollToTopVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* Show toast helper */
  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true })
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2000)
  }, [])

  /* Add item handler */
  const handleAddItem = useCallback(
    (item: MenuItem) => {
      addItem({ id: item.id, name: item.name, price: item.price, imageUrl: item.imageUrl })
      showToast(`${item.name} agregado`)
    },
    [addItem, showToast]
  )

  /* Checkout handler */
  const handleCheckout = async () => {
    if (items.length === 0) return
    try {
      await navigator.clipboard.writeText(`${totalPrice} CUP`)
    } catch {
      // clipboard not available
    }
    setCartOpen(false)
    setPaymentOpen(true)
  }

  /* Payment method handler */
  const handlePaymentMethod = async (method: string) => {
    const shift = await fetchShift()

    if (method === 'zelle' || method === 'paypal' || method === 'visa') {
      const link = shift?.links?.[method as keyof typeof shift.links] || '#'
      window.open(link, '_blank')
      setPaymentOpen(false)
      clearCart()
      showToast('¡Pedido realizado!')
    } else if (method === 'transfermovil') {
      try {
        const res = await fetch('/api/qr')
        if (!res.ok) throw new Error('No QR')
        const data = await res.json()
        setQrData({ url: data.qrUrl, staff: data.staff || 'turno' })
        setPaymentOpen(false)
        setQrOpen(true)
        clearCart()
      } catch {
        showToast('No se pudo obtener el QR')
      }
    }
  }

  /* Fetch shift data */
  async function fetchShift() {
    try {
      const res = await fetch('/api/shift')
      if (res.ok) return await res.json()
    } catch {
      // ignore
    }
    return null
  }

  /* Scroll to category */
  const scrollToCategory = (id: string) => {
    const el = document.getElementById(`section-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <div className="flex size-12 items-center justify-center overflow-hidden rounded-xl border border-orange-100 bg-gradient-to-br from-orange-50 to-orange-100 shadow-sm">
            <img
              src="/logo.png"
              alt="Pizza Mary"
              className="size-10 rounded-lg object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold tracking-tight text-gray-900">
              Pizza Mary
            </h1>
            <p className="text-xs text-gray-400">Menú de mesa · Cienfuegos</p>
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex size-11 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-200 transition-all hover:bg-orange-600 hover:shadow-xl active:scale-95"
            aria-label="Abrir carrito"
          >
            <ShoppingCart className="size-5" />
            {totalItems > 0 && (
              <motion.span
                key={totalItems}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm"
              >
                {totalItems}
              </motion.span>
            )}
          </button>
        </div>
      </header>

      {/* ─── CATEGORY NAV ─── */}
      <nav
        className="sticky top-[57px] z-30 border-b border-gray-100 bg-white/80 backdrop-blur-md"
        aria-label="Categorías"
      >
        <div className="scrollbar-hide mx-auto flex max-w-lg gap-2 overflow-x-auto px-4 py-2.5">
          {MENU_DATA.map((cat) => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className={`flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all active:scale-95 ${
                activeSection === `section-${cat.id}`
                  ? 'border-orange-200 bg-orange-50 text-orange-600 shadow-sm'
                  : 'border-gray-150 bg-gray-50 text-gray-500 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-500'
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </nav>

      {/* ─── MAIN CONTENT ─── */}
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-4">
        {/* Notice */}
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-200/50 bg-gradient-to-r from-amber-50 to-orange-50 p-3">
          <AlertCircle className="mt-0.5 size-4 flex-shrink-0 text-amber-500" />
          <div>
            <p className="text-xs font-semibold text-amber-700">Debes saber que...</p>
            <p className="text-xs text-amber-600">
              10% adicional en salón. Feriados: 24, 31 dic y 1 ene.
            </p>
          </div>
        </div>

        {/* Menu Sections */}
        <div className="flex flex-col gap-8">
          {MENU_DATA.map((cat) => (
            <section key={cat.id} id={`section-${cat.id}`} className="scroll-mt-28">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl">{cat.emoji}</span>
                <h2 className="text-base font-bold text-gray-900">{cat.name}</h2>
                <Separator className="flex-1" />
                <span className="text-xs text-gray-300">{cat.items.length}</span>
              </div>
              <div className="flex flex-col gap-3">
                {cat.items.map((item) => (
                  <MenuCard key={item.id} item={item} categoryEmoji={cat.emoji} onAdd={handleAddItem} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* ─── FLOATING CART BUTTON (mobile) ─── */}
      {totalItems > 0 && !cartOpen && (
        <motion.button
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-5 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 text-sm font-bold text-white shadow-xl shadow-orange-300/40 transition-all hover:shadow-2xl active:scale-95"
        >
          <ShoppingCart className="size-4" />
          <span>{totalItems}</span>
          <Separator orientation="vertical" className="h-4 bg-orange-400/50" />
          <span>{formatPrice(totalPrice)}</span>
        </motion.button>
      )}

      {/* ─── SCROLL TO TOP ─── */}
      <AnimatePresence>
        {scrollToTopVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 left-5 z-40 flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-lg transition-all hover:bg-gray-50 active:scale-95"
            aria-label="Volver arriba"
          >
            <ChevronUp className="size-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ─── FOOTER ─── */}
      <footer className="mt-auto border-t border-gray-100 bg-white py-4 text-center">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} Pizza Mary · JotaJota
        </p>
      </footer>

      {/* ─── CART DRAWER ─── */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckout}
      />

      {/* ─── PAYMENT MODAL ─── */}
      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        onSelectMethod={handlePaymentMethod}
      />

      {/* ─── QR MODAL ─── */}
      <QRModal
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        qrUrl={qrData.url}
        staff={qrData.staff}
        total={totalPrice}
      />

      {/* ─── TOAST ─── */}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  )
}
