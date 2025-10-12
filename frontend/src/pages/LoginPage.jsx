import React from "react";
import LoginForm from "../components/LoginForm";

function LoginPage({ setIsLoggedIn }) {
  return (
    <div>
      <LoginForm setIsLoggedIn={setIsLoggedIn}/>
    </div>
  );
}

export default LoginPage;
