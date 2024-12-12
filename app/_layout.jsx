// rnfes - снипет для начального кода шаблона, експорт функционального  RN  компонента со стилями
import { StyleSheet, Text, View } from "react-native";
import { SplashScreen, Stack } from "expo-router"; // Slot и Stack  — ключевые компоненты в Expo Router, которые используются для создания гибких и структурированных пользовательских интерфейсов
// Slot - Определяет место, куда можно вставить другой компонент. Это похоже на заполнение пустого места в шаблоне, рендерит дочерний маршрут.
// Stack - Создает стек навигации, экран в стеке имеет свою историю, что позволяет пользователю возвращаться назад.
import { useFonts } from "expo-font";
import { useEffect } from "react";
import "../global.css";

SplashScreen.preventAutoHideAsync(); // предотвращение автоматического скрытия заставки (асинхронности) до загрузки ресурсов

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) return null;

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};
export default RootLayout;
