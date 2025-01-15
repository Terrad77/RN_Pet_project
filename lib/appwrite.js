import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite"; //  install before Appwrite React Native SDK:  npx expo install react-native-appwrite react-native-url-polyfill

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.terrad77.rn_pet_project",
  projectId: "67696eb20020e2602d43",
  databaseId: "6769730e002a231e7be8",
  userCollectionId: "676973b6001ad88a7439",
  videoCollectionId: "6769745e0005ce8be9a7",
  storageId: "676978ff001f404aae5b",
};

// деструктуризация объекта appwriteConfig -> позволяет извлечь его свойства и использовать их в других частях кода, без необходимости обращаться к объекту напрямую =  без точечной нотации (appwriteConfig.endpoint).
const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = appwriteConfig;

// Init React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register user (createUser)
export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw Error;
    // creating avavtar account
    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
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
    // console.log(error);
    throw new Error(error);
  }
};

// Sign In
export const signIn = async (email, password) => {
  try {
    // Проверяем наличие активной сессии
    const currentSession = await account.get();
    if (currentSession) {
      console.log("Active session found:", currentSession);
      // throw new Error("A session is already active.");
      // Удаляем активную сессию (опционально)
      try {
        await account.deleteSession("current");
        console.log("Active session deleted.");
      } catch (error) {
        console.log("No active session to delete, proceeding to sign in...");
      }
    }
    // Создаем новую сессию
    const session = await account.createEmailPasswordSession(email, password); // for React Native SDK 0.5.0   https://appwrite.io/docs/products/auth/email-password
    console.log("Session created successfully:", session);
    return session; // Возвращаем session для отладки
  } catch (error) {
    console.error("Sign-in error details:", error);

    // Генерируем читаемое сообщение для пользователя
    const errorMessage =
      error.message || "Sign-in failed, when try to create session";

    throw new Error(errorMessage);
  }
};

// get Current User
export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {}
};

// get Posts
export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId);

    // if (!posts) throw Error;

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

// Закрытие старой сессии
export const logoutAllSessions = async () => {
  try {
    await account.deleteSessions(); // Удаляет все активные сессии
    console.log("All sessions closed successfully.");
  } catch (error) {
    console.error("Error closing sessions:", error);
  }
};
