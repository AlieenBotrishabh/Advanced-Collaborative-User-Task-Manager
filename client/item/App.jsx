import NewTask from './components/NewTask';
import HomePage from './components/HomePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignUp from './components/SignUp';
import Projects from './components/Projects';
import Calender from './components/Calender';
import NewProject from './components/NewProject';
import Note from './components/Note';
import TeamDashboard from './components/Team';

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
        }
    ])
  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App