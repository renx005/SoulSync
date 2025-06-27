
import { useState } from 'react';
import { useReports } from '@/hooks/useReports';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ReportStatus } from '@/types/reports';

export default function ReportedContent() {
  const { reports, updateReportStatus } = useReports();
  const { user } = useUser();
  const [filter, setFilter] = useState<ReportStatus | 'all'>('pending');

  const filteredReports = reports.filter(report => 
    filter === 'all' ? true : report.status === filter
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleStatusUpdate = (reportId: string, status: ReportStatus) => {
    if (user) {
      updateReportStatus(reportId, status, user.id);
    }
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case 'resolved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Resolved</Badge>;
      case 'dismissed':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Dismissed</Badge>;
      default:
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Under Review</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reported Content</h1>
        <Select value={filter} onValueChange={(value: ReportStatus | 'all') => setFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reports</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reviewed">Under Review</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredReports.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No reports found for the selected filter.
            </CardContent>
          </Card>
        ) : (
          filteredReports.map((report) => (
            <Card key={report.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Report #{report.id.slice(0, 8)}
                  </CardTitle>
                  {getStatusBadge(report.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Reported on {format(new Date(report.date), 'PPP')}
                    </p>
                    <p className="text-sm">
                      <strong>Content Type:</strong> {report.contentType}
                    </p>
                    <p className="text-sm">
                      <strong>Reason:</strong> {report.reason}
                    </p>
                    {report.details && (
                      <p className="text-sm">
                        <strong>Details:</strong> {report.details}
                      </p>
                    )}
                  </div>

                  {report.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleStatusUpdate(report.id, 'reviewed')}
                      >
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Review
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleStatusUpdate(report.id, 'resolved')}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Resolve
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleStatusUpdate(report.id, 'dismissed')}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Dismiss
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
