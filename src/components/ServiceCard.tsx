
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  delay?: number;
}

const ServiceCard = ({ title, description, icon, to, delay = 0 }: ServiceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="feature-card max-w-sm w-full mx-auto overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`w-16 h-16 mb-5 rounded-full bg-primary/10 flex items-center justify-center text-primary
        transition-transform duration-300 ${isHovered ? "scale-110" : ""}`}>
        {icon}
      </div>
      
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      
      <p className="text-muted-foreground mb-6 text-sm">
        {description}
      </p>
      
      <Link 
        to={to}
        className={`group inline-flex items-center text-primary font-medium gap-1 
          transition-all duration-200 hover:gap-2`}
      >
        Explore Now
        <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  );
};

export default ServiceCard;
