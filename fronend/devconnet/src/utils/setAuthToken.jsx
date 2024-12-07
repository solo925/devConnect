import axios from "axios";

const setAuthToken = (token) => {
  // Set the token globally for all axios requests using cookies
  const token = Cookies.get('access_token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
}


export default setAuthToken;
