import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AditionalInfo } from "./components/AditionalInfo";
import { CreditBalance } from "./components/CreditBalance";
import { CreditPackages } from "./components/CreditPackages";
import { TransactionHistory } from "./components/TransactionHistory";
import { UsageSummary } from "./components/UsageSummary";
import { tabs } from "./constants";

export const Credits = () => {
  return (
    <div className="px-6 pb-6 w-full">
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
    </div>
  );
};
