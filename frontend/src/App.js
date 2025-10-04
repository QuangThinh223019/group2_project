import React, { useState } from "react";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";
import "./App.css"; // import CSS

function App() {
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => setRefresh(!refresh);

  return (
    <div className="container">
      <h1>🚀 Quản lý User</h1>
      <AddUser onUserAdded={handleRefresh} />
      <UserList refresh={refresh} />
    </div>
  );
}

export default App;
