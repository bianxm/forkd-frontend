import { 
  createBrowserRouter,
  createRoutesFromElements, 
  Route,
  RouterProvider,
  Outlet,
} from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Recipe, { recipeLoader } from './components/Recipe' 
import User, { userLoader } from './components/User'

function RootLayout(){
  return(
    <div>
      <header><Header /></header>
      <main><Outlet /></main>
      <footer><Footer /></footer>
    </div>
  );
}

function Home(){
  return(
    <div className="w-screen h-screen bg-stone-50">
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
      <Route path="login" element={<div>LOGIN PAGE HERE</div>}></Route>
      <Route path="signup" element={<div>SIGN UP PAGE HERE</div>}></Route>

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