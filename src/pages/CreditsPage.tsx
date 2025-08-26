import CreditBalance from "../components/credits/CreditBalance";
import CreditPackages from "../components/credits/CreditPackages";
import TransactionHistory from "../components/credits/TransactionHistory";
import UsageSummary from "../components/credits/UsageSummary";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

const CreditsPage = () => {
  const tabs = [
    { id: "overview", label: "Visão Geral", icon: "📊" },
    { id: "packages", label: "Pacotes", icon: "💳" },
    { id: "transactions", label: "Transações", icon: "📋" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Sistema de Créditos</h1>
        <p className="text-muted-foreground">
          Gerencie seus créditos para usar modelos de IA e acompanhe seu consumo
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center space-x-2"
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CreditBalance />
              <UsageSummary />
            </div>

            {/* Informações Adicionais */}
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
                        Escolha um pacote de créditos que atenda às suas
                        necessidades
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="text-3xl mb-2">🤖</div>
                      <h3 className="font-semibold mb-2">
                        2. Use Modelos de IA
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Seus créditos são automaticamente deduzidos ao usar
                        funcionalidades de IA
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="text-3xl mb-2">📊</div>
                      <h3 className="font-semibold mb-2">3. Acompanhe o Uso</h3>
                      <p className="text-sm text-muted-foreground">
                        Monitore seu consumo e histórico de transações em tempo
                        real
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="packages" className="mt-6">
          <CreditPackages />
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <TransactionHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreditsPage;
