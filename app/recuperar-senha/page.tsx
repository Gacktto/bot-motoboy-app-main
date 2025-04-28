"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Mail, Lock, ArrowLeft, AlertCircle, KeyRound } from "lucide-react"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { authApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

// Step 1: Email form schema
const emailSchema = z.object({
  email: z.string().email({
    message: "Email inválido.",
  }),
})

// Step 2: Verification code schema
const codeSchema = z.object({
  code: z.string().min(6, {
    message: "O código deve ter pelo menos 6 caracteres.",
  }),
})

// Step 3: New password schema
const passwordSchema = z
  .object({
    password: z.string().min(6, {
      message: "A senha deve ter pelo menos 6 caracteres.",
    }),
    confirmPassword: z.string().min(6, {
      message: "A senha deve ter pelo menos 6 caracteres.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  })

type EmailFormValues = z.infer<typeof emailSchema>
type CodeFormValues = z.infer<typeof codeSchema>
type PasswordFormValues = z.infer<typeof passwordSchema>

export default function RecuperarSenhaPage() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Email form
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  })

  // Code form
  const codeForm = useForm<CodeFormValues>({
    resolver: zodResolver(codeSchema),
    defaultValues: {
      code: "",
    },
  })

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmitEmail = async (values: EmailFormValues) => {
    setIsLoading(true)

    try {
      await authApi.requestPasswordReset(values.email)
      setEmail(values.email)
      setStep(2)
      toast({
        title: "Código enviado",
        description: "Verifique seu email para o código de recuperação",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao enviar o código",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmitCode = async (values: CodeFormValues) => {
    setIsLoading(true)

    try {
      await authApi.verifyResetCode(email, values.code)
      setStep(3)
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Código inválido",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmitPassword = async (values: PasswordFormValues) => {
    setIsLoading(true)

    try {
      await authApi.resetPassword(email, values.password)
      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao alterar a senha",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Recuperar Senha</h1>
          <p className="mt-2 text-sm text-gray-600">
            {step === 1 && "Digite seu email para receber um código de recuperação"}
            {step === 2 && "Digite o código de verificação enviado para seu email"}
            {step === 3 && "Defina sua nova senha"}
          </p>
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-6">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FormLabel>Email</FormLabel>
                        {fieldState.error && (
                          <span className="text-xs text-destructive flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {fieldState.error.message}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                        <FormControl>
                          <Input placeholder="seu@email.com" className="pl-10" {...field} />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                  {isLoading ? (
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
                      Enviando...
                    </span>
                  ) : (
                    "Enviar Código"
                  )}
                </Button>

                <div className="text-center text-sm">
                  <Link
                    href="/"
                    className="flex items-center justify-center gap-1 text-emerald-600 hover:text-emerald-500"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para o login
                  </Link>
                </div>
              </form>
            </Form>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Form {...codeForm}>
              <form onSubmit={codeForm.handleSubmit(onSubmitCode)} className="space-y-6">
                <FormField
                  control={codeForm.control}
                  name="code"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FormLabel>Código de Verificação</FormLabel>
                        {fieldState.error && (
                          <span className="text-xs text-destructive flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {fieldState.error.message}
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <KeyRound className="h-4 w-4 text-gray-400" />
                        </div>
                        <FormControl>
                          <Input placeholder="Digite o código de 6 dígitos" className="pl-10" {...field} />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                  {isLoading ? (
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
                      Verificando...
                    </span>
                  ) : (
                    "Verificar Código"
                  )}
                </Button>

                <div className="text-center text-sm">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center justify-center gap-1 text-emerald-600 hover:text-emerald-500 mx-auto"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                  </button>
                </div>
              </form>
            </Form>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-6">
                <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FormLabel>Nova Senha</FormLabel>
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
                          <Input type="password" placeholder="Mínimo 6 caracteres" className="pl-10" {...field} />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FormLabel>Confirmar Senha</FormLabel>
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
                          <Input type="password" placeholder="Confirme sua senha" className="pl-10" {...field} />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                  {isLoading ? (
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
                      Salvando...
                    </span>
                  ) : (
                    "Salvar Nova Senha"
                  )}
                </Button>
              </form>
            </Form>
          </motion.div>
        )}
      </div>
    </div>
  )
}

