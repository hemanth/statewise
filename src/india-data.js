const rows = [
  ["AP", "Andhra Pradesh", "AP", "Amaravati", "South", "Rice Bowl of India", 1956],
  ["AR", "Arunachal Pradesh", "AR", "Itanagar", "Northeast", "Land of Dawn-Lit Mountains", 1987],
  ["AS", "Assam", "AS", "Dispur", "Northeast", "Land of Red River and Blue Hills", 1950],
  ["BR", "Bihar", "BR", "Patna", "East", "Land of Viharas & Enlightenment", 1950],
  ["CG", "Chhattisgarh", "CG", "Raipur", "Central", "Rice Bowl of Central India", 2000],
  ["GA", "Goa", "GA", "Panaji", "West", "Pearl of the Orient", 1987],
  ["GJ", "Gujarat", "GJ", "Gandhinagar", "West", "Land of the Legends", 1960],
  ["HR", "Haryana", "HR", "Chandigarh", "North", "Breadbasket of India", 1966],
  ["HP", "Himachal Pradesh", "HP", "Shimla", "North", "Land of the Gods", 1971],
  ["JH", "Jharkhand", "JH", "Ranchi", "East", "Land of Forests", 2000],
  ["KA", "Karnataka", "KA", "Bengaluru", "South", "Cradle of Indian Tech", 1956],
  ["KL", "Kerala", "KL", "Thiruvananthapuram", "South", "God’s Own Country", 1956],
  ["MP", "Madhya Pradesh", "MP", "Bhopal", "Central", "Heart of India", 1956],
  ["MH", "Maharashtra", "MH", "Mumbai", "West", "Gateway of India", 1960],
  ["MN", "Manipur", "MN", "Imphal", "Northeast", "Jewel of India", 1972],
  ["ML", "Meghalaya", "ML", "Shillong", "Northeast", "Abode of Clouds", 1972],
  ["MZ", "Mizoram", "MZ", "Aizawl", "Northeast", "Land of the Hill People", 1987],
  ["NL", "Nagaland", "NL", "Kohima", "Northeast", "Land of Festivals", 1963],
  ["OD", "Odisha", "OD", "Bhubaneswar", "East", "Soul of India", 1950],
  ["PB", "Punjab", "PB", "Chandigarh", "North", "Land of Five Rivers", 1966],
  ["RJ", "Rajasthan", "RJ", "Jaipur", "West", "Land of Kings", 1950],
  ["SK", "Sikkim", "SK", "Gangtok", "Northeast", "Valley of Rice", 1975],
  ["TN", "Tamil Nadu", "TN", "Chennai", "South", "Land of Temples", 1950],
  ["TG", "Telangana", "TG", "Hyderabad", "South", "Seed Bowl of India", 2014],
  ["TR", "Tripura", "TR", "Agartala", "Northeast", "Land of Cane and Bamboo", 1972],
  ["UP", "Uttar Pradesh", "UP", "Lucknow", "North", "Heartland of India", 1950],
  ["UK", "Uttarakhand", "UK", "Dehradun", "North", "Land of the Sages", 2000],
  ["WB", "West Bengal", "WB", "Kolkata", "East", "Cultural Capital of India", 1950],
  ["AN", "Andaman and Nicobar Islands", "AN", "Port Blair", "South", "Emerald Islands", 1956],
  ["CH", "Chandigarh", "CH", "Chandigarh", "North", "The Beautiful City", 1966],
  ["DH", "Dadra and Nagar Haveli and Daman and Diu", "DH", "Daman", "West", "Portuguese Heritage Coast", 2020],
  ["DL", "Delhi", "DL", "New Delhi", "North", "Heart of the Republic", 1956],
  ["JK", "Jammu and Kashmir", "JK", "Srinagar", "North", "Paradise on Earth", 2019],
  ["LA", "Ladakh", "LA", "Leh", "North", "Land of High Passes", 2019],
  ["LD", "Lakshadweep", "LD", "Kavaratti", "South", "Coral Paradise", 1956],
  ["PY", "Puducherry", "PY", "Puducherry", "South", "French Riviera of the East", 1962],
];

export const states = rows.map(
  ([id, name, abbr, capital, region, nickname, year]) => ({
    id,
    name,
    abbr,
    capital,
    region,
    nickname,
    year,
  }),
);

export const regions = ["North", "South", "West", "East", "Central", "Northeast"];

export const displayRegion = (s) => s.region;

export const colors = {
  North: "#e3db98",
  South: "#9dc8a7",
  West: "#efc594",
  East: "#d3b8db",
  Central: "#f0b89e",
  Northeast: "#a8d5c8",
};

export const smallStates = ["DL", "CH", "GA", "PY", "DH", "SK", "LD"];

export const karnataka = {
  fact: "Karnataka is home to Bengaluru (India's Silicon Valley), the majestic Vijayanagara stone temples of Hampi, and the lush Western Ghats.",
  image:
    "https://images.unsplash.com/photo-1600100397608-f010f443b350?auto=format&fit=crop&w=1000&q=85",
};
