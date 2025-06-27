import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";
import { AxiosError } from "axios";

type User = {
  email: string;
  password: string;
};

type NewUser = User & {
  name: string;
  firstName: string;
  birthday: Date;
};

type UserBasicInfo = {
  iduser: string;
  name: string;
  firstName: string;
  birthday: Date;
  email: string;
};

type UserProfileData = {
  name: string;
  firstName: string;
  email: string;
};

type RejectPayload = {
  message?: string;
};

type AuthApiState = {
  basicUserInfo?: UserBasicInfo | null;
  userProfileData?: UserProfileData | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
};

const initialState: AuthApiState = {
  basicUserInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo") as string)
    : null,
  userProfileData: undefined,
  status: "idle",
  error: null,
};

export const login = createAsyncThunk(
  "login",
  async (data: User, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("api/auth/login", data);
      const resData = response.data;
      localStorage.setItem("userInfo", JSON.stringify(resData.user));
      return resData.user as UserBasicInfo;
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: error.message || "Ein unbekannter Fehler ist aufgetreten." });
    }
  }
);

export const register = createAsyncThunk<UserBasicInfo, NewUser, { rejectValue: RejectPayload }>(
  "register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("api/auth/register", data);
      const resData = response.data;
      localStorage.setItem("userInfo", JSON.stringify(resData.user));
      return resData.user as UserBasicInfo;
    } catch (err) {
      const error = err as AxiosError<RejectPayload>;
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: error.message || "Ein unbekannter Registrierungsfehler ist aufgetreten." });
    }
  }
);

export const logout = createAsyncThunk<any, void, { rejectValue: RejectPayload }>( "logout",async (_, { rejectWithValue }) => { 
    try {
      const response = await axiosInstance.post("api/auth/logout", {});
      localStorage.removeItem("userInfo"); 
      return response.data;
    } catch (err) {
      const error = err as AxiosError<RejectPayload>;
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: error.message || "Ein unbekannter Logout-Fehler ist aufgetreten." });
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login Reducers (bereits angepasst)
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<UserBasicInfo>) => {
          state.status = "idle";
          state.basicUserInfo = action.payload;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        // Zugriff auf das Payload des rejected-Falls
        state.error = (action.payload as RejectPayload)?.message || action.error.message || "Login fehlgeschlagen";
      })

      // Register Reducers
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        register.fulfilled,
        (state, action: PayloadAction<UserBasicInfo>) => {
          state.status = "idle";
          state.basicUserInfo = action.payload;
        }
      )
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        // Zugriff auf das Payload des rejected-Falls für Registrierung
        state.error = (action.payload as RejectPayload)?.message || action.error.message || "Registrierung fehlgeschlagen";
      })

      // Logout Reducers
      .addCase(logout.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.status = "idle";
        state.basicUserInfo = null; // Basic user info beim Logout löschen
        state.error = null; // Fehlermeldung beim erfolgreichen Logout löschen
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        // Zugriff auf das Payload des rejected-Falls für Logout
        state.error = (action.payload as RejectPayload)?.message || action.error.message || "Logout fehlgeschlagen";
      });
  },
});

export default authSlice.reducer;