import { SIGN_IN, SIGN_OUT, FETCH_COLOR, EDIT_COLOR } from "./types";
import { toast } from "react-toastify";
import api from "../apis/users";
import history from '../history'

export const signIn = (data) => {
    return async (dispatch, getState) => {
        // const {userId} = getState().auth;
        try {
          const response = await api.post(
            `/login`,
            data
          );
          dispatch({ type: SIGN_IN, payload: data.email });
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("user",data.email)
          history.push('/dashboard')
        } catch (error) {
          toast("failed to save your preference");
        }
      };
};


export const signup = (data) => {
    return async (dispatch, getState) => {
    try {
        const response = await api.post(
          `/register`,
          data
        );
        dispatch({ type: SIGN_IN, payload: data.email });
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user",data.email)
        history.push('/dashboard')
      } catch (error) {
        toast("failed to save your preference");
      }
    };
}

export const signOut = () => {
  return {
    type: SIGN_OUT,
  };
};

export const editColorPreference = (color) => {
  return async (dispatch, getState) => {
    const {userId} = getState().auth;
    try {
      const response = await api.post(
        `/preference/${userId}`,
        {
          color: color,
        }
      );
      toast("Successfully saved your color preference");
      dispatch({ type: EDIT_COLOR, payload: color });
    } catch (error) {
      toast("failed to save your preference");
    }
  };
};

export const fetchColor = (color) => {
  return {
    type: FETCH_COLOR,
    payload: color,
  };
};

