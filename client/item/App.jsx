import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './components/HomePage';
import NewTask from './components/NewTask';
import LoginPage from './components/LoginPage';
import SignUp from './components/SignUp';
import TeamDashboard from './components/Team';
import Reminder from './components/Reminder';
import Users from './components/Users';
import TeamsOverview from './components/TeamOverview';
import Team from './components/Team';
import { Navigate } from 'react-router-dom';
import TaskCharts from './components/TaskCharts';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/task',
    element: <NewTask />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <SignUp />,
  },
  {
    path: '/team',
    element: <TeamDashboard />,
  },
  {
    path: '/reminder',
    element: <Reminder />,
  },
  {
    path: '/users',
    element: <Users />,
  },
  {
    path: '/teams',
    element: <TeamsOverview />,
  },
  {
    path: '/teams/:teamId',
    element: <Team />,
  },
  {
    path: '/tasks/:teamId',
    element: <NewTask />,
  },
  {
    path: '*',
    element: <Navigate to="/teams" replace />,
  },
  {
    path: '/taskcharts',
    element: <TaskCharts />
  }
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
