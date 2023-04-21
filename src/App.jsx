import { 
  createBrowserRouter,
  createRoutesFromElements, 
  Route,
  RouterProvider,
  Outlet,
  useLocation,
} from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Recipe, { recipeLoader } from './components/Recipe' 
import User, { userLoader } from './components/User'
import { LogIn, SignUp } from './components/Authenticate'

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

function Home(){
  return(
    <div className="bg-stone-50">
      <h2>Welcome</h2>
      <p>Boilerplate</p>
    </div>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />}/>
      <Route path=":username" element={<div><Outlet /></div>} >
        <Route index 
          element={<User />} 
          loader={userLoader}
          errorElement={<div>404 NOT FOUND</div>}/>
        <Route path=":recipe_id" 
          element={<Recipe />}
          loader={recipeLoader}
          errorElement={<div>404 RECIPE NOT FOUND</div>} />
      </Route>
      
      {/* public only routes */}
      <Route path="login" element={<LogIn />} />
      <Route path="signup" element={<SignUp />} />

      {/* private only routes */}
      <Route path="new" element={<div>FIGURE OUT MODAL POP UP IN PLACE</div>}></Route>
    </Route>
  )
);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App