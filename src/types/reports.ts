
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

export interface Report {
  id: string;
  contentId: string;
  contentType: 'post' | 'comment';
  reporterId: string;
  reason: string;
  details?: string;
  status: ReportStatus;
  date: string;
  reviewedBy?: string;
  reviewDate?: string;
}
