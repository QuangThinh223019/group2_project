import React, { useEffect, useState } from "react";
import axios from "axios";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const base = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/\/$/, '') : 'http://localhost:4000';
      const res = await axios.get(`${base}/api/users`, {
        headers: localStorage.getItem('accessToken') ? { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } : {},
      });
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
