import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const addApplication = () => {
    const company = prompt("Company Name");
    const role = prompt("Role");

    if (!company || !role) return;

    const newApp = {
      id: Date.now(),
      company,
      role,
      status: "Applied"
    };

    setApplications([...applications, newApp]);
  };

  const statuses = ["Applied", "Interview", "Offer", "Rejected"];

  return (
    <div className="dashboard-container">

      <div className="dashboard-header">
  <div className="dashboard-title">
    <h1>Internship Tracker</h1>
    <p>Manage your internship applications</p>
  </div>

  <div className="dashboard-actions">
    <button className="primary-btn" onClick={addApplication}>
      Add Application
    </button>

    <button className="secondary-btn" onClick={logoutHandler}>
      Logout
    </button>
  </div>
</div>

      <div className="kanban-board">

        {statuses.map((status) => (
          <div key={status} className="kanban-column">

            <h2>{status}</h2>

            {applications
              .filter((app) => app.status === status)
              .map((app) => (
                <div key={app.id} className="kanban-card">

                  <h3>{app.company}</h3>
                  <p>{app.role}</p>

                </div>
              ))}

          </div>
        ))}

      </div>

    </div>
  );
}

export default Dashboard;