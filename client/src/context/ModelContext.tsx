import React, { createContext, useContext, useEffect, useState } from "react";
import type { AlertColor } from "@mui/material";
import type { SimpleUser, User } from "../../../shared/types/User";
import type { SimplePost, Post } from "../../../shared/types/Post";
import type { Message } from "../../../shared/types/Message";

import * as authApi from "../api/authApi";
import * as userApi from "../api/userApi";
import * as postApi from "../api/postApi";
import * as messageApi from "../api/messageApi";

import type { ClientModel } from "../types/model";

interface ModelContextType {
  //Application model
  model: ClientModel;

  setModel: React.Dispatch<React.SetStateAction<ClientModel>>;

  //Authentication
  login: (username: string, password: string) => Promise<void>;

  logout: () => Promise<void>;

  createUser: (user: User) => Promise<SimpleUser>;

  editCurrentUser: (user: User) => Promise<SimpleUser>;

  deleteCurrentUser: () => Promise<void>;

  //Public users
  getUser: (userId: number) => Promise<SimpleUser>;

  //Board
  loadBoard: () => Promise<SimplePost[]>;

  loadPost: (postId: number) => Promise<Post>;

  createPost: (post: Post) => Promise<Post>;

  editPost: (post: Post) => Promise<Post>;

  resolvePost: (postId: number) => Promise<Post>;

  deletePost: (postId: number) => Promise<void>;

  //Messages
  sendMessage: (message: Message) => Promise<Message>;

  //Alerts
  alertOpen: boolean;
  alertText: string;
  alertSeverity: AlertColor;

  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;

  setAlertText: React.Dispatch<React.SetStateAction<string>>;

  setAlertSeverity: React.Dispatch<React.SetStateAction<AlertColor>>;

  triggerAlert: (severity: AlertColor, text: string) => void;
}

const ModelContext = createContext<ModelContextType | null>(null);

const initialModel: ClientModel = {
  currUser: undefined,
  cachedUsers: {},
  currentPost: undefined,
  board: undefined,
  isAuthenticated: false,
  authLoading: true,
};


export function ModelProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [model, setModel] = useState<ClientModel>(initialModel);

  //Alert state
  const [alertOpen, setAlertOpen] = useState(false);

  const [alertText, setAlertText] = useState("");

  const [alertSeverity, setAlertSeverity] = useState<AlertColor>("success");


  const triggerAlert = (
    severity: AlertColor,
    text: string
  ) => {
    setAlertSeverity(severity);
    setAlertText(text);
    setAlertOpen(true);
  };


  /*
   * check whether the browser already has a valid authentication cookie.
   *
   * runs once when the application starts.
   */
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await authApi.getCurrentUser();

        if (response.isSuccess && response.data) {
          setModel(prev => ({
            ...prev,
            currUser: response.data,
            isAuthenticated: true,
            authLoading: false,
          }));
        } else {
          setModel(prev => ({
            ...prev,
            currUser: undefined,
            isAuthenticated: false,
            authLoading: false,
          }));
        }
      } catch {
        setModel(prev => ({
          ...prev,
          currUser: undefined,
          isAuthenticated: false,
          authLoading: false,
        }));
      }
    };

    checkAuthentication();
  }, []);


  //Login
  const login = async (username: string, password: string) => {
    const response = await authApi.login(username, password);

    if (!response.isSuccess || !response.data) {
      throw new Error(response.message || "Unable to log in.");
    }

    setModel(prev => ({
      ...prev,
      currUser: response.data,
      isAuthenticated: true,
    }));

    triggerAlert("success", response.message || "Successfully logged in.");
  };


  //Logout
  const logout = async () => {
    try {
      const response = await authApi.logout();

      setModel({
        currUser: undefined,
        cachedUsers: {},
        currentPost: undefined,
        board: undefined,
        isAuthenticated: false,
        authLoading: false,
      });

      if (response.message) {
        triggerAlert("success", response.message);
      }

    } catch (error) {
      setModel({
        currUser: undefined,
        cachedUsers: {},
        currentPost: undefined,
        board: undefined,
        isAuthenticated: false,
        authLoading: false,
      });
      throw error;
    }
  };


  /*
   * Create user
   * Creating an account does not automatically authenticate the user
   */
  const createUser = async (user: User): Promise<SimpleUser> => {
    const response = await userApi.createUser(user);

    if (!response.isSuccess || !response.data) {
      throw new Error(response.message || "Unable to create account.");
    }

    setModel(prev => ({
      ...prev,

      cachedUsers: {
        ...prev.cachedUsers,

        [response.data.user_id]: response.data,
      },
    }));

    triggerAlert("success", response.message || "Account created successfully.");

    return response.data;
  };


  /*
   * Get public user information.
   *
   * First checks the local cache.
   */
  const getUser = async (userId: number): Promise<SimpleUser> => {
    const cached = model.cachedUsers[userId];

    if (cached) { return cached; }

    const response = await userApi.getUser(userId);

    if (!response.isSuccess || !response.data) {
      throw new Error(response.message || "Unable to retrieve user.");
    }

    setModel(prev => ({
      ...prev,
      cachedUsers: {
        ...prev.cachedUsers,

        [userId]: response.data,
      },
    }));

    return response.data;
  };

  //Edit currently authenticated user.
  const editCurrentUser = async (user: User): Promise<SimpleUser> => {
    const response = await userApi.editUser(user);

    if (!response.isSuccess || !response.data) {
      throw new Error(response.message || "Unable to update user.");
    }

    setModel(prev => ({
      ...prev,

      currUser: response.data,

      cachedUsers: {
        ...prev.cachedUsers,

        [response.data.user_id]: response.data,
      },
    }));

    triggerAlert("success", response.message || "Account updated successfully.");

    return response.data;
  };


  //Delete currently authenticated user
  const deleteCurrentUser = async (): Promise<void> => {
    const response = await userApi.deleteUser();

    if (!response.isSuccess) {
      throw new Error(response.message || "Unable to delete account.");
    }

    setModel({
      currUser: undefined,
      cachedUsers: {},
      currentPost: undefined,
      board: undefined,
      isAuthenticated: false,
      authLoading: false,
    });

    triggerAlert("success", response.message || "Account deleted.");
  };

  //Load board
  const loadBoard = async (): Promise<SimplePost[]> => {
    const response = await postApi.getBoard();

    if (!response.isSuccess) {

      throw new Error(response.message || "Unable to load board.");
    }


    setModel(prev => ({
      ...prev,

      board: response.data,
    }));

    return response.data;
  };


  //Load complete post
  const loadPost = async (postId: number): Promise<Post> => {
    const response = await postApi.getPost(postId);

    if (!response.isSuccess || !response.data) {
      throw new Error(response.message || "Unable to load post.");
    }

    setModel(prev => ({
      ...prev,

      currentPost: response.data,
    }));

    return response.data;
  };


  //Create post
  const createPost = async (post: Post): Promise<Post> => {
    const response = await postApi.createPost(post);

    if (!response.isSuccess || !response.data) {
      throw new Error(response.message || "Unable to create post.");
    }

    setModel(prev => ({
      ...prev,

      currentPost: response.data,

      board:
        prev.board
          ? [
            ...prev.board,
            {
              post_id: response.data.post_id,
              user_id: response.data.user_id,
              userDisplayName: response.data.userDisplayName,
              title: response.data.title,
              isResolved: response.data.isResolved,
              created: response.data.created,
              imageData: response.data.imageData,
            },
          ]
          : prev.board,
    }));

    return response.data;
  };


  //Edit post
  const editPost = async (post: Post): Promise<Post> => {
    const response = await postApi.editPost(post);

    if (!response.isSuccess || !response.data
    ) {
      throw new Error(response.message || "Unable to edit post.");
    }

    setModel(prev => ({
      ...prev,

      currentPost: response.data,

      board:
        prev.board?.map(existingPost =>
          existingPost.post_id === response.data.post_id
            ? {
              post_id: response.data.post_id,
              user_id: response.data.user_id,
              userDisplayName: response.data.userDisplayName,
              title: response.data.title,
              isResolved: response.data.isResolved,
              created: response.data.created,
              imageData: response.data.imageData,
            }
            : existingPost
        ),
    }));


    return response.data;
  };


  // Resolve post
  const resolvePost = async (postId: number): Promise<Post> => {
    const response = await postApi.resolvePost(postId);

    if (!response.isSuccess || !response.data) {
      throw new Error(response.message || "Unable to resolve post.");
    }


    setModel(prev => ({
      ...prev,

      currentPost: response.data,

      board:
        prev.board?.filter(
          post =>
            post.post_id !== postId
        ),
    }));


    return response.data;
  };


  //Delete post
  const deletePost = async (postId: number): Promise<void> => {

    const response =
      await postApi.deletePost(postId);


    if (
      !response.isSuccess
    ) {

      throw new Error(
        response.message ||
        "Unable to delete post."
      );
    }


    setModel(prev => ({
      ...prev,
      currentPost:
        prev.currentPost?.post_id === postId ? undefined : prev.currentPost,

      board:
        prev.board?.filter(
          post => post.post_id !== postId
        ),
    }));

    triggerAlert("success", response.message || "Post deleted.");
  };

  //Messages
  const sendMessage = async (message: Message): Promise<Message> => {
    const response = await messageApi.sendMessage(message);

    if (!response.isSuccess || !response.data) {
      throw new Error(response.message || "Unable to send message.");
    }

    setModel(prev => {
      if (!prev.currentPost || prev.currentPost.post_id !== response.data.post_id
      ) {return prev;}

      return {
        ...prev,
        currentPost: {
          ...prev.currentPost,

          messages: [
            ...prev.currentPost.messages,
            response.data,
          ],
        },
      };
    });
    return response.data;
  };


  /*
   * Context value
   */
  return (
    <ModelContext.Provider
      value={{
        model,
        setModel,

        login,
        logout,

        createUser,
        editCurrentUser,
        deleteCurrentUser,

        getUser,

        loadBoard,
        loadPost,
        createPost,
        editPost,
        resolvePost,
        deletePost,

        sendMessage,

        alertOpen,
        alertText,
        alertSeverity,

        setAlertOpen,
        setAlertText,
        setAlertSeverity,

        triggerAlert,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
}


export function useModel(): ModelContextType {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error("useModel must be used inside a ModelProvider.");
  }
  return context;
}