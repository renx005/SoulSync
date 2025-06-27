import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { 
  Trophy,
  Users,
  MessageCircle,
  AlertTriangle,
  Clock,
  HelpCircle,
  Shield,
  ChartLine,
  FileCheck,
  Award,
  ArrowUpRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ProfessionalHome() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [timeOfDay, setTimeOfDay] = useState('');
  
  useEffect(() => {
    const getTimeOfDay = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'morning';
      if (hour < 17) return 'afternoon';
      return 'evening';
    };
    setTimeOfDay(getTimeOfDay());
  }, []);

  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['professionalDashboard'],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        pendingQuestions: 3,
        recentReports: 2,
        totalContributions: 17,
        recentActivity: {
          responses: 8,
          likes: 24,
          solved: 12
        },
        weeklyStats: {
          responsesGiven: 15,
          questionsAnswered: 10,
          peopleHelped: 25
        }
      };
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-gray-100 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-pro-primary to-pro-secondary rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-semibold mb-2">
          Good {timeOfDay}, {user?.username}
        </h1>
        <p className="text-white/80">
          Your expertise makes a difference in our community
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/50 backdrop-blur-sm border-pro-primary/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-pro-light p-3">
                <Award className="h-6 w-6 text-pro-primary" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold mt-4">{dashboardData?.weeklyStats.peopleHelped}</h3>
            <p className="text-sm text-muted-foreground">People helped this week</p>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm border-pro-primary/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-pro-light p-3">
                <MessageCircle className="h-6 w-6 text-pro-primary" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold mt-4">{dashboardData?.weeklyStats.responsesGiven}</h3>
            <p className="text-sm text-muted-foreground">Responses this week</p>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-sm border-pro-primary/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="rounded-full bg-pro-light p-3">
                <ChartLine className="h-6 w-6 text-pro-primary" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold mt-4">{dashboardData?.recentActivity.likes}</h3>
            <p className="text-sm text-muted-foreground">Engagement received</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <Card className="border-pro-primary/10">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-pro-primary" />
            Professional Impact
          </CardTitle>
          <CardDescription>
            Track your contributions and community impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Monthly Goal Progress</span>
                <span className="text-pro-primary font-medium">
                  {dashboardData?.totalContributions}/20 Responses
                </span>
              </div>
              <Progress 
                value={(dashboardData?.totalContributions ?? 0) * 5} 
                className="h-2"
                indicatorClassName="bg-gradient-to-r from-pro-primary to-pro-secondary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm font-medium mb-1">
                  <FileCheck className="h-4 w-4 text-green-500" />
                  <span>Solved Cases</span>
                </div>
                <p className="text-2xl font-semibold">{dashboardData?.recentActivity.solved}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm font-medium mb-1">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span>Active Threads</span>
                </div>
                <p className="text-2xl font-semibold">{dashboardData?.recentActivity.responses}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm font-medium mb-1">
                  <Shield className="h-4 w-4 text-purple-500" />
                  <span>Trust Score</span>
                </div>
                <p className="text-2xl font-semibold">98%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attention Required Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-pro-primary/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData?.pendingQuestions > 0 && (
                <div className="flex justify-between items-center p-4 bg-amber-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-amber-500" />
                    <span>{dashboardData.pendingQuestions} questions need answers</span>
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/professional/community')}
                  >
                    Review
                  </Button>
                </div>
              )}

              {dashboardData?.recentReports > 0 && (
                <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span>{dashboardData.recentReports} content reports</span>
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/professional/community')}
                  >
                    Check
                  </Button>
                </div>
              )}

              {(!dashboardData?.pendingQuestions && !dashboardData?.recentReports) && (
                <div className="text-center py-8">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <FileCheck className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="text-muted-foreground">All caught up!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-pro-primary/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-pro-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: "Answered a question about anxiety management",
                  time: "2 hours ago",
                  icon: MessageCircle,
                  color: "text-blue-500"
                },
                {
                  action: "Reviewed reported content",
                  time: "5 hours ago",
                  icon: Shield,
                  color: "text-purple-500"
                },
                {
                  action: "Provided feedback on meditation techniques",
                  time: "1 day ago",
                  icon: MessageCircle,
                  color: "text-blue-500"
                }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`rounded-full p-2 bg-gray-50 ${item.color}`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
