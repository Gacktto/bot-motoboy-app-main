"use client"

import { redirect } from "next/navigation"
import { useState, useEffect } from "react"
import LoginForm from "@/components/login-form"
import LoadingScreen from "@/components/loading-screen"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  // In a real app, you would check if the user is authenticated
  // For demo purposes, we'll just show the login form
  const isAuthenticated = false

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (isAuthenticated) {
    redirect("/dashboard")
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Motoboy Connect</h1>
          <p className="mt-2 text-sm text-gray-600">Faça login para acessar o painel</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

