import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useAuth from "@/auth/store";

export default function UserProfilePage() {
  const user = useAuth((state) => state.user);

  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
        <p className="text-gray-600 dark:text-gray-300">No user found</p>
      </div>
    );
  }

  const handleChange = (e:any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEdit(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-black dark:via-gray-900 dark:to-black p-4">
      <Card className="w-full max-w-xl backdrop-blur-xl bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl">
        <CardContent className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              User Profile
            </h1>

            {!isEdit ? (
              <Button onClick={() => setIsEdit(true)}>Edit</Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEdit(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden">
              {user.image ? (
                <img
                  src={user.image}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-600 dark:text-gray-300">
                  {user.name?.charAt(0) || "U"}
                </div>
              )}
            </div>

            <div>
              <p className="text-gray-900 dark:text-white font-semibold">
                {user.name || "No Name"}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {user.email}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Name</Label>
              {isEdit ? (
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="bg-white dark:bg-white/10"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{user.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Email</Label>
              {isEdit ? (
                <Input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="bg-white dark:bg-white/10"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{user.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Provider</Label>
              <p className="text-gray-900 dark:text-white capitalize">
                {user.provider}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-300">Status</Label>
              <p className="text-gray-900 dark:text-white">
                {user.enabled ? "Active" : "Disabled"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
