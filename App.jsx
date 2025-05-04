import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Droplet, Moon, Smartphone } from "lucide-react";

export default function Dashboard() {
  const [habits, setHabits] = useState({ sleep: 7, water: 2, screen: 4 });
  const [streak, setStreak] = useState(0);
  const [log, setLog] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/habits/john")
      .then((res) => res.json())
      .then((data) => {
        setLog(data);
        setStreak(data.length);
      });
  }, []);

  const handleCheckIn = () => {
    const today = {
      user: "john",
      day: `Day ${log.length + 1}`,
      ...habits,
      streak: streak + 1,
    };

    fetch("http://localhost:4000/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(today),
    })
      .then((res) => res.json())
      .then((newEntry) => {
        setLog([...log, newEntry]);
        setStreak(streak + 1);
      });
  };

  const chartData = {
    labels: log.map((l) => l.day),
    datasets: [
      {
        label: "Sleep (hrs)",
        data: log.map((l) => l.sleep),
        borderColor: "#6366f1",
        backgroundColor: "#6366f133",
      },
      {
        label: "Water (L)",
        data: log.map((l) => l.water),
        borderColor: "#22c55e",
        backgroundColor: "#22c55e33",
      },
      {
        label: "Screen Time (hrs)",
        data: log.map((l) => l.screen),
        borderColor: "#f97316",
        backgroundColor: "#f9731633",
      },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-white shadow rounded-xl">
        <h1 className="text-2xl font-bold text-purple-600">Pulse Tracker</h1>
        <Button variant="outline">Profile</Button>
      </nav>

      {/* Streak Tracker */}
      <Card className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Flame className="text-orange-500" />
          <p className="text-lg font-semibold">Streak: {streak} days</p>
        </div>
        <Button onClick={handleCheckIn}>Daily Check-In ✅</Button>
      </Card>

      {/* Habit Sliders */}
      <Card>
        <CardContent className="space-y-4 p-4">
          <HabitSlider
            icon={<Moon />} label="Sleep (hrs)"
            value={habits.sleep}
            onChange={(v) => setHabits({ ...habits, sleep: v })}
            min={4} max={10}
          />
          <HabitSlider
            icon={<Droplet />} label="Water (L)"
            value={habits.water}
            onChange={(v) => setHabits({ ...habits, water: v })}
            min={1} max={5}
          />
          <HabitSlider
            icon={<Smartphone />} label="Screen Time (hrs)"
            value={habits.screen}
            onChange={(v) => setHabits({ ...habits, screen: v })}
            min={2} max={10}
          />
        </CardContent>
      </Card>

      {/* Graph */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">Weekly Progress 📊</h2>
          <Line data={chartData} />
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm pt-6">
        &copy; 2025 Pulse Tracker. All rights reserved.
      </footer>
    </div>
  );
}

function HabitSlider({ icon, label, value, onChange, min, max }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="font-medium">{label}: {value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full"
      />
    </div>
  );
}
