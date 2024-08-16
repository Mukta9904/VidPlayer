import { ThemeToggle } from "@/components/theme-toggle";
import Homepage from "./homepage/page";
import { NextUIProvider } from "@nextui-org/react";

export default function Home() {
  return (
    <>
    <div >
      <NextUIProvider>
      <Homepage/>
      </NextUIProvider>
    </div>
    </>
  );
}
