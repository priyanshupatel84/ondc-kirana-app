import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router"; // Importing router for navigation
import { H3 } from "~/components/ui/typography"; //

const Home = () => {
  const router = useRouter();

  // Navigation handler
  const handleNavigation = (route) => {
    router.push(route);
  };
  return (
    <View className="flex-1 bg-white">
      <View className="p-4">
        <Text className="text-xl font-semibold">Welcome, User Singh</Text>
      </View>

      {/* //store */}
      <View className="flex flex-row flex-wrap justify-center mx-2 gap-2 border p-2 rounded-xl bg-gray-100">
        <View className="w-full">
          <H3 className="text-center">Set Up Store</H3>
        </View>
        <TouchableOpacity
          className="w-[46%] h-16 bg-green-500 justify-center items-center border rounded-lg"
          onPress={() => handleNavigation("/kycVerification")}
        >
          <Text className="text-white text-lg">KYC Verification</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-[46%] h-16 bg-blue-500 justify-center items-center border rounded-lg"
          onPress={() => handleNavigation("/addBank")}
        >
          <Text className="text-white text-lg">Add Bank</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-[46%] h-16 bg-red-500 justify-center items-center border rounded-lg"
          onPress={() => handleNavigation("/addStore")}
        >
          <Text className="text-white text-lg">Add Store</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-[46%] h-16 bg-yellow-500 justify-center items-center border rounded-lg"
          onPress={() => handleNavigation("/logisticsDetails")}
        >
          <Text className="text-white text-lg">Logistics Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-[46%] h-16 bg-purple-500 justify-center items-center border rounded-lg"
          onPress={() => handleNavigation("/storeTiming")}
        >
          <Text className="text-white text-lg">Store Timing</Text>
        </TouchableOpacity>
      </View>

      {/* Dashboard Section */}
      <View className="flex flex-row flex-wrap justify-center pb-2 gap-2 border p-2 rounded-xl bg-gray-100 my-2">
        <View className="w-full">
          <H3 className="text-center">Dashboard</H3>
        </View>
        <TouchableOpacity
          className="w-[95%] h-32 bg-green-500 justify-center items-center border rounded-lg"
          onPress={() => handleNavigation("../(catalog)")}
        >
          <Text className="text-white text-lg">Create Catalog</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-[46%] h-32 bg-blue-500 justify-center items-center border rounded-lg"
          onPress={() => handleNavigation("../(inventory)")}
        >
          <Text className="text-white text-lg">Inventory</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-[46%] h-32 bg-red-500 justify-center items-center border rounded-lg"
          onPress={() => handleNavigation("../(return)")}
        >
          <Text className="text-white text-lg">Returns</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-[46%] h-32 bg-yellow-500 justify-center items-center border rounded-lg"
          onPress={() => handleNavigation("/(order)")}
        >
          <Text className="text-white text-lg">Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-[46%] h-32 bg-purple-500 justify-center items-center border rounded-lg"
          onPress={() => handleNavigation("/(complaints)")}
        >
          <Text className="text-white text-lg">Complaints</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;
