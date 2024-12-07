import axios from "axios";
import Cookies from "js-cookie";
import { setAlert } from "./alert";
import {
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  REGISTER_FAIL,
  REGISTER_SUCCESS
} from "./types";

// Register User
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: { "Content-Type": "application/json" },
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post("http://127.0.0.1:8000/api/auth/register", body, config);
    console.log("register data", res.data);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data.access, // Use the access token
    });

    // Set token in cookies
    Cookies.set("access_token", res.data.access, { expires: 1 }); // Expire in 1 day

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
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: { "Content-Type": "application/json" },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("http://127.0.0.1:8000/api/auth/login", body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data.access,
    });

    // Set token in cookies
    Cookies.set("access_token", res.data.access, { expires: 1 }); // Expire in 1 day

    dispatch(loadUser());
  } catch (err) {
    const error = err.response.data.error;

    dispatch(setAlert(error, "danger"));

    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

export const logout = () => (dispatch) => {

  Cookies.remove("access_token");

  dispatch({ type: LOGOUT });
  dispatch({ type: CLEAR_PROFILE });
};
