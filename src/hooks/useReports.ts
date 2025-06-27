
import { useState, useEffect } from 'react';
import { Report, ReportStatus } from '@/types/reports';
import { useToast } from '@/hooks/use-toast';

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedReports = localStorage.getItem('soulsync_reported_content');
    if (storedReports) {
      try {
        setReports(JSON.parse(storedReports));
      } catch (error) {
        console.error('Failed to parse reports:', error);
      }
    }
  }, []);

  const saveReports = (updatedReports: Report[]) => {
    localStorage.setItem('soulsync_reported_content', JSON.stringify(updatedReports));
    setReports(updatedReports);
  };

  const submitReport = (report: Omit<Report, 'id' | 'date' | 'status'>) => {
    const newReport: Report = {
      ...report,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      status: 'pending'
    };
    
    const updatedReports = [...reports, newReport];
    saveReports(updatedReports);
    
    toast({
      title: "Report submitted",
      description: "Thank you for helping keep our community safe.",
    });
    
    return newReport;
  };

  const updateReportStatus = (reportId: string, status: ReportStatus, adminId: string) => {
    const updatedReports = reports.map(report => {
      if (report.id === reportId) {
        return {
          ...report,
          status,
          reviewedBy: adminId,
          reviewDate: new Date().toISOString()
        };
      }
      return report;
    });
    
    saveReports(updatedReports);
    
    toast({
      title: "Report updated",
      description: `Report has been marked as ${status}.`,
    });
  };

  return {
    reports,
    submitReport,
    updateReportStatus,
  };
}
