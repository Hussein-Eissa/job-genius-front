
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import SettingsSidebar from "@/components/settings/SettingsSidebar";
import { Link } from "react-router-dom";
import { useProfileStore } from "@/reducers/ProfileReducerStore";
import { Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AnnouncedJobsPage = () => {
    const { profile, fetchMeProfile } = useProfileStore();

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
        fetchMeProfile();
    }, []);

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


    const [jobs, setJobs] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch("https://jobgenius.bsite.net/api/JobListing/me", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then((res) => res.json())
            .then((data) => setJobs(data.$values))
            .catch((err) => console.error("Failed to fetch jobs", err));
    }, [jobs]);

    const handleDeleteJob = (jobId: string) => {
        fetch(`https://jobgenius.bsite.net/api/JobListing/${jobId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then((res) => {
            if (res.ok) {
                setJobs(jobs.filter(job => job.jobID !== jobId));
                toast({
                    title: "Job removed",
                    description: "Job has been successfully removed from your announced jobs.",
                });
            } else {
                toast({
                    title: "Error",
                    description: "Failed to remove job. Please try again.",
                    variant: "destructive",
                });
            }
        }).catch((err) => {
            console.error("Failed to delete job", err);
            toast({
                title: "Error",
                description: "Failed to remove job. Please try again.",
                variant: "destructive",
            });
        });
    }

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-grow flex">
                <SettingsSidebar />
                <main className="flex-grow px-8 py-6">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-bold">My Jobs Announcement</h1>
                        <Button variant="outline" className="bg-white" asChild>
                        <Link to="/">Back to homepage</Link>
                        </Button>
                    </div>
                    
                    <div className="mb-8 flex items-center justify-between">
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold mb-2">Hello, {profile?.fullname.split(" ")[0]}!</h2>
                            <p className="text-gray-600">Here are the jobs you Announced from {formatRange(startDate, endDate)}.</p>
                        </div>
                        
                        <div className="flex flex-col items-end">
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
                                    className="absolute top-[160px] bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10 flex gap-2"
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
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        {jobs.map((job) => (
                            <div
                                key={job.jobID}
                                className="bg-white p-6 rounded-xl shadow border border-gray-200 flex justify-between items-center"
                                >
                                <div>
                                    <h3 className="text-lg font-semibold">{job.title}</h3>
                                    <p className="text-gray-500">{job.company} • {job.city}, {job.country}</p>
                                    <div className="flex gap-2 mt-2">
                                        <span className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full">Full-Time</span>
                                        {job.categories.$values.map((cat, idx) => (
                                            <span
                                            key={idx}
                                            className="text-sm px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full"
                                            >
                                            {cat}
                                            </span>
                                        ))}
                                        {job.skills.$values.map((skill, idx) => (
                                            <span
                                            key={idx}
                                            className="text-sm px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full"
                                            >
                                            {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="flex flex-col items-center gap-4">
                                    <div className="flex justify-between items-center w-full">
                                        <button className="bg-blue-900 text-white px-7 py-2 rounded-lg">View</button>
                                        <button className="text-black-600 hover:text-red-500" onClick={() => handleDeleteJob(job.jobID)}>
                                            <Trash2 />
                                        </button>
                                    </div>
                                    <div className="relative w-full w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="absolute left-0 top-0 h-full bg-blue-600 rounded-full"
                                            style={{
                                                width: `${Math.min(
                                                100,
                                                Math.round((job.applicationSent / job.capacity) * 100)
                                                )}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {job.applicationSent} applied for this Job
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AnnouncedJobsPage;
