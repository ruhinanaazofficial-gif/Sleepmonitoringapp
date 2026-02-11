import { useEffect, useState } from "react";
import { getSleepSessions } from "../utils/storage";
import { SleepSession } from "../types";
import { Clock, Moon, TrendingUp, Star } from "lucide-react";
import { format, parseISO, differenceInMinutes } from "date-fns";

export function Dashboard() {
  const [sessions, setSessions] = useState<SleepSession[]>([]);

  useEffect(() => {
    setSessions(getSleepSessions());
  }, []);

  const recentSessions = sessions
    .sort((a, b) => new Date(b.bedtime).getTime() - new Date(a.bedtime).getTime())
    .slice(0, 7);

  const avgSleepDuration =
    recentSessions.length > 0
      ? recentSessions.reduce((acc, s) => acc + s.duration, 0) / recentSessions.length
      : 0;

  const avgQuality =
    recentSessions.length > 0
      ? recentSessions.reduce((acc, s) => acc + s.quality, 0) / recentSessions.length
      : 0;

  const lastSession = recentSessions[0];

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl mb-2">Sleep Dashboard</h2>
        <p className="text-slate-400">Track your sleep patterns and quality</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-800/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-indigo-300" />
            <h3 className="text-slate-300">Avg Sleep Duration</h3>
          </div>
          <p className="text-3xl font-semibold">{formatDuration(Math.round(avgSleepDuration))}</p>
          <p className="text-sm text-slate-400 mt-1">Last 7 nights</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-800/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-5 h-5 text-purple-300" />
            <h3 className="text-slate-300">Avg Sleep Quality</h3>
          </div>
          <p className="text-3xl font-semibold">{avgQuality.toFixed(1)}/5</p>
          <p className="text-sm text-slate-400 mt-1">Last 7 nights</p>
        </div>

        <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border border-blue-800/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Moon className="w-5 h-5 text-blue-300" />
            <h3 className="text-slate-300">Total Sessions</h3>
          </div>
          <p className="text-3xl font-semibold">{sessions.length}</p>
          <p className="text-sm text-slate-400 mt-1">All time</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-900/50 to-teal-900/50 border border-cyan-800/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-cyan-300" />
            <h3 className="text-slate-300">Sleep Streak</h3>
          </div>
          <p className="text-3xl font-semibold">{recentSessions.length}</p>
          <p className="text-sm text-slate-400 mt-1">Recent nights</p>
        </div>
      </div>

      {/* Last Night */}
      {lastSession && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h3 className="text-xl mb-4">Last Night's Sleep</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-slate-400 mb-1">Bedtime</p>
              <p className="text-xl">{format(parseISO(lastSession.bedtime), "h:mm a")}</p>
              <p className="text-sm text-slate-500">{format(parseISO(lastSession.bedtime), "MMM d, yyyy")}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">Wake Time</p>
              <p className="text-xl">{format(parseISO(lastSession.waketime), "h:mm a")}</p>
              <p className="text-sm text-slate-500">{format(parseISO(lastSession.waketime), "MMM d, yyyy")}</p>
            </div>
            <div>
              <p className="text-slate-400 mb-1">Duration</p>
              <p className="text-xl">{formatDuration(lastSession.duration)}</p>
              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < lastSession.quality ? "fill-yellow-400 text-yellow-400" : "text-slate-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          {lastSession.notes && (
            <div className="mt-4 pt-4 border-t border-slate-800">
              <p className="text-slate-400 mb-1">Notes</p>
              <p className="text-slate-200">{lastSession.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Recent Sessions */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h3 className="text-xl mb-4">Recent Sleep Sessions</h3>
        {recentSessions.length > 0 ? (
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium">{format(parseISO(session.bedtime), "EEEE, MMM d")}</p>
                  <p className="text-sm text-slate-400">
                    {format(parseISO(session.bedtime), "h:mm a")} → {format(parseISO(session.waketime), "h:mm a")}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{formatDuration(session.duration)}</p>
                    <div className="flex items-center gap-0.5 justify-end mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < session.quality ? "fill-yellow-400 text-yellow-400" : "text-slate-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-center py-8">No sleep sessions recorded yet. Start logging your sleep!</p>
        )}
      </div>
    </div>
  );
}
