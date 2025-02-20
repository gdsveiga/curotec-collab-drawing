import { Eye, EyeClosed } from "@phosphor-icons/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "src/components/shared/button";
import Input from "src/components/shared/input";
import { useAuthContext } from "src/contexts/auth";

function Register() {
  const { register } = useAuthContext();
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState<boolean>(false);

  return (
    <div className="max-w-md w-full mx-auto py-4 px-8 rounded-md shadow-md bg-grass-500 text-grass-800">
      <h2 className="text-2xl leading-none">Welcome</h2>
      <small>Enter a username and a password in order to register</small>
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
        <div>
          <small>Confirm password</small>
          <Input
            className="w-full"
            type={isConfirmPasswordVisible ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            adornment={
              isConfirmPasswordVisible ? (
                <EyeClosed
                  size={20}
                  weight="bold"
                  className="cursor-pointer text-grass-700"
                  onClick={() => setIsConfirmPasswordVisible((prev) => !prev)}
                />
              ) : (
                <Eye
                  size={20}
                  weight="bold"
                  className="cursor-pointer text-grass-700"
                  onClick={() => setIsConfirmPasswordVisible((prev) => !prev)}
                />
              )
            }
          />
        </div>
      </div>
      <small
        className="hover:underline cursor-pointer"
        onClick={() => navigate("/login")}
      >
        Already have an account? Login now!
      </small>
      <div className="mt-4">
        <Button
          className="px-4 py-2"
          variant="primary"
          type="button"
          onClick={() => register(username, password)}
          disabled={password !== confirmPassword}
        >
          Register
        </Button>
      </div>
    </div>
  );
}

export default Register;
