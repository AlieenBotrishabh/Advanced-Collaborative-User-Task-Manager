import React from 'react';
import NewTask from './components/NewTask';
import HomePage from './components/HomePage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const App = () => {
    const router = ([
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
    <div>App</div>
    <RouterProvider router={router} />
    </>
  )
}

export default App