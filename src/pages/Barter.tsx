
import { useState, useEffect } from "react";
import { Filter, RefreshCw, Plus, Search } from "lucide-react";
import Navbar from "../components/Navbar";
import MachineCard from "../components/MachineCard";
import AIAssistant from "../components/AIAssistant";
import { machines, aiRecommendations } from "../lib/data";

const Barter = () => {
  const [isListOpen, setIsListOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMachines, setFilteredMachines] = useState(machines);
  
  // Simulating loading machines
  useEffect(() => {
    // Filter machines based on search and value
    const filtered = machines.filter(machine => {
      const matchesSearch = machine.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          machine.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesValue = selectedValue === null || 
                          (machine.value >= selectedValue * 0.8 && 
                           machine.value <= selectedValue * 1.2);
      
      return matchesSearch && matchesValue;
    });
    
    setFilteredMachines(filtered);
  }, [searchQuery, selectedValue]);
  
  const toggleListForm = () => {
    setIsListOpen(!isListOpen);
  };
  
  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
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
            <p className="text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredMachines.length}</span> equipment available for barter
            </p>
          </div>
          
          {/* Machine Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMachines.length > 0 ? (
              filteredMachines.map((machine) => (
                <MachineCard key={machine.id} machine={machine} />
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
        </div>
      </section>
      
      {/* AI Assistant Floating Button */}
      <AIAssistant recommendations={aiRecommendations} />
      
      {/* List Equipment Modal Form - Simplified for demo */}
      {isListOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-scale-in">
            <h2 className="text-2xl font-bold mb-4">List Your Equipment</h2>
            <p className="text-muted-foreground mb-6">
              Fill out the details below to list your equipment for barter
            </p>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="equipName" className="block text-sm font-medium mb-2">
                  Equipment Name
                </label>
                <input
                  type="text"
                  id="equipName"
                  className="input-vismay w-full"
                  placeholder="e.g. Water Pump, Mini Tractor"
                />
              </div>
              
              <div>
                <label htmlFor="equipDesc" className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="equipDesc"
                  rows={3}
                  className="input-vismay w-full"
                  placeholder="Brief description of your equipment"
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="equipValue" className="block text-sm font-medium mb-2">
                  Estimated Value (₹)
                </label>
                <input
                  type="number"
                  id="equipValue"
                  className="input-vismay w-full"
                  placeholder="Enter value in rupees"
                />
              </div>
              
              <div>
                <label htmlFor="equipCondition" className="block text-sm font-medium mb-2">
                  Condition
                </label>
                <select
                  id="equipCondition"
                  className="input-vismay w-full"
                >
                  <option value="">Select condition</option>
                  <option value="New">New</option>
                  <option value="Good">Good</option>
                  <option value="Used">Used</option>
                  <option value="Needs Repair">Needs Repair</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="equipImage" className="block text-sm font-medium mb-2">
                  Upload Image
                </label>
                <div className="border-2 border-dashed border-border rounded-xl p-4 text-center">
                  <p className="text-muted-foreground text-sm mb-2">
                    Drag and drop an image or click to browse
                  </p>
                  <button type="button" className="btn-outline py-2 text-sm">
                    Upload Image
                  </button>
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={toggleListForm}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-vismay flex-1"
                  onClick={() => {
                    toggleListForm();
                    // Here you would normally handle the form submission
                  }}
                >
                  List Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Barter;
