
import { useState, useEffect } from "react";
import { Filter, RefreshCw, Plus, Search, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import MachineCard from "../components/MachineCard";
import AIAssistant from "../components/AIAssistant";
import { aiRecommendations } from "../lib/data";
import { 
  supabase, 
  getCurrentUser, 
  fetchAllMachines, 
  createMachine,
  fetchUserMachines,
  createBarterRequest
} from "../lib/supabase";

// Types for our components
interface Machine {
  id: string;
  name: string;
  description: string;
  value: number;
  condition: string;
  image_url: string;
  owner_id: string;
  created_at: string;
  owner: {
    id: string;
    full_name: string;
    location: string;
    phone?: string;
  };
}

interface BarterRequest {
  id: string;
  requester_id: string;
  owner_id: string;
  requesting_machine_id: string;
  offered_machine_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

const Barter = () => {
  // State variables
  const [isListOpen, setIsListOpen] = useState(false);
  const [isBarterModalOpen, setIsBarterModalOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [userMachines, setUserMachines] = useState<Machine[]>([]);
  const [selectedUserMachine, setSelectedUserMachine] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [machines, setMachines] = useState<Machine[]>([]);
  const [filteredMachines, setFilteredMachines] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Form state for listing a new machine
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    value: "",
    condition: "",
    image_url: ""
  });
  
  // Fetch current user and machines on component mount
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Get current user
        const user = await getCurrentUser();
        setCurrentUser(user);
        
        // Fetch all machines
        const allMachines = await fetchAllMachines();
        setMachines(allMachines);
        setFilteredMachines(allMachines);
        
        // If user is logged in, fetch their machines
        if (user) {
          const userMachines = await fetchUserMachines(user.id);
          setUserMachines(userMachines);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load machines. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        const user = session?.user;
        setCurrentUser(user);
        
        if (user) {
          const userMachines = await fetchUserMachines(user.id);
          setUserMachines(userMachines);
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setUserMachines([]);
      }
    });
    
    return () => {
      // Clean up auth listener
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  // Filter machines when search query or value filter changes
  useEffect(() => {
    // Filter machines based on search and value
    const filtered = machines.filter(machine => {
      // Skip machines owned by the current user
      if (currentUser && machine.owner_id === currentUser.id) {
        return false;
      }
      
      const matchesSearch = machine.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          machine.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesValue = selectedValue === null || 
                          (machine.value >= selectedValue * 0.8 && 
                           machine.value <= selectedValue * 1.2);
      
      return matchesSearch && matchesValue;
    });
    
    setFilteredMachines(filtered);
  }, [searchQuery, selectedValue, machines, currentUser]);
  
  // Handler functions
  const toggleListForm = () => {
    if (!currentUser) {
      toast.error("Please login to list your equipment", {
        description: "You need to be logged in to list equipment for barter.",
        action: {
          label: "Login",
          onClick: () => window.location.href = "/login"
        }
      });
      return;
    }
    setIsListOpen(!isListOpen);
    // Reset form data when opening
    if (!isListOpen) {
      setFormData({
        name: "",
        description: "",
        value: "",
        condition: "",
        image_url: ""
      });
    }
  };
  
  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('equip', '').toLowerCase()]: value
    }));
  };
  
  const handleSubmitMachine = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to list equipment");
      return;
    }
    
    // Basic validation
    if (!formData.name || !formData.description || !formData.value || !formData.condition) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Default image if none provided
    const imageUrl = formData.image_url || "https://images.unsplash.com/photo-1605002123921-34b325e2a20b?q=80&w=1000&auto=format&fit=crop";
    
    try {
      setIsLoading(true);
      
      // Create new machine
      const newMachine = await createMachine({
        name: formData.name,
        description: formData.description,
        value: parseFloat(formData.value),
        condition: formData.condition,
        image_url: imageUrl,
        owner_id: currentUser.id
      });
      
      if (newMachine) {
        // Add to local state with owner data
        const machineWithOwner = {
          ...newMachine,
          owner: {
            id: currentUser.id,
            full_name: currentUser.user_metadata?.full_name || "Anonymous",
            location: currentUser.user_metadata?.location || "Unknown"
          }
        };
        
        setMachines(prev => [machineWithOwner, ...prev]);
        setUserMachines(prev => [machineWithOwner, ...prev]);
        
        toast.success("Equipment listed successfully");
        toggleListForm();
      }
    } catch (error) {
      console.error("Error creating machine:", error);
      toast.error("Failed to list equipment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const openBarterModal = (machine: Machine) => {
    if (!currentUser) {
      toast.error("Please login to barter", {
        description: "You need to be logged in to initiate a barter request.",
        action: {
          label: "Login",
          onClick: () => window.location.href = "/login"
        }
      });
      return;
    }
    
    if (userMachines.length === 0) {
      toast.error("No equipment to barter with", {
        description: "You need to list some equipment before you can barter.",
        action: {
          label: "List Equipment",
          onClick: toggleListForm
        }
      });
      return;
    }
    
    setSelectedMachine(machine);
    setSelectedUserMachine(userMachines[0]?.id || null);
    setIsBarterModalOpen(true);
  };
  
  const handleBarterRequest = async () => {
    if (!currentUser || !selectedMachine || !selectedUserMachine) {
      toast.error("Missing information for barter request");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Create barter request
      const barterRequest = await createBarterRequest({
        requester_id: currentUser.id,
        owner_id: selectedMachine.owner_id,
        requesting_machine_id: selectedMachine.id,
        offered_machine_id: selectedUserMachine,
        status: 'pending'
      });
      
      if (barterRequest) {
        toast.success("Barter request sent successfully", {
          description: `Your request has been sent to ${selectedMachine.owner.full_name}`
        });
        setIsBarterModalOpen(false);
      }
    } catch (error) {
      console.error("Error creating barter request:", error);
      toast.error("Failed to send barter request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 md:pb-16 px-4 bg-accent/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
              Barter Your Farming Equipment
            </h1>
            <p className="text-muted-foreground mb-8 animate-fade-in" style={{animationDelay: "200ms"}}>
              List your farming equipment and find suitable exchange options. Our platform matches items of similar value to help you get what you need without major investments.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{animationDelay: "400ms"}}>
              <button onClick={toggleListForm} className="btn-vismay">
                <Plus size={18} />
                List Your Equipment
              </button>
              <button onClick={toggleFilter} className="btn-outline">
                <Filter size={18} />
                Filter Options
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Machine Listings Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* User's Equipment Section (if logged in) */}
          {currentUser && userMachines.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Your Listed Equipment</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userMachines.map((machine) => (
                  <MachineCard 
                    key={machine.id} 
                    machine={machine} 
                    isContactVisible={false}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Search & Filter Tools */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-muted-foreground" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search equipment..."
                className="input-vismay pl-10 w-full"
              />
            </div>
            
            {/* Value Filter */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <label htmlFor="valueFilter" className="whitespace-nowrap font-medium">
                Equipment Value:
              </label>
              <select
                id="valueFilter"
                value={selectedValue || ""}
                onChange={(e) => setSelectedValue(e.target.value ? Number(e.target.value) : null)}
                className="input-vismay w-full md:w-auto"
              >
                <option value="">Any Value</option>
                <option value="10000">Below ₹10,000</option>
                <option value="25000">Around ₹25,000</option>
                <option value="50000">Around ₹50,000</option>
                <option value="75000">Around ₹75,000</option>
                <option value="100000">Around ₹1,00,000</option>
                <option value="150000">Above ₹1,50,000</option>
              </select>
              
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedValue(null);
                }}
                className="flex items-center gap-1 text-primary"
              >
                <RefreshCw size={14} />
                <span className="text-sm">Reset</span>
              </button>
            </div>
          </div>
          
          {/* Results Count */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Available for Barter</h2>
            <p className="text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredMachines.length}</span> equipment available for barter
            </p>
          </div>
          
          {/* Loading State */}
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 size={40} className="mx-auto animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading equipment listings...</p>
            </div>
          ) : (
            /* Machine Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMachines.length > 0 ? (
                filteredMachines.map((machine) => (
                  <MachineCard 
                    key={machine.id} 
                    machine={machine} 
                    onContact={() => openBarterModal(machine)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No equipment found</h3>
                  <p className="text-muted-foreground mb-6">
                    Please try adjusting your filters or search criteria
                  </p>
                  <button 
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedValue(null);
                    }}
                    className="btn-outline mx-auto"
                  >
                    <RefreshCw size={18} />
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* AI Assistant Floating Button */}
      <AIAssistant recommendations={aiRecommendations} />
      
      {/* List Equipment Modal Form */}
      {isListOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-scale-in">
            <h2 className="text-2xl font-bold mb-4">List Your Equipment</h2>
            <p className="text-muted-foreground mb-6">
              Fill out the details below to list your equipment for barter
            </p>
            
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="equipName" className="block text-sm font-medium mb-2">
                  Equipment Name*
                </label>
                <input
                  type="text"
                  id="equipName"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-vismay w-full"
                  placeholder="e.g. Water Pump, Mini Tractor"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="equipDescription" className="block text-sm font-medium mb-2">
                  Description*
                </label>
                <textarea
                  id="equipDescription"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input-vismay w-full"
                  placeholder="Brief description of your equipment"
                  required
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="equipValue" className="block text-sm font-medium mb-2">
                  Estimated Value (₹)*
                </label>
                <input
                  type="number"
                  id="equipValue"
                  value={formData.value}
                  onChange={handleInputChange}
                  className="input-vismay w-full"
                  placeholder="Enter value in rupees"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="equipCondition" className="block text-sm font-medium mb-2">
                  Condition*
                </label>
                <select
                  id="equipCondition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="input-vismay w-full"
                  required
                >
                  <option value="">Select condition</option>
                  <option value="New">New</option>
                  <option value="Good">Good</option>
                  <option value="Used">Used</option>
                  <option value="Needs Repair">Needs Repair</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="equipImage_url" className="block text-sm font-medium mb-2">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  id="equipImage_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="input-vismay w-full"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  If left empty, a default image will be used
                </p>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={toggleListForm}
                  className="btn-outline flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-vismay flex-1"
                  onClick={handleSubmitMachine}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "List Equipment"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Barter Request Modal */}
      {isBarterModalOpen && selectedMachine && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-3xl w-full animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Barter Request</h2>
              <button 
                onClick={() => setIsBarterModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">You're requesting:</h3>
                <div className="bg-accent/30 p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src={selectedMachine.image_url} 
                      alt={selectedMachine.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-medium">{selectedMachine.name}</h4>
                      <p className="text-sm text-muted-foreground">₹{selectedMachine.value.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-sm">{selectedMachine.description}</p>
                  <div className="mt-3 text-sm text-muted-foreground">
                    Owned by {selectedMachine.owner.full_name}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">You're offering:</h3>
                {userMachines.length > 0 ? (
                  <>
                    <select
                      value={selectedUserMachine || ""}
                      onChange={(e) => setSelectedUserMachine(e.target.value)}
                      className="input-vismay w-full mb-4"
                    >
                      {userMachines.map(machine => (
                        <option key={machine.id} value={machine.id}>
                          {machine.name} (₹{machine.value.toLocaleString()})
                        </option>
                      ))}
                    </select>
                    
                    {selectedUserMachine && (
                      <div className="bg-primary/10 p-4 rounded-xl">
                        {userMachines.filter(m => m.id === selectedUserMachine).map(machine => (
                          <div key={machine.id}>
                            <div className="flex items-center gap-3 mb-3">
                              <img 
                                src={machine.image_url} 
                                alt={machine.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div>
                                <h4 className="font-medium">{machine.name}</h4>
                                <p className="text-sm text-muted-foreground">₹{machine.value.toLocaleString()}</p>
                              </div>
                            </div>
                            <p className="text-sm">{machine.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-muted p-4 rounded-xl text-center">
                    <p className="text-muted-foreground mb-2">You don't have any equipment to offer.</p>
                    <button 
                      onClick={() => {
                        setIsBarterModalOpen(false);
                        setTimeout(() => toggleListForm(), 300);
                      }}
                      className="btn-outline py-2 text-sm"
                    >
                      <Plus size={16} />
                      List Your Equipment First
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="border-t border-border pt-4 mt-4 flex flex-col md:flex-row gap-4 items-center justify-end">
              <p className="text-sm text-muted-foreground">
                After sending a request, the owner will be able to contact you to discuss the exchange.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setIsBarterModalOpen(false)}
                  className="btn-outline py-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBarterRequest}
                  className="btn-vismay py-2"
                  disabled={isLoading || !selectedUserMachine}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Send Barter Request"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Barter;
