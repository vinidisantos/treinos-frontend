import { Anton } from "next/font/google";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

type AppLogoProps = {
  className?: string;
};

export function AppLogo({ className }: AppLogoProps) {
  return (
    <p
      className={`${anton.className} text-[22px] uppercase leading-[1.15] not-italic ${className ?? ""}`}
    >
      Fit.ai
    </p>
  );
}
