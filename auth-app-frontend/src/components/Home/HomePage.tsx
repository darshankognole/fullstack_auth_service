import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Zap, Users } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-white text-gray-900 dark:from-black dark:via-gray-900 dark:to-black dark:text-white">
      {/* Hero Section */}
      <section className="text-center py-24 px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold leading-tight"
        >
          Secure Authentication
          <br />
          <span className="text-indigo-400">Reimagined for the Future</span>
        </motion.h1>

        <p className="mt-6 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Build, manage, and scale authentication with modern security,
          lightning-fast performance, and seamless developer experience.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg">Get Started</Button>
          <Button size="lg" variant="outline">View Docs</Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Features</h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-6 auto-rows-fr"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="group relative overflow-hidden rounded-2xl"
            >
              {/* light sweep effect */}
              <span className="pointer-events-none absolute inset-0 before:absolute before:top-full before:left-[-50%] before:h-[200%] before:w-[200%] before:rotate-45 before:bg-gradient-to-tr before:from-transparent before:via-white/20 before:to-transparent before:opacity-0 group-hover:before:top-[-50%] group-hover:before:left-[100%] group-hover:before:opacity-100 before:transition-all before:duration-700" />

              <Card className="h-full bg-white/70 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 transition-all duration-300 group-hover:bg-white/80 dark:group-hover:bg-white/10">
                <CardContent className="p-6 text-center flex flex-col h-full">
                  <feature.icon className="mx-auto mb-4 h-10 w-10 text-indigo-400 transition-transform duration-200 group-hover:scale-105" />
                  <div className="flex-1 flex flex-col justify-between">
                  <h3 className="text-xl font-semibold mb-2 text-indigo-600 dark:text-indigo-200">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-600 dark:to-purple-600">
        <h2 className="text-4xl font-bold">Start Securing Your App Today</h2>
        <p className="mt-4 text-gray-200">
          Join thousands of developers building secure authentication systems.
        </p>
        <Button size="lg" className="mt-6 bg-white text-black hover:bg-gray-200">
          Create Account
        </Button>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-gray-500 dark:text-gray-400">
        © 2026 AuthX. All rights reserved.
      </footer>
    </div>
  );
}

const features = [
  {
    icon: ShieldCheck,
    title: "Advanced Security",
    description: "State-of-the-art encryption and secure token management.",
  },
  {
    icon: Lock,
    title: "Multi-Factor Auth",
    description: "Add extra layers of protection with MFA support.",
  },
  {
    icon: Zap,
    title: "Fast Integration",
    description: "Plug and play APIs with minimal setup required.",
  },
  {
    icon: Users,
    title: "User Management",
    description: "Manage users, roles, and permissions effortlessly.",
  },
];
