import { useEffect, useState } from "react";
import { getRoutines, saveRoutines } from "../utils/storage";
import { Routine, RoutineItem } from "../types";
import { Plus, Check, X, GripVertical } from "lucide-react";

export function Routines() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null);

  useEffect(() => {
    const loadedRoutines = getRoutines();
    setRoutines(loadedRoutines);
    if (loadedRoutines.length > 0) {
      setActiveRoutine(loadedRoutines[0]);
    }
  }, []);

  const handleToggleItem = (itemId: string) => {
    if (!activeRoutine) return;

    const updatedRoutine = {
      ...activeRoutine,
      items: activeRoutine.items.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      ),
    };

    const updatedRoutines = routines.map((r) => (r.id === activeRoutine.id ? updatedRoutine : r));
    setRoutines(updatedRoutines);
    setActiveRoutine(updatedRoutine);
    saveRoutines(updatedRoutines);
  };

  const handleAddItem = () => {
    if (!activeRoutine) return;

    const newItem: RoutineItem = {
      id: Date.now().toString(),
      title: "New routine item",
      completed: false,
      order: activeRoutine.items.length + 1,
    };

    const updatedRoutine = {
      ...activeRoutine,
      items: [...activeRoutine.items, newItem],
    };

    const updatedRoutines = routines.map((r) => (r.id === activeRoutine.id ? updatedRoutine : r));
    setRoutines(updatedRoutines);
    setActiveRoutine(updatedRoutine);
    saveRoutines(updatedRoutines);
  };

  const handleRemoveItem = (itemId: string) => {
    if (!activeRoutine) return;

    const updatedRoutine = {
      ...activeRoutine,
      items: activeRoutine.items.filter((item) => item.id !== itemId),
    };

    const updatedRoutines = routines.map((r) => (r.id === activeRoutine.id ? updatedRoutine : r));
    setRoutines(updatedRoutines);
    setActiveRoutine(updatedRoutine);
    saveRoutines(updatedRoutines);
  };

  const handleUpdateItemTitle = (itemId: string, title: string) => {
    if (!activeRoutine) return;

    const updatedRoutine = {
      ...activeRoutine,
      items: activeRoutine.items.map((item) => (item.id === itemId ? { ...item, title } : item)),
    };

    const updatedRoutines = routines.map((r) => (r.id === activeRoutine.id ? updatedRoutine : r));
    setRoutines(updatedRoutines);
    setActiveRoutine(updatedRoutine);
    saveRoutines(updatedRoutines);
  };

  const handleResetRoutine = () => {
    if (!activeRoutine) return;

    const updatedRoutine = {
      ...activeRoutine,
      items: activeRoutine.items.map((item) => ({ ...item, completed: false })),
    };

    const updatedRoutines = routines.map((r) => (r.id === activeRoutine.id ? updatedRoutine : r));
    setRoutines(updatedRoutines);
    setActiveRoutine(updatedRoutine);
    saveRoutines(updatedRoutines);
  };

  if (!activeRoutine) {
    return <div>Loading...</div>;
  }

  const completedCount = activeRoutine.items.filter((item) => item.completed).length;
  const totalCount = activeRoutine.items.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl mb-2">Bedtime Routines</h2>
        <p className="text-slate-400">Create and follow your nightly routine for better sleep</p>
      </div>

      {/* Progress */}
      <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-800/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl">{activeRoutine.name}</h3>
          <span className="text-slate-300">
            {completedCount}/{totalCount} completed
          </span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress === 100 && (
          <div className="mt-4 p-3 bg-green-900/30 border border-green-700/50 rounded-lg text-center">
            <p className="text-green-300">🎉 Great job! Your routine is complete. Sleep well!</p>
          </div>
        )}
      </div>

      {/* Routine Items */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg">Routine Steps</h3>
          <div className="flex gap-2">
            <button
              onClick={handleResetRoutine}
              className="px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Reset All
            </button>
            <button
              onClick={handleAddItem}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Step
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {activeRoutine.items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
                item.completed ? "bg-slate-800/50" : "bg-slate-800"
              }`}
            >
              <button className="cursor-grab text-slate-500 hover:text-slate-400">
                <GripVertical className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleToggleItem(item.id)}
                className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                  item.completed
                    ? "bg-indigo-600 border-indigo-600"
                    : "border-slate-600 hover:border-indigo-500"
                }`}
              >
                {item.completed && <Check className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={item.title}
                onChange={(e) => handleUpdateItemTitle(item.id, e.target.value)}
                className={`flex-1 bg-transparent border-none outline-none ${
                  item.completed ? "line-through text-slate-500" : ""
                }`}
              />

              <button
                onClick={() => handleRemoveItem(item.id)}
                className="flex-shrink-0 p-1 text-slate-500 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {activeRoutine.items.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <p>No routine steps yet. Add your first step to get started!</p>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-900/20 border border-blue-800/50 rounded-xl p-6">
        <h3 className="text-lg mb-3">💡 Tips for Better Sleep</h3>
        <ul className="space-y-2 text-slate-300">
          <li>• Maintain a consistent sleep schedule</li>
          <li>• Keep your bedroom cool (60-67°F)</li>
          <li>• Avoid screens 30-60 minutes before bed</li>
          <li>• Practice relaxation techniques like deep breathing</li>
          <li>• Avoid caffeine and heavy meals before bedtime</li>
        </ul>
      </div>
    </div>
  );
}
