import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  reorderApplications
} from "../services/applicationService";
import {
  DndContext,
  closestCorners
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
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
  } = useSortable({ id: app._id });

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

function DroppableColumn({ status, applications, children }) {
  const { isOver, setNodeRef } = useDroppable({
    id: status
  });

  const style = {
    backgroundColor: isOver ? "rgba(0, 0, 0, 0.05)" : undefined,
    transition: "background-color 0.2s ease",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`kanban-column ${status.toLowerCase()}`}
    >
      <h2>{status}</h2>
      <SortableContext items={applications.map(app => app._id)} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
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
    position: "",
    status: "Applied"
  });

  const statuses = ["Applied", "Interview", "Offer", "Rejected"];

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    } else {
      getApplications()
        .then((data) => setApplications(data))
        .catch((err) => console.log(err));
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
    setFormData({ company: "", position: "", status: "Applied" });
    setShowModal(true);
  };

  const handleEditApplication = (_id) => {
    const app = applications.find((a) => a._id === _id);

    setEditingApp(app);
    setFormData({
      company: app.company,
      position: app.position,
      status: app.status
    });

    setShowModal(true);
  };

  const handleDeleteApplication = async (_id) => {
    try {
      await deleteApplication(_id);
      setApplications(applications.filter((app) => app._id !== _id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeId = active.id;
    const overId = over.id;

    const activeApp = applications.find(app => app._id === activeId);
    if (!activeApp) return;

    let newStatus = overId;
    if (!statuses.includes(newStatus)) {
      const overApp = applications.find(app => app._id === newStatus);
      if (overApp) {
        newStatus = overApp.status;
      }
    }

    if (!statuses.includes(newStatus)) return;

    // First do optimistic UI update locally
    let updatedApplications = [];

    setApplications((items) => {
      const oldIndex = items.findIndex((app) => app._id === activeId);
      const newIndex = items.findIndex((app) => app._id === overId);

      const itemsClone = [...items];

      if (activeApp.status === newStatus) {
        if (newIndex >= 0) {
          updatedApplications = arrayMove(itemsClone, oldIndex, newIndex);
        }
      } else {
        itemsClone[oldIndex] = { ...itemsClone[oldIndex], status: newStatus }
      };
      if (newIndex >= 0) {
        updatedApplications = arrayMove(itemsClone, oldIndex, newIndex);
      } else {
        const [movedApp] = itemsClone.splice(oldIndex, 1);
        itemsClone.push(movedApp);
        updatedApplications = itemsClone;
      }
      return updatedApplications.length > 0 ? updatedApplications : itemsClone;
    })
  };

  // We also need to get the finalApps to send to the backend. We can recreate them here (or use the returned value if we used a ref, but recalculating is fine)
  const finalApps = [...applications];
  const oldIndex = finalApps.findIndex((app) => app._id === activeId);
  const newIndex = finalApps.findIndex((app) => app._id === overId);

  let updatedApps = [];
  if (activeApp.status === newStatus) {
    if (newIndex >= 0) {
      updatedApps = arrayMove(finalApps, oldIndex, newIndex);
    }
  } else {
    finalApps[oldIndex] = { ...finalApps[oldIndex], status: newStatus };
    if (newIndex >= 0) {
      updatedApps = arrayMove(finalApps, oldIndex, newIndex);
    } else {
      const [movedApp] = finalApps.splice(oldIndex, 1);
      finalApps.push(movedApp);
      updatedApps = finalApps;
    }
  }

  const payloadApps = updatedApps.length > 0 ? updatedApps : finalApps;

  // Then update status and order on the backend
  try {
    const updates = payloadApps.map((app, index) => ({
      _id: app._id,
      order: index,
      status: app.status
    }));
    await reorderApplications(updates);
  } catch (err) {
    console.error("Failed to update status and order on server:", err);
  }
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

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (editingApp) {
      const updatedApp = await updateApplication(editingApp._id, formData);
      setApplications(
        applications.map((a) =>
          a._id === editingApp._id ? updatedApp : a
        )
      );
    } else {
      const newApp = await createApplication(formData);
      setApplications([...applications, newApp]);
    }
    setShowModal(false);
  } catch (err) {
    console.log(err);
  }
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

    <DndContext
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-board">
        {statuses.map((status) => (
          <DroppableColumn
            key={status}
            status={status}
            applications={applications.filter(app => app.status === status)}
          >
            {applications
              .filter((app) => app.status === status)
              .map((app) => (
                <SortableItem key={app._id} app={app}>
                  <div className="kanban-card">

                    <h3>{app.company}</h3>
                    <p>{app.position}</p>

                    <div className="card-actions">
                      <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => handleEditApplication(app._id)}
                      >
                        Edit
                      </button>

                      <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => handleDeleteApplication(app._id)}
                      >
                        Delete
                      </button>
                    </div>

                  </div>
                </SortableItem>
              ))}
          </DroppableColumn>
        ))}
      </div>
    </DndContext>

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
              name="position"
              placeholder="Position"
              value={formData.position}
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
)
  ;

export default Dashboard;