import Navbar from "../components/navbar.jsx";
import Toolbar from "../components/toolbar.jsx";

const Dashboard = () => {

    return (
        <div className="page-div" style={{ backgroundColor: "var(--grey)" }}>
            <Navbar/>
            <Toolbar/>
        </div>
    );
};

export default Dashboard;