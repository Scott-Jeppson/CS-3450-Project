import { BrowserRouter, Routes, Route} from "react-router-dom";
import Home from './Pages/Home.jsx';
import SignIn from './Pages/SignIn.jsx';
import CreateAccount from './Pages/CreateAccount.jsx';

// Main component of the app where the routing and global state management is defined
function App() {

    // Future: Global states managed here such as user state

  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
        <Routes>
            <Route path="/signin" element={<SignIn />} />
        </Routes>
        <Routes>
            <Route path="/createaccount" element={<CreateAccount />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App
