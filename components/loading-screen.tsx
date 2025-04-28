import { Loader2 } from "lucide-react"

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-emerald-600 text-white">
          <span className="text-xl font-bold">MB</span>
        </div>
        <h1 className="text-xl font-semibold text-gray-900">Motoboy Connect</h1>
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-sm text-gray-500">Carregando...</p>
      </div>
    </div>
  )
}

