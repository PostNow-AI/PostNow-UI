import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CurrentSubscription } from "./components/CurrentSubscription";
import { SubscriptionManagement } from "./components/SubscriptionManagement";
import { SubscriptionOverview } from "./components/SubscriptionOverview";
import { SubscriptionPlans } from "./components/SubscriptionPlans";
import { tabs } from "./constants";

export const Subscription = () => {
  return (
    <Container
      headerTitle="Sistema de Assinaturas"
      headerDescription="Gerencie suas assinaturas e explore nossos planos"
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
              <CurrentSubscription />
              <SubscriptionOverview />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="plans" className="mt-6">
          <SubscriptionPlans />
        </TabsContent>

        <TabsContent value="management" className="mt-6">
          <SubscriptionManagement />
        </TabsContent>
      </Tabs>
    </Container>
  );
};
