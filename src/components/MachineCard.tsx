
import { useState } from "react";
import { MessageSquare, Info } from "lucide-react";
import { toast } from "sonner";

interface OwnerProfile {
  id: string;
  full_name: string;
  location: string;
  phone?: string;
}

export interface MachineProps {
  id: string;
  name: string;
  description: string;
  value: number;
  condition: string;
  image_url: string;
  owner_id: string;
  created_at: string;
  owner: OwnerProfile;
  isContactVisible?: boolean;
  onContact?: () => void;
  onDetails?: () => void;
}

const MachineCard = ({ 
  machine, 
  isContactVisible = true,
  onContact,
  onDetails 
}: { 
  machine: MachineProps;
  isContactVisible?: boolean;
  onContact?: () => void;
  onDetails?: () => void;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const handleContactClick = () => {
    if (onContact) {
      onContact();
    } else {
      toast.info(`Contact ${machine.owner.full_name} about ${machine.name}`);
    }
  };
  
  const handleDetailsClick = () => {
    if (onDetails) {
      onDetails();
    } else {
      // Default behavior if no handler provided
      toast.info(`View details of ${machine.name}`);
    }
  };
  
  return (
    <div className="vismay-card overflow-hidden flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={machine.image_url} 
          alt={machine.name}
          className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 
            ${imageLoaded ? 'loaded' : 'image-fade-in'}`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
          ₹{machine.value.toLocaleString()}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold">{machine.name}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${
            machine.condition === 'New' ? 'bg-green-100 text-green-700' :
            machine.condition === 'Good' ? 'bg-blue-100 text-blue-700' :
            'bg-amber-100 text-amber-700'
          }`}>
            {machine.condition}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 flex-grow">
          {machine.description}
        </p>
        
        <div className="text-xs text-foreground/70 mb-4">
          <div className="flex items-center gap-1">
            <span className="font-medium">Owner:</span> {machine.owner.full_name}
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Location:</span> {machine.owner.location}
          </div>
        </div>
        
        <div className="flex gap-2">
          {isContactVisible && (
            <button 
              className="btn-vismay py-2 px-4 text-sm flex-1"
              onClick={handleContactClick}
            >
              <MessageSquare size={16} />
              Contact Owner
            </button>
          )}
          <button 
            className="btn-outline py-2 px-3 text-sm"
            onClick={handleDetailsClick}
          >
            <Info size={16} />
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default MachineCard;
