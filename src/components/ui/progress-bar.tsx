import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import React from "react";
import { Card, CardContent } from "./card";
import { Progress } from "./progress";

interface ProgressBarProps {
  percentage: number;
  currentStep: number;
  totalSteps: number;
  currentStepName: string;
  elapsedTime: number;
  status: "generating" | "complete" | "error";
  error?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  currentStep,
  totalSteps,
  currentStepName,
  elapsedTime,
  status,
  error,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case "generating":
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case "complete":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "generating":
        return "Gerando com IA...";
      case "complete":
        return "Geração concluída!";
      case "error":
        return "Erro na geração";
      default:
        return "Iniciando...";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "generating":
        return "text-blue-600";
      case "complete":
        return "text-green-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <div>
                <h3 className="font-semibold text-lg">{getStatusText()}</h3>
                <p className={`text-sm ${getStatusColor()}`}>
                  {status === "generating"
                    ? currentStepName
                    : "Processo finalizado"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {percentage}%
              </div>
              <div className="text-sm text-gray-500">
                Passo {currentStep} de {totalSteps}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={percentage} className="h-3" />
            <div className="flex justify-between text-sm text-gray-500">
              <span>0%</span>
              <span>{percentage}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Current Step Info */}
          {status === "generating" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-blue-800">
                  {currentStepName}
                </span>
              </div>
              <p className="text-sm text-blue-600 mt-1">
                Processando... ({elapsedTime}s)
              </p>
            </div>
          )}

          {/* Error Display */}
          {status === "error" && error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="font-medium text-red-800">
                  Erro na geração
                </span>
              </div>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          )}

          {/* Success Display */}
          {status === "complete" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium text-green-800">
                  Geração concluída!
                </span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Tempo total: {elapsedTime}s
              </p>
            </div>
          )}

          {/* Steps Overview */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Etapas do processo:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Array.from({ length: totalSteps }, (_, index) => {
                const stepNumber = index + 1;
                const isCompleted = stepNumber < currentStep;
                const isCurrent = stepNumber === currentStep;

                return (
                  <div
                    key={stepNumber}
                    className={`flex items-center space-x-2 p-2 rounded text-sm ${
                      isCompleted
                        ? "bg-green-100 text-green-800"
                        : isCurrent
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isCurrent
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-gray-500"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        stepNumber
                      )}
                    </div>
                    <span className="truncate">
                      {isCompleted
                        ? "✓ Concluído"
                        : isCurrent
                        ? "🔄 Em andamento"
                        : "⏳ Pendente"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
