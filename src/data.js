const rows = [
  ["01", "Alabama", "AL", "Montgomery", "South", "Yellowhammer State", 1819],
  ["02", "Alaska", "AK", "Juneau", "West", "The Last Frontier", 1959],
  ["04", "Arizona", "AZ", "Phoenix", "Southwest", "Grand Canyon State", 1912],
  ["05", "Arkansas", "AR", "Little Rock", "South", "The Natural State", 1836],
  ["06", "California", "CA", "Sacramento", "West", "The Golden State", 1850],
  ["08", "Colorado", "CO", "Denver", "West", "Centennial State", 1876],
  [
    "09",
    "Connecticut",
    "CT",
    "Hartford",
    "Northeast",
    "Constitution State",
    1788,
  ],
  ["10", "Delaware", "DE", "Dover", "Northeast", "The First State", 1787],
  ["12", "Florida", "FL", "Tallahassee", "South", "Sunshine State", 1845],
  ["13", "Georgia", "GA", "Atlanta", "South", "Peach State", 1788],
  ["15", "Hawaii", "HI", "Honolulu", "West", "Aloha State", 1959],
  ["16", "Idaho", "ID", "Boise", "West", "Gem State", 1890],
  ["17", "Illinois", "IL", "Springfield", "Midwest", "Prairie State", 1818],
  ["18", "Indiana", "IN", "Indianapolis", "Midwest", "Hoosier State", 1816],
  ["19", "Iowa", "IA", "Des Moines", "Midwest", "Hawkeye State", 1846],
  ["20", "Kansas", "KS", "Topeka", "Midwest", "Sunflower State", 1861],
  ["21", "Kentucky", "KY", "Frankfort", "South", "Bluegrass State", 1792],
  ["22", "Louisiana", "LA", "Baton Rouge", "South", "Pelican State", 1812],
  ["23", "Maine", "ME", "Augusta", "Northeast", "Pine Tree State", 1820],
  ["24", "Maryland", "MD", "Annapolis", "Northeast", "Old Line State", 1788],
  ["25", "Massachusetts", "MA", "Boston", "Northeast", "Bay State", 1788],
  ["26", "Michigan", "MI", "Lansing", "Midwest", "Great Lakes State", 1837],
  ["27", "Minnesota", "MN", "Saint Paul", "Midwest", "North Star State", 1858],
  ["28", "Mississippi", "MS", "Jackson", "South", "Magnolia State", 1817],
  ["29", "Missouri", "MO", "Jefferson City", "Midwest", "Show-Me State", 1821],
  ["30", "Montana", "MT", "Helena", "West", "Treasure State", 1889],
  ["31", "Nebraska", "NE", "Lincoln", "Midwest", "Cornhusker State", 1867],
  ["32", "Nevada", "NV", "Carson City", "West", "Silver State", 1864],
  ["33", "New Hampshire", "NH", "Concord", "Northeast", "Granite State", 1788],
  ["34", "New Jersey", "NJ", "Trenton", "Northeast", "Garden State", 1787],
  [
    "35",
    "New Mexico",
    "NM",
    "Santa Fe",
    "Southwest",
    "Land of Enchantment",
    1912,
  ],
  ["36", "New York", "NY", "Albany", "Northeast", "Empire State", 1788],
  ["37", "North Carolina", "NC", "Raleigh", "South", "Tar Heel State", 1789],
  [
    "38",
    "North Dakota",
    "ND",
    "Bismarck",
    "Midwest",
    "Peace Garden State",
    1889,
  ],
  ["39", "Ohio", "OH", "Columbus", "Midwest", "Buckeye State", 1803],
  ["40", "Oklahoma", "OK", "Oklahoma City", "Southwest", "Sooner State", 1907],
  ["41", "Oregon", "OR", "Salem", "West", "Beaver State", 1859],
  [
    "42",
    "Pennsylvania",
    "PA",
    "Harrisburg",
    "Northeast",
    "Keystone State",
    1787,
  ],
  ["44", "Rhode Island", "RI", "Providence", "Northeast", "Ocean State", 1790],
  ["45", "South Carolina", "SC", "Columbia", "South", "Palmetto State", 1788],
  [
    "46",
    "South Dakota",
    "SD",
    "Pierre",
    "Midwest",
    "Mount Rushmore State",
    1889,
  ],
  ["47", "Tennessee", "TN", "Nashville", "South", "Volunteer State", 1796],
  ["48", "Texas", "TX", "Austin", "Southwest", "Lone Star State", 1845],
  ["49", "Utah", "UT", "Salt Lake City", "West", "Beehive State", 1896],
  [
    "50",
    "Vermont",
    "VT",
    "Montpelier",
    "Northeast",
    "Green Mountain State",
    1791,
  ],
  ["51", "Virginia", "VA", "Richmond", "South", "Old Dominion", 1788],
  ["53", "Washington", "WA", "Olympia", "West", "Evergreen State", 1889],
  ["54", "West Virginia", "WV", "Charleston", "South", "Mountain State", 1863],
  ["55", "Wisconsin", "WI", "Madison", "Midwest", "Badger State", 1848],
  ["56", "Wyoming", "WY", "Cheyenne", "West", "Equality State", 1890],
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
export const regions = [
  "West",
  "Southwest",
  "Midwest",
  "Southeast",
  "Northeast",
];
export const displayRegion = (s) =>
  s.region === "South" ? "Southeast" : s.region;
export const colors = {
  West: "#d4dda4",
  Southwest: "#efc594",
  Midwest: "#f3dc94",
  Southeast: "#ebbaa7",
  Northeast: "#bebfdc",
};
export const california = {
  fact: "California is home to both the highest point in the contiguous U.S. (Mount Whitney) and the lowest (Death Valley).",
  image:
    "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1000&q=85",
};
export function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
