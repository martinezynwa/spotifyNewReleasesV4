import { getPathTitle } from "@/lib/routes";
import { usePathname } from "expo-router";
import { Text } from "react-native";

export const HeaderTitle = () => {
  const path = usePathname();

  const { pathName } = getPathTitle(path);

  return <Text>{pathName}</Text>;
};
