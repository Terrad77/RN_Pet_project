import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Video, ResizeMode } from "expo-av"; // Install Expo AV: expo install expo-av
import * as Animatable from "react-native-animatable";
import { icons } from "../constants";

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1.1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

const TrendingItem = ({ activeItem, item }) => {
  const [play, setPlay] = useState(false);

  // const videoRef = useRef(null);
  // useEffect(() => {
  //   if (play && videoRef.current) {
  //     videoRef.current.playAsync();
  //   }
  // }, [play]);

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item ? zoomIn : zoomOut} // zoom in/out animation for active (or not) item
      duration={500}
    >
      {play ? (
        <Video
          source={{ uri: item.video }}
          // className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
          // стилизация видео-контейнера без использования стилей nattivewind
          style={{
            width: 208, // эквивалент w-52
            height: 288, // эквивалент h-72
            borderRadius: 35,
            backgroundColor: "rgba(255,255,255,0.1)", // для видимости
          }}
          resizeMode={ResizeMode.CONTAIN} // video resize mode
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false); // stop video when it's finished
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-black/40"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[0]);

  // function to handle viewable items change, also Use a ref for viewabilityConfig callback (Changing onViewableItemsChanged on the fly is not supported in RN)
  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  }).current; //current для, сохранения ссылки на объект, которая остаётся неизменной между рендерами компонента.

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 170 }} // initial offset,  позволяет начальный сдвиг контента, добавляя эффект уже "частично прокрученного" списка.
      horizontal
    />
  );
};

export default Trending;
