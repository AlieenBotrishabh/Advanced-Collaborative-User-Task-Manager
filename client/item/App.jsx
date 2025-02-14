import NewTask from './components/NewTask';
import HomePage from './components/HomePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignUp from './components/SignUp';
import Projects from './components/Projects';
import Calender from './components/Calender';

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
        },
        {
          path : '/project',
          element : <Projects />
        },
        {
          path : '/calender',
          element : <Calender />
        }
    ])
  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App