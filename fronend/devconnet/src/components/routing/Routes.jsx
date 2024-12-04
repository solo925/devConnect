import React from "react";
import { Route, Routes } from "react-router-dom"; // Replace Switch with Routes

import Login from "../auth/Login";
import Register from "../auth/Register";
import Dashboard from "../dashboard/Dashboard";
import Alert from "../layout/Alert";
import NotFound from "../layout/NotFound";
import Post from "../post/Post";
import Posts from "../posts/Posts";
import AddEducation from "../profile-forms/AddEducation";
import AddExperience from "../profile-forms/AddExperience";
import CreateProfile from "../profile-forms/CreateProfile";
import EditProfile from "../profile-forms/EditProfile";
import Profile from "../profile/Profile";
import Profiles from "../profiles/Profiles";
import PrivateRoute from "./PrivateRoute";

const RoutesComponent = () => {
  return (
    <section className="container">
      <Alert />
      <Routes> {/* Use Routes instead of Switch */}
        <Route path="/login" element={<Login />} /> {/* Use element prop instead of component */}
        <Route path="/register" element={<Register />} />
        <Route path="/profiles" element={<Profiles />} />
        <Route path="/profile/:id" element={<Profile />} />

        {/* Use PrivateRoute component with Routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/create-profile" element={<PrivateRoute><CreateProfile /></PrivateRoute>} />
        <Route path="/edit-profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
        <Route path="/add-experience" element={<PrivateRoute><AddExperience /></PrivateRoute>} />
        <Route path="/add-education" element={<PrivateRoute><AddEducation /></PrivateRoute>} />
        <Route path="/posts" element={<PrivateRoute><Posts /></PrivateRoute>} />
        <Route path="/posts/:id" element={<PrivateRoute><Post /></PrivateRoute>} />

        {/* Default route for NotFound */}
        <Route path="*" element={<NotFound />} /> {/* Catch-all for 404 */}
      </Routes>
    </section>
  );
};

export default RoutesComponent;
