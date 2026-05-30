import { useState} from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import type RegisterData from "@/models/RegisterData";
import { registerUser } from "@/services/AuthService";
import { useNavigate } from "react-router";

export default function Signup() {
  const navigate = useNavigate();
  const [data, setData] = useState<RegisterData>({
    name: "",
    email: "",
    password: ""
  });
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(event.target.name);
    // console.log(event.target.value);
    setData(value => ({
      ...value,
      [event.target.name]: event.target.value,
    }))
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(data);

    if(data.name.trim() === ""){
      toast.error("Name is required");
      return;
    }

    if(data.email.trim() == ""){
      toast.error("Email is required");
      return;
    }

    if(data.password.trim() == ""){
      toast.error("Password is required");
      return;
    }

    try {
      const result = await registerUser(data);
      console.log(result);
      toast.success("User register successfully...")
      setData({
        name: "",
        email: "",
        password: ""
      });
      navigate("/login")
    } catch (error) {
      console.log(error);
      toast.error("error in registering the user....")
    }
  }



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
          <form onSubmit={handleFormSubmit} action="">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Join the future of secure authentication</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  name="name"
                  value={data.name}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-white/10 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={data.email}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-white/10 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  name="password"
                  value={data.password}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-white/10 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Sign Up
              </Button>
            </div>

            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
              OR CONTINUE WITH
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="flex items-center gap-2 border-gray-300 dark:border-white/20 bg-white dark:bg-white/10 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/20 font-medium">
                <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.73 1.22 9.24 3.6l6.9-6.9C35.64 2.16 30.2 0 24 0 14.64 0 6.44 5.48 2.44 13.44l8.06 6.26C12.64 13.12 17.92 9.5 24 9.5z" /><path fill="#4285F4" d="M46.14 24.55c0-1.64-.15-3.21-.43-4.73H24v9h12.4c-.53 2.86-2.14 5.28-4.56 6.9l7.04 5.46C43.88 37.18 46.14 31.43 46.14 24.55z" /><path fill="#FBBC05" d="M10.5 28.7c-.48-1.44-.75-2.97-.75-4.55s.27-3.11.75-4.55l-8.06-6.26C.9 17.02 0 20.39 0 24.15s.9 7.13 2.44 10.81l8.06-6.26z" /><path fill="#34A853" d="M24 48c6.48 0 11.92-2.13 15.9-5.8l-7.04-5.46c-1.96 1.32-4.47 2.1-8.86 2.1-6.08 0-11.36-3.62-13.5-8.8l-8.06 6.26C6.44 42.52 14.64 48 24 48z" /></svg>
                Google
              </Button>

              <Button variant="outline" className="flex items-center gap-2 border-gray-300 dark:border-white/20 bg-white dark:bg-white/10 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-white/20 font-medium">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.75 5.4.75 11.75c0 4.9 3.17 9.05 7.57 10.52.55.1.75-.23.75-.52v-1.82c-3.08.67-3.73-1.48-3.73-1.48-.5-1.27-1.23-1.6-1.23-1.6-1-.68.08-.67.08-.67 1.1.08 1.68 1.14 1.68 1.14.98 1.67 2.57 1.19 3.2.9.1-.71.38-1.19.69-1.46-2.46-.28-5.05-1.23-5.05-5.48 0-1.21.43-2.2 1.14-2.98-.11-.28-.5-1.41.11-2.94 0 0 .94-.3 3.08 1.14a10.7 10.7 0 0 1 2.8-.38c.95 0 1.9.13 2.8.38 2.14-1.44 3.08-1.14 3.08-1.14.61 1.53.22 2.66.11 2.94.71.78 1.14 1.77 1.14 2.98 0 4.26-2.6 5.2-5.07 5.47.39.34.73 1.01.73 2.03v3.01c0 .29.2.63.76.52 4.4-1.47 7.57-5.62 7.57-10.52C23.25 5.4 18.35.5 12 .5z" /></svg>
                GitHub
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
