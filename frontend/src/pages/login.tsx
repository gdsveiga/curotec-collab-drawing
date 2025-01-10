import { EyeClosed, Eye } from "@phosphor-icons/react/dist/ssr";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "src/components/shared/button";
import Input from "src/components/shared/input";
import { useAuthContext } from "src/contexts/auth";

function Auth() {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  return (
    <div className="lg:max-w-md w-full lg:mx-auto mx-4 py-4 px-8 rounded-md shadow-md bg-grass-500 text-grass-800">
      <h2 className="text-2xl leading-none">Welcome</h2>
      <small>Please, enter your username and password below</small>
      <div className="flex flex-col mt-4 gap-2">
        <div>
          <small>Username</small>
          <Input
            className="w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <small>Password</small>
          <Input
            className="w-full"
            type={isPasswordVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            adornment={
              isPasswordVisible ? (
                <EyeClosed
                  size={20}
                  weight="bold"
                  className="cursor-pointer text-grass-700"
                  onClick={() => setIsPasswordVisible((prev) => !prev)}
                />
              ) : (
                <Eye
                  size={20}
                  weight="bold"
                  className="cursor-pointer text-grass-700"
                  onClick={() => setIsPasswordVisible((prev) => !prev)}
                />
              )
            }
          />
        </div>
      </div>
      <small
        className="hover:underline cursor-pointer"
        onClick={() => navigate("/register")}
      >
        Don't have an account? Register now, it's free!
      </small>
      <div className="mt-4">
        <Button
          className="px-4 py-2"
          variant="primary"
          onClick={() => login(username, password)}
          type="button"
        >
          Login
        </Button>
      </div>
    </div>
  );
}

export default Auth;
