import React, { useState } from "react";
import UserList from "./component/UserList";
import AddUser from "./component/AddUser";
import "./App.css"; // import CSS

function App() {
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => setRefresh(!refresh);

  return (
    <div className="container">
      <h1>🚀 Quản lý User</h1>
      <AddUser onUserAdded={handleRefresh} />
      <UserList key={refresh} />
    </div>
  );
}

export default App;
