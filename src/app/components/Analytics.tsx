import { useEffect, useState } from "react";
import { getSleepSessions } from "../utils/storage";
import { SleepSession } from "../types";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format, parseISO, startOfWeek, eachDayOfInterval, subDays } from "date-fns";

export function Analytics() {
  const [sessions, setSessions] = useState<SleepSession[]>([]);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("week");

  useEffect(() => {
    setSessions(getSleepSessions());
  }, []);

  const getFilteredSessions = () => {
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case "week":
        startDate = subDays(now, 7);
        break;
      case "month":
        startDate = subDays(now, 30);
        break;
      default:
        return sessions;
    }

    return sessions.filter((s) => new Date(s.bedtime) >= startDate);
  };

  const filteredSessions = getFilteredSessions().sort(
    (a, b) => new Date(a.bedtime).getTime() - new Date(b.bedtime).getTime()
  );

  // Prepare data for charts
  const durationData = filteredSessions.map((session) => ({
    date: format(parseISO(session.bedtime), "MMM d"),
    duration: (session.duration / 60).toFixed(1),
    quality: session.quality,
  }));

  const qualityDistribution = [
    { quality: "1 Star", count: filteredSessions.filter((s) => s.quality === 1).length },
    { quality: "2 Stars", count: filteredSessions.filter((s) => s.quality === 2).length },
    { quality: "3 Stars", count: filteredSessions.filter((s) => s.quality === 3).length },
    { quality: "4 Stars", count: filteredSessions.filter((s) => s.quality === 4).length },
    { quality: "5 Stars", count: filteredSessions.filter((s) => s.quality === 5).length },
  ];

  const avgDuration =
    filteredSessions.length > 0
      ? filteredSessions.reduce((acc, s) => acc + s.duration, 0) / filteredSessions.length / 60
      : 0;

  const avgQuality =
    filteredSessions.length > 0
      ? filteredSessions.reduce((acc, s) => acc + s.quality, 0) / filteredSessions.length
      : 0;

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3">
          <p className="text-sm text-slate-300">{payload[0].payload.date}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value} {entry.name === "duration" ? "hrs" : ""}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl mb-2">Sleep Analytics</h2>
          <p className="text-slate-400">Visualize your sleep patterns and trends</p>
        </div>

        <div className="flex gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1">
          <button
            onClick={() => setTimeRange("week")}
            className={`px-4 py-2 rounded-md transition-colors ${
              timeRange === "week" ? "bg-indigo-600" : "hover:bg-slate-800"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange("month")}
            className={`px-4 py-2 rounded-md transition-colors ${
              timeRange === "month" ? "bg-indigo-600" : "hover:bg-slate-800"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange("all")}
            className={`px-4 py-2 rounded-md transition-colors ${
              timeRange === "all" ? "bg-indigo-600" : "hover:bg-slate-800"
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {filteredSessions.length > 0 ? (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-800/50 rounded-xl p-6">
              <h3 className="text-slate-300 mb-2">Average Sleep Duration</h3>
              <p className="text-3xl font-semibold">{avgDuration.toFixed(1)} hrs</p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-800/50 rounded-xl p-6">
              <h3 className="text-slate-300 mb-2">Average Quality</h3>
              <p className="text-3xl font-semibold">{avgQuality.toFixed(1)}/5</p>
            </div>
            <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border border-blue-800/50 rounded-xl p-6">
              <h3 className="text-slate-300 mb-2">Total Sessions</h3>
              <p className="text-3xl font-semibold">{filteredSessions.length}</p>
            </div>
          </div>

          {/* Duration Over Time */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="text-xl mb-4">Sleep Duration & Quality Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={durationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip content={customTooltip} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="duration"
                  stroke="#6366f1"
                  strokeWidth={2}
                  name="Duration (hrs)"
                  dot={{ fill: "#6366f1" }}
                />
                <Line
                  type="monotone"
                  dataKey="quality"
                  stroke="#a855f7"
                  strokeWidth={2}
                  name="Quality"
                  dot={{ fill: "#a855f7" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Quality Distribution */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
            <h3 className="text-xl mb-4">Sleep Quality Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={qualityDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="quality" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px" }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Insights */}
          <div className="bg-blue-900/20 border border-blue-800/50 rounded-xl p-6">
            <h3 className="text-xl mb-3">📊 Insights</h3>
            <ul className="space-y-2 text-slate-300">
              {avgDuration < 7 && (
                <li>• Your average sleep duration is below the recommended 7-9 hours. Try going to bed earlier!</li>
              )}
              {avgDuration >= 7 && avgDuration <= 9 && (
                <li>• Great! Your average sleep duration is within the recommended 7-9 hours.</li>
              )}
              {avgQuality < 3 && (
                <li>
                  • Your sleep quality scores are low. Consider reviewing your bedtime routine and sleep environment.
                </li>
              )}
              {avgQuality >= 4 && <li>• Excellent sleep quality! Keep up your healthy sleep habits.</li>}
              <li>
                • Consistency is key! Try to maintain regular sleep and wake times, even on weekends.
              </li>
            </ul>
          </div>
        </>
      ) : (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-12 text-center">
          <p className="text-slate-400 mb-4">No sleep data available for the selected time range</p>
          <p className="text-slate-500">Start logging your sleep to see analytics and insights</p>
        </div>
      )}
    </div>
  );
}
