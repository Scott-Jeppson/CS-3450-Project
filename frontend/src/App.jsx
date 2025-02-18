import { BrowserRouter, Routes, Route} from "react-router-dom";
import Home from './Pages/Home.jsx';
import SignIn from './Pages/SignIn.jsx';
import CreateAccount from './Pages/CreateAccount.jsx';
import Test from './Pages/Test.jsx';

// Main component of the app where the routing and global state management is defined
function App() {

    // Future: Global states managed here such as user state

  return (
    <BrowserRouter>
        <Routes>
            <Route index element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/createaccount" element={<CreateAccount />} />
            <Route path="/test" element={<Test />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App
