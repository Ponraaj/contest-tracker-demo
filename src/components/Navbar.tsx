import { useState } from "react";
import { Contest } from "@/lib/types";
import { Menu, Search } from "lucide-react";

interface SidebarProps {
  contests: Contest[];
  selectedContest: string;
  setSelectedContest: (contest: string) => void;
  handleContestChange: (contest: string) => void;
  toTitleCase: (str: string) => string;
}

export default function Navbar({ 
  contests, 
  selectedContest, 
  setSelectedContest, 
  handleContestChange, 
  toTitleCase 
}: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const getContestInitial = (contestName: string) => {
    const match = contestName.match(/^(\w).*?(\d+)$/);
    return match ? match[1] + match[2] : 'N/A';
  };

  const filteredContests = contests.filter(contest =>
    contest.contest_name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => {
        setIsExpanded(false);
        setShowSearch(false);
        setSearchTerm("");
      }}
    >
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white transition-all duration-300 ${
          isExpanded ? 'w-56' : 'w-16'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4">
          {!isExpanded ? (
            <Menu className="w-6 h-6 text-white hover:text-gray-400 transition" />
          ) : (
            <>
              {!showSearch ? (
                <>
                  <h2 className="text-xl font-semibold text-gray-200 text-center w-full">Contests</h2>
                  <button
                    onClick={() => setShowSearch(true)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="w-full">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search contests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      autoFocus
                      className="w-full pl-8 pr-4 py-1 bg-gray-800 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onBlur={() => {
                        if (!searchTerm) {
                          setShowSearch(false);
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Contest List */}
        <div className="mt-4">
          {filteredContests.map((contest, index) => (
            <div
              key={index}
              className={`relative group cursor-pointer transition-all ${
                selectedContest === contest.contest_name
                  ? 'bg-gray-500'
                  : 'hover:bg-gray-700'
              }`}
              onClick={() => {
                setSelectedContest(contest.contest_name);
                handleContestChange(contest.contest_name);
              }}
            >
              <div className={`flex items-center p-4 ${
                !isExpanded ? 'justify-center' : ''
              }`}>
                {/* Contest Initial with Number */}
                {!isExpanded &&
                <div className="w-10 h-10 flex items-center justify-center font-semibold text-base flex-shrink-0">
                  {getContestInitial(toTitleCase(contest.contest_name))}
                </div>
                }
                
                {/* Contest Details */}
                <div className={`ml-3 whitespace-nowrap overflow-hidden transition-opacity duration-200 ${
                  isExpanded ? 'opacity-100' : 'opacity-0 w-0'
                }`}>
                  <div className="font-medium text-center w-full">
                    {toTitleCase(contest.contest_name.replace(/_/g, " "))}
                  </div>
                  <div className="text-sm text-gray-400 text-center w-full">
                    {new Date(contest.created_at).toLocaleDateString("en-GB")}
                  </div>
                </div>
              </div>

              {/* Tooltip for collapsed state */}
              {!isExpanded && (
                <div className="absolute left-16 top-0 z-50 whitespace-nowrap bg-gray-800 px-4 py-2 rounded-md ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="font-medium">
                    {toTitleCase(contest.contest_name.replace(/_/g, " "))}
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(contest.created_at).toLocaleDateString("en-GB")}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}