import React from "react";
import LoginForm from "../components/LoginForm";

function LoginPage({ setIsLoggedIn, setRole  }) {
  return (
    <div>
      <LoginForm setIsLoggedIn={setIsLoggedIn} setRole={setRole} />
    </div>
  );
}

export default LoginPage;