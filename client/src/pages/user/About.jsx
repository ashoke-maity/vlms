import { Link } from "react-router-dom";
import { 
  ArrowLeft,
  Play,
  Heart,
  Eye,
  Star,
  Users,
  Film,
  Globe,
  Shield,
  Zap,
  Award,
  Mail,
  Github,
  Twitter,
  Linkedin
} from "lucide-react";

export default function About() {
  const features = [
    {
      icon: Play,
      title: "Extensive Video Library",
      description: "Access thousands of high-quality videos across multiple genres and categories."
    },
    {
      icon: Heart,
      title: "Personalized Lists",
      description: "Create and manage your own collections of favorite videos and playlists."
    },
    {
      icon: Eye,
      title: "Smart Recommendations",
      description: "AI-powered suggestions based on your viewing history and preferences."
    },
    {
      icon: Star,
      title: "Rating System",
      description: "Rate and review videos to help others discover great content."
    },
    {
      icon: Users,
      title: "Community Features",
      description: "Connect with other users, share recommendations, and discuss your favorite videos."
    },
    {
      icon: Film,
      title: "Multiple View Modes",
      description: "Choose from grid, list, carousel, or cinematic shelf viewing options."
    }
  ];

  const stats = [
    { label: "Videos Available", value: "10,000+", icon: Film },
    { label: "Active Users", value: "50,000+", icon: Users },
    { label: "Countries", value: "150+", icon: Globe },
    { label: "Languages", value: "25+", icon: Globe }
  ];

  const team = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      bio: "Passionate about creating the ultimate video streaming experience.",
      avatar: "AJ"
    },
    {
      name: "Sarah Chen",
      role: "Lead Developer",
      bio: "Full-stack developer with expertise in modern web technologies.",
      avatar: "SC"
    },
    {
      name: "Mike Rodriguez",
      role: "UX Designer",
      bio: "Creating intuitive and beautiful user experiences.",
      avatar: "MR"
    },
    {
      name: "Emily Davis",
      role: "Content Curator",
      bio: "Ensuring the highest quality content for our users.",
      avatar: "ED"
    }
  ];

  const technologies = [
    "React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Vite", "TypeScript"
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <div className="bg-neutral-900/50 backdrop-blur border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold">About VLMS</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Play size={32} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Video Library Management System
          </h1>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto mb-8">
            VLMS is a modern, feature-rich video streaming platform designed to provide users with 
            an exceptional viewing experience. Discover, organize, and enjoy your favorite content 
            with powerful tools and intuitive design.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/browse"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors flex items-center gap-2"
            >
              <Play size={20} />
              Start Browsing
            </Link>
            <Link
              to="/register"
              className="bg-neutral-800 hover:bg-neutral-700 text-white px-8 py-3 rounded-lg transition-colors"
            >
              Join Now
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center p-6 bg-neutral-900 rounded-lg border border-neutral-800">
                <Icon size={32} className="text-blue-400 mx-auto mb-4" />
                <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-neutral-400">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose VLMS?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="p-6 bg-neutral-900 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors">
                  <Icon size={32} className="text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-neutral-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-neutral-300 mb-6">
                At VLMS, we believe that great content should be accessible, discoverable, and enjoyable 
                for everyone. Our mission is to create the most user-friendly video platform that 
                connects people with the content they love.
              </p>
              <p className="text-lg text-neutral-300 mb-6">
                We're committed to providing a seamless viewing experience with powerful organization 
                tools, intelligent recommendations, and a vibrant community of content enthusiasts.
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Shield size={20} className="text-green-400" />
                  <span className="text-sm text-neutral-400">Secure & Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={20} className="text-yellow-400" />
                  <span className="text-sm text-neutral-400">Lightning Fast</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={20} className="text-purple-400" />
                  <span className="text-sm text-neutral-400">Award Winning</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg p-8 border border-blue-500/30">
              <h3 className="text-xl font-semibold mb-4">What We Offer</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Unlimited video streaming</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Personalized recommendations</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Advanced search and filtering</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Cross-platform compatibility</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Community features</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Regular content updates</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center p-6 bg-neutral-900 rounded-lg border border-neutral-800">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                  {member.avatar}
                </div>
                <h3 className="text-lg font-semibold mb-2">{member.name}</h3>
                <p className="text-blue-400 text-sm mb-3">{member.role}</p>
                <p className="text-neutral-400 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Built With Modern Technology</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {technologies.map((tech, index) => (
              <div key={index} className="px-4 py-2 bg-neutral-800 rounded-full text-sm text-neutral-300 border border-neutral-700">
                {tech}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
          <p className="text-lg text-neutral-300 mb-8 max-w-2xl mx-auto">
            Have questions, suggestions, or feedback? We'd love to hear from you. 
            Our team is always ready to help and improve your experience.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <a
              href="mailto:contact@vlms.com"
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
            >
              <Mail size={20} />
              contact@vlms.com
            </a>
            <a
              href="https://github.com/vlms"
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
            >
              <Github size={20} />
              GitHub
            </a>
            <a
              href="https://twitter.com/vlms"
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
            >
              <Twitter size={20} />
              Twitter
            </a>
            <a
              href="https://linkedin.com/company/vlms"
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
            >
              <Linkedin size={20} />
              LinkedIn
            </a>
          </div>
          <div className="text-sm text-neutral-500">
            © 2024 VLMS. All rights reserved. | 
            <Link to="/privacy" className="hover:text-neutral-400 transition-colors"> Privacy Policy</Link> | 
            <Link to="/terms" className="hover:text-neutral-400 transition-colors"> Terms of Service</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
