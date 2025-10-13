import { Button } from "@/components/ui";
import { useTheme } from "@/contexts/ThemeContext";

// Icons for theme toggle
const SunIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const MoonIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

const SystemIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

interface ThemeToggleProps {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export const ThemeToggle = ({
  variant = "outline",
  size = "icon",
  className = "",
}: ThemeToggleProps) => {
  const { theme, setTheme, actualTheme } = useTheme();

  const handleToggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getIcon = () => {
    if (theme === "system") {
      return <SystemIcon />;
    }
    return actualTheme === "dark" ? <MoonIcon /> : <SunIcon />;
  };

  const getTooltipText = () => {
    switch (theme) {
      case "light":
        return "Modo Claro";
      case "dark":
        return "Modo Escuro";
      case "system":
        return "Modo Sistema";
      default:
        return "Alternar Tema";
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleTheme}
      className={`transition-all duration-200 ${className}`}
      aria-label={`Alternar tema. Atual: ${getTooltipText()}`}
      title={getTooltipText()}
    >
      {getIcon()}
      <span className="sr-only">{getTooltipText()}</span>
    </Button>
  );
};
