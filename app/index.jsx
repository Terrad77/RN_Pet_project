import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { Text, View, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import Loader from "../components/Loader";
import { Link } from "expo-router";
import "../global.css";
import { useGlobalContext } from "../context/GlobalProvider";

export default function App() {
  const { isLoading, isLogged } = useGlobalContext();

  if (!isLoading && isLogged) return <Redirect href="/home" />;

  return (
    <SafeAreaView className="bg-primary h-full">
      <Loader isLoading={isLoading} />

      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className=" w-full justify-center items-center h-full px-4 ">
          <Image
            source={images.logo}
            className="w-[130px] h-[84px] "
            resizeMode="contain"
          />
          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[298px] "
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Discover Endless {"\n"}
              Possibilities with{"  "}
              <Text className=" text-secondary-200 ">Aora</Text>
            </Text>

            <Image
              source={images.path}
              className="w-[130px] h-[16px] absolute -bottom-3 -right-6 " // not work w & h for image
              style={{ width: 130, height: 16 }} // fix for image
              resizeMode="contain"
            />
          </View>

          <Text className="text-xs font-pregular text-gray-100 mt-12 text-center text-wrap ">
            Where creativity meets innovation: embark on a journey of limitless.
            Exploration with Aora. {"\n"}Created by
            <Text className=" text-secondary-200 "> Terrad77 ©</Text>
          </Text>

          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
