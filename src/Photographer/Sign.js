import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Mail } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";


const Sign = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState("hidden");
  const submitForm = (e) => {
    e.preventDefault();
    if (email === "ilias@gmail.com" && password === "123456") {
      window.location.href = "/photographer";
    } else {
      setAlert("block");
    }
  };
  const getIsFormValid = () => {
    return email && password;
  };
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="w-[420px] rounded-[12px] gap-[24px] border-[#3F3F46] border-[1px] flex flex-col p-[24px] bg-[#09090B]">
        <div className="w-full h-[56px] flex justify-center items-center">
          <Link to={"/"} className="flex justify-start w-full">
            <div className="flex items-center justify-start w-full">
              <img
                src={`${process.env.PUBLIC_URL}/images/left.png`}
                className="w-[20px] h-[20px]"
              ></img>
              <p className="text-[#FAFAFA] text-[16px] font-medium leading-[24px]">
                Back
              </p>
            </div>
          </Link>
        </div>
        <div className="flex flex-col gap-[8px] ">
          <p className="text-[#FAFAFA] text-[30px] font-semibold tracking-tighter">
            Sign In
          </p>
          <p className="text-[#A1A1AA] text-[14px] font-normal leading-[20px]">
            By continuing you agree to our terms of service and privacy policy
          </p>
        </div>
        <div className="flex flex-col gap-[15px] items-center">
          <form
            className="flex flex-col gap-[15px] items-center w-full"
            onSubmit={submitForm}
          >
            <Input
              type="email"
              placeholder="Enter your email"
              className=" w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Enter your password"
              className=" w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              disabled={!getIsFormValid()}
              className=" w-full bg-[#FAFAFA] text-[#09090B] hover:bg-[#FAFAFA] hover:text-[#09090B]"
            >
              <Mail className="mr-2 h-4 w-4" /> Sign In with Email
            </Button>
            <Link to={"/"} className="w-full">
              <Button
                variant="secondary"
                className="bg-[#27272A] text-[#FAFAFA] w-full hover:bg-[#27272A]"
              >
                Cancel
              </Button>
            </Link>

            <Alert variant="destructive" className={`${alert}`}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Wrong Credentials, Please Try Again.
              </AlertDescription>
            </Alert>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Sign;
