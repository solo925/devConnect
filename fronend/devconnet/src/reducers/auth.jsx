import Cookies from "js-cookie";
import {
  ACCOUNT_DELETED,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_LOADED
} from "../actions/types";

const initialState = {
  token: Cookies.get("access_token"),
  isAuthenticated: null,
  loading: true,
  user: null
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return { ...state, isAuthenticated: true, loading: false, user: payload };

    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      console.log('Token received:', payload);
      // Store token in cookies with an expiration time of 1 day
      Cookies.set("access_token", payload.access, { expires: 1 });
      return {
        ...state,
        token: payload.access,
        isAuthenticated: true,
        loading: false
      };

    case AUTH_ERROR:
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case LOGOUT:
    case ACCOUNT_DELETED:
      console.log('Clearing token');
      // Remove token from cookies when logging out or account is deleted
      Cookies.remove("access_token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      };

    default:
      return state;
  }
}
