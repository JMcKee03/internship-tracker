import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCorners
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableItem({ app, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: app.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}


function Dashboard() {
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [applications, setApplications] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "Applied"
  });

  const statuses = ["Applied", "Interview", "Offer", "Rejected"];

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  /* =========================
     APPLICATION ACTIONS
  ========================= */

  const openAddModal = () => {
    setEditingApp(null);
    setFormData({ company: "", role: "", status: "Applied" });
    setShowModal(true);
  };

  const editApplication = (id) => {
    const app = applications.find((a) => a.id === id);

    setEditingApp(app);
    setFormData({
      company: app.company,
      role: app.role,
      status: app.status
    });

    setShowModal(true);
  };

  const deleteApplication = (id) => {
    setApplications(applications.filter((app) => app.id !== id));
  };

  const moveApplication = (id) => {
    const app = applications.find((a) => a.id === id);

    const nextIndex =
      (statuses.indexOf(app.status) + 1) % statuses.length;

    setApplications(
      applications.map((a) =>
        a.id === id ? { ...a, status: statuses[nextIndex] } : a
      )
    );
  };

  /* =========================
     FORM HANDLERS
  ========================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingApp) {
      setApplications(
        applications.map((a) =>
          a.id === editingApp.id ? { ...a, ...formData } : a
        )
      );
    } else {
      const newApp = {
        id: Date.now(),
        ...formData
      };

      setApplications([...applications, newApp]);
    }

    setShowModal(false);
  };

  return (
    <div className="dashboard-container">

      <div className="dashboard-header">

  <div className="header-left">
    <h1 className="gradient-text">Internship Tracker</h1>
    <p className="subtitle">
      Stay organized. Track progress. Land the offer.
    </p>
  </div>

  <div className="header-right">
    <div className="user-badge">
      <span>Welcome back</span>
      <strong>{userInfo?.name || "User"}</strong>
    </div>

    <button className="primary-btn" onClick={openAddModal}>
      + Add
    </button>

    <button className="secondary-btn" onClick={logoutHandler}>
      Logout
    </button>
  </div>

</div>

      <div className="kanban-board">
        {statuses.map((status) => (



          <div
            key={status}
            className={`kanban-column ${status.toLowerCase()}`}
          >
            
            <h2>{status}</h2>

            {applications
              .filter((app) => app.status === status)
              .map((app) => (
                <div key={app.id} className="kanban-card">

                  <h3>{app.company}</h3>
                  <p>{app.role}</p>

                  <div className="card-actions">
                    <button onClick={() => moveApplication(app.id)}>
                      Move
                    </button>

                    <button onClick={() => editApplication(app.id)}>
                      Edit
                    </button>

                    <button onClick={() => deleteApplication(app.id)}>
                      Delete
                    </button>
                  </div>

                </div>
              ))}
          </div>
        ))}
      </div>

      {/* =========================
          MODAL
      ========================= */}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">

            <h2>
              {editingApp ? "Edit Application" : "Add Application"}
            </h2>

            <form onSubmit={handleSubmit}>

              <input
                type="text"
                name="company"
                placeholder="Company"
                value={formData.company}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="role"
                placeholder="Role"
                value={formData.role}
                onChange={handleChange}
                required
              />

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                {statuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>

              <div className="modal-actions">
                <button type="submit" className="primary-btn">
                  Save
                </button>

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;