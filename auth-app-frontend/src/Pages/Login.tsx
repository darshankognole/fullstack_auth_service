import React, { useState, type FormEvent, } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner"
import { motion } from "framer-motion";
import type LoginData from "../models/LoginData";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";
import useAuth from "@/auth/store";
import OAuth2Buttons from "@/components/OAuth2Buttons";

export default function FuturisticLogin() {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const login = useAuth(state=> state.login);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value
    })
  }

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (loginData.email.trim() == "") {
      toast.error("Email is required");
      return;
    }

    if (loginData.password.trim() == "") {
      toast.error("Password is required");
      return;
    }

    // console.log(event.target);
    // console.log(loginData);

    try {
      setLoading(true);
      // const userInfo = await loginUser(loginData);
      await login(loginData);
      toast.success("Login success");
      // console.log(userInfo);
      console.log("STORE AFTER LOGIN:", useAuth.getState());
      navigate("/dashboard")

      // save the current user loggedIn informations
      // localStorage 
    } catch (error:any) {
      console.log(error);
      toast.error("Error !!");
      if(error?.status == 400){
        setError(error);
      }else{
        setError(
          {
            ...error,
          });
      }
    } finally {
      setLoading(false);
    }
  };





  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-black dark:via-gray-900 dark:to-black p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 50, -50, 0], y: [0, -50, 50, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          className="w-[500px] h-[500px] bg-purple-400/30 dark:bg-purple-500 opacity-30 blur-3xl rounded-full absolute top-0 left-0"
        />
        <motion.div
          animate={{ x: [0, -60, 60, 0], y: [0, 60, -60, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          className="w-[500px] h-[500px] bg-blue-400/30 dark:bg-blue-500 opacity-30 blur-3xl rounded-full absolute bottom-0 right-0"
        />
      </div>

      <Card className="relative z-10 w-full max-w-md backdrop-blur-xl bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-2xl rounded-2xl">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Access your secure futuristic dashboard</p>
          </div>

           {/* error section */}
          {error && (
            <div>
            <Alert variant="destructive">
              <CheckCircle2Icon/>
              <AlertTitle>
                { error?.response 
                    ? error?.response?.data?.message
                    : error?.messag
                }
              </AlertTitle>
            </Alert>
          </div>
          ) }

          <form onSubmit={handleFormSubmit} action="">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Email</Label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  id="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-white/10 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Password</Label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-white/10 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <Button disabled={loading} className=" mb-2 w-full bg-purple-600 cursor-pointer hover:bg-purple-700 text-white">
                {loading ? (
                  <>
                    <Spinner />
                    Please Wait...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </div>

            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
              OR CONTINUE WITH
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
            </div>

            <OAuth2Buttons/>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
