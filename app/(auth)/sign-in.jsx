import React, { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Image, Alert } from "react-native";

import { images } from "../../constants";
// import { CustomButton, FormField } from "../../components";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";

import { getCurrentUser, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false); // submitting state
  const [form, setForm] = useState({ email: "", password: "" }); // default form state
  const { setUser, setIsLogged } = useGlobalContext(); // usage global context

  const submit = async () => {
    // cheking before signIn
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please enter your credentials");
      return; // Exit the function if any field is empty
    }

    setIsSubmitting(true); // changing state
    console.log("Sign-in with:", form.email, form.password); // Check user data

    try {
      // try to enter
      await signIn(form.email, form.password);

      const result = await getCurrentUser();
      console.log("Current user:", result); // Check user result

      setUser(result); // Сохраняем пользователя в глобальный контекст
      setIsLogged(true);

      Alert.alert("Success", "User signed in successfully");

      console.log("Redirecting to home...");
      router.replace("/home"); // using function from expo router for changin route
    } catch (error) {
      console.error("Sign-in error:", error);
      // Обработка ошибок
      if (error.message.includes("A session is already active")) {
        // Если уже существует сессия, просто получаем текущего пользователя
        const result = await getCurrentUser();
        setUser(result);
        setIsLogged(true);

        Alert.alert("Info", "You are already logged in.");
        router.replace("/home");
      } else {
        Alert.alert("Error", error.message || "Failed to sign in");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[83vh] px-4 my-6">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
            Log in to Aora
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(event) => setForm({ ...form, email: event })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(event) => setForm({ ...form, password: event })}
            otherStyles="mt-7"
          />
          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-secondary"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
