import { Suspense } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { BotaoSair } from '@/components/layout/BotaoSair';
import { UsuarioLogado } from '@/components/layout/UsuarioLogado';

// Com Cache Components, os cookies são lidos dentro de <Suspense>: a estrutura da
// página é entregue de imediato, e os dados do usuário chegam em seguida.
export default function LayoutAutenticado({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      rodapeMenu={
        <>
          <Suspense>
            <UsuarioLogado />
          </Suspense>
          <BotaoSair />
        </>
      }
    >
      {children}
    </AppShell>
  );
}
