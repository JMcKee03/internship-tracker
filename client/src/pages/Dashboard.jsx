function Dashboard() {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1>Welcome, {user?.name} 👋</h1>
    </div>
  );
}

export default Dashboard;