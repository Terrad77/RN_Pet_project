import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary rounded-xl min-h-[62px] flex flex-row justify-center items-center 
        ${containerStyles} 
        ${isLoading ? "opacity-50" : ""}`}
      // disabled={isLoading} // использование устаревшего pointerEvents prop напрямую
      style={{
        pointerEvents: isLoading ? "none" : "auto", // Disables pointer events when loading, сенсорное взаимодействие отключено когда кнопка находится в состоянии загрузки, что аналогично использованию disabled реквизит
      }}
    >
      <Text className={`text-primary font-psemibold text-lg ${textStyles}`}>
        {title}
      </Text>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          className="ml-2"
        />
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
