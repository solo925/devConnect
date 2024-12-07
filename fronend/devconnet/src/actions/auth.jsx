import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import { setAlert } from "./alert";
import {
  AUTH_ERROR,
  CLEAR_PROFILE,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_LOADED
} from "./types";

// Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get("http://127.0.0.1:8000/api/auth/user");
    dispatch({ type: USER_LOADED, payload: res.data });
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
  }
};

// Register User
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: { "Content-Type": "application/json" },
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post("http://127.0.0.1:8000/api/auth/register", body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data.access, // Use the access token
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data;

    if (errors["email"]) {
      errors["email"].forEach((msg) => dispatch(setAlert(`Email: ${msg}`, "danger")));
    }

    dispatch({ type: REGISTER_FAIL });
  }
};


// Login User
export const login = (email, password) => async dispatch => {
  const config = {
    headers: { "Content-Type": "application/json" }
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("http://127.0.0.1:8000/api/auth/login", body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data.token
    });

    dispatch(loadUser());
  } catch (err) {
    const error = err.response.data.error;

    dispatch(setAlert(error, "danger"));

    dispatch({
      type: LOGIN_FAIL
    });
  }
};

// Logout
export const logout = () => dispatch => {
  dispatch({ type: LOGOUT });
  dispatch({ type: CLEAR_PROFILE });
};
