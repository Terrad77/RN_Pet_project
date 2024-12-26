import { Account, Avatars, Client, Databases, ID } from "react-native-appwrite"; // before, need to install Appwrite React Native SDK (type in terminal):    npx expo install react-native-appwrite react-native-url-polyfill

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.terrad77.rn_pet_project",
  projectId: "67696eb20020e2602d43",
  databaseId: "6769730e002a231e7be8",
  userCollectionsId: "676973b6001ad88a7439",
  videoCollectionId: "6769745e0005ce8be9a7",
  storageId: "676978ff001f404aae5b",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// function for Register newUser
export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw Error;
    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionsId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

// function for signIn
export async function signIn(email, password) {
  try {
    const session = await account.createSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}
