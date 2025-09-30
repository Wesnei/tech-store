import Link from "next/link";
import { Store, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t text-center">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center justify-items-center">
          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1 flex flex-col items-center">
            <Link href="/" className="flex items-center space-x-2 justify-center">
              <Store className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">TechStore</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-xs text-center">
              Sua loja online de tecnologia com os melhores produtos e preços do mercado. Qualidade garantida e entrega rápida.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4 flex flex-col items-center">
            <h3 className="text-sm font-semibold text-foreground">Links Rápidos</h3>
            <ul className="space-y-2 flex flex-col items-center">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Produtos
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div className="space-y-4 flex flex-col items-center">
            <h3 className="text-sm font-semibold text-foreground">Suporte</h3>
            <ul className="space-y-2 flex flex-col items-center">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Entrega
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Devoluções
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div className="space-y-4 flex flex-col items-center">
            <h3 className="text-sm font-semibold text-foreground">Contato</h3>
            <ul className="space-y-3 flex flex-col items-center">
              <li className="flex items-center space-x-2 text-sm text-muted-foreground justify-center">
                <Mail className="h-4 w-4" />
                <span>contato@techstore.com</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground justify-center">
                <Phone className="h-4 w-4" />
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-muted-foreground justify-center">
                <MapPin className="h-4 w-4" />
                <span>Boa Viagem - CE</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border text-center flex flex-col items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 TechStore. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
