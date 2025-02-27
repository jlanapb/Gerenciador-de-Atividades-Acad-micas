import { Stack } from "expo-router";
import { AtividadesProvider } from "@/context/AtividadesContext";

export default function Layout() {
  return (
    <AtividadesProvider>
      <Stack screenOptions={{ headerShown: true }} />
    </AtividadesProvider>
  );
}
