"use client";

import type React from "react";

import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/lib/react-query"

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Home,
  Truck,
  Users,
  User,
  Wifi,
  LogOut,
  ChevronDown,
  Bell,
  CreditCard,
} from "lucide-react";

import { useUser } from "@/hooks/useUser";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile";
import { cookieUtils } from "@/lib/utils/cookies";
import { useBotConnectionSync } from "@/hooks/use-bot-connection-sync";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
}

const NavItem = ({ href, icon, label, active, onClick }: NavItemProps) => (
  <Link
    href={href}
    onClick={onClick}
    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
      active
        ? "bg-emerald-100 text-emerald-900"
        : "text-gray-500 hover:bg-gray-100"
    }`}
  >
    {icon}
    <span>{label}</span>
    {label === "Corridas" ? null : null}
  </Link>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isError } = useUser();
  const [userData, setUserData] = useState({
    name: "Usuário",
    imgSrc: "ImgSrc"
  });

  useEffect(() => {
    if (!isLoading && user) {
      setUserData({
        name: user.name,
        imgSrc: "imgSrc"
      });
    }
  }, [isLoading, user]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isMobile = useMobile();
  const router = useRouter();
  useBotConnectionSync();

  useEffect(() => {
    if (!isLoading && (!user || isError)) {
      router.push("/");
    }
  }, [isLoading, user, isError, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const logout = () => {
    cookieUtils.removeAuthData();
    router.push("/");
  };

  const navItems = [
    {
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      label: "Dashboard",
    },
    {
      href: "/dashboard/corridas",
      icon: <Truck className="h-5 w-5" />,
      label: "Corridas",
    },
    {
      href: "/dashboard/contatos",
      icon: <Users className="h-5 w-5" />,
      label: "Contatos",
    },
    {
      href: "/dashboard/conexao",
      icon: <Wifi className="h-5 w-5" />,
      label: "Conexão",
    },
    {
      href: "/dashboard/pagamentos",
      icon: <CreditCard className="h-5 w-5" />,
      label: "Pagamentos",
    },
    {
      href: "/dashboard/perfil",
      icon: <User className="h-5 w-5" />,
      label: "Perfil",
    },
  ];

  const sidebar = (
    <div className="flex h-full flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-600 text-white">
            MB
          </div>
          <span>Motoboy Connect</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={pathname === item.href}
              onClick={isMobile ? closeSidebar : undefined}
            />
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 text-red-600"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );

  return (
    <QueryClientProvider client={queryClient}>

      <div className="flex min-h-screen bg-gray-50">
        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 border-r bg-white lg:block">
          {sidebar}
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-64">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-white px-4 lg:px-6">
            {/* Mobile sidebar trigger */}
            {isMobile && (
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0">
                  {sidebar}
                </SheetContent>
              </Sheet>
            )}

            <div className="ml-auto flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      2
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between p-2">
                    <span className="text-sm font-medium">Notificações</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 text-xs"
                    >
                      Marcar todas como lidas
                    </Button>
                  </div>
                  <div className="max-h-80 overflow-auto">
                    <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                      <div className="flex w-full justify-between">
                        <span className="font-medium">
                          Nova corrida disponível
                        </span>
                        <span className="text-xs text-gray-500">Agora</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Empresa ABC solicitou uma entrega urgente.
                      </p>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                      <div className="flex w-full justify-between">
                        <span className="font-medium">Pagamento recebido</span>
                        <span className="text-xs text-gray-500">1h atrás</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Você recebeu um pagamento de R$ 45,00.
                      </p>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="/placeholder.svg?height=32&width=32"
                        alt="Avatar"
                      />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="hidden text-left lg:block">
                      <div className="text-sm font-medium">{userData.name}</div>
                      <div className="text-xs text-gray-500">Motoboy</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/perfil">Meu Perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-4 lg:p-6"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </QueryClientProvider>
  );
}
