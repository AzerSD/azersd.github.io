import { motion } from "framer-motion";
import { format } from "date-fns";
import { ExternalLink, Calendar, Code, Trophy, Users, ChevronRight, Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { TimelineItem } from "@shared/schema";

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "project":
      return Code;
    case "hackathon":
      return Trophy;
    case "event":
      return Users;
    default:
      return Code;
  }
};

const getCategoryConfig = (category: string) => {
  switch (category) {
    case "project":
      return {
        color: "bg-blue-500",
        bgColor: "bg-blue-50 dark:bg-blue-950/20",
        textColor: "text-blue-700 dark:text-blue-300",
        borderColor: "border-blue-200 dark:border-blue-800",
      };
    case "hackathon":
      return {
        color: "bg-yellow-500",
        bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
        textColor: "text-yellow-700 dark:text-yellow-300",
        borderColor: "border-yellow-200 dark:border-yellow-800",
      };
    case "event":
      return {
        color: "bg-green-500",
        bgColor: "bg-green-50 dark:bg-green-950/20",
        textColor: "text-green-700 dark:text-green-300",
        borderColor: "border-green-200 dark:border-green-800",
      };
    default:
      return {
        color: "bg-gray-500",
        bgColor: "bg-gray-50 dark:bg-gray-950/20",
        textColor: "text-gray-700 dark:text-gray-300",
        borderColor: "border-gray-200 dark:border-gray-800",
      };
  }
};

const TimelineItemComponent = ({ item, index }: { item: TimelineItem; index: number }) => {
  const IconComponent = getCategoryIcon(item.category);
  const config = getCategoryConfig(item.category);
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -100 : 100, y: 50 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1, type: "spring", stiffness: 100 }}
      className={`flex items-center mb-16 ${isLeft ? "flex-row" : "flex-row-reverse"}`}
    >
      {/* Content */}
      <div className={`w-5/12 ${isLeft ? "pr-12 text-right" : "pl-12 text-left"}`}>
        <motion.div
          whileHover={{ scale: 1.03, rotateY: isLeft ? -2 : 2 }}
          className="relative group"
        >
          <Card className={`${config.bgColor} ${config.borderColor} border-2 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${config.color}/5 group-hover:${config.color}/10 transition-all duration-300`} />
            <CardContent className="p-8 relative">
              {/* Category and Date Header */}
              <div className={`flex items-center gap-3 mb-4 ${isLeft ? "justify-end" : "justify-start"}`}>
                <Badge 
                  variant={item.category === "project" ? "default" : "secondary"} 
                  className={`${config.textColor} bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-3 py-1 text-xs font-semibold uppercase tracking-wide`}
                >
                  <IconComponent className="w-3 h-3 mr-1" />
                  {item.category}
                </Badge>
                <div className={`flex items-center gap-1 text-sm ${config.textColor} font-medium`}>
                  <Calendar className="w-3 h-3" />
                  {format(new Date(item.date), "MMM yyyy")}
                </div>
              </div>
              
              {/* Title */}
              <motion.h3 
                className="text-2xl font-bold mb-4 text-gray-900 dark:text-white leading-tight"
                whileHover={{ x: isLeft ? -4 : 4 }}
              >
                {item.title}
              </motion.h3>
              
              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-base">
                {item.description}
              </p>

              {/* Technologies */}
              {item.technologies && item.technologies.length > 0 && (
                <div className={`flex flex-wrap gap-2 mb-6 ${isLeft ? "justify-end" : "justify-start"}`}>
                  {item.technologies.map((tech, techIndex) => (
                    <motion.div
                      key={techIndex}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Badge variant="outline" className="text-xs px-3 py-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                        {tech}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Action Button */}
              {item.link && (
                <motion.div
                  className={`flex ${isLeft ? "justify-end" : "justify-start"}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    size="sm"
                    className={`group ${config.color} hover:${config.color}/90 text-white border-0 px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl`}
                  >
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      <span className="mr-2">Explore</span>
                      <ExternalLink className="w-3 h-3 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Timeline Line and Dot */}
      <div className="relative flex items-center justify-center w-2/12">
        <div className="absolute w-1 bg-gradient-to-b from-blue-400 via-purple-500 to-pink-500 h-full opacity-80"></div>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.3, rotate: 360 }}
          className={`relative z-10 w-16 h-16 ${config.color} rounded-full flex items-center justify-center shadow-2xl border-4 border-white dark:border-gray-900 group cursor-pointer`}
        >
          <IconComponent className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          <div className={`absolute inset-0 rounded-full ${config.color} opacity-30 group-hover:opacity-50 animate-pulse`}></div>
        </motion.div>
      </div>

      {/* Empty space for alignment */}
      <div className="w-5/12"></div>
    </motion.div>
  );
};

export function TimelineSection({ timelineItems }: { timelineItems: TimelineItem[] }) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      {timelineItems && timelineItems.length > 0 ? (
        <div className="relative">
          {timelineItems.map((item, index) => (
            <TimelineItemComponent key={item.id} item={item} index={index} />
          ))}
          
          {/* Journey End Marker */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: timelineItems.length * 0.1 + 1, duration: 0.8 }}
            className="text-center pt-12"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white dark:border-gray-900"
              >
                <Star className="w-8 h-8 text-white" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 w-20 h-20 mx-auto bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full"
              />
            </div>
            <motion.p 
              className="mt-6 text-xl font-semibold text-gray-700 dark:text-gray-300"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              The journey continues...
            </motion.p>
            <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
              More amazing projects coming soon
            </p>
          </motion.div>
        </div>
      ) : (
        <div className="text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-500 dark:text-gray-400"
          >
            <Code className="w-20 h-20 mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl font-semibold mb-4">No timeline items yet</h3>
            <p className="text-lg">Your amazing journey is about to begin!</p>
          </motion.div>
        </div>
      )}
    </div>
  );
}