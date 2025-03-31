import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/HomePage/Home'
// react-router-dom is used in React applications to handle routing, allowing you to navigate between different pages (components) without reloading the browser. It provides tools for defining routes, navigating between pages, and managing URL parameters.




const appRouter = createBrowserRouter(
  [
    {
      path:'/',
      element:<Home/>
    }
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
