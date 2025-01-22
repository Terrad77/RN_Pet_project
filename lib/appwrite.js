import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite"; // Install Appwrite React Native SDK: npx expo install react-native-appwrite react-native-url-polyfill

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.terrad77.rn_pet_project",
  projectId: "67696eb20020e2602d43",
  databaseId: "6769730e002a231e7be8",
  userCollectionId: "676973b6001ad88a7439",
  videoCollectionId: "6769745e0005ce8be9a7",
  storageId: "676978ff001f404aae5b",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = appwriteConfig;

// Initialize React Native SDK
const client = new Client();

client
  .setEndpoint(endpoint) // Set Appwrite endpoint
  .setProject(projectId) // Set project ID
  .setPlatform(platform); // Set application ID or bundle ID

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register user (createUser)  cоздать аккаунт через Appwrite Auth
export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw new Error("Failed to create a new account.");

    // Создать URL для аватара
    const avatarUrl = avatars.getInitials(username);
    console.log("Generated Avatar URL:", avatarUrl); //проверка генерации URL аватара

    // Создание нового пользователя в коллекции users
    const newUser = await databases.createDocument(
      databaseId,
      userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    console.log("User successfully added to the users collection:", newUser);

    // Опционально: автоматически войти после регистрации
    await signIn(email, password);

    return newUser;
  } catch (error) {
    console.error("Error in createUser:", error.message);
    throw error;
  }
};

// Sign In
export const signIn = async (email, password) => {
  try {
    try {
      const currentSession = await account.get();
      if (currentSession) {
        console.log("User is already signed in.");

        return currentSession;
      }
    } catch {
      console.log("No active session. Proceeding to sign in...");
    }

    const session = await account.createEmailPasswordSession(email, password);
    console.log("Session created successfully:", session);

    return session;
  } catch (error) {
    console.error("Sign-in error:", error.message);
    throw new Error(error.message || "Failed to sign in. Please try again.");
  }
};

// Get Current User
export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error("No active account found.");

    // Поиск входящего пользователя в коллекции users
    const currentUser = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw new Error("No user document found.");

    return currentUser.documents[0];
  } catch (error) {
    console.error("Error fetching current user:", error.message);
    throw new Error(error);
  }
};

// Get All Posts
export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId);
    if (!posts.documents.length) throw new Error("No posts found.");

    return posts.documents;
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    throw new Error("Failed to fetch posts. Please try again later.", error);
  }
};

// Get Latest Posts
export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt", Query.limit(7)),
    ]);
    if (!posts.documents.length) throw new Error("No posts found.");

    return posts.documents;
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    throw new Error("Failed to fetch posts. Please try again later.", error);
  }
};

// Logout Current Session
export const logoutCurrentSession = async () => {
  try {
    await account.deleteSession("current");
    console.log("Logged out of current session successfully.");
  } catch (error) {
    console.error("Error logging out of current session:", error.message);
  }
};
