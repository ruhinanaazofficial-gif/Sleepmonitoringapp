import { useEffect, useState } from "react";
import { getSleepSessions, saveSleepSession, deleteSleepSession } from "../utils/storage";
import { SleepSession } from "../types";
import { Plus, Trash2, Star } from "lucide-react";
import { format, parseISO } from "date-fns";

export function SleepLog() {
  const [sessions, setSessions] = useState<SleepSession[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState<SleepSession | null>(null);

  const loadSessions = () => {
    setSessions(getSleepSessions().sort((a, b) => new Date(b.bedtime).getTime() - new Date(a.bedtime).getTime()));
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Delete this sleep session?")) {
      deleteSleepSession(id);
      loadSessions();
    }
  };

  const handleEdit = (session: SleepSession) => {
    setEditingSession(session);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingSession(null);
    loadSessions();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl mb-2">Sleep Log</h2>
          <p className="text-slate-400">Record and manage your sleep sessions</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Sleep Session
        </button>
      </div>

      {showForm && <SleepForm session={editingSession} onClose={handleFormClose} />}

      <div className="space-y-4">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <div key={session.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-medium mb-1">{format(parseISO(session.bedtime), "EEEE, MMMM d, yyyy")}</h3>
                  <p className="text-slate-400">
                    {format(parseISO(session.bedtime), "h:mm a")} → {format(parseISO(session.waketime), "h:mm a")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(session)}
                    className="px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(session.id)}
                    className="p-1.5 text-red-400 hover:bg-red-950/50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Duration</p>
                  <p className="text-lg">{formatDuration(session.duration)}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Quality</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < session.quality ? "fill-yellow-400 text-yellow-400" : "text-slate-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {session.notes && (
                <div className="pt-4 border-t border-slate-800">
                  <p className="text-slate-400 text-sm mb-1">Notes</p>
                  <p className="text-slate-200">{session.notes}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-12 text-center">
            <p className="text-slate-400 mb-4">No sleep sessions recorded yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              Add Your First Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SleepForm({ session, onClose }: { session: SleepSession | null; onClose: () => void }) {
  const [bedtime, setBedtime] = useState(session?.bedtime.slice(0, 16) || "");
  const [waketime, setWaketime] = useState(session?.waketime.slice(0, 16) || "");
  const [quality, setQuality] = useState(session?.quality || 3);
  const [notes, setNotes] = useState(session?.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bedtime || !waketime) {
      alert("Please fill in bedtime and wake time");
      return;
    }

    const bedtimeDate = new Date(bedtime);
    const waketimeDate = new Date(waketime);
    const duration = Math.round((waketimeDate.getTime() - bedtimeDate.getTime()) / (1000 * 60));

    if (duration <= 0) {
      alert("Wake time must be after bedtime");
      return;
    }

    const newSession: SleepSession = {
      id: session?.id || Date.now().toString(),
      bedtime: bedtimeDate.toISOString(),
      waketime: waketimeDate.toISOString(),
      quality,
      notes: notes.trim() || undefined,
      duration,
    };

    saveSleepSession(newSession);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full">
        <h3 className="text-xl mb-4">{session ? "Edit Sleep Session" : "Add Sleep Session"}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Bedtime</label>
            <input
              type="datetime-local"
              value={bedtime}
              onChange={(e) => setBedtime(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Wake Time</label>
            <input
              type="datetime-local"
              value={waketime}
              onChange={(e) => setWaketime(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Sleep Quality</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setQuality(value)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Star
                    className={`w-8 h-8 ${
                      value <= quality ? "fill-yellow-400 text-yellow-400" : "text-slate-600"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 resize-none"
              rows={3}
              placeholder="How did you sleep? Any dreams or disturbances?"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              {session ? "Update" : "Add"} Session
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
