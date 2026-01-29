/**
 * InstagramDashboard - Full dashboard with metrics and charts
 */

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInstagramConnection } from "@/hooks/useInstagramConnection";
import { useInstagramMetrics } from "@/hooks/useInstagramMetrics";
import {
  AlertCircle,
  Eye,
  Loader2,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { InstagramStatusCard } from "./InstagramStatusCard";

export function InstagramDashboard() {
  const [period, setPeriod] = useState<7 | 30 | 90>(30);
  const { isConnected } = useInstagramConnection();
  const {
    chartData,
    insights,
    latestMetrics,
    followerGrowthRate,
    isLoading,
    error,
  } = useInstagramMetrics({
    days: period,
    enabled: isConnected,
  });

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Instagram</h1>
            <p className="text-muted-foreground">
              Conecte sua conta para ver métricas e insights
            </p>
          </div>
        </div>
        <InstagramStatusCard />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erro ao carregar métricas. Tente novamente mais tarde.
        </AlertDescription>
      </Alert>
    );
  }

  const StatCard = ({ title, value, change, icon: Icon }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {change !== undefined && (
          <p
            className={`text-xs flex items-center gap-1 ${change >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {change >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {change >= 0 ? "+" : ""}
            {change.toFixed(1)}% vs período anterior
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Instagram</h1>
          <p className="text-muted-foreground">
            Análise detalhada de performance e engajamento
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={period === 7 ? "default" : "outline"}
            onClick={() => setPeriod(7)}
            size="sm"
          >
            7 dias
          </Button>
          <Button
            variant={period === 30 ? "default" : "outline"}
            onClick={() => setPeriod(30)}
            size="sm"
          >
            30 dias
          </Button>
          <Button
            variant={period === 90 ? "default" : "outline"}
            onClick={() => setPeriod(90)}
            size="sm"
          >
            90 dias
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <InstagramStatusCard />

      {/* Stats Grid */}
      {insights && latestMetrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Seguidores"
            value={insights.totalFollowers}
            change={followerGrowthRate}
            icon={Users}
          />
          <StatCard
            title="Impressões"
            value={insights.totalImpressions}
            icon={Eye}
          />
          <StatCard title="Alcance" value={insights.totalReach} icon={Target} />
          <StatCard
            title="Taxa de Engajamento"
            value={`${insights.avgEngagementRate.toFixed(1)}%`}
            icon={Zap}
          />
        </div>
      )}

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="engagement">Engajamento</TabsTrigger>
          <TabsTrigger value="growth">Crescimento</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Impressões e Alcance</CardTitle>
              <CardDescription>
                Visualizações e alcance único ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="colorImpressions"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="impressions"
                    name="Impressões"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorImpressions)"
                  />
                  <Area
                    type="monotone"
                    dataKey="reach"
                    name="Alcance"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#colorReach)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visualizações de Perfil</CardTitle>
              <CardDescription>
                Quantas pessoas visitaram seu perfil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="profileViews"
                    name="Visualizações"
                    fill="#fbbf24"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Taxa de Engajamento</CardTitle>
              <CardDescription>
                Percentual de engajamento em relação ao alcance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="engagement"
                    name="Taxa de Engajamento (%)"
                    stroke="#ec4899"
                    strokeWidth={2}
                    dot={{ fill: "#ec4899" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {latestMetrics && (
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Cliques no Site
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {latestMetrics.website_clicks}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Últimas 24 horas
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Contatos por Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {latestMetrics.email_contacts}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Últimas 24 horas
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Impressões Totais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {latestMetrics.impressions}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Últimas 24 horas
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Growth Tab */}
        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Crescimento de Seguidores</CardTitle>
              <CardDescription>
                Evolução do número de seguidores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="followers"
                    name="Seguidores"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {insights && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Crescimento Total
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {insights.followerGrowth >= 0 ? "+" : ""}
                    {insights.followerGrowth}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {followerGrowthRate >= 0 ? "+" : ""}
                    {followerGrowthRate.toFixed(1)}% no período
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Taxa Média de Engajamento
                    </CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {insights.avgEngagementRate.toFixed(2)}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Média do período
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
