import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
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
const storage = new Storage(client);

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

// Search Posts
export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.search("title", query),
    ]);
    if (!posts.documents.length) throw new Error("No posts found.");

    return posts.documents;
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    throw new Error("Failed to fetch posts. Please try again later.", error);
  }
};

// Get User Posts
export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.equal("creator", userId),
    ]);
    if (!posts.documents.length) throw new Error("No posts found.");

    return posts.documents;
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    throw new Error("Failed to fetch posts. Please try again later.", error);
  }
};

// Sign Out
export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    console.log("Logged out of current session successfully.");
    return session;
  } catch (error) {
    throw new Error("Failed to sign out. Please try again later.", error);
  }
};

// Get File Preview
export const getFilePreview = async (fileId, type) => {
  let fileUrl;
  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
      return file;
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }
    if (!fileUrl) throw new Error("Failed to fetch file preview.");

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
};

// Upload File
export const uploadFile = async (file, type) => {
  if (!file) return;

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await storage.getFilePreview(uploadedFile.$id, type);

    return fileUrl;
  } catch (error) {
    throw new Error("Failed to upload file. Please try again later.", error);
  }
};

// Create Video
export const createVideo = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);
    const newPost = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );
    return newPost;
  } catch (error) {
    throw new Error(error);
  }
};
