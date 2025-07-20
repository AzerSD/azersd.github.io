import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, MapPin, Download, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { AnimatedBackground } from "@/components/animated-background";
import { TimelineSection } from "@/components/navigation";
import type { TimelineItem } from "@shared/schema";

export default function Portfolio() {
  const { data: timelineItems, isLoading } = useQuery<TimelineItem[]>({
    queryKey: ["/api/timeline"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <AnimatedBackground />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <ThemeToggle />
      
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <motion.div
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent bg-size-200 bg-pos-0">
                  My Journey
                </h1>
              </motion.div>
            </div>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Explore my projects, hackathon victories, and speaking engagements. 
              Each milestone represents growth, learning, and passion for technology.
            </motion.p>

            {/* Quick Stats */}
            <motion.div 
              className="flex flex-wrap justify-center gap-8 mt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {timelineItems?.filter(item => item.category === "project").length || 0}
                </div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {timelineItems?.filter(item => item.category === "hackathon").length || 0}
                </div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Hackathons</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {timelineItems?.filter(item => item.category === "event").length || 0}
                </div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Events</div>
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div 
              className="flex justify-center gap-4 mt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button variant="outline" size="icon" className="rounded-full hover:scale-110 transition-all">
                <Github className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full hover:scale-110 transition-all">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full hover:scale-110 transition-all">
                <Mail className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="rounded-full hover:scale-110 transition-all">
                <Download className="w-4 h-4 mr-2" />
                Resume
              </Button>
            </motion.div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
      </div>

      {/* Timeline Section */}
      <TimelineSection timelineItems={timelineItems || []} />

      {/* Footer */}
      <footer className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-4">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Built with passion using React, TypeScript, and Framer Motion
              </p>
            </div>
            <div className="flex justify-center space-x-4 text-sm text-gray-500 dark:text-gray-500">
              <span>© 2024 Portfolio</span>
              <span>•</span>
              <span className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                Open to opportunities
              </span>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}