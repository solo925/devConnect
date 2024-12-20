import axios from "axios";
import { setAlert } from "./alert";
import {
  ADD_COMMENT,
  ADD_POST,
  DELETE_POST,
  GET_POST,
  GET_POSTS,
  POST_ERROR,
  REMOVE_COMMENT,
  UPDATE_LIKES
} from "./types";

// Get posts
export const getPosts = () => async dispatch => {
  try {
    const res = await axios.get("http://127.0.0.1:8000/api/posts");

    dispatch({ type: GET_POSTS, payload: res.data });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get post
export const getPost = postId => async dispatch => {
  try {
    const res = await axios.get(`http://127.0.0.1:8000/api/posts/${postId}`);

    dispatch({ type: GET_POST, payload: res.data });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Toggle Like
export const toggleLike = postId => async dispatch => {
  try {
    const res = await axios.post(`http://127.0.0.1:8000/api/posts/${postId}/like`);

    dispatch({ type: UPDATE_LIKES, payload: res.data });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete Post
export const deletePost = postId => async dispatch => {
  try {
    await axios.delete(`http://127.0.0.1:8000/api/posts/${postId}`);

    dispatch({ type: DELETE_POST, payload: postId });
    dispatch(setAlert("Post Removed", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add Post
export const addPost = formData => async dispatch => {
  const config = {
    headers: { "Content-Type": "application/json" }
  };
  try {
    const res = await axios.post("http://127.0.0.1:8000/api/posts", formData, config);

    dispatch({ type: ADD_POST, payload: res.data });
    dispatch(setAlert("Post Added", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add Comment
export const addComment = (postId, formData) => async dispatch => {
  const config = {
    headers: { "Content-Type": "application/json" }
  };
  try {
    const res = await axios.post(
      `http://127.0.0.1:8000/api/posts/${postId}/comments`,
      formData,
      config
    );

    dispatch({ type: ADD_COMMENT, payload: res.data });
    dispatch(setAlert("Comment Added", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete Comment
export const deleteComment = (postId, commentId) => async dispatch => {
  try {
    await axios.delete(`http://127.0.0.1:8000/api/posts/comments/${commentId}`);

    dispatch({ type: REMOVE_COMMENT, payload: commentId });
    dispatch(setAlert("Comment Removed", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
