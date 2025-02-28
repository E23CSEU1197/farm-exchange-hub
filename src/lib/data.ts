
// Mock data for the application
// This would be replaced with actual backend API calls

// Machine data for barter
export const machines = [
  {
    id: "m1",
    name: "Mini Tractor",
    description: "Compact mini tractor suitable for small farms. Well-maintained with minor wear and tear.",
    value: 85000,
    condition: "Good",
    image: "https://images.unsplash.com/photo-1605002123921-34b325e2a20b?q=80&w=1000&auto=format&fit=crop",
    owner: {
      name: "Rajesh Singh",
      location: "Pune, Maharashtra"
    }
  },
  {
    id: "m2",
    name: "Seed Drill",
    description: "Modern seed drill with precise seed placement. Used for only two seasons.",
    value: 45000,
    condition: "Good",
    image: "https://images.unsplash.com/photo-1590685974251-9d6516e0db51?q=80&w=1000&auto=format&fit=crop",
    owner: {
      name: "Anand Patel",
      location: "Ahmedabad, Gujarat"
    }
  },
  {
    id: "m3",
    name: "Harrow Disc",
    description: "Heavy-duty harrow disc for soil preparation. Brand new, never used in field.",
    value: 30000,
    condition: "New",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop",
    owner: {
      name: "Manjinder Singh",
      location: "Amritsar, Punjab"
    }
  },
  {
    id: "m4",
    name: "Water Pump Set",
    description: "High-capacity water pump for irrigation. Used but well-maintained.",
    value: 15000,
    condition: "Used",
    image: "https://images.unsplash.com/photo-1585400633954-8c762895d315?q=80&w=1000&auto=format&fit=crop",
    owner: {
      name: "Venkatesh Reddy",
      location: "Hyderabad, Telangana"
    }
  },
  {
    id: "m5",
    name: "Rotavator",
    description: "Efficient rotavator for soil tilling. Perfect for preparing seedbeds.",
    value: 70000,
    condition: "Good",
    image: "https://images.unsplash.com/photo-1536345122291-9459b741fdad?q=80&w=1000&auto=format&fit=crop",
    owner: {
      name: "Pramod Kumar",
      location: "Lucknow, Uttar Pradesh"
    }
  },
  {
    id: "m6",
    name: "Pesticide Sprayer",
    description: "Mounted pesticide sprayer with 500L tank. Great for large field applications.",
    value: 25000,
    condition: "Good",
    image: "https://images.unsplash.com/photo-1592982537447-29baac5f5203?q=80&w=1000&auto=format&fit=crop",
    owner: {
      name: "Gopal Sharma",
      location: "Jaipur, Rajasthan"
    }
  }
];

// Crop listings for sell page
export const crops = [
  {
    id: "c1",
    name: "Organic Wheat",
    quantity: "2 Tonnes",
    price: 3500, // per quintal
    quality: "Premium",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1c0cf4b7e?q=80&w=1000&auto=format&fit=crop",
    seller: {
      name: "Harpreet Singh",
      location: "Bathinda, Punjab"
    }
  },
  {
    id: "c2",
    name: "Basmati Rice",
    quantity: "1.5 Tonnes",
    price: 4200, // per quintal
    quality: "Premium",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e8ac?q=80&w=1000&auto=format&fit=crop",
    seller: {
      name: "Ravi Kumar",
      location: "Karnal, Haryana"
    }
  },
  {
    id: "c3",
    name: "Yellow Mustard",
    quantity: "800 kg",
    price: 5500, // per quintal
    quality: "Standard",
    image: "https://images.unsplash.com/photo-1552663651-2e4250e6c7c8?q=80&w=1000&auto=format&fit=crop",
    seller: {
      name: "Bhupendra Yadav",
      location: "Alwar, Rajasthan"
    }
  }
];

// Donation categories
export const donationCategories = [
  {
    id: "d1",
    name: "Farmer Education",
    description: "Support education programs for farmers to learn modern sustainable farming techniques.",
    image: "https://images.unsplash.com/photo-1510295892303-a94d83c5a85b?q=80&w=1000&auto=format&fit=crop",
    goalAmount: 500000,
    raisedAmount: 125000
  },
  {
    id: "d2",
    name: "Debt Relief",
    description: "Help farmers overcome debt burdens due to crop failures and market fluctuations.",
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1000&auto=format&fit=crop",
    goalAmount: 1000000,
    raisedAmount: 450000
  },
  {
    id: "d3",
    name: "Children's Education",
    description: "Support education for farmers' children to help break the cycle of poverty.",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1000&auto=format&fit=crop",
    goalAmount: 300000,
    raisedAmount: 120000
  },
  {
    id: "d4",
    name: "Sustainable Equipment",
    description: "Fund modern farming equipment that is environmentally sustainable and efficient.",
    image: "https://images.unsplash.com/photo-1565362796208-3a2c7c1cdb22?q=80&w=1000&auto=format&fit=crop",
    goalAmount: 750000,
    raisedAmount: 200000
  }
];

// AI Assistant recommendations
export const aiRecommendations = [
  "Based on your farm size, a Mini Tractor would be more efficient than a full-sized one.",
  "Consider the Seed Drill for precision sowing, which reduces seed waste by 30%.",
  "The Water Pump Set would address your irrigation needs during dry periods.",
  "A combination of Harrow Disc and Rotavator would prepare your soil optimally for wheat cultivation."
];
