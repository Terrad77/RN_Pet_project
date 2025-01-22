import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";
import { getAllPosts, getLatestPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";

const Home = () => {
  const { data: posts, refetch } = useAppwrite(getAllPosts); // fetch all posts
  const { data: latestPosts } = useAppwrite(getLatestPosts); // fetch latest posts

  const [refreshing, setRefreshing] = useState(false); // refresh state for FlatList

  // refresh function for FlatList
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch(); // recall videos -> if any new video is uploaded
    setRefreshing(false);
  };

  console.log("posts:", posts);

  // one flatlist
  // with list header
  // and horizontal flatlist
  // can`t do usage just scrollview as there's both horizontal and vertical scroll (two flat lists, within trending)
  return (
    <SafeAreaView className="bg-primary  h-full">
      <FlatList
        data={posts} // add media data in this array
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard video={item} /> // pass video data to VideoCard component
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  Terrad77
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-6 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 text-lg font-pregular mb-3">
                Latest Videos
              </Text>

              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos found"
            subtitle="be the first to upload a video"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
