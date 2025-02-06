import React, { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";
import { getUserPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";

import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";

const Profile = () => {
  // logout function
  const logout = () => {};
  const { user, setUser, setIsloggedIn } = useGlobalContext(); // get user data from global context
  const { data: posts } = useAppwrite(() => getUserPosts(user.$id)); // get user posts from appwrite

  return (
    <SafeAreaView className="bg-primary  h-full">
      <FlatList
        data={posts} // add media data in this array
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard video={item} /> // pass video data to VideoCard component
        )}
        ListHeaderComponent={() => (
          <View
            className="w-full justify-center items-center mt-6 mb-12 px-4"
            onPress={logout}
          >
            <TouchableOpacity className="w-full items-end mb-10">
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>
            <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center ">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
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
