// custom hook to fetch data from Appwrite
import { useEffect, useState } from "react";
import { Alert } from "react-native";

const useAppwrite = (fn) => {
  const [data, setData] = useState([]); // state for media data
  const [isLoading, setIsLoading] = useState(true); // loading state for FlatList

  // function to fetch data
  const fetchData = async () => {
    setIsLoading(true);

    // fetch media data
    try {
      const response = await fn();

      setData(response); // set media data in state
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // fetch media data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => fetchData();

  return { data, isLoading, refetch };
};

export default useAppwrite;
