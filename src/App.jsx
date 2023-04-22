import { 
  createBrowserRouter,
  createRoutesFromElements, 
  Route,
  RouterProvider,
  Outlet,
  useLocation,
  Navigate,
} from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Recipe, { recipeLoader } from './components/Recipe' 
import User, { userLoader } from './components/User'
import { LogIn } from './components/LogIn'
import { SignUp } from './components/SignUp'
import Home from './components/Home'
import NotFound from './components/NotFound'
import AuthProvider, { useAuth } from './contexts/AuthProvider'

function RootLayout(){
  let location = useLocation();
  return(
    <div className="flex flex-col justify-between w-screen h-screen">
      {location.pathname !== '/login' && location.pathname !== '/signup' && <header className="flex-none"><Header /></header>}
        <main className="flex-auto"><Outlet /></main>
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />}/>
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
      {/* <Route path="login" element={<LogIn />} />
      <Route path="signup" element={<SignUp />} /> */}
      <Route path="signup" element={<PublicRoute><SignUp /></PublicRoute>} />

      {/* private only routes */}
      <Route path="new" element={<div>FIGURE OUT MODAL POP UP IN PLACE</div>}></Route>
    </Route>
  )
);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App