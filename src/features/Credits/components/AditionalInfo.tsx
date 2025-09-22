import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export const AditionalInfo = () => {
  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Como Funciona</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">💳</div>
              <h3 className="font-semibold mb-2">1. Compre Créditos</h3>
              <p className="text-sm text-muted-foreground">
                Escolha um pacote de créditos que atenda às suas necessidades
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl mb-2">🤖</div>
              <h3 className="font-semibold mb-2">2. Use Modelos de IA</h3>
              <p className="text-sm text-muted-foreground">
                Seus créditos são automaticamente deduzidos ao usar
                funcionalidades de IA
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold mb-2">3. Acompanhe o Uso</h3>
              <p className="text-sm text-muted-foreground">
                Monitore seu consumo e histórico de transações em tempo real
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
