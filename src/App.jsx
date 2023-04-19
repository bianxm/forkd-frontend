import { 
  createBrowserRouter,
  createRoutesFromElements, 
  Route,
  RouterProvider,
  NavLink, 
  Outlet,
  useParams
} from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'

function RootLayout(){
  return(
    <div>
      <header>
        <Header />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
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

function User(){
  const { username } = useParams()
  return(
    <div className="w-screen h-screen bg-stone-50">
      <h2>{username}</h2>
    </div>
  );
}

function Recipe(){
  const { recipe_id } = useParams()
  return(
    <div className="w-screen h-screen bg-stone-50">
      <h2>{recipe_id}</h2>
    </div>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />}/>
      <Route path=":username" element={<div><Outlet /></div>} >
        <Route index element={<User />}></Route>
        <Route path=":recipe_id" element={<Recipe />}></Route>
      </Route>
    </Route>
  )
);

function App() {
  // console.log(import.meta.env.VITE_BASE_API_URL)
  return (
    <RouterProvider router={router} />
  );
}

export default App