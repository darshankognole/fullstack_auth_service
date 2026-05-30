
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Activity, Clock, User } from "lucide-react";
import { getCurrentUser } from "@/services/AuthService";
import useAuth from "@/auth/store";
import { useState } from "react";
import type UserT from "@/models/User";
import toast from "react-hot-toast";

export default function Userhome() {

  const user = useAuth(state => state.user)
  const [user1, setUser1] = useState<UserT | null>(null);

  const getUserData=async()=>{
    try{
      const user1 = await getCurrentUser(user?.email);
      setUser1(user1);
      toast.success("You are able to access secured API's ")
    } catch (error){
      console.log(error);
      toast.error("error in getting data")
    }
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-white text-gray-900 dark:bg-black dark:text-white">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back, user 👋
        </p>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6">
        {stats.map((item, i) => (
          <Card
            key={i}
            className="p-6 bg-white/70 dark:bg-white/5 backdrop-blur border border-gray-200 dark:border-white/10"
          >
            <CardContent className="p-0">
              <item.icon className="h-6 w-6 text-indigo-500 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.label}
              </p>
              <h3 className="text-xl font-semibold mt-1">{item.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Section */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 mt-10">
        
        {/* Activity */}
        <Card className="col-span-2 p-6 bg-white/70 dark:bg-white/5 backdrop-blur border border-gray-200 dark:border-white/10">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <li>🔐 Logged in from Chrome (Windows)</li>
            <li>📱 New device added</li>
            <li>⚙️ Password updated</li>
            <li>🛡️ MFA enabled</li>
          </ul>
        </Card>

        {/* Profile */}
        <Card className="p-6 bg-white/70 dark:bg-white/5 backdrop-blur border border-gray-200 dark:border-white/10">
          <h2 className="text-lg font-semibold mb-4">Profile</h2>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p><strong>Name:</strong> John Doe</p>
            <p><strong>Email:</strong> john@example.com</p>
            <p><strong>Status:</strong> Active</p>
          </div>
        </Card>
      </div>

      {/* Actions */}
      {/* <div className="max-w-7xl mx-auto mt-10 flex gap-4">
        <Button>Update Profile</Button>
        <Button variant="outline">Change Password</Button>
        <Button variant="ghost">Logout</Button>
      </div> */}

      <div className="text-center">
        <Button onClick={getUserData} className="rounded-2xl px-8 text-lg"> Get current User</Button>
      </div>
      <p>
        {user1?.name}
      </p>
    </div>
  );
}

const stats = [
  {
    icon: Activity,
    label: "Active Sessions",
    value: "3",
  },
  {
    icon: Clock,
    label: "Last Login",
    value: "2 hours ago",
  },
  {
    icon: ShieldCheck,
    label: "Security Status",
    value: "Strong",
  },
  {
    icon: User,
    label: "Account Type",
    value: "Premium",
  },
];