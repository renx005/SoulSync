export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  posts: number;
  color: string;
}

export interface PostData {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole?: string;
  categoryId: string;
  categoryName: string;
  createdAt: Date;
  likes: number;
  replies: number;
  isLiked?: boolean;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  categoryName: string;
  author: string;
  authorId: string;
  authorRole?: string;
  authorAvatar?: string;
  date: Date;
  replies: number;
  isAnonymous?: boolean;
  likes: number;
  images?: string[];
  videoLinks?: string[];
  isEdited?: boolean;
  lastEditedDate?: Date;
  isHidden?: boolean;
}

export interface ForumReply {
  id: string;
  postId: string;
  content: string;
  author: string;
  authorId: string;
  authorRole?: string;
  authorAvatar?: string;
  date: Date;
  isAnonymous?: boolean;
  likes: number;
  isEdited?: boolean;
  lastEditedDate?: Date;
  isHidden?: boolean;
}

export type ReportStatus = 'pending' | 'reviewed' | 'resolved';

export interface Report {
  id: string;
  contentId: string;
  contentType: 'post' | 'reply';
  reportedBy: string;
  reportedByName: string;
  targetUserId: string;
  reason: string;
  date: Date;
  status: ReportStatus;
  content?: string;
  categoryId?: string;
  postId?: string;
}

export type NotificationType = 'reply' | 'like' | 'report' | 'verification' | 'system' | 'user' | 'admin' | 'reminder';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  content: string;
  relatedId: string;
  date: Date;
  read: boolean;
  url?: string;
}

export interface ProfessionalVerification {
  id: string;
  userId: string;
  name: string;
  occupation: string;
  documentUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: Date;
  reviewedDate?: Date;
}
