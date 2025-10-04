import React, { useEffect, useState } from "react";
import axios from "axios";

function UserList() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi khi load user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refresh]); // reload mỗi khi refresh thay đổi

  return (
    <div className="list-container">
      <h2>Danh sách User</h2>
      <ul>
        {users.map(user => (
          <li key={user._id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
