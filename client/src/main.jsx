import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './App.jsx';
import './index.css';

import DashboardLayout from './components/layout/DashboardLayout.jsx';
import PrivateRoute from './components/common/PrivateRoute.jsx';
import InstructorRoute from './components/common/InstructorRoute.jsx';
import AdminRoute from './components/common/AdminRoute.jsx';
import PublicLayout from './components/layout/PublicLayout.jsx';

import RootRedirect from './pages/RootRedirect.jsx';
import LoginPage from './pages/Login.jsx';
import RegisterPage from './pages/Register.jsx';
import CoursesPage from './pages/Courses.jsx';
import CourseDetailPage from './pages/CourseDetail.jsx';
import DashboardPage from './pages/Dashboard.jsx';
import MyLearningPage from './pages/MyLearningPage.jsx';
import CreateCoursePage from './pages/CreateCoursePage.jsx';
import InstructorDashboardPage from './pages/InstructorDashboardPage.jsx';
import ManageCoursePage from './pages/ManageCoursePage.jsx';
import ProfilePage from './pages/Profile.jsx';
import AuthCallbackPage from './pages/AuthCallbackPage.jsx';
import TakeQuizPage from './pages/TakeQuizPage.jsx';
import QuizResultPage from './pages/QuizResultPage.jsx';
import UserListPage from './pages/UserListPage.jsx';
import UserEditPage from './pages/UserEditPage.jsx';
import AdminCourseListPage from './pages/AdminCourseListPage.jsx';
import AssignmentPage from './pages/AssignmentPage.jsx';
import LessonTasksPage from './pages/LessonTasksPage.jsx';

const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index={true} element={<RootRedirect />} />
    <Route element={<PublicLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
    </Route>
    <Route path="" element={<PrivateRoute />}>
      <Route element={<DashboardLayout />}>
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/learn/:courseId" element={<MyLearningPage />} />
        <Route path="/quiz/lesson/:lessonId" element={<TakeQuizPage />} />
        <Route path="/quiz/result/:attemptId" element={<QuizResultPage />} />
        <Route path="/assignment/:assignmentId" element={<AssignmentPage />} />
        <Route path="/lesson/:courseId/:lessonId/tasks" element={<LessonTasksPage />} />
        
        <Route path="" element={<InstructorRoute />}>
          <Route path="/courses/create" element={<CreateCoursePage />} />
          <Route path="/instructor/dashboard" element={<InstructorDashboardPage />} />
          <Route path="/instructor/courses/:courseId/manage" element={<ManageCoursePage />} />
        </Route>
        
        <Route path="" element={<AdminRoute />}>
          <Route path="/admin/users" element={<UserListPage />} />
          <Route path="/admin/user/:id/edit" element={<UserEditPage />} />
          <Route path="/admin/courses" element={<AdminCourseListPage />} />
        </Route>
      </Route>
    </Route>
  </Route>
));
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    {/* This line now correctly uses the environment variable */}
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </Provider>
);