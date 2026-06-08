export const leads = [
  { id: "L001", name: "Mohammed Al-Rashid", phone: "+971 50 234 5678", language: "Arabic", flag: "🇦🇪", status: "calling", propertyInterest: "3BR Apartment, Downtown", investType: "investment", source: "Instagram", assignedAgent: "AI Agent Alpha", time: "2 min ago", budget: "AED 2.8M" },
  { id: "L002", name: "Priya Sharma", phone: "+91 98765 43210", language: "Hindi", flag: "🇮🇳", status: "qualified", propertyInterest: "2BR Villa, Palm Jumeirah", investType: "live-in", source: "Meta", assignedAgent: "AI Agent Beta", time: "18 min ago", budget: "AED 4.2M" },
  { id: "L003", name: "James Morrison", phone: "+44 7700 900123", language: "English", flag: "🇬🇧", status: "appointed", propertyInterest: "Studio, Business Bay", investType: "investment", source: "Instagram", assignedAgent: "AI Agent Alpha", time: "1 hr ago", budget: "AED 950K" },
  { id: "L004", name: "Fatima Al-Zahra", phone: "+971 55 876 5432", language: "Arabic", flag: "🇦🇪", status: "new", propertyInterest: "4BR Penthouse, Marina", investType: "live-in", source: "Meta", assignedAgent: "Unassigned", time: "3 min ago", budget: "AED 8.5M" },
  { id: "L005", name: "Chen Wei", phone: "+86 138 0000 1234", language: "Mandarin", flag: "🇨🇳", status: "called", propertyInterest: "2BR Apartment, JVC", investType: "investment", source: "Instagram", assignedAgent: "AI Agent Gamma", time: "45 min ago", budget: "AED 1.6M" },
  { id: "L006", name: "Sarah Al-Mansoori", phone: "+971 56 345 6789", language: "Arabic", flag: "🇦🇪", status: "closed", propertyInterest: "5BR Villa, Emirates Hills", investType: "live-in", source: "Meta", assignedAgent: "Human: Ahmed K.", time: "2 days ago", budget: "AED 15M" },
  { id: "L007", name: "Nikolai Petrov", phone: "+7 916 123 4567", language: "Russian", flag: "🇷🇺", status: "qualified", propertyInterest: "3BR Apartment, DIFC", investType: "investment", source: "Instagram", assignedAgent: "AI Agent Beta", time: "3 hrs ago", budget: "AED 3.1M" },
  { id: "L008", name: "Aisha Bello", phone: "+234 803 456 7890", language: "English", flag: "🇳🇬", status: "called", propertyInterest: "1BR Apartment, Dubai South", investType: "investment", source: "Meta", assignedAgent: "AI Agent Alpha", time: "6 hrs ago", budget: "AED 750K" },
];

export const properties = [
  {
    id: "P001", developer: "Emaar Properties", name: "Burj Crown Residences", location: "Downtown Dubai", type: "Apartment", bedrooms: 3, price: 2850000, currency: "AED", roi: 7.2, rentalYield: 6.8, image: "downtown", tags: ["sale", "rent"], completion: "Ready", sqft: 1820, description: "Iconic tower with panoramic Burj Khalifa views. Premium finishes throughout.", amenities: ["Pool", "Gym", "Concierge", "Valet"], floors: "42-54"
  },
  {
    id: "P002", developer: "Nakheel", name: "Palm Beach Towers", location: "Palm Jumeirah", type: "Villa", bedrooms: 4, price: 6200000, currency: "AED", roi: 5.9, rentalYield: 5.4, image: "palm", tags: ["sale"], completion: "Ready", sqft: 3400, description: "Beachfront villas with private pool and direct beach access. Limited collection.", amenities: ["Private Pool", "Beach Access", "Gym", "Smart Home"], floors: "G+2"
  },
  {
    id: "P003", developer: "DAMAC Properties", name: "DAMAC Hills 2", location: "Dubailand", type: "Townhouse", bedrooms: 3, price: 1450000, currency: "AED", roi: 8.1, rentalYield: 7.9, image: "hills", tags: ["sale", "rent"], completion: "Q2 2025", sqft: 1650, description: "Master-planned community with championship golf course and lush greenery.", amenities: ["Golf Course", "Pool", "Cycling Tracks", "Community Center"], floors: "G+1"
  },
  {
    id: "P004", developer: "Sobha Realty", name: "Sobha Seahaven Tower", location: "Dubai Harbour", type: "Apartment", bedrooms: 2, price: 3100000, currency: "AED", roi: 6.5, rentalYield: 6.1, image: "harbour", tags: ["sale"], completion: "Q4 2025", sqft: 1340, description: "Ultra-luxury marina living with yacht club access. Sobha signature quality.", amenities: ["Yacht Club", "Infinity Pool", "Fine Dining", "Spa"], floors: "35-68"
  },
  {
    id: "P005", developer: "Meraas", name: "Port de La Mer", location: "La Mer, Jumeirah", type: "Apartment", bedrooms: 1, price: 1850000, currency: "AED", roi: 7.8, rentalYield: 7.5, image: "lamer", tags: ["sale", "rent"], completion: "Ready", sqft: 980, description: "Mediterranean-inspired waterfront community. Walking distance to beach.", amenities: ["Beach Access", "Marina", "Retail & Dining", "Pool"], floors: "5-12"
  },
  {
    id: "P006", developer: "Emaar Properties", name: "The Valley Townhouses", location: "Dubai-Al Ain Road", type: "Townhouse", bedrooms: 4, price: 2100000, currency: "AED", roi: 8.4, rentalYield: 8.1, image: "valley", tags: ["sale"], completion: "Q3 2026", sqft: 2650, description: "Family-friendly gated community with extensive parks and kids' play areas.", amenities: ["Park", "Schools Nearby", "Swimming Pool", "Kids Play Area"], floors: "G+2"
  },
];

export const appointments = [
  { id: "A001", lead: "James Morrison", type: "video", agent: "Ahmed Khalil", date: "2026-06-07", time: "14:00", property: "Studio, Business Bay", status: "confirmed", notes: "Follow-up on mortgage pre-approval" },
  { id: "A002", lead: "Priya Sharma", type: "site-visit", agent: "Layla Hassan", date: "2026-06-07", time: "16:30", property: "2BR Villa, Palm Jumeirah", status: "confirmed", notes: "Bring school distance report" },
  { id: "A003", lead: "Nikolai Petrov", type: "phone", agent: "AI Agent Beta", date: "2026-06-08", time: "10:00", property: "3BR Apartment, DIFC", status: "scheduled", notes: "Discuss payment plan options" },
  { id: "A004", lead: "Chen Wei", type: "video", agent: "Ahmed Khalil", date: "2026-06-09", time: "09:00", property: "2BR Apartment, JVC", status: "scheduled", notes: "Mandarin interpreter required" },
  { id: "A005", lead: "Fatima Al-Zahra", type: "site-visit", agent: "Layla Hassan", date: "2026-06-10", time: "11:00", property: "4BR Penthouse, Marina", status: "pending", notes: "High-priority: AED 8.5M budget" },
];

export const developers = [
  { id: "D001", name: "Emaar Properties", logo: "E", properties: 24, activeListings: 18, totalValue: "AED 245M", onedrive: true, lastSync: "10 min ago" },
  { id: "D002", name: "Nakheel", logo: "N", properties: 16, activeListings: 11, totalValue: "AED 189M", onedrive: true, lastSync: "1 hr ago" },
  { id: "D003", name: "DAMAC Properties", logo: "D", properties: 31, activeListings: 22, totalValue: "AED 312M", onedrive: true, lastSync: "2 hrs ago" },
  { id: "D004", name: "Sobha Realty", logo: "S", properties: 12, activeListings: 9, totalValue: "AED 156M", onedrive: false, lastSync: "Manual" },
  { id: "D005", name: "Meraas", logo: "M", properties: 8, activeListings: 6, totalValue: "AED 98M", onedrive: true, lastSync: "30 min ago" },
];

export const callTranscript = [
  { role: "agent", text: "مرحباً، معكم وكيل ذكاء اصطناعي من ريحان العقارات. هل تحدثت مع أحد منا من قبل؟", time: "00:05", lang: "Arabic" },
  { role: "lead", text: "لا، هذه أول مرة. رأيت إعلانكم على انستغرام.", time: "00:12", lang: "Arabic" },
  { role: "agent", text: "رائع! شكراً لاهتمامك. لاحظت اهتمامك بالشقق في وسط دبي. هل هذا للسكن أم للاستثمار؟", time: "00:20", lang: "Arabic" },
  { role: "lead", text: "للاستثمار في الغالب، لكن قد نسكن فيها لاحقاً.", time: "00:31", lang: "Arabic" },
  { role: "agent", text: "ممتاز! عندي بالضبط ما تبحث عنه. هل عندك أطفال سيلتحقون بالمدارس هناك؟", time: "00:45", lang: "Arabic" },
  { role: "lead", text: "نعم، طفلان. الأول في الصف الخامس والثاني في رياض الأطفال.", time: "00:58", lang: "Arabic" },
  { role: "agent", text: "ممتاز، سأبحث الآن عن المدارس القريبة وأوقات التنقل الصباحية لك...", time: "01:15", lang: "Arabic" },
];

export const subAgentStatus = [
  { name: "School Mapper", status: "active", task: "Finding schools near Downtown Dubai", progress: 68 },
  { name: "Mortgage Calculator", status: "idle", task: "Waiting for budget confirmation", progress: 0 },
  { name: "Property Recommender", status: "active", task: "Filtering 3BR units under AED 3M", progress: 85 },
  { name: "WhatsApp Sender", status: "idle", task: "Ready to send brochures", progress: 0 },
  { name: "Calendar Scheduler", status: "idle", task: "Available for booking", progress: 0 },
];

export const customerProfile = {
  name: "Mohammed Al-Rashid",
  phone: "+971 50 234 5678",
  language: "Arabic",
  budget: "AED 2.5M - 3M",
  investType: "Investment + Possible Live-in",
  marital: "Married",
  kids: 2,
  kidsAges: [10, 4],
  currentSchool: "GEMS World Academy (suspected)",
  preferredArea: "Downtown / DIFC",
  mortgageNeeded: "~AED 1.8M (estimated)",
  callDuration: "01:32",
};
