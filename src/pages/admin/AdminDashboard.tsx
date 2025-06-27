
import { useEffect, useMemo, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Users, AlertTriangle, FileText, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Activity {
  type: string;
  user?: string;
  timestamp: string;
  description: string;
}

export default function AdminDashboard() {
  const { registeredUsers, pendingProfessionals } = useUser();
  const [reportCount, setReportCount] = useState<number>(0);
  const [contentCount, setContentCount] = useState<number>(0);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [graphData, setGraphData] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch reports and community/posts counts from localStorage or fallback to dummy
  useEffect(() => {
    setFetching(true);
    setError(null);

    try {
      // Reports
      const storedReports = JSON.parse(localStorage.getItem("soulsync_reported_content") || "[]");
      setReportCount(storedReports.length);

      // Posts
      let posts = 0;
      const storedPosts = JSON.parse(localStorage.getItem("soulsync_community_posts") || "[]");
      if (Array.isArray(storedPosts)) {
        posts = storedPosts.length;
      }
      setContentCount(posts);

      // Recent activity
      let recent: Activity[] = [];
      // User registrations (based on mock context)
      if (registeredUsers && Array.isArray(registeredUsers)) {
        registeredUsers.slice(-5).forEach(u => recent.push({
          type: "User Registered",
          user: u.username,
          timestamp: (u as any).joinDate ? format(new Date((u as any).joinDate), "yyyy-MM-dd HH:mm") : format(new Date(), "yyyy-MM-dd HH:mm"),
          description: `${u.username} joined as ${u.role}`
        }));
      }
      // Professional verifications
      if (pendingProfessionals && Array.isArray(pendingProfessionals)) {
        pendingProfessionals.slice(-5).forEach(p => recent.push({
          type: "Professional Verification Pending",
          user: p.username,
          timestamp: format(new Date(), "yyyy-MM-dd HH:mm"),
          description: `${p.username} is pending verification`
        }));
      }
      // Reports
      if (storedReports && Array.isArray(storedReports)) {
        storedReports.slice(-5).forEach((r: any) => recent.push({
          type: "Content Reported",
          user: r.reportedBy || "User",
          timestamp: r.date ? format(new Date(r.date), "yyyy-MM-dd HH:mm") : format(new Date(), "yyyy-MM-dd HH:mm"),
          description: `Reported: ${r.reason || "Content"}`
        }));
      }
      // Posts (community)
      if (Array.isArray(storedPosts)) {
        storedPosts.slice(-5).forEach((post: any) => recent.push({
          type: "Community Post",
          user: post.author || "User",
          timestamp: post.createdAt ? format(new Date(post.createdAt), "yyyy-MM-dd HH:mm") : format(new Date(), "yyyy-MM-dd HH:mm"),
          description: `${post.author || "A user"} posted in community`
        }));
      }
      // Sort by timestamp (desc)
      recent.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      // Only latest 10 activities
      setRecentActivity(recent.slice(0, 10));

      // Dummy graph (but try to base on actual data)
      // Show weekly user registrations for last 4 weeks (dummy fallback)
      let graph: any[] = [];
      try {
        let now = new Date();
        for (let i = 3; i >= 0; i--) {
          let periodUsers = registeredUsers.filter((u: any) =>
            (u.joinDate && new Date(u.joinDate) <= new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000))
          ).length;
          graph.push({
            week: `Week ${4 - i}`,
            users: periodUsers
          });
        }
        setGraphData(graph);
      } catch (e) {
        setGraphData([
          { week: "Week 1", users: 3 },
          { week: "Week 2", users: 4 },
          { week: "Week 3", users: 5 },
          { week: "Week 4", users: 2 },
        ]);
      }
    } catch (e) {
      setError("Failed to fetch dashboard data.");
      toast({
        title: "Dashboard error",
        description: "Error loading admin dashboard data.",
        variant: "destructive"
      });
    } finally {
      setFetching(false);
    }
  }, [registeredUsers, pendingProfessionals]);

  // Platform stats (with dummy fallback if data missing)
  const usersCount = registeredUsers?.length ?? 5;
  const prosCount = registeredUsers?.filter((u: any) => u.role === "professional").length || 1;
  const reportsCount = reportCount || 0;
  const postsCount = contentCount || 0;

  // Pending tasks: pending professional verifications, pending reports
  const pendingTasks = useMemo(() => {
    let tasks: { id: string, type: string, label: string, date: string }[] = [];
    if (Array.isArray(pendingProfessionals) && pendingProfessionals.length > 0) {
      pendingProfessionals.forEach(p => {
        tasks.push({
          id: p.id,
          type: "verification",
          label: `${p.username} (Verification needed)`,
          date: format(new Date(), "yyyy-MM-dd")
        });
      });
    }
    // Only REAL pending reports (status = 'pending')
    try {
      const storedReports = JSON.parse(localStorage.getItem("soulsync_reported_content") || "[]");
      if (Array.isArray(storedReports)) {
        storedReports.filter((r: any) => r.status === "pending").forEach((r: any) => {
          tasks.push({
            id: r.id || Math.random() + "",
            type: "report",
            label: `${r.contentType ? `${r.contentType} report` : "Content report"} - ${r.reason || ""}`,
            date: r.date ? format(new Date(r.date), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")
          });
        });
      }
    } catch (e) {}
    return tasks;
  }, [pendingProfessionals, reportCount]);

  return (
    <div className="py-2 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <User className="h-6 w-6 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersCount}</div>
            <p className="text-xs text-muted-foreground">Registered Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Professionals</CardTitle>
            <Users className="h-6 w-6 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prosCount}</div>
            <p className="text-xs text-muted-foreground">Verified Pros</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reports</CardTitle>
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportsCount}</div>
            <p className="text-xs text-muted-foreground">Pending Reports</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Content</CardTitle>
            <FileText className="h-6 w-6 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{postsCount}</div>
            <p className="text-xs text-muted-foreground">Community Posts</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-5 my-2">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold">User Growth</div>
          {fetching && <RefreshCw className="h-4 w-4 animate-spin" />}
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={graphData} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="users" fill="#9b87f5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingTasks.length === 0 ? (
              <div className="text-sm text-muted-foreground">No pending tasks.</div>
            ) : (
              <ul className="space-y-2">
                {pendingTasks.map(task => (
                  <li key={task.id} className="p-2 rounded-lg border border-border flex items-center justify-between">
                    <span>{task.label}</span>
                    <span className="text-xs text-muted-foreground">{task.date}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="text-sm text-muted-foreground">No recent activity.</div>
            ) : (
              <ul className="space-y-1">
                {recentActivity.map((a, i) => (
                  <li key={i} className="flex gap-2 justify-between items-center p-1 border-b last:border-0 border-border">
                    <span>
                      <span className="font-medium">{a.type}</span>{" "}
                      {a.user && <span className="text-purple-700">{a.user}</span>}
                    </span>
                    <span className="text-xs text-muted-foreground">{a.timestamp}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
      {error && (
        <div className="mt-2 text-sm text-destructive bg-destructive-foreground/10 p-3 rounded">{error}</div>
      )}
    </div>
  );
}
