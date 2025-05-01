"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, AlertCircle, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormValues } from "@/lib/validations/login";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/services/api";
import { useMasks } from "@/hooks/use-masks";
import { cookieUtils } from "@/lib/utils/cookies";
import { apiFetch } from "@/services/api/apiFetch";

type AuthResponse = {
  token: string;
  userId: string;
  status: number;
};

export default function LoginForm() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { formatPhoneNumber } = useMasks();

  // Trecho do onSubmit atualizado
const onSubmit = async (values: LoginFormValues) => {
  setIsLoading(true);
  try {
    // 1. Buscar CSRF token
    const csrfRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/csrf-token`, {
      credentials: "include", // importante para trazer o cookie csrf_secret
    });

    const { csrfToken } = await csrfRes.json();

    // 2. Enviar dados de login + csrfToken no header
    const response = await apiFetch<AuthResponse>("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "csrf-token": csrfToken, // Header esperado pelo backend
      },
      body: JSON.stringify(values),
    });

    if (response.token && response.userId) {
      cookieUtils.setAuthData({
        token: response.token,
        userId: response.userId,
      });
      router.push("/dashboard");
    } else {
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro ao fazer login",
        variant: "destructive",
      });
    }
  } catch (error) {
    toast({
      title: "Erro ao fazer login",
      description:
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao fazer login",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel>Telefone</FormLabel>
                  {fieldState.error && (
                    <span className="text-xs text-destructive flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {fieldState.error.message}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="(00) 00000-0000"
                      className="pl-10"
                      {...field}
                      onChange={(e) => {
                        const formattedValue = formatPhoneNumber(
                          e.target.value
                        );
                        field.onChange(formattedValue);
                      }}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel>Senha</FormLabel>
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
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      {...field}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={isLoading}
          >
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
                Entrando...
              </span>
            ) : (
              "Entrar"
            )}
          </Button>

          <div className="text-center">
            <Link
              href="/recuperar-senha"
              className="text-sm text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              Esqueceu sua senha?
            </Link>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-500">Não tem uma conta?</span>{" "}
            <Link
              href="/cadastro"
              className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              Cadastre-se
            </Link>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
