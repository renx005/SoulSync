
import { useState } from 'react';
import { useReports } from '@/hooks/useReports';
import { useUser } from '@/contexts/UserContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentId: string;
  contentType: 'post' | 'comment';
}

const reportReasons = [
  'Inappropriate content',
  'Harassment or bullying',
  'Spam',
  'Misinformation',
  'Violence',
  'Other'
];

export function ReportDialog({
  open,
  onOpenChange,
  contentId,
  contentType
}: ReportDialogProps) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const { submitReport } = useReports();
  const { user } = useUser();

  const handleSubmit = () => {
    if (!user || !reason) return;

    submitReport({
      contentId,
      contentType,
      reporterId: user.id,
      reason,
      details: details.trim() || undefined
    });

    // Reset form and close dialog
    setReason('');
    setDetails('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Content</DialogTitle>
          <DialogDescription>
            Please help us understand why you're reporting this content.
            Your report will be reviewed by our moderation team.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm font-medium">
              Reason for reporting
            </label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {reportReasons.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="details" className="text-sm font-medium">
              Additional details (optional)
            </label>
            <Textarea
              id="details"
              placeholder="Provide any additional context that might help us understand the issue"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!reason}>
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
