import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import SettingsSidebar from "@/components/settings/SettingsSidebar";
import { Link } from "react-router-dom";
import { useJobStore } from "@/reducers/JobListingReducerStore";

const SavedJobsPage = () => {
  const { savedJobs, fetchSavedJobs, deleteSavedJob } = useJobStore();

  function getLast7DaysRange() {
    const now = new Date();
    const endDate = new Date(now); 
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 6);
  
    const formatDate = (d) => d.toISOString().slice(0, 10);
  
    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    };
  }

  const { startDate: defaultStart, endDate: defaultEnd } = getLast7DaysRange();

    const [startDate, setStartDate] = useState(defaultStart);
    const [endDate, setEndDate] = useState(defaultEnd);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const datePickerRef = useRef<HTMLDivElement>(null);

  const formatRange = (start: string, end: string) => {
    const options = { month: "short", day: "numeric" } as const;
    const startFormatted = new Date(start).toLocaleDateString("en-US", options);
    const endFormatted = new Date(end).toLocaleDateString("en-US", options);
    return `${startFormatted} - ${endFormatted}`;
  };

  useEffect(() => {
    fetchSavedJobs();
  }, [fetchSavedJobs]);

  // اغلاق الـ datepicker لو ضغطت بره
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
    }
    if (showDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDatePicker]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex">
        <SettingsSidebar />
        <main className="flex-grow px-8 py-6">
          <h1 className="text-2xl font-semibold mb-6">My Applications</h1>
          <header className="flex flex-wrap gap-10 justify-between items-center bg-white max-md:px-5 relative">
            <section className="self-stretch my-auto min-w-60 max-md:max-w-full">
              <h2 className="text-2xl text-slate-800">
                <strong>Great job, Ahmed!</strong>
              </h2>
              <p className="mt-2 text-base font-medium leading-relaxed text-slate-500 max-md:max-w-full">
                Here are the jobs you bookmarked from {formatRange(startDate, endDate)}.
              </p>
            </section>

            <button
              className="flex justify-between items-center self-stretch px-4 py-3 text-base leading-relaxed bg-white rounded-2xl border border-solid border-[color:var(--Neutrals-20,#D6DDEB)] text-slate-800 w-[180px]"
              aria-label="Select date range"
              onClick={() => setShowDatePicker((prev) => !prev)}
            >
              <span className="self-stretch my-auto text-slate-800">
                {formatRange(startDate, endDate)}
              </span>
              <img
                src="https://cdn.builder.io/api/v1/image/assets/673e1fe91fa1413d9a4985e3f88c2e3d/324e14ea9c25eb7964c35162952a0c39afe25fa1?placeholderIfAbsent=true"
                className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
                alt="Calendar icon"
              />
            </button>

            {showDatePicker && (
              <div
                ref={datePickerRef}
                className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10 flex gap-2"
              >
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1"
                  aria-label="Start date"
                />
                <span className="self-center">-</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1"
                  aria-label="End date"
                />
              </div>
            )}
          </header>

          {savedJobs.length === 0 ? (
            <p>You have no saved jobs.</p>
          ) : (
            savedJobs.map((job) => (
              <div
                key={job.jobID}
                className="border rounded-md p-4 mb-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {/* Example SVG icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <h2 className="font-semibold text-lg">{job.title}</h2>
                      <p className="text-sm text-gray-500">
                        {job.company} · {job.city}, {job.country}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Button
                      onClick={() => deleteSavedJob(job.jobID)}
                      variant="destructive"
                      size="sm"
                    >
                      Remove
                    </Button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-medium">
                    {job.type}
                  </span>
                  {/* Categories */}
                  {Array.isArray(job.categories)
                    ? job.categories.map((category, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded border border-yellow-300 text-yellow-600 text-xs font-medium"
                        >
                          {category.name}
                        </span>
                      ))
                    : null}

                  {/* Skills */}
                  {Array.isArray(job.skills)
                    ? job.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded border border-purple-300 text-purple-600 text-xs font-medium"
                        >
                          {skill.name}
                        </span>
                      ))
                    : null}
                </div>

                <Link
                  to={`/job/${job.jobID}`}
                  className="inline-block mt-4 text-blue-600 hover:underline"
                >
                  Show Details
                </Link>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
};

export default SavedJobsPage;
