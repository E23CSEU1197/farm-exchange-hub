
import { useState, useEffect } from "react";
import { Plus, Search, Filter, ArrowRight, RefreshCw, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import { getCurrentUser, supabase } from "../lib/supabase";
import { formatDate } from "../lib/utils";

interface Seller {
  id: string;
  full_name: string;
  location: string;
  phone?: string;
}

interface Crop {
  id: string;
  name: string;
  quantity: string;
  price: number;
  quality: string;
  description: string;
  image_url: string;
  seller_id: string;
  created_at: string;
  seller: Seller;
}

const Sell = () => {
  const [isBuying, setIsBuying] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [crops, setCrops] = useState<Crop[]>([]);
  const [filteredCrops, setFilteredCrops] = useState<Crop[]>([]);
  const [isListOpen, setIsListOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    price: "",
    quality: "Standard",
    description: "",
    image_url: ""
  });
  
  // Fetch current user and crops on component mount
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Get current user
        const user = await getCurrentUser();
        setCurrentUser(user);
        
        // Fetch all crops
        const { data, error } = await supabase
          .from('crops')
          .select(`
            *,
            seller:profiles(id, full_name, location, phone)
          `)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setCrops(data || []);
        setFilteredCrops(data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load crops. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        setCurrentUser(session?.user || null);
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
      }
    });
    
    return () => {
      // Clean up auth listener
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  // Filter crops when search query changes
  useEffect(() => {
    const filtered = crops.filter(crop => {
      if (!isBuying && currentUser && crop.seller_id === currentUser.id) {
        // When in sell mode, show only user's crops
        return crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               crop.description?.toLowerCase().includes(searchQuery.toLowerCase());
      } else if (isBuying) {
        // When in buy mode, show all crops except user's
        if (currentUser && crop.seller_id === currentUser.id) {
          return false;
        }
        return crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               crop.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
               crop.seller.location.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return false;
    });
    
    setFilteredCrops(filtered);
  }, [searchQuery, crops, isBuying, currentUser]);
  
  const toggleMode = () => {
    setIsBuying(!isBuying);
    setSearchQuery("");
  };
  
  const toggleListForm = () => {
    if (!currentUser) {
      toast.error("Please login to list your crops", {
        description: "You need to be logged in to sell produce.",
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
        quantity: "",
        price: "",
        quality: "Standard",
        description: "",
        image_url: ""
      });
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('crop', '').toLowerCase()]: value
    }));
  };
  
  const handleSubmitCrop = async () => {
    if (!currentUser) {
      toast.error("You must be logged in to list crops");
      return;
    }
    
    // Basic validation
    if (!formData.name || !formData.quantity || !formData.price || !formData.quality) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Default image if none provided
    const imageUrl = formData.image_url || "https://images.unsplash.com/photo-1574323347407-f5e1c0cf4b7e?q=80&w=1000&auto=format&fit=crop";
    
    try {
      setIsSubmitting(true);
      
      // Create new crop
      const { data, error } = await supabase
        .from('crops')
        .insert({
          name: formData.name,
          quantity: formData.quantity,
          price: parseFloat(formData.price),
          quality: formData.quality,
          description: formData.description || `Fresh ${formData.name} available for purchase.`,
          image_url: imageUrl,
          seller_id: currentUser.id
        })
        .select();
      
      if (error) throw error;
      
      if (data && data[0]) {
        // Add to local state with seller data
        const cropWithSeller = {
          ...data[0],
          seller: {
            id: currentUser.id,
            full_name: currentUser.user_metadata?.full_name || "Anonymous",
            location: currentUser.user_metadata?.location || "Unknown",
            phone: currentUser.user_metadata?.phone
          }
        };
        
        setCrops(prev => [cropWithSeller, ...prev]);
        toast.success("Crop listed successfully");
        toggleListForm();
      }
    } catch (error) {
      console.error("Error creating crop listing:", error);
      toast.error("Failed to list crop. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const openPurchaseModal = (crop: Crop) => {
    if (!currentUser) {
      toast.error("Please login to purchase crops", {
        description: "You need to be logged in to contact the seller.",
        action: {
          label: "Login",
          onClick: () => window.location.href = "/login"
        }
      });
      return;
    }
    
    setSelectedCrop(crop);
    setIsPurchaseModalOpen(true);
  };
  
  const handlePurchaseRequest = async () => {
    if (!currentUser || !selectedCrop) return;
    
    try {
      setIsSubmitting(true);
      
      // Create purchase request
      const { error } = await supabase
        .from('crop_purchases')
        .insert({
          buyer_id: currentUser.id,
          seller_id: selectedCrop.seller_id,
          crop_id: selectedCrop.id,
          status: 'pending',
          quantity_requested: selectedCrop.quantity,
          total_price: selectedCrop.price
        });
      
      if (error) throw error;
      
      toast.success("Purchase request sent successfully", {
        description: `Your request has been sent to ${selectedCrop.seller.full_name}. They will contact you soon.`
      });
      
      setIsPurchaseModalOpen(false);
    } catch (error) {
      console.error("Error creating purchase request:", error);
      toast.error("Failed to send purchase request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const deleteCrop = async (cropId: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('crops')
        .delete()
        .eq('id', cropId);
      
      if (error) throw error;
      
      setCrops(prev => prev.filter(crop => crop.id !== cropId));
      toast.success("Crop listing deleted successfully");
    } catch (error) {
      console.error("Error deleting crop listing:", error);
      toast.error("Failed to delete listing. Please try again.");
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
              Buy and Sell Farm Produce
            </h1>
            <p className="text-muted-foreground mb-8 animate-fade-in" style={{animationDelay: "200ms"}}>
              Connect directly with buyers and sellers in your area. No middlemen, fair prices, and quality assurance.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 animate-fade-in" style={{animationDelay: "400ms"}}>
              <div className="bg-white rounded-full p-1 shadow-sm flex">
                <button 
                  className={`px-6 py-2 rounded-full transition-colors ${
                    isBuying ? 'bg-primary text-white' : 'bg-transparent text-foreground'
                  }`}
                  onClick={() => setIsBuying(true)}
                >
                  Buy Produce
                </button>
                <button 
                  className={`px-6 py-2 rounded-full transition-colors ${
                    !isBuying ? 'bg-primary text-white' : 'bg-transparent text-foreground'
                  }`}
                  onClick={() => setIsBuying(false)}
                >
                  Sell Produce
                </button>
              </div>
              
              {!isBuying && (
                <button onClick={toggleListForm} className="btn-vismay">
                  <Plus size={18} />
                  List Your Produce
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content Section */}
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
                onChange={handleSearch}
                placeholder={isBuying ? "Search crops or location..." : "Search your listings..."}
                className="input-vismay pl-10 w-full"
              />
            </div>
            
            {/* Filters */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button className="btn-outline py-2 text-sm w-full md:w-auto">
                <Filter size={16} />
                Filter Options
              </button>
              <button 
                onClick={() => {
                  setSearchQuery("");
                }}
                className="flex items-center gap-1 text-primary whitespace-nowrap"
              >
                <RefreshCw size={14} />
                <span className="text-sm">Reset</span>
              </button>
            </div>
          </div>
          
          {/* Results Count */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">
              {isBuying ? 'Available Crops for Purchase' : 'Your Crop Listings'}
            </h2>
            <p className="text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredCrops.length}</span> {isBuying ? 'crops for purchase' : 'of your listings'}
            </p>
          </div>
          
          {/* Loading State */}
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 size={40} className="mx-auto animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading crop listings...</p>
            </div>
          ) : (
            /* Crop Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCrops.length > 0 ? (
                filteredCrops.map((crop) => (
                  <div key={crop.id} className="vismay-card overflow-hidden flex flex-col h-full">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={crop.image_url} 
                        alt={crop.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                        ₹{crop.price.toLocaleString()}/quintal
                      </div>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold">{crop.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          crop.quality === 'Premium' ? 'bg-green-100 text-green-700' :
                          crop.quality === 'Standard' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {crop.quality}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2 flex-grow">
                        {crop.description}
                      </p>
                      
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Quantity:</span>
                        <span className="text-sm">{crop.quantity}</span>
                      </div>
                      
                      <div className="text-xs text-foreground/70 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Listed on:</span>
                          <span>{formatDate(crop.created_at)}</span>
                        </div>
                        
                        {isBuying && (
                          <>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="font-medium">Seller:</span> {crop.seller.full_name}
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Location:</span> {crop.seller.location}
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        {isBuying ? (
                          <button 
                            className="btn-vismay py-2 px-4 text-sm flex-1"
                            onClick={() => openPurchaseModal(crop)}
                          >
                            Contact Seller
                          </button>
                        ) : (
                          <button 
                            className="btn-vismay py-2 px-4 text-sm flex-1 bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600"
                            onClick={() => deleteCrop(crop.id)}
                          >
                            Remove Listing
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No crops found</h3>
                  {isBuying ? (
                    <p className="text-muted-foreground mb-6">
                      There are no crops available for purchase right now.
                    </p>
                  ) : (
                    <>
                      <p className="text-muted-foreground mb-6">
                        You haven't listed any crops for sale yet.
                      </p>
                      <button 
                        onClick={toggleListForm}
                        className="btn-vismay mx-auto"
                      >
                        <Plus size={18} />
                        List Your Produce
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* List Crop Modal Form */}
      {isListOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">List Your Produce</h2>
              <button 
                onClick={toggleListForm}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={24} />
              </button>
            </div>
            
            <p className="text-muted-foreground mb-6">
              Fill out the details below to list your crops for sale
            </p>
            
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="cropName" className="block text-sm font-medium mb-2">
                  Crop Name*
                </label>
                <input
                  type="text"
                  id="cropName"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-vismay w-full"
                  placeholder="e.g. Wheat, Rice, Potatoes"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="cropQuantity" className="block text-sm font-medium mb-2">
                  Quantity*
                </label>
                <input
                  type="text"
                  id="cropQuantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="input-vismay w-full"
                  placeholder="e.g. 2 Tonnes, 500 kg"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="cropPrice" className="block text-sm font-medium mb-2">
                  Price per Quintal (₹)*
                </label>
                <input
                  type="number"
                  id="cropPrice"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="input-vismay w-full"
                  placeholder="Enter price in rupees"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="cropQuality" className="block text-sm font-medium mb-2">
                  Quality*
                </label>
                <select
                  id="cropQuality"
                  value={formData.quality}
                  onChange={handleInputChange}
                  className="input-vismay w-full"
                  required
                >
                  <option value="Premium">Premium</option>
                  <option value="Standard">Standard</option>
                  <option value="Economy">Economy</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="cropDescription" className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="cropDescription"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input-vismay w-full"
                  placeholder="Describe your produce, harvesting date, etc."
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="cropImage_url" className="block text-sm font-medium mb-2">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  id="cropImage_url"
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
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-vismay flex-1"
                  onClick={handleSubmitCrop}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "List Produce"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Purchase Modal */}
      {isPurchaseModalOpen && selectedCrop && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-scale-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Purchase Request</h2>
              <button 
                onClick={() => setIsPurchaseModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={selectedCrop.image_url} 
                  alt={selectedCrop.name} 
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold">{selectedCrop.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedCrop.quantity} • ₹{selectedCrop.price.toLocaleString()}/quintal
                  </p>
                </div>
              </div>
              
              <div className="bg-accent/30 p-4 rounded-lg mb-4">
                <h4 className="font-medium mb-2">Seller Information</h4>
                <p className="text-sm"><span className="font-medium">Name:</span> {selectedCrop.seller.full_name}</p>
                <p className="text-sm"><span className="font-medium">Location:</span> {selectedCrop.seller.location}</p>
                {selectedCrop.seller.phone && (
                  <p className="text-sm"><span className="font-medium">Phone:</span> {selectedCrop.seller.phone}</p>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                By sending a purchase request, the seller will be notified of your interest. 
                They may contact you directly to discuss further details including delivery and payment.
              </p>
              
              <div className="border-t border-border pt-4 flex justify-end gap-3">
                <button
                  onClick={() => setIsPurchaseModalOpen(false)}
                  className="btn-outline py-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePurchaseRequest}
                  className="btn-vismay py-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Send Purchase Request"
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

export default Sell;
