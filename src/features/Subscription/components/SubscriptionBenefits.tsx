import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

export const SubscriptionBenefits = () => {
  const benefits = [
    {
      title: "Acesso Ilimitado",
      description: "Use todos os recursos da plataforma sem restrições",
      icon: "🚀",
    },

    {
      title: "Suporte Prioritário",
      description: "Atendimento especializado e suporte técnico",
      icon: "🎧",
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Benefícios da Assinatura</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg"
            >
              <div className="text-2xl">{benefit.icon}</div>
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-1">{benefit.title}</h4>
                <p className="text-xs text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-sm text-primary font-medium">
            💡 Cancele a qualquer momento, sem multas ou taxas adicionais
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
