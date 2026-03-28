import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const MEMBERS = [
  {
    name: "Adithya Sapkal",
    role: "Project Lead & ML Engineer",
    initials: "AS",
    color: "#FF9933",
    gradient: "from-orange-400 to-saffron",
    skills: ["Machine Learning", "Python", "Data Analysis"],
  },
  {
    name: "Aditiya",
    role: "Backend Developer",
    initials: "AD",
    color: "#3b82f6",
    gradient: "from-blue-400 to-blue-600",
    skills: ["Flask", "API Design", "Database"],
  },
  {
    name: "Amulya",
    role: "Frontend Engineer",
    initials: "AM",
    color: "#8b5cf6",
    gradient: "from-violet-400 to-purple-600",
    skills: ["React", "UI/UX", "Tailwind CSS"],
  },
  {
    name: "Sinchana",
    role: "Data Scientist",
    initials: "SI",
    color: "#138808",
    gradient: "from-green-400 to-india-green",
    skills: ["Data Science", "Visualization", "Research"],
  },
  {
    name: "Swarnava",
    role: "Research & Chemistry",
    initials: "SW",
    color: "#ec4899",
    gradient: "from-pink-400 to-rose-500",
    skills: ["Chemistry", "Research", "Documentation"],
  },
];

export default function Team() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-sm font-semibold text-primary">👨‍💻 Meet the Team</span>
          </div>
          <h1 className="text-4xl font-display font-extrabold text-foreground mb-4">
            The Minds Behind AQI India
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A passionate team of students combining AI, chemistry, and design to build a cleaner, more informed India.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MEMBERS.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-card rounded-3xl p-8 shadow-sm border border-border/50 hover:shadow-xl hover:shadow-black/8 transition-all duration-300 group"
            >
              {/* Avatar */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div
                    className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${member.gradient} flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300`}
                  >
                    <span className="text-3xl font-extrabold text-white font-display">
                      {member.initials}
                    </span>
                  </div>
                  <div
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white"
                    style={{ background: member.color }}
                  />
                </div>
              </div>

              {/* Info */}
              <div className="text-center mb-5">
                <h3 className="text-xl font-display font-bold text-foreground">{member.name}</h3>
                <p className="text-sm font-semibold mt-1" style={{ color: member.color }}>
                  {member.role}
                </p>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border/50"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Social links */}
              <div className="flex justify-center gap-3">
                {[
                  { icon: <Github className="w-4 h-4" />, label: "GitHub" },
                  { icon: <Linkedin className="w-4 h-4" />, label: "LinkedIn" },
                  { icon: <Mail className="w-4 h-4" />, label: "Email" },
                ].map((s) => (
                  <button
                    key={s.label}
                    aria-label={s.label}
                    className="w-9 h-9 rounded-xl border border-border bg-muted/40 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all duration-200"
                  >
                    {s.icon}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center bg-white rounded-3xl p-10 border border-border/50 shadow-sm"
        >
          <p className="text-2xl font-display font-bold text-foreground mb-2">
            "Building a cleaner India, one prediction at a time." 🇮🇳
          </p>
          <p className="text-muted-foreground">
            AQI India — AI-Powered Air Quality Intelligence System
          </p>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
