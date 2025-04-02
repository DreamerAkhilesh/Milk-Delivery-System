import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/HomePage/Home'
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Profile from './components/ProfilePage/profile';
import ProductPage from './components/ProductPage/ProductPage';
// react-router-dom is used in React applications to handle routing, allowing you to navigate between different pages (components) without reloading the browser. It provides tools for defining routes, navigating between pages, and managing URL parameters.




const appRouter = createBrowserRouter(
  [
    {
      path:'/',
      element:<Home/>
    },
    {
      path:'/login',
      element:<Login/>
    },
    {
      path:'/signup',
      element:<Signup/>
    },
    {
      path:'/profile',
      element:<Profile/>
    },
    {
      path:'/products',
      element:<ProductPage/>
    },
  
  ]
) ;

function App() {
  return (
    <>
      <RouterProvider router={appRouter}/>

    </>
  );
};

export default App
