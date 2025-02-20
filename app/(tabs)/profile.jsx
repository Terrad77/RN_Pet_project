import React from "react";
import { View, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import InfoBox from "../../components/InfoBox";
import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";
import { getUserPosts, signOut } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";

import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";
import { router } from "expo-router";

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext(); // get user data from global context
  const { data: posts } = useAppwrite(() => getUserPosts(user.$id)); // get user posts from appwrite

  // logout function
  const logout = async () => {
    await signOut(); // sign out from appwrite
    setUser(null); // set user data to null
    setIsLogged(false); // set isloggedIn to false

    router.replace("/sign-in"); // navigate to sign-in screen
  };
  console.log("user:", user);

  return (
    <SafeAreaView className="bg-primary  h-full">
      <FlatList
        data={posts} // add media data in this array
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard video={item} /> // pass video data to VideoCard component
        )}
        ListHeaderComponent={() => (
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              className="w-full items-end mb-10"
              onPress={logout}
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>
            <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center ">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg bg-white"
                resizeMode="cover"
              />
            </View>
            <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />
            <View className="flex-row mt-5">
              <InfoBox
                title={posts.length || 0}
                subtitle="Posts"
                containerStyles="mr-10"
                titleStyles="text-xl"
              />
              <InfoBox
                title="100.3k"
                subtitle="Followers"
                titleStyles="text-xl"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos found"
            subtitle="No videos found for this search query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
