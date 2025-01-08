import React from "react";
import Button from "src/components/shared/button";
import Input from "src/components/shared/input";

function Auth() {
  return (
    <div className="max-w-md w-full mx-auto py-4 px-8 rounded-md shadow-md bg-grass-500 text-grass-800">
      <h2 className="text-2xl leading-none">Welcome</h2>
      <small>Please, enter your username and password below</small>
      <div className="flex flex-col mt-4 gap-2">
        <div>
          <small>Username</small>
          <Input className="w-full" />
        </div>
        <div>
          <small>Password</small>
          <Input className="w-full" type="password" />
        </div>
      </div>
      <small className="hover:underline cursor-pointer">
        Don't have an account? Register now, it's free!
      </small>
      <div className="mt-4">
        <Button className="px-4 py-2" variant="primary">
          Login
        </Button>
      </div>
    </div>
  );
}

export default Auth;
