import NewTask from './components/NewTask';
import HomePage from './components/HomePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignUp from './components/SignUp';
import Projects from './components/Projects';
import NewProject from './components/NewProject';
import Note from './components/Note';
import TeamDashboard from './components/Team';
import Reminder from './components/Reminder';
import Users from './components/Users';

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
          path : '/newproject',
          element : <NewProject />
        },
        {
          path : '/notes/:projectId',
          element : <Note />
        },
        {
          path: '/team',
          element: <TeamDashboard />
        },
        {
          path: '/reminder',
          element: <Reminder />
        },
        {
          path: '/users',
          element: <Users />
        }
    ])
  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App