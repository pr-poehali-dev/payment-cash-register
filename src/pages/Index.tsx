import { useState } from "react";
import Icon from "@/components/ui/icon";

type Page = "home" | "products" | "cart" | "payment" | "settings";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  emoji: string;
}

interface CartItem extends Product {
  qty: number;
}

const PRODUCTS: Product[] = [
  { id: 1, name: "Кофе Эспрессо", price: 150, category: "Напитки", emoji: "☕" },
  { id: 2, name: "Капучино", price: 220, category: "Напитки", emoji: "🍵" },
  { id: 3, name: "Латте", price: 250, category: "Напитки", emoji: "🥛" },
  { id: 4, name: "Круассан", price: 180, category: "Выпечка", emoji: "🥐" },
  { id: 5, name: "Чизкейк", price: 320, category: "Десерты", emoji: "🍰" },
  { id: 6, name: "Авокадо-тост", price: 380, category: "Еда", emoji: "🥑" },
  { id: 7, name: "Сэндвич", price: 290, category: "Еда", emoji: "🥪" },
  { id: 8, name: "Смузи", price: 270, category: "Напитки", emoji: "🥤" },
  { id: 9, name: "Тирамису", price: 350, category: "Десерты", emoji: "🍮" },
  { id: 10, name: "Маффин", price: 160, category: "Выпечка", emoji: "🧁" },
  { id: 11, name: "Вода", price: 80, category: "Напитки", emoji: "💧" },
  { id: 12, name: "Сок апельсин", price: 190, category: "Напитки", emoji: "🍊" },
];

const PAYMENT_METHODS = [
  { id: "card", label: "Банковская карта", icon: "CreditCard", color: "#3b82f6" },
  { id: "cash", label: "Наличные", icon: "Banknote", color: "#22c55e" },
  { id: "qr", label: "QR-код / СБП", icon: "QrCode", color: "#a855f7" },
  { id: "apple", label: "Apple Pay / Google Pay", icon: "Smartphone", color: "#f97316" },
];

const STATS = [
  { label: "Выручка сегодня", value: "84 500 ₽", delta: "+12%", color: "#3b82f6", icon: "TrendingUp" },
  { label: "Чеков сегодня", value: "147", delta: "+8%", color: "#22c55e", icon: "Receipt" },
  { label: "Средний чек", value: "575 ₽", delta: "+4%", color: "#f97316", icon: "BarChart3" },
  { label: "Товаров продано", value: "312", delta: "+15%", color: "#a855f7", icon: "Package" },
];

export default function Index() {
  const [page, setPage] = useState<Page>("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [payMethod, setPayMethod] = useState("card");
  const [paySuccess, setPaySuccess] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const categories = ["Все", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];
  const filtered = PRODUCTS.filter((p) => {
    const matchCat = selectedCategory === "Все" || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;
      if (item.qty === 1) return prev.filter((i) => i.id !== id);
      return prev.map((i) => i.id === id ? { ...i, qty: i.qty - 1 } : i);
    });
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const handlePay = () => {
    setPaySuccess(true);
    setTimeout(() => {
      setCart([]);
      setPaySuccess(false);
      setPage("home");
    }, 2500);
  };

  const navItems: { id: Page; label: string; icon: string }[] = [
    { id: "home", label: "Главная", icon: "LayoutDashboard" },
    { id: "products", label: "Товары", icon: "Package" },
    { id: "cart", label: "Корзина", icon: "ShoppingCart" },
    { id: "payment", label: "Оплата", icon: "CreditCard" },
    { id: "settings", label: "Настройки", icon: "Settings" },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden" style={{ fontFamily: "'Golos Text', sans-serif" }}>
      {/* Sidebar */}
      <aside
        className={`flex flex-col transition-all duration-300 ${sidebarOpen ? "w-60" : "w-16"} shrink-0`}
        style={{ background: "hsl(220,20%,6%)", borderRight: "1px solid hsl(var(--border))" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: "1px solid hsl(var(--border))" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 glow-blue" style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
            <Icon name="Zap" size={18} className="text-white" />
          </div>
          {sidebarOpen && (
            <span className="font-black text-lg tracking-tight text-white">
              Касса<span style={{ color: "#60a5fa" }}>Про</span>
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative group ${
                page === item.id
                  ? "font-semibold"
                  : "hover:bg-secondary"
              }`}
              style={
                page === item.id
                  ? { background: "rgba(59,130,246,0.15)", color: "#60a5fa" }
                  : { color: "hsl(var(--muted-foreground))" }
              }
            >
              <div className="relative shrink-0">
                <Icon name={item.icon} size={20} />
                {item.id === "cart" && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center" style={{ background: "#f97316" }}>
                    {cartCount}
                  </span>
                )}
              </div>
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
              {page === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full" style={{ background: "#60a5fa" }} />
              )}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3" style={{ borderTop: "1px solid hsl(var(--border))" }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all hover:bg-secondary"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            <Icon name={sidebarOpen ? "PanelLeftClose" : "PanelLeftOpen"} size={18} />
            {sidebarOpen && <span className="text-sm">Свернуть</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-14 flex items-center justify-between px-6 shrink-0" style={{ borderBottom: "1px solid hsl(var(--border))", background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)" }}>
          <h1 className="font-bold text-base text-foreground">
            {navItems.find((n) => n.id === page)?.label}
          </h1>
          <div className="flex items-center gap-3">
            <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              {new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
              КА
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 animate-fade-in">

          {/* ── HOME ── */}
          {page === "home" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-foreground">Добрый день! 👋</h2>
                  <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>Сегодня отличный день для продаж</p>
                </div>
                <button
                  onClick={() => setPage("products")}
                  className="flex items-center gap-2 text-white font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all text-sm"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", boxShadow: "0 0 20px rgba(59,130,246,0.3)" }}
                >
                  <Icon name="Plus" size={16} />
                  Новый чек
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map((s, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-5 space-y-3 hover:scale-[1.02] transition-transform cursor-default"
                    style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}22` }}>
                        <Icon name={s.icon} size={20} style={{ color: s.color }} />
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${s.color}22`, color: s.color }}>
                        {s.delta}
                      </span>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-foreground">{s.value}</div>
                      <div className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick + Recent */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <h3 className="font-bold text-xs uppercase tracking-wider mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>Быстрый доступ</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Создать чек", icon: "FilePlus", color: "#3b82f6", action: () => setPage("products") },
                      { label: "Принять оплату", icon: "CreditCard", color: "#22c55e", action: () => setPage("payment") },
                      { label: "Товары", icon: "Package", color: "#f97316", action: () => setPage("products") },
                      { label: "Настройки", icon: "Settings", color: "#a855f7", action: () => setPage("settings") },
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={item.action}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all group hover:scale-105"
                        style={{ border: `1px solid ${item.color}33`, background: `${item.color}0a` }}
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: `${item.color}22` }}>
                          <Icon name={item.icon} size={20} style={{ color: item.color }} />
                        </div>
                        <span className="text-xs font-medium text-foreground">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <h3 className="font-bold text-xs uppercase tracking-wider mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>Последние чеки</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Кофе + Круассан", time: "14:32", amount: "370 ₽", method: "Карта" },
                      { label: "Латте × 2, Чизкейк", time: "14:15", amount: "820 ₽", method: "СБП" },
                      { label: "Смузи + Маффин", time: "13:58", amount: "430 ₽", method: "Наличные" },
                      { label: "Тирамису × 3", time: "13:41", amount: "1 050 ₽", method: "Карта" },
                    ].map((tx, i) => (
                      <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: i < 3 ? "1px solid hsl(var(--border))" : "none" }}>
                        <div>
                          <div className="text-sm font-medium text-foreground">{tx.label}</div>
                          <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{tx.time} · {tx.method}</div>
                        </div>
                        <span className="text-sm font-bold" style={{ color: "#22c55e" }}>{tx.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── PRODUCTS ── */}
          {page === "products" && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
                  <input
                    type="text"
                    placeholder="Поиск товаров..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2"
                    style={{ background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))" }}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                      style={
                        selectedCategory === cat
                          ? { background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff", boxShadow: "0 0 12px rgba(59,130,246,0.3)" }
                          : { background: "hsl(var(--secondary))", color: "hsl(var(--muted-foreground))" }
                      }
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filtered.map((product) => {
                  const inCart = cart.find((i) => i.id === product.id);
                  return (
                    <div
                      key={product.id}
                      className="rounded-2xl p-4 flex flex-col gap-3 hover:scale-[1.03] transition-all cursor-pointer group"
                      style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${inCart ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.08)"}`, backdropFilter: "blur(12px)" }}
                      onClick={() => addToCart(product)}
                    >
                      <div className="text-4xl text-center">{product.emoji}</div>
                      <div>
                        <div className="text-sm font-semibold text-foreground leading-tight">{product.name}</div>
                        <div className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{product.category}</div>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-base font-black" style={{ color: "#60a5fa" }}>{product.price} ₽</span>
                        {inCart ? (
                          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", boxShadow: "0 0 10px rgba(59,130,246,0.4)" }}>
                            {inCart.qty}
                          </span>
                        ) : (
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center transition-all" style={{ background: "hsl(var(--secondary))", color: "hsl(var(--muted-foreground))" }}>
                            <Icon name="Plus" size={14} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── CART ── */}
          {page === "cart" && (
            <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
              {cart.length === 0 ? (
                <div className="rounded-3xl p-16 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Корзина пуста</h3>
                  <p className="text-sm mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>Добавьте товары из каталога</p>
                  <button
                    onClick={() => setPage("products")}
                    className="text-white font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition-all text-sm"
                    style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", boxShadow: "0 0 20px rgba(59,130,246,0.3)" }}
                  >
                    Открыть каталог
                  </button>
                </div>
              ) : (
                <>
                  <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="p-4 flex items-center justify-between" style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                      <span className="font-bold text-sm text-foreground">Позиции в чеке</span>
                      <button onClick={() => setCart([])} className="text-xs hover:underline" style={{ color: "hsl(var(--destructive))" }}>Очистить</button>
                    </div>
                    <div>
                      {cart.map((item, idx) => (
                        <div key={item.id} className="flex items-center gap-4 p-4" style={{ borderBottom: idx < cart.length - 1 ? "1px solid hsl(var(--border))" : "none" }}>
                          <span className="text-2xl">{item.emoji}</span>
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-foreground">{item.name}</div>
                            <div className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{item.price} ₽ × {item.qty}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:text-red-400"
                              style={{ background: "hsl(var(--secondary))", color: "hsl(var(--muted-foreground))" }}
                            >
                              <Icon name="Minus" size={12} />
                            </button>
                            <span className="w-6 text-center text-sm font-bold text-foreground">{item.qty}</span>
                            <button
                              onClick={() => addToCart(item)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:text-blue-400"
                              style={{ background: "hsl(var(--secondary))", color: "hsl(var(--muted-foreground))" }}
                            >
                              <Icon name="Plus" size={12} />
                            </button>
                          </div>
                          <span className="w-24 text-right font-bold text-foreground">
                            {(item.price * item.qty).toLocaleString("ru-RU")} ₽
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl p-5 space-y-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="flex justify-between text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                      <span>Товаров</span><span>{cartCount} шт.</span>
                    </div>
                    <div className="flex justify-between text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                      <span>Скидка</span><span>0 ₽</span>
                    </div>
                    <div className="flex justify-between pt-3" style={{ borderTop: "1px solid hsl(var(--border))" }}>
                      <span className="font-bold text-foreground">Итого</span>
                      <span className="text-2xl font-black" style={{ color: "#60a5fa" }}>{cartTotal.toLocaleString("ru-RU")} ₽</span>
                    </div>
                    <button
                      onClick={() => setPage("payment")}
                      className="w-full text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-all text-sm tracking-wide"
                      style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", boxShadow: "0 0 20px rgba(59,130,246,0.3)" }}
                    >
                      Перейти к оплате →
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── PAYMENT ── */}
          {page === "payment" && (
            <div className="max-w-lg mx-auto space-y-5 animate-fade-in">
              {paySuccess ? (
                <div className="rounded-3xl p-16 text-center animate-slide-up" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", boxShadow: "0 0 30px rgba(34,197,94,0.4)" }}>
                    <Icon name="CheckCircle" size={40} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-2">Оплата прошла!</h3>
                  <p style={{ color: "hsl(var(--muted-foreground))" }}>Чек будет отправлен клиенту</p>
                </div>
              ) : (
                <>
                  <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <h3 className="font-bold text-xs uppercase tracking-wider mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>Сумма к оплате</h3>
                    <div className="text-5xl font-black text-foreground mb-1">
                      {cartTotal > 0 ? `${cartTotal.toLocaleString("ru-RU")} ₽` : "0 ₽"}
                    </div>
                    <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {cartCount > 0 ? `${cartCount} позиций в чеке` : "Корзина пуста"}
                    </p>
                  </div>

                  <div className="rounded-2xl p-5 space-y-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <h3 className="font-bold text-xs uppercase tracking-wider mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>Способ оплаты</h3>
                    {PAYMENT_METHODS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setPayMethod(m.id)}
                        className="w-full flex items-center gap-4 p-4 rounded-xl transition-all"
                        style={{
                          border: payMethod === m.id ? `1px solid rgba(59,130,246,0.6)` : "1px solid hsl(var(--border))",
                          background: payMethod === m.id ? "rgba(59,130,246,0.1)" : "hsl(var(--secondary))",
                        }}
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${m.color}22` }}>
                          <Icon name={m.icon} size={20} style={{ color: m.color }} />
                        </div>
                        <span className="font-semibold text-sm text-foreground flex-1 text-left">{m.label}</span>
                        {payMethod === m.id && (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                            <Icon name="Check" size={12} className="text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handlePay}
                    disabled={cartCount === 0}
                    className="w-full font-bold py-4 rounded-xl text-white text-base tracking-wide transition-all hover:opacity-90 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                    style={
                      cartCount > 0
                        ? { background: "linear-gradient(135deg, #3b82f6, #6366f1)", boxShadow: "0 0 20px rgba(59,130,246,0.3)" }
                        : { background: "hsl(var(--secondary))", color: "hsl(var(--muted-foreground))" }
                    }
                  >
                    {cartCount > 0
                      ? `Принять оплату ${cartTotal.toLocaleString("ru-RU")} ₽`
                      : "Корзина пуста"}
                  </button>

                  {cartCount === 0 && (
                    <button onClick={() => setPage("products")} className="w-full text-sm font-medium hover:underline" style={{ color: "#60a5fa" }}>
                      ← Вернуться к товарам
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── SETTINGS ── */}
          {page === "settings" && (
            <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
              <div className="rounded-2xl p-5 space-y-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <h3 className="font-bold text-xs uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>Информация о магазине</h3>
                {[
                  { label: "Название магазина", placeholder: "КассаПро Кофе" },
                  { label: "ИНН", placeholder: "7707083893" },
                  { label: "Адрес", placeholder: "Москва, ул. Ленина, 1" },
                  { label: "Телефон", placeholder: "+7 (999) 123-45-67" },
                ].map((field, i) => (
                  <div key={i} className="space-y-1.5">
                    <label className="text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>{field.label}</label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2.5 rounded-xl text-sm text-foreground focus:outline-none focus:ring-2"
                      style={{ background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))" }}
                    />
                  </div>
                ))}
              </div>

              <div className="rounded-2xl p-5 space-y-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <h3 className="font-bold text-xs uppercase tracking-wider mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>Способы оплаты</h3>
                {[
                  { label: "Банковская карта (эквайринг)", icon: "CreditCard", color: "#3b82f6", on: true },
                  { label: "Наличные", icon: "Banknote", color: "#22c55e", on: true },
                  { label: "СБП / QR-код", icon: "QrCode", color: "#a855f7", on: true },
                  { label: "Apple Pay / Google Pay", icon: "Smartphone", color: "#f97316", on: false },
                ].map((method, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "hsl(var(--secondary))" }}>
                    <div className="flex items-center gap-3">
                      <Icon name={method.icon} size={18} style={{ color: method.color }} />
                      <span className="text-sm font-medium text-foreground">{method.label}</span>
                    </div>
                    <div className="w-11 h-6 rounded-full relative cursor-pointer" style={{ background: method.on ? "rgba(59,130,246,0.3)" : "hsl(var(--border))" }}>
                      <div className="w-4 h-4 rounded-full absolute top-1 transition-all" style={{ background: method.on ? "#60a5fa" : "hsl(var(--muted-foreground))", right: method.on ? "4px" : "auto", left: method.on ? "auto" : "4px" }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl p-5 space-y-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <h3 className="font-bold text-xs uppercase tracking-wider mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>Чеки и уведомления</h3>
                {[
                  { label: "Отправлять чек на email клиента", on: true },
                  { label: "SMS-уведомление после оплаты", on: false },
                  { label: "Электронный чек в мессенджер", on: true },
                  { label: "Автоматический отчёт в конце дня", on: false },
                ].map((opt, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "hsl(var(--secondary))" }}>
                    <span className="text-sm text-foreground">{opt.label}</span>
                    <div className="w-11 h-6 rounded-full relative cursor-pointer" style={{ background: opt.on ? "rgba(59,130,246,0.3)" : "hsl(var(--border))" }}>
                      <div className="w-4 h-4 rounded-full absolute top-1 transition-all" style={{ background: opt.on ? "#60a5fa" : "hsl(var(--muted-foreground))", right: opt.on ? "4px" : "auto", left: opt.on ? "auto" : "4px" }} />
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="w-full text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-all text-sm"
                style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", boxShadow: "0 0 20px rgba(59,130,246,0.3)" }}
              >
                Сохранить настройки
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
