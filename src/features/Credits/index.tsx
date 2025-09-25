import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AditionalInfo } from "./components/AditionalInfo";
import { CreditBalance } from "./components/CreditBalance";
import { CreditPackages } from "./components/CreditPackages";
import { TransactionHistory } from "./components/TransactionHistory";
import { UsageSummary } from "./components/UsageSummary";
import { tabs } from "./constants";

export const Credits = () => {
  return (
    <Container
      headerTitle="Sistema de Créditos"
      headerDescription="Gerencie seus créditos para usar modelos de IA e acompanhe seu consumo"
    >
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

            <AditionalInfo />
          </div>
        </TabsContent>

        <TabsContent value="packages" className="mt-6">
          <CreditPackages />
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <TransactionHistory />
        </TabsContent>
      </Tabs>
    </Container>
  );
};
