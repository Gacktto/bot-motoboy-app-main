"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, CreditCard, Calendar, User, Lock, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { paymentsApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import LoadingScreen from "@/components/loading-screen"
import { z } from "zod"

// Payment form schema
const paymentSchema = z.object({
  cardName: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres.",
  }),
  cardNumber: z
    .string()
    .min(16, {
      message: "Número de cartão inválido.",
    })
    .max(19),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, {
    message: "Data inválida. Use o formato MM/AA.",
  }),
  cvv: z
    .string()
    .min(3, {
      message: "CVV inválido.",
    })
    .max(4),
})

type PaymentFormValues = z.infer<typeof paymentSchema>

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  features: string[]
}

export default function AssinaturaPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<string>("")
  const router = useRouter()
  const { toast } = useToast()

  // Load subscription plans
  useEffect(() => {
    const loadPlans = async () => {
      try {
        const plansData = await paymentsApi.getSubscriptionPlans()
        setPlans(plansData)
        setSelectedPlan(plansData[0].id)
        setIsLoading(false)
      } catch (error) {
        toast({
          title: "Erro ao carregar planos",
          description: "Não foi possível carregar os planos de assinatura",
          variant: "destructive",
        })
      }
    }

    loadPlans()
  }, [toast])

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  })

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "")
    const groups = []

    for (let i = 0; i < digits.length; i += 4) {
      groups.push(digits.slice(i, i + 4))
    }

    return groups.join(" ").trim()
  }

  const formatExpiryDate = (value: string) => {
    const digits = value.replace(/\D/g, "")

    if (digits.length <= 2) {
      return digits
    }

    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`
  }

  const onSubmit = async (values: PaymentFormValues) => {
    if (!selectedPlan) {
      toast({
        title: "Selecione um plano",
        description: "Por favor, selecione um plano de assinatura",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await paymentsApi.subscribe(selectedPlan, values)
      toast({
        title: "Assinatura realizada",
        description: "Sua assinatura foi realizada com sucesso",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Erro ao realizar assinatura",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao processar sua assinatura",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Escolha seu plano</h1>
          <p className="mt-2 text-gray-600">Selecione o plano que melhor atende às suas necessidades</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all ${
                selectedPlan === plan.id ? "border-emerald-500 ring-2 ring-emerald-500" : ""
              }`}
            >
              {plan.id === "pro" && (
                <div className="absolute -right-12 top-6 rotate-45 bg-emerald-500 px-12 py-1 text-sm font-semibold text-white">
                  Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                  <span className="text-2xl font-bold">R$ {plan.price.toFixed(2)}</span>
                  <span className="text-sm">/mês</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-emerald-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant={selectedPlan === plan.id ? "default" : "outline"}
                  className={`w-full ${selectedPlan === plan.id ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {selectedPlan === plan.id ? "Selecionado" : "Selecionar"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Informações de Pagamento</h2>

          <Tabs defaultValue="credit-card">
            <TabsList className="mb-4">
              <TabsTrigger value="credit-card">Cartão de Crédito</TabsTrigger>
              <TabsTrigger value="pix">PIX</TabsTrigger>
            </TabsList>

            <TabsContent value="credit-card">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="cardName"
                    render={({ field, fieldState }) => (
                      <FormItem className="space-y-2">
                        <div className="flex items-center justify-between">
                          <FormLabel>Nome no Cartão</FormLabel>
                          {fieldState.error && (
                            <span className="text-xs text-destructive flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {fieldState.error.message}
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <User className="h-4 w-4 text-gray-400" />
                          </div>
                          <FormControl>
                            <Input placeholder="Nome como está no cartão" className="pl-10" {...field} />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field, fieldState }) => (
                      <FormItem className="space-y-2">
                        <div className="flex items-center justify-between">
                          <FormLabel>Número do Cartão</FormLabel>
                          {fieldState.error && (
                            <span className="text-xs text-destructive flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {fieldState.error.message}
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <CreditCard className="h-4 w-4 text-gray-400" />
                          </div>
                          <FormControl>
                            <Input
                              placeholder="1234 5678 9012 3456"
                              className="pl-10"
                              maxLength={19}
                              {...field}
                              onChange={(e) => {
                                field.onChange(formatCardNumber(e.target.value))
                              }}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="expiryDate"
                      render={({ field, fieldState }) => (
                        <FormItem className="space-y-2">
                          <div className="flex items-center justify-between">
                            <FormLabel>Validade</FormLabel>
                            {fieldState.error && (
                              <span className="text-xs text-destructive flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {fieldState.error.message}
                              </span>
                            )}
                          </div>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Calendar className="h-4 w-4 text-gray-400" />
                            </div>
                            <FormControl>
                              <Input
                                placeholder="MM/AA"
                                className="pl-10"
                                maxLength={5}
                                {...field}
                                onChange={(e) => {
                                  field.onChange(formatExpiryDate(e.target.value))
                                }}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cvv"
                      render={({ field, fieldState }) => (
                        <FormItem className="space-y-2">
                          <div className="flex items-center justify-between">
                            <FormLabel>CVV</FormLabel>
                            {fieldState.error && (
                              <span className="text-xs text-destructive flex items-center">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {fieldState.error.message}
                              </span>
                            )}
                          </div>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Lock className="h-4 w-4 text-gray-400" />
                            </div>
                            <FormControl>
                              <Input
                                placeholder="123"
                                className="pl-10"
                                maxLength={4}
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e.target.value.replace(/\D/g, ""))
                                }}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processando...
                      </span>
                    ) : (
                      `Assinar por R$ ${plans.find((p) => p.id === selectedPlan)?.price.toFixed(2) || "0.00"}/mês`
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="pix">
              <div className="flex flex-col items-center space-y-4 py-4">
                <div className="rounded-lg border p-4 bg-gray-50 w-48 h-48 flex items-center justify-center">
                  <img src="/placeholder.svg?height=150&width=150" alt="QR Code PIX" className="h-36 w-36" />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-2">Escaneie o QR Code ou copie a chave PIX abaixo</p>
                  <div className="flex items-center justify-center space-x-2">
                    <code className="bg-gray-100 px-3 py-1 rounded text-sm">motoboy-connect-pix@email.com</code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText("motoboy-connect-pix@email.com")
                        toast({
                          title: "Chave PIX copiada",
                          description: "A chave PIX foi copiada para a área de transferência",
                        })
                      }}
                    >
                      Copiar
                    </Button>
                  </div>
                </div>
                <Button
                  className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => {
                    setIsSubmitting(true)
                    setTimeout(() => {
                      toast({
                        title: "Pagamento confirmado",
                        description: "Seu pagamento via PIX foi confirmado",
                      })
                      router.push("/")
                    }, 2000)
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Verificando pagamento...
                    </span>
                  ) : (
                    "Já fiz o pagamento"
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

