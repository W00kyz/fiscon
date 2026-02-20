import { QueryClientProvider } from "@tanstack/react-query"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router"
import { Toaster } from "@/components/ui/sonner.tsx"
import { TooltipProvider } from "@/components/ui/tooltip.tsx"
import { queryClient } from "@/lib/query-client.ts"
import { router } from "@/routes.tsx"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RouterProvider router={router} />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>,
)
