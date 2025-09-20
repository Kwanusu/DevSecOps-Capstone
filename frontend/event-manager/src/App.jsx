import { useState, useEffect } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import io from "socket.io-client";

// Connect to backend SocketIO
const socket = io("http://localhost:5000");


function App() {
  const [tab, setTab] = useState("events");
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
  });

  const [metricsData, setMetricsData] = useState({ requests: [], latency: [] });

  // Fetch events
  useEffect(() => {
    fetch("/api/events")
      .then(res => res.json())
      .then(data => setEvents(data));

    // Listen for live events
    socket.on("new_event", (event) => {
      setEvents(prev => [...prev, event]);
    });

    // Listen for live metrics
    socket.on("metrics_update", (metric) => {
      setMetricsData(prev => {
        const requests = [...prev.requests];
        const latency = [...prev.latency];

        // Update requests
        const idx = requests.findIndex(r => r.endpoint === metric.endpoint);
        if(idx >= 0) requests[idx].count = metric.count;
        else requests.push({ endpoint: metric.endpoint, count: metric.count });

        // Update latency
        const lidx = latency.findIndex(l => l.endpoint === metric.endpoint);
        if(lidx >= 0) latency[lidx].latency = metric.latency;
        else latency.push({ endpoint: metric.endpoint, latency: metric.latency });

        return { requests, latency };
      });
    });
    return () => {
      socket.off("new_event");
      socket.off("metrics_update");
    };
  }, []);

  // Fetch metrics periodically
  useEffect(() => {
    if (tab === "metrics") {
      const fetchMetrics = async () => {
        const res = await fetch("/metrics");
        const raw = await res.text();

        // Parse Prometheus text format
        const requestCounts = [];
        const requestLatency = [];

        raw.split("\n").forEach((line) => {
          if (line.startsWith("flask_http_request_total")) {
            // Example: flask_http_request_total{method="GET",endpoint="/",http_status="200"} 3
            const match = line.match(/endpoint="([^"]+)",.*\s+(\d+)/);
            if (match) {
              requestCounts.push({ endpoint: match[1], count: parseInt(match[2], 10) });
            }
          }
          if (line.startsWith("flask_http_request_duration_seconds")) {
            const match = line.match(/endpoint="([^"]+)"\s+([\d.]+)/);
            if (match) {
              requestLatency.push({ endpoint: match[1], latency: parseFloat(match[2]) });
            }
          }
        });

        setMetricsData({ requests: requestCounts, latency: requestLatency });
      };

      fetchMetrics();
      const interval = setInterval(fetchMetrics, 5000); // refresh every 5 sec
      return () => clearInterval(interval);
    }
  }, [tab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const newEvent = await res.json();
    setEvents([...events, newEvent]);
    setForm({ title: "", date: "", location: "", description: "" });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">DevSecOps Dashboard</h1>

      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        {/* Events Tab */}
        <TabsContent value="events">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Event</CardTitle>
              <CardDescription>Fill in the details below.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                />
                <Input
                  type="date"
                  placeholder="Date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
                <Input
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
                <Button type="submit">Add Event</Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">All Events</h2>
            {events.map((ev) => (
              <Card key={ev.id}>
                <CardContent>
                  <h3 className="text-xl font-bold">{ev.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {ev.date} - {ev.location}
                  </p>
                  <p className="mt-2">{ev.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Request Counts</CardTitle>
              <CardDescription>Number of requests per endpoint</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart width={600} height={300} data={metricsData.requests}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="endpoint" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#4f46e5" />
              </BarChart>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Request Latency (s)</CardTitle>
              <CardDescription>Latency per endpoint</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart width={600} height={300} data={metricsData.latency}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="endpoint" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="latency" stroke="#f43f5e" />
              </LineChart>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;
