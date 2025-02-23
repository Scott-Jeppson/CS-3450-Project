import Navbar from "../components/navbar.jsx";
import Toolbar from "../components/toolbar.jsx";
import SumoSim from "../components/SumoSim.jsx";

const Dashboard = () => {

    return (
        <div className="page-div" style={{ backgroundColor: "var(--grey)" }}>
            <Navbar/>
            {/* <Toolbar/> */}
            <SumoSim/>
        </div>
    );
};

export default Dashboard;