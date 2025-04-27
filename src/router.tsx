import { PageLoading } from '@ui/utils/PageLoading';
import { lazy, Suspense } from 'react';
import MainLayout from './components/MainLayout';
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './components/utils/ProtectedRoute'; // Import your ProtectedRoute
// import Welcome from './pages/Welcome';
// import AddPost from './pages/AddPost';
// import { MyProfile } from './pages/MyProfile';

/* Code split theme page */
const UserProfile = lazy(async () => await import('./pages/UserProfile'));
const Home = lazy(async () => await import('./pages/Home'));
const Login = lazy(async () => await import('./pages/Login'));
const SignUp = lazy(async () => await import('./pages/SignUp'));
const Welcome = lazy(async () => await import('./pages/Welcome'));
const AddPost = lazy(async () => await import('./pages/AddPost'));
const MyProfile = lazy(async () => await import('./pages/MyProfile'));

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={<PageLoading />}>
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: '/profile',
        element: (
          <Suspense fallback={<PageLoading />}>
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: '/profile/:id',
        element: (
          <Suspense fallback={<PageLoading />}>
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: '/add-post',
        element: (
          <Suspense fallback={<PageLoading />}>
            <ProtectedRoute>
              <AddPost />
            </ProtectedRoute>
          </Suspense>
        )
      },
      {
        path: '/welcome',
        element: (
          <Suspense fallback={<PageLoading />}>
            <Welcome />
          </Suspense>
        )
      },
      {
        path: '/login',
        element: (
          <Suspense fallback={<PageLoading />}>
            <Login />
          </Suspense>
        )
      },
      {
        path: '/sign-up',
        element: (
          <Suspense fallback={<PageLoading />}>
            <SignUp />
          </Suspense>
        )
      }
    ]
  }
]);

export default router;