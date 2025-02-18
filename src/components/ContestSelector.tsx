import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";

interface Contest {
  contest_name: string;
  created_at: string;
}

interface Props {
  contests: Contest[];
  selectedContest: string;
  setSelectedContest: (contest: string) => void;
  handleContestChange: (contest: string) => void;
  toTitleCase: (str: string) => string;
}

export default function ContestSelector({
  contests,
  selectedContest,
  setSelectedContest,
  handleContestChange,
  toTitleCase
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const visibleCards = 3;

  const filteredContests = contests.filter((contest) =>
    contest.contest_name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const currentContests = filteredContests.slice(startIndex, startIndex + visibleCards);

  const nextSlide = () => {
    if (startIndex + visibleCards < filteredContests.length && !isAnimating) {
      setSlideDirection("left");
      setIsAnimating(true);

      setTimeout(() => {
        setStartIndex(startIndex + visibleCards);
        setSlideDirection(null);
        setIsAnimating(false);
      }, 300); // Match the animation duration
    }
  };

  const prevSlide = () => {
    if (startIndex > 0 && !isAnimating) {
      setSlideDirection("right");
      setIsAnimating(true);

      setTimeout(() => {
        setStartIndex(Math.max(0, startIndex - visibleCards));
        setSlideDirection(null);
        setIsAnimating(false);
      }, 300); // Match the animation duration
    }
  };

  useEffect(() => {
    // Reset animation state when search changes
    setIsAnimating(false);
    setSlideDirection(null);
  }, [searchTerm]);

  // Get animation classes based on current state
  const getAnimationClass = () => {
    if (!slideDirection) return "";

    if (slideDirection === "left") {
      return "animate-slide-left";
    } else {
      return "animate-slide-right";
    }
  };

  return (
    <div className="p-6 text-center">
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <span className="text-gray-700 font-medium">Contest List</span>
      </button>

      {/* Add animation keyframes */}
      <style jsx global>{`
        @keyframes slideLeft {
          0% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(-100%); opacity: 0; }
        }
        @keyframes slideRight {
          0% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        @keyframes slideInLeft {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          0% { transform: translateX(-100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-left {
          animation: slideLeft 300ms ease-in-out forwards;
        }
        .animate-slide-right {
          animation: slideRight 300ms ease-in-out forwards;
        }
        .animate-slide-in-left {
          animation: slideInLeft 300ms ease-in-out forwards;
        }
        .animate-slide-in-right {
          animation: slideInRight 300ms ease-in-out forwards;
        }
      `}</style>

      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 transition-all duration-300">
          <div className="bg-gray-400 dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-4xl relative transform transition-all duration-300 scale-100 opacity-100">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-4 -right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-110 group"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 transition-colors duration-300" />
              <Input
                type="text"
                placeholder="Search contests..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setStartIndex(0);
                }}
                className="pl-12 py-4 text-lg w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
              />
            </div>

            {/* Contest Cards Container */}
            <div className="flex items-center justify-between gap-6">
              {/* Previous Button */}
              <button
                onClick={prevSlide}
                disabled={startIndex === 0 || isAnimating}
                className={`p-4 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-110 ${(startIndex === 0 || isAnimating) ? "opacity-50 cursor-not-allowed" : "shadow-lg hover:shadow-xl"
                  }`}
              >
                <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-gray-200" />
              </button>

              {/* Cards */}
              <div className="flex justify-center gap-6 overflow-hidden p-4 relative w-full"
                ref={cardsContainerRef}>
                <div className={`flex justify-center gap-6 w-full ${getAnimationClass()}`}>
                  {currentContests.map((contest, index) => (
                    <Card
                      key={index}
                      onClick={() => {
                        setSelectedContest(contest.contest_name);
                        handleContestChange(contest.contest_name);
                      }}
                      className={`cursor-pointer w-52 h-40 transition-all duration-300 transform hover:scale-105 
                      ${selectedContest === contest.contest_name
                          ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white hover:shadow-2xl hover:shadow-blue-500/50 border-none"
                          : "bg-white dark:bg-gray-800 hover:shadow-xl border border-gray-200 dark:border-gray-700"
                        }`}
                    >
                      <CardHeader className="text-center p-4">
                        <CardTitle
                          className={`text-xl font-bold ${selectedContest === contest.contest_name
                            ? "text-white"
                            : "text-gray-800 dark:text-gray-200"
                            }`}
                        >
                          {toTitleCase(contest.contest_name.replace(/_/g, " "))}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <div className={`text-md mt-2 ${selectedContest === contest.contest_name
                          ? "text-gray-100"
                          : "text-gray-600 dark:text-gray-400"
                          }`}>
                          {new Date(contest.created_at).toLocaleDateString("en-GB")}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={nextSlide}
                disabled={startIndex + visibleCards >= filteredContests.length || isAnimating}
                className={`p-4 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-110 ${(startIndex + visibleCards >= filteredContests.length || isAnimating) ? "opacity-50 cursor-not-allowed" : "shadow-lg hover:shadow-xl"
                  }`}
              >
                <ChevronRight className="w-6 h-6 text-gray-800 dark:text-gray-200" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
