import { RadioTower } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <RadioTower className="h-24 w-24 text-gray-300 dark:text-gray-600 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Nenhuma oportunidade disponível
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md">
        Não há oportunidades de conteúdo para esta semana. Aguarde o próximo
        ciclo de geração ou entre em contato com o suporte.
      </p>
    </div>
  );
};

