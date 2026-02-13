export const Container = ({
  children,
  containerActions,
  headerTitle,
  headerDescription,
}: {
  children: React.ReactNode;
  headerTitle: string;
  headerDescription: string | React.ReactNode;
  containerActions?: React.ReactNode;
}) => {
  return (
    <div className="px-6 pb-6 space-y-6 w-full h-full">
      <div className="flex justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">{headerTitle}</h2>
          <span className="text-muted-foreground">{headerDescription}</span>
        </div>
        {/* Main Content */}
        {containerActions && containerActions}
      </div>
      {children}
    </div>
  );
};
