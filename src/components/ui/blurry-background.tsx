export const BlurryBackground = ({
  children,
  variant = "1",
}: {
  children: React.ReactNode;
  variant: string;
}) => {
  const switchBackground = () => {
    switch (variant) {
      case "1":
        return "/background.svg";
      case "2":
        return "/background-2.svg";
      default:
        return "/background.svg";
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${switchBackground()})` }}
    >
      {children}
    </div>
  );
};
