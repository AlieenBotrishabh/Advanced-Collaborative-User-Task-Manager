import NewTask from './components/NewTask';
import HomePage from './components/HomePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignUp from './components/SignUp';

const App = () => {
    const router = createBrowserRouter([
        {
            path : '/',
            element : <HomePage />
        },
        {
            path : '/task',
            element : <NewTask />
        },
        {
          path : '/login',
          element : <LoginPage />
        },
        {
          path : '/register',
          element : <SignUp />
        }
    ])
  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App