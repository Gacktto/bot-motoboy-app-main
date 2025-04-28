// Fake API service to simulate backend requests

// Helper to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Fake authentication service
export const authApi = {
  login: async (email: string, password: string) => {
    await delay(1500)

    // Simple validation for demo purposes
    if (email === "teste@email.com" && password === "123456") {
      return { success: true, user: { id: "1", name: "João da Silva", email, role: "motoboy" } }
    }

    throw new Error("Email ou senha inválidos")
  },

  register: async (userData: any) => {
    await delay(2000)
    return { success: true, user: { id: "2", ...userData } }
  },

  requestPasswordReset: async (email: string) => {
    await delay(1500)
    return { success: true, message: "Código enviado para o email" }
  },

  verifyResetCode: async (email: string, code: string) => {
    await delay(1000)
    // For demo, accept any 6-digit code
    if (code.length === 6 && /^\d+$/.test(code)) {
      return { success: true }
    }
    throw new Error("Código inválido")
  },

  resetPassword: async (email: string, password: string) => {
    await delay(1500)
    return { success: true, message: "Senha alterada com sucesso" }
  },
}

// Fake dashboard data service
export const dashboardApi = {
  getStats: async () => {
    await delay(2000)
    return {
      connection: {
        status: "connected",
        lastUpdate: "agora",
      },
      messages: {
        status: "active",
        count: 12,
      },
      rides: {
        today: 5,
        comparison: "+2",
      },
      completion: {
        rate: 98,
      },
    }
  },

  getPendingRides: async () => {
    await delay(1800)
    return [
      {
        id: "delivery-1",
        company: "Empresa 1",
        distance: 2,
        value: 25.0,
      },
      {
        id: "delivery-2",
        company: "Empresa 2",
        distance: 4,
        value: 30.0,
      },
      {
        id: "delivery-3",
        company: "Empresa 3",
        distance: 6,
        value: 35.0,
      },
    ]
  },

  getTodaysRides: async () => {
    await delay(1500)
    return [
      {
        id: 1,
        company: "Restaurante Sabor Caseiro",
        time: "12:30",
        status: "completed",
        details: {
          pickupAddress: "Av. Paulista, 1000",
          deliveryAddress: "Rua Augusta, 500",
          customer: "Maria Silva",
          items: "1x Marmitex, 1x Refrigerante",
          value: 25.0,
          distance: 3.5,
          duration: "25 min",
        },
      },
      {
        id: 2,
        company: "Farmácia Saúde",
        time: "10:15",
        status: "completed",
        details: {
          pickupAddress: "Rua Oscar Freire, 200",
          deliveryAddress: "Alameda Santos, 800",
          customer: "João Pereira",
          items: "Medicamentos",
          value: 18.5,
          distance: 2.1,
          duration: "15 min",
        },
      },
      {
        id: 3,
        company: "Mercado Express",
        time: "16:45",
        status: "canceled",
        details: {
          pickupAddress: "Rua Haddock Lobo, 350",
          deliveryAddress: "Av. Rebouças, 1200",
          customer: "Ana Costa",
          items: "Compras de supermercado",
          value: 30.0,
          distance: 4.2,
          duration: "30 min",
        },
      },
      {
        id: 4,
        company: "Loja de Eletrônicos TechPlus",
        time: "14:20",
        status: "completed",
        details: {
          pickupAddress: "Shopping Ibirapuera",
          deliveryAddress: "Rua Pamplona, 700",
          customer: "Carlos Mendes",
          items: "1x Carregador, 1x Fone de ouvido",
          value: 22.0,
          distance: 3.0,
          duration: "20 min",
        },
      },
    ]
  },
}

// Fake contacts service
export const contactsApi = {
  getContacts: async () => {
    await delay(1800)
    return [
      { id: "1", name: "João Silva", phone: "(11) 98765-4321" },
      { id: "2", name: "Maria Oliveira", phone: "(11) 91234-5678" },
      { id: "3", name: "Pedro Santos", phone: "(11) 99876-5432" },
      { id: "4", name: "Ana Costa", phone: "(11) 98765-1234" },
      { id: "5", name: "Carlos Souza", phone: "(11) 91234-8765" },
    ]
  },

  addContact: async (contact: any) => {
    await delay(1500)
    return { id: Math.random().toString(36).substring(7), ...contact }
  },

  updateContact: async (id: string, contact: any) => {
    await delay(1500)
    return { id, ...contact }
  },

  deleteContact: async (id: string) => {
    await delay(1500)
    return { success: true }
  },
}

// Fake connection service
export const connectionApi = {
  getStatus: async () => {
    await delay(1500)
    return {
      connected: Math.random() > 0.3,
      device: "WhatsApp (Android)",
      lastConnection: "Agora",
      messagesSent: 12,
      messagesReceived: 24,
    }
  },

  connect: async () => {
    await delay(3000)
    return { success: true, connected: true }
  },

  disconnect: async () => {
    await delay(1500)
    return { success: true, connected: false }
  },
}

// Fake payments service
export const paymentsApi = {
  getPayments: async () => {
    await delay(2000)
    return [
      {
        id: "1",
        date: "02/04/2025",
        amount: 49.9,
        status: "paid",
        plan: "Plano Básico",
        period: "Abril 2025",
      },
      {
        id: "2",
        date: "02/03/2025",
        amount: 49.9,
        status: "paid",
        plan: "Plano Básico",
        period: "Março 2025",
      },
      {
        id: "3",
        date: "02/02/2025",
        amount: 49.9,
        status: "paid",
        plan: "Plano Básico",
        period: "Fevereiro 2025",
      },
      {
        id: "4",
        date: "02/01/2025",
        amount: 49.9,
        status: "paid",
        plan: "Plano Básico",
        period: "Janeiro 2025",
      },
      {
        id: "5",
        date: "02/12/2024",
        amount: 49.9,
        status: "paid",
        plan: "Plano Básico",
        period: "Dezembro 2024",
      },
      {
        id: "6",
        date: "02/05/2025",
        amount: 49.9,
        status: "pending",
        plan: "Plano Básico",
        period: "Maio 2025",
      },
      {
        id: "7",
        date: "02/11/2024",
        amount: 39.9,
        status: "overdue",
        plan: "Plano Básico (Promoção)",
        period: "Novembro 2024",
      },
    ]
  },

  getSubscriptionInfo: async () => {
    await delay(1500)
    return {
      plan: "Plano Básico",
      price: 49.9,
      status: "active",
      nextPayment: "02/05/2025",
    }
  },

  getSubscriptionPlans: async () => {
    await delay(1500)
    return [
      {
        id: "basic",
        name: "Plano Básico",
        price: 49.9,
        features: ["Até 100 contatos", "Até 500 mensagens por dia", "Suporte por email"],
      },
      {
        id: "pro",
        name: "Plano Profissional",
        price: 89.9,
        features: [
          "Contatos ilimitados",
          "Mensagens ilimitadas",
          "Suporte prioritário",
          "Relatórios avançados",
          "Múltiplos dispositivos",
        ],
      },
      {
        id: "enterprise",
        name: "Plano Empresarial",
        price: 149.9,
        features: [
          "Tudo do Plano Profissional",
          "API personalizada",
          "Gerente de conta dedicado",
          "Treinamento personalizado",
          "SLA garantido",
        ],
      },
    ]
  },

  subscribe: async (planId: string, paymentInfo: any) => {
    await delay(2500)
    return { success: true, subscriptionId: Math.random().toString(36).substring(7) }
  },
}

// Fake profile service
export const profileApi = {
  getProfile: async () => {
    await delay(1500)
    return {
      name: "João da Silva",
      email: "joao.silva@email.com",
      phone: "(11) 98765-4321",
    }
  },

  updateProfile: async (profileData: any) => {
    await delay(1800)
    return { success: true, profile: profileData }
  },

  updatePassword: async (passwords: any) => {
    await delay(1500)
    return { success: true }
  },
}

