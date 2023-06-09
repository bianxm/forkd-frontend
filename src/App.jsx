import { 
  createBrowserRouter,
  createRoutesFromElements, 
  Route,
  RouterProvider,
  Outlet,
  useLocation,
  Navigate,
} from 'react-router-dom'

import AuthProvider, { useAuth } from './contexts/AuthProvider'
import FlashProvider from './contexts/FlashProvider'

import Header from './components/Header'
import Footer from './components/Footer'
import Recipe, { recipeLoader } from './components/Recipe' 
import User, { userLoader } from './components/User'
import { LogIn } from './components/LogIn'
import { SignUp } from './components/SignUp'
import Home, { featuredLoader } from './components/Home'
import NotFound from './components/NotFound'
import FlashMessage from './components/FlashMessage'
import NewRecipe from './components/NewRecipe'
import Settings, {ChangeAvatar, ChangeEmail, ChangePassword, ChangeUsername} from './components/Settings'

function RootLayout(){
  let location = useLocation();
  return(
    <div className="relative flex flex-col justify-between w-screen h-screen">
      {location.pathname !== '/login' && location.pathname !== '/signup' && <header className="flex-none"><Header /></header>}
        <main className="relative flex-auto">
          <FlashMessage />
          <Outlet />
        </main>
      {location.pathname !== '/login' && location.pathname !== '/signup' && <footer className="flex-none"><Footer /></footer>}
    </div>
  );
}

function PublicRoute({children}){
  const { user } = useAuth();
  if (user===undefined){
    return null;
  } else if (user){
    return <Navigate to="/" />
  } else{
    return children;
  }
}

function PrivateRoute({children}){
  const { user } = useAuth();
  if (user===undefined){
    return null;
  } else if (user){
    return children;
  } else{
    return <Navigate to="/" />
  }
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} loader={featuredLoader} />
      <Route path=":username" element={<div><Outlet /></div>} >
        <Route index 
          element={<User />} 
          loader={userLoader}
          errorElement={<NotFound />}/>
        <Route path=":recipe_id" 
          element={<Recipe />}
          loader={recipeLoader}
          errorElement={<NotFound />} />
      </Route>
      
      {/* public only routes */}
      <Route path="login" element={<PublicRoute><LogIn /></PublicRoute>} />
      <Route path="signup" element={<PublicRoute><SignUp /></PublicRoute>} />

      {/* private only routes */}
      <Route path="new" element={<PrivateRoute><NewRecipe /></PrivateRoute>} />
      <Route path="settings" element={<PrivateRoute><Settings /></PrivateRoute>}>
        <Route path="password" element={<ChangePassword />} />
        <Route path="username" element={<ChangeUsername />} />
        <Route path="email" element={<ChangeEmail />} />
        <Route path="avatar" element={<ChangeAvatar />} />
      </Route>
    </Route>
  )
);

function App() {
  return (
    <FlashProvider>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    </FlashProvider>
  );
}

export default App;