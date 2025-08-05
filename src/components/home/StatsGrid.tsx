import { StatCard } from "./StatCard";

interface StatData {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  valueClassName?: string;
}

interface StatsGridProps {
  statsData: StatData[];
}

export const StatsGrid = ({ statsData }: StatsGridProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {statsData.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
          valueClassName={stat.valueClassName}
        />
      ))}
    </div>
  );
};
