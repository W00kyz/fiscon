import { Link } from "react-router"
import { Button } from "@/components/ui/button.tsx"

const NotFoundPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4">
    <h1 className="text-4xl font-bold">404</h1>
    <p className="text-muted-foreground">Página não encontrada</p>
    <Button asChild>
      <Link to="/">Voltar ao início</Link>
    </Button>
  </div>
)

export default NotFoundPage
