import { Badge } from "./badge";

export const BetaLogo = () => {
  return (
    <div className="flex justify-center items-center gap-2">
      <img
        src={"/postnow_logo_white.svg"}
        alt="Logo"
        className=" max-w-[138px] h-10"
      />
      <Badge>BETA</Badge>
    </div>
  );
};
