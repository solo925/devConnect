import axios from "axios";
import { setAlert } from "../actions/alert";

import {
  ACCOUNT_DELETED,
  CLEAR_PROFILE,
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_ERROR,
  UPDATE_PROFILE
} from "./types";

// Set Axios defaults to include credentials (cookies)
axios.defaults.withCredentials = true;

// Get Current User Profile
export const getCurrentProfile = () => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  try {
    const res = await axios.get("http://127.0.0.1:8000/api/profile/me");
    dispatch({ type: GET_PROFILE, payload: res.data });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response?.statusText || "Error", status: err.response?.status },
    });
  }
};

// Get All Profiles
export const getProfiles = () => async (dispatch) => {
  try {
    const res = await axios.get("http://127.0.0.1:8000/api/profiles");
    dispatch({ type: GET_PROFILES, payload: res.data });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response?.statusText || "Error", status: err.response?.status },
    });
  }
};

// Get Profile by ID
export const getProfileById = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`http://127.0.0.1:8000/api/profile/${userId}`);
    dispatch({ type: GET_PROFILE, payload: res.data });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response?.statusText || "Error", status: err.response?.status },
    });
  }
};

// Create or update profile
import Cookies from "js-cookie"; // Make sure you've imported js-cookie

export const createProfile = (formData, history, edit = false) => async (dispatch) => {
  try {
    // Get the token from the cookies
    const token = Cookies.get("access_token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    };

    const body = JSON.stringify(formData);

    // Make the POST request to create the profile
    const res = await axios.post("http://127.0.0.1:8000/api/profile", body, config);

    dispatch({ type: GET_PROFILE, payload: res.data });

    dispatch(setAlert(edit ? "Profile Updated" : "Profile Created", "success"));

    if (!edit) {
      navigate("/dashboard");
    }
  } catch (err) {
    const errors = err.response?.data;

    if (errors) {
      Object.keys(errors).forEach((key) =>
        errors[key].forEach((msg) => dispatch(setAlert(`${key}: ${msg}`, "danger")))
      );
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response?.statusText || "Error", status: err.response?.status },
    });
  }
};

// Add Experience
export const addExperience = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const body = JSON.stringify(formData);

    const res = await axios.post("http://127.0.0.1:8000/api/profile/experience", body, config);

    dispatch({ type: UPDATE_PROFILE, payload: res.data });
    dispatch(setAlert("Experience added", "success"));

    navigate("/dashboard");
  } catch (err) {
    const errors = err.response?.data;

    if (errors) {
      Object.keys(errors).forEach((key) =>
        errors[key].forEach((msg) => dispatch(setAlert(`${key}: ${msg}`, "danger")))
      );
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response?.statusText || "Error", status: err.response?.status },
    });
  }
};

// Add Education
export const addEducation = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const body = JSON.stringify(formData);

    const res = await axios.post("http://127.0.0.1:8000/api/profile/education", body, config);

    dispatch({ type: UPDATE_PROFILE, payload: res.data });
    dispatch(setAlert("Education added", "success"));

    navigate("/dashboard");
  } catch (err) {
    const errors = err.response?.data;

    if (errors) {
      Object.keys(errors).forEach((key) =>
        errors[key].forEach((msg) => dispatch(setAlert(`${key}: ${msg}`, "danger")))
      );
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response?.statusText || "Error", status: err.response?.status },
    });
  }
};

// Delete Experience
export const deleteExperience = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`http://127.0.0.1:8000/api/profile/experience/${id}`);

    dispatch({ type: UPDATE_PROFILE, payload: res.data });
    dispatch(setAlert("Experience Removed", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response?.statusText || "Error", status: err.response?.status },
    });
  }
};

// Delete Education
export const deleteEducation = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`http://127.0.0.1:8000/api/profile/education/${id}`);

    dispatch({ type: UPDATE_PROFILE, payload: res.data });
    dispatch(setAlert("Education Removed", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response?.statusText || "Error", status: err.response?.status },
    });
  }
};

// Delete Account and profile
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm("Are you sure? This can not be undone!")) {
    try {
      await axios.delete("http://127.0.0.1:8000/api/profile");

      dispatch({ type: CLEAR_PROFILE });
      dispatch({ type: ACCOUNT_DELETED });

      dispatch(setAlert("Your account has been deleted permanently"));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response?.statusText || "Error", status: err.response?.status },
      });
    }
  }
};
