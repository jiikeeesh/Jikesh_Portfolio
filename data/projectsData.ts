export interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  link: string;
  github: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce platform built with Next.js, featuring product listings, shopping cart, and payment integration.",
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Stripe"],
    link: "#",
    github: "#"
  },
  {
    id: 2,
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates, user authentication, and team workspace features.",
    tech: ["React", "Firebase", "TypeScript", "Tailwind CSS"],
    link: "#",
    github: "#"
  },
  {
    id: 3,
    title: "Portfolio Website",
    description: "A modern portfolio website showcasing projects with smooth animations, dark mode support, and responsive design.",
    tech: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
    link: "#",
    github: "#"
  },
  {
    id: 4,
    title: "Analytics Dashboard",
    description: "A comprehensive analytics dashboard with interactive charts, data visualization, and real-time metrics tracking.",
    tech: ["React", "Chart.js", "TypeScript", "Node.js"],
    link: "#",
    github: "#"
  }
];
