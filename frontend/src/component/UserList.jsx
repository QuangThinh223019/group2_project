import React, { useEffect, useState } from "react";
import axios from "axios";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi khi load user:", err);
    }
  };

  return (
    <div className="list-container">
      <h2>Danh sách User</h2>
      <ul>
        {users.map((u, idx) => (
          <li key={idx}>
            <span>{u.name}</span> - <span>{u.email}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
