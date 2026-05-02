/* eslint-disable react-hooks/purity */
import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, User, ChevronDown } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────
interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface Rule {
  keywords: string[];
  response: string;
  priority: number;
}

// ─── Knowledge Base ──────────────────────────────────────────────────
const RULES: Rule[] = [
  // ── Greetings ──
  {
    keywords: [
      "hello",
      "hi",
      "hey",
      "good morning",
      "good afternoon",
      "good evening",
      "howdy",
      "greetings",
      "sup",
      "yo",
    ],
    response:
      "Hello there! 👋 Welcome to UmaMASA! I'm Sagbot, your friendly assistant. How can I help you today?",
    priority: 10,
  },
  {
    keywords: ["how are you", "how r u", "kumusta", "kamusta", "how's it going", "what's up"],
    response:
      "I'm doing great, thank you for asking! 😊 I'm always here and ready to help you with anything related to UmaMASA. What can I assist you with?",
    priority: 10,
  },
  {
    keywords: ["thank you", "thanks", "salamat", "ty", "thank u", "appreciated"],
    response:
      "You're very welcome! 😊 If you need anything else, don't hesitate to ask. Happy shopping at UmaMASA!",
    priority: 10,
  },
  {
    keywords: ["bye", "goodbye", "see you", "take care", "paalam"],
    response:
      "Goodbye! 👋 Thank you for visiting UmaMASA. Come back anytime — fresh produce awaits you! 🌿",
    priority: 10,
  },
  {
    keywords: ["who are you", "what are you", "your name", "what is sagbot"],
    response:
      "I'm Sagbot 🤖, UmaMASA's virtual assistant! I can help you with browsing products, placing orders, checking order statuses, and general questions about our platform. Feel free to ask me anything!",
    priority: 9,
  },
  {
    keywords: ["what is umamasa", "about umamasa", "tell me about umamasa"],
    response:
      "UmaMASA is a Department of Agriculture initiative — an online marketplace that connects you directly to fresh, local, and sustainable agricultural products. We offer vegetables, fruits, dairy, meat, and more! 🌱",
    priority: 9,
  },

  // ── Buying / Shopping ──
  {
    keywords: [
      "how to buy",
      "how do i buy",
      "how to purchase",
      "purchase",
      "buy something",
      "how to shop",
      "want to buy",
      "how can i buy",
    ],
    response:
      'Here\'s how to buy on UmaMASA! 🛒\n\n1️⃣ Go to the **Market** page (home page)\n2️⃣ Browse the products — you can filter by category and sort by price\n3️⃣ Click on a product to see details\n4️⃣ Choose your **quantity** and click **"Add to Cart"**\n5️⃣ Go to your **Cart** to review items\n6️⃣ Click **"Checkout"** to proceed\n7️⃣ Enter your **delivery address** and click **"Place Order"**\n\nThat\'s it! Your order will be placed as **Pending** and the seller will confirm it shortly. 🎉',
    priority: 8,
  },
  {
    keywords: ["add to cart", "cart", "how to add", "add item", "add product"],
    response:
      'To add items to your cart: 🛒\n\n1️⃣ Click on any product in the **Market** page\n2️⃣ A details popup will appear\n3️⃣ Use the **+** and **−** buttons to set your desired quantity\n4️⃣ Click the **"Add to Cart"** button\n\nYou\'ll be redirected to your cart where you can review your items!',
    priority: 7,
  },
  {
    keywords: [
      "checkout",
      "how to checkout",
      "place order",
      "placing order",
      "how to place order",
      "confirm order",
      "submit order",
    ],
    response:
      'To checkout and place your order: 📦\n\n1️⃣ Go to your **Cart** page\n2️⃣ Review your items and quantities\n3️⃣ Click the **"Checkout"** button\n4️⃣ Enter your **full delivery address**\n5️⃣ Payment method is **Cash on Delivery** (pay when it arrives!)\n6️⃣ Click **"Place Order"** to confirm\n\nYou\'ll see a success message once your order is submitted! ✅',
    priority: 7,
  },

  // ── Cart ──
  {
    keywords: [
      "view cart",
      "my cart",
      "see cart",
      "open cart",
      "go to cart",
      "where is cart",
      "find cart",
    ],
    response:
      'You can access your cart by clicking **"Cart"** in the top navigation bar, or by clicking the 🛒 shopping cart icon. There you can adjust quantities, remove items, and proceed to checkout!',
    priority: 6,
  },
  {
    keywords: ["remove from cart", "delete from cart", "remove item", "delete item"],
    response:
      "To remove an item from your cart:\n\n1️⃣ Go to the **Cart** page\n2️⃣ Find the item you want to remove\n3️⃣ Click the red **trash icon** 🗑️ next to it\n4️⃣ Confirm the removal in the popup dialog\n\nDone! The item will be removed from your cart.",
    priority: 7,
  },
  {
    keywords: ["change quantity", "update quantity", "modify quantity", "edit quantity"],
    response:
      "To change the quantity of an item in your cart:\n\n1️⃣ Go to the **Cart** page\n2️⃣ Find the item you want to modify\n3️⃣ Use the **+** and **−** buttons to adjust the quantity\n\nThe total price will update automatically! 💰",
    priority: 7,
  },

  // ── Orders ──
  {
    keywords: [
      "order status",
      "check order",
      "my orders",
      "where is my order",
      "track order",
      "order tracking",
      "view orders",
      "see orders",
    ],
    response:
      'To check your orders: 📋\n\n1️⃣ Click **"Orders"** in the navigation bar\n2️⃣ You\'ll see all your orders with their statuses\n3️⃣ Use the filter tabs to view by status:\n   • **Pending** — Waiting for seller confirmation\n   • **Confirmed** — Seller accepted your order\n   • **Completed** — Order delivered successfully\n   • **Cancelled** — Order was cancelled',
    priority: 7,
  },
  {
    keywords: ["pending", "what is pending", "pending meaning", "pending order"],
    response:
      "A **Pending** order means your order has been placed but is still waiting for the seller to confirm it. Don't worry — the seller will review and confirm it shortly! ⏳",
    priority: 6,
  },
  {
    keywords: ["confirmed", "what is confirmed", "confirmed order", "confirmed meaning"],
    response:
      "A **Confirmed** order means the seller has accepted your order and it's being prepared for delivery! 🎉 Sit tight — your fresh produce is on its way!",
    priority: 6,
  },
  {
    keywords: ["completed", "completed order", "delivered", "delivery complete"],
    response:
      'A **Completed** order means your order has been successfully delivered to you! 🥳 If you loved the products, feel free to order again using the **"Buy Again"** button!',
    priority: 6,
  },
  {
    keywords: ["cancel", "cancel order", "cancelled", "how to cancel"],
    response:
      "To cancel an order, you can do so from the **Orders** page while the order is still in **Pending** status. Once an order is confirmed by the seller, it can no longer be cancelled. If you need further assistance, please contact our support.",
    priority: 7,
  },

  // ── Payment ──
  {
    keywords: [
      "payment",
      "pay",
      "payment method",
      "how to pay",
      "payment options",
      "cod",
      "cash on delivery",
    ],
    response:
      "Currently, UmaMASA supports **Cash on Delivery (COD)** 💵 as the payment method. This means you pay when your order arrives at your doorstep — no advance payment needed! Easy and hassle-free! 😊",
    priority: 7,
  },
  {
    keywords: ["credit card", "debit card", "gcash", "maya", "online payment", "bank transfer"],
    response:
      "At the moment, we only support **Cash on Delivery (COD)** as a payment method. We're working on adding more payment options like GCash, Maya, and card payments in the future. Stay tuned! 💳",
    priority: 6,
  },

  // ── Delivery ──
  {
    keywords: [
      "delivery",
      "shipping",
      "delivery fee",
      "shipping fee",
      "delivery cost",
      "how long delivery",
    ],
    response:
      "Great news! 🎉 Delivery on UmaMASA is currently **FREE**! Just enter your complete delivery address during checkout, and your fresh produce will be delivered right to your door. Delivery times may vary depending on your location.",
    priority: 7,
  },
  {
    keywords: ["delivery address", "address", "change address", "where to deliver"],
    response:
      "You'll be asked to enter your **full delivery address** during the checkout process. Make sure to provide a complete and accurate address so the delivery goes smoothly! 📍",
    priority: 6,
  },

  // ── Account ──
  {
    keywords: ["register", "sign up", "create account", "new account", "how to register"],
    response:
      'To create an account on UmaMASA: 📝\n\n1️⃣ Go to the **Register** page (or click "Create an account" from the login page)\n2️⃣ Fill in your **First Name**, **Last Name**, and optionally your **Middle Name**\n3️⃣ Enter a valid **email address**\n4️⃣ Create a **password** (at least 8 characters)\n5️⃣ Click **"Create Account"**\n\nYou\'ll be all set to start shopping! 🌿',
    priority: 7,
  },
  {
    keywords: ["login", "sign in", "log in", "how to login", "can't login", "unable to login"],
    response:
      'To log in to UmaMASA: 🔐\n\n1️⃣ Go to the **Login** page\n2️⃣ Enter your registered **email address**\n3️⃣ Enter your **password**\n4️⃣ Click **"Sign In"**\n\nIf you don\'t have an account yet, click "Create an account" to register first!',
    priority: 7,
  },
  {
    keywords: ["logout", "sign out", "log out", "how to logout"],
    response:
      'To log out:\n\n1️⃣ Click on your **profile avatar** (top-right corner of the navigation bar)\n2️⃣ A dropdown menu will appear\n3️⃣ Click **"Log out"** at the bottom\n\nYou\'ll be redirected to the login page. See you next time! 👋',
    priority: 7,
  },
  {
    keywords: ["forgot password", "reset password", "change password", "lost password"],
    response:
      "I'm sorry, the password reset feature is not yet available on UmaMASA. If you've forgotten your password, please contact our support team at **info@da.gov.ph** or call **(02) 8928-8741** for assistance. 📞",
    priority: 7,
  },

  // ── Products ──
  {
    keywords: [
      "products",
      "what do you sell",
      "what products",
      "available products",
      "what can i buy",
    ],
    response:
      "UmaMASA offers a wide variety of fresh agricultural products including:\n\n🥦 **Vegetables**\n🍎 **Fruits**\n🧀 **Dairy**\n🥩 **Meat**\n\nVisit the **Market** page to browse all available products. You can filter by category and sort by price or newest arrivals!",
    priority: 6,
  },
  {
    keywords: ["filter", "category", "categories", "sort", "search product", "find product"],
    response:
      "On the **Market** page, you can:\n\n🔍 **Filter** products by category (Vegetables, Fruits, Dairy, Meat)\n📊 **Sort** products by Best Match, Price (Low to High / High to Low), or Newest Arrivals\n🔎 **Search** for specific products using the search bar in the navigation\n\nThis makes it easy to find exactly what you're looking for! 🎯",
    priority: 6,
  },
  {
    keywords: ["price", "how much", "cost", "expensive", "cheap", "affordable"],
    response:
      "Product prices vary depending on the item. You can find the price displayed on each product card on the **Market** page. Use the **Sort** feature to arrange products from lowest to highest price (or vice versa) to find items within your budget! 💰",
    priority: 5,
  },

  // ── Contact / Support ──
  {
    keywords: ["contact", "support", "help", "customer service", "phone", "email", "reach"],
    response:
      "You can reach the UmaMASA support team through:\n\n📞 **Phone:** (02) 8928-8741\n📧 **Email:** info@da.gov.ph\n\nWe're here to help! Feel free to contact us for any concerns or inquiries. 💬",
    priority: 6,
  },

  // ── Theme ──
  {
    keywords: ["dark mode", "light mode", "theme", "change theme", "dark theme", "light theme"],
    response:
      'To switch between Dark and Light mode:\n\n1️⃣ Click on your **profile avatar** (top-right)\n2️⃣ In the dropdown, click **"Dark Mode"** or **"Light Mode"**\n\nThe theme will change instantly! 🌙☀️',
    priority: 6,
  },
];

// ─── Matching Engine ─────────────────────────────────────────────────
const FALLBACK_RESPONSE =
  "I appreciate your question, but I'm sorry — that's outside of my scope as Sagbot. 😅 I can help you with browsing products, placing orders, payment, delivery, and account-related questions on UmaMASA.\n\nIf you need further assistance, please contact our support:\n📞 (02) 8928-8741\n📧 info@da.gov.ph";

function getResponse(input: string): string {
  const normalized = input.toLowerCase().trim();
  if (!normalized) return FALLBACK_RESPONSE;

  let bestMatch: Rule | null = null;
  let bestScore = 0;

  for (const rule of RULES) {
    let matchCount = 0;
    for (const keyword of rule.keywords) {
      if (normalized.includes(keyword)) {
        matchCount++;
      }
    }
    if (matchCount > 0) {
      const score = matchCount * 10 + rule.priority;
      if (score > bestScore) {
        bestScore = score;
        bestMatch = rule;
      }
    }
  }

  return bestMatch ? bestMatch.response : FALLBACK_RESPONSE;
}

// ─── Quick Suggestions ──────────────────────────────────────────────
const QUICK_SUGGESTIONS = [
  "How to buy?",
  "My orders",
  "Payment methods",
  "Delivery info",
  "Contact support",
];

// ─── Component ───────────────────────────────────────────────────────
export default function Sagbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hi there! 👋 I'm **Sagbot**, your UmaMASA assistant. I can help you with shopping, orders, payments, and more!\n\nWhat would you like to know?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 80;
    setShowScrollBtn(!isNearBottom);
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(
      () => {
        const botResponse = getResponse(text);
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          text: botResponse,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
      },
      600 + Math.random() * 600
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Simple markdown-like bold rendering
  const renderText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-bold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <>
      {/* ── Floating Action Button ── */}
      <button
        id="sagbot-fab"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen
            ? "bg-red-500 hover:bg-red-600 rotate-0"
            : "bg-gradient-to-br from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800"
        }`}
        title={isOpen ? "Close Sagbot" : "Chat with Sagbot"}
      >
        <div className={`transition-transform duration-300 ${isOpen ? "rotate-90" : "rotate-0"}`}>
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
        </div>

        {/* Notification dot */}
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {/* ── Chat Window ── */}
      <div
        className={`fixed bottom-24 right-6 z-[9998] w-[370px] max-w-[calc(100vw-2rem)] transition-all duration-300 origin-bottom-right ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-90 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-[520px] max-h-[70vh] rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-background">
          {/* ── Header ── */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 px-5 py-4 flex items-center gap-3 shrink-0">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-emerald-700" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-sm tracking-tight">Sagbot</h3>
              <p className="text-emerald-200 text-xs">UmaMASA Assistant • Online</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── Messages ── */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-muted/30 relative"
            style={{ scrollBehavior: "smooth" }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 items-end animate-fade-in ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    msg.sender === "bot" ? "bg-emerald-100 dark:bg-emerald-900/40" : "bg-primary/10"
                  }`}
                >
                  {msg.sender === "bot" ? (
                    <Bot className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-primary" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[75%] px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-line rounded-2xl ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-card border border-border/50 text-foreground rounded-bl-md shadow-sm"
                  }`}
                >
                  {msg.text.split("\n").map((line, i) => (
                    <span key={i}>
                      {renderText(line)}
                      {i < msg.text.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-2 items-end animate-fade-in">
                <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="bg-card border border-border/50 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5">
                    <span
                      className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Scroll to bottom button */}
          {showScrollBtn && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-[140px] left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:bg-muted transition-colors z-10"
            >
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          )}

          {/* ── Quick Suggestions ── */}
          {messages.length <= 1 && !isTyping && (
            <div className="px-4 py-2 flex flex-wrap gap-1.5 bg-background border-t border-border/30 shrink-0">
              {QUICK_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                  className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* ── Input ── */}
          <form
            onSubmit={handleSubmit}
            className="px-3 py-3 bg-background border-t border-border/40 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              id="sagbot-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              disabled={isTyping}
              className="flex-1 h-10 px-4 rounded-full bg-muted/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* ── Footer ── */}
          <div className="px-4 py-1.5 text-center bg-background border-t border-border/20 shrink-0">
            <p className="text-[10px] text-muted-foreground/60">
              Sagbot • UmaMASA Virtual Assistant
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
