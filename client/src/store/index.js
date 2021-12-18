import { configureStore } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const groupsSlice = createSlice({
  name: "groups",
  initialState: {
    groupsList: [],
  },
  reducers: {
    updateGroups(state, action) {
      state.groupsList = [...action.payload];
    },
    removeAllGroups(state) {
      state.groupsList = [];
    },
  },
});

export const groupsActions = groupsSlice.actions;

const groupMembersSlice = createSlice({
  name: "groupMembers",
  initialState: {
    groupMembersList: [],
    isEditing: false,
    removeOldImage: false,
    groupMemberOnEdit: {},
  },
  reducers: {
    addGroupMember(state, action) {
      const { firstName, lastName, birthday, gender, age, _id } =
        action.payload;
      state.groupMembersList = [
        { firstName, lastName, gender, birthday, age, _id },
        ...state.groupMembersList,
      ];
    },
    addAllGroupMembers(state, action) {
      state.groupMembersList = [...action.payload];
    },
    removeAllGroupMembers(state) {
      state.groupMembersList = [];
    },
    openEdit(state, action) {
      state.isEditing = true;
      state.removeOldImage = false;
      state.groupMemberOnEdit = action.payload;
    },
    closeEdit(state) {
      state.isEditing = false;
      state.removeOldImage = false;
      state.groupMemberOnEdit = {};
    },
    removeImage(state) {
      state.removeOldImage = true;
    },
  },
});

export const groupMembersActions = groupMembersSlice.actions;

const uiSlice = createSlice({
  name: "ui",
  initialState: { notification: null },
  reducers: {
    showNotification(state, action) {
      state.notification = {
        status: action.payload.status,
        message: action.payload.message,
      };
    },
    removeNotification(state) {
      state.notification = null;
    },
  },
});

export const uiActions = uiSlice.actions;

const initialUser = !!localStorage.getItem("user");
const initialUserData = initialUser
  ? JSON.parse(localStorage.getItem("user"))
  : null;
const userSlice = createSlice({
  name: "user",
  initialState: { isLoggedIn: initialUser, userData: initialUserData },
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.userData = action.payload.userData;
      localStorage.setItem("user", JSON.stringify(action.payload.userData));
      localStorage.setItem(
        "logoutTime",
        new Date(new Date().getTime() + 60 * 60 * 1000).getTime()
      );
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userData = null;
      localStorage.removeItem("user");
      localStorage.removeItem("logoutTime");
    },
  },
});

export const userActions = userSlice.actions;

const store = configureStore({
  reducer: {
    groups: groupsSlice.reducer,
    groupMembers: groupMembersSlice.reducer,
    ui: uiSlice.reducer,
    user: userSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
