import NewTask from './components/NewTask';
import HomePage from './components/HomePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

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
    ])
  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App