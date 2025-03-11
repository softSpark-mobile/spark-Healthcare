import { createSlice } from "@reduxjs/toolkit";
import {jwtDecode} from 'jwt-decode'
interface AuthState {
  isAuthenticated: boolean;
  screen: "login" | "signup" | "onboardingOne" | "onboardingTwo" | "onboardingThree" | "drawer";
  token : null
  isLoggedIn: null,
  name: string,
  userName: string,
  email: string,
  userId: string,
  isOnboarding: boolean,
  profilePhoto: string,
}

const initialState: AuthState = {
  isAuthenticated: true,
  token: null,
  isLoggedIn: null,
  name: '',
  userName: '',
  email: '',
  userId: '',
  isOnboarding: false,
  profilePhoto: '',
  screen: "login",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: { 
    login : (state,action) => {
       state.token = action.payload
       const user = jwtDecode(action.payload)
       state.name = user.userName,
       state.userId = user.userId,
       state.email = user.email,
       state.isOnboarding = user.IsOnboardingFinish
    },
    loginSuccess: (state) => {
      state.isAuthenticated = true;
      state.screen = "drawer";
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.screen = "login";
    },
    goToSignUp: (state) => {
      state.screen = "signup";
    },
    goToOnboardingOne: (state) => {
      state.screen = "onboardingOne";
    },
    goToOnboardingTwo: (state) => {
      state.screen = "onboardingTwo";
    },
    goToOnboardingThree: (state) => {
      state.screen = "onboardingThree";
    },
    completeOnboarding: (state) => {
      state.screen = "drawer"; 
      state.isAuthenticated = true;
    },
    goBackToOnboardingOne: (state) => {
      state.screen = "onboardingOne";
    },
    goBackToOnboardingTwo: (state) => {
      state.screen = "onboardingTwo";
    },
  },
});

export const {
  loginSuccess,
  logout,
  goToSignUp,
  goToOnboardingOne,
  goToOnboardingTwo,
  goToOnboardingThree,
  goBackToOnboardingOne,
  goBackToOnboardingTwo,
  completeOnboarding,
  login
} = authSlice.actions;
export default authSlice.reducer;
