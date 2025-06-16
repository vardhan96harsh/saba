export interface IconProps {
  className?: string;
}

export interface TabProps {
  isPartner?: boolean;
}
export interface CourseCategory {
  voice: boolean;
  video: boolean;
  headset: boolean;
  infrastructure: boolean;
}
export type EnrollmentType = 'Course' | 'Exam' | 'Course with exam';
export type CourseType =
  | 'Instructor-Led'
  | 'Virtual Instructor-Led'
  | 'E-learning'
  | 'Certification';
export type CourseCode =
  | 'UCTFND'
  | 'UCTINT'
  | 'VOCFND'
  | 'VOCINT1'
  | 'VOICE-PRO'
  | 'VIDFND'
  | 'VIDINT'
  | 'VIDINT2'
  | 'VIDINTE'
  | 'VIDEO-PRO'
  | 'INFFND'
  | 'INFINT1'
  | 'INFRA-PRO'
  | 'INFADV'
  | 'HEDFND'
  | 'LENFND'
  | 'PDMFND';

export type CourseLevel = 'any' | 'specialist' | 'professional' | 'expert';

export interface ExamData {
  title: string;
  id: string;
  proctored: 'Yes' | 'No';
  questionsAmount: number;
  passPercent: string;
  duration: string;
  link: string;
  blueprintLink: string;
}

export interface Course {
  enrollmentType: EnrollmentType;
  category: CourseCategory;
  title: string;
  description?: string;
  image: string;
  code: CourseCode;
  duration?: string;
  type: CourseType;
  link: string;
  partnerLink?: string;
  level: CourseLevel;
  examData?: ExamData;
}

export interface SubCategory {
  ui_id: string; // Unique identifier for the subcategory
  name: string;  // Subcategory name
  image?: string;
}

export interface Channel {
  id: Number;
  name: string;
  svgData?: string;
  subcategories?: SubCategory[];
}

// host import

export interface Host {
  id?: number;
  name: string;
  employee_id: string;
  email_id: string;
  profilePicture?: string;
  banner?: string;
  profile?: string;
  host_id?: string; 
  category?: string; 
  designation?: string;
  photoName?: string;  }




  

export interface ChannelSubs {
  [key: string]: any[],
}

export interface CommentData {
  [key: string]: any,
}


export interface VideoData {
 
  podcasts?: Podcast[];
  channels?: Channel[];
  hosts?:    Host[];
  channel_subs?: ChannelSubs;
}

export interface Podcast {
  id: string;
  channel_id?: Number,
  title?: string;
  length?: string;
  thumbnail?: string;
  category: string;
  video_id: string;
  publish_date: string;
  link?: string;
  music?: string;
  notes?: string;
  wise_link?: string;
  host?:string;
  comments?: Comment[]
}



export interface Comment {
  name: string;
  comment: string
  user_id?: string
}

export interface CustomWindow extends Window {
  Saba: {
    site: {
      env: {
        microapp?: Microapp;
        session?: Session;
      };
    };
  };
}

export interface Microapp {
  language_pref: string;
  country: string;
  hc_username: string;
  certificate: string;
  language: string;
  userName: string;
  apiCertificate: string;
  locale: string;
  hc_host: string;
}

export interface Session {
  site: string;
  csrfNonce: string;
  userName: string;
  userId: string;
  trqLocale: string;
  isNodeChanged: string;
}

export interface AudienceResponse {
  results: Audience[];
}

export interface Audience {
  displayName: string;
  id: string;
  href: string;
}

export interface WorkspaceData {
  totalResults: number;
  hasMoreResults: boolean;
  startIndex: number;
  itemsPerPage: number;
  results: Result[];
  facets: unknown[];
}

export interface FolderData {
  totalResults: number;
  hasMoreResults: boolean;
  startIndex: number;
  itemsPerPage: number;
  results: Result[];
  facets: unknown[];
}

export interface SecurityDomain {
  id: string;
  displayName: string;
}

export interface FolderId {
  id: string;
  displayName: string;
}

export interface PlayerTemplate {
  id: string;
  displayName: string;
}

export interface DeliveryVendor {
  id: string;
  displayName: string;
}

export interface Owner {
  id: string;
  displayName: string;
}

export interface Result {
  author: string;
  authorId: string;
  available_from?: string;
  available_offline: boolean;
  content_format_version: unknown;
  content_format: string;
  content_location: string;
  content_provider: unknown;
  contentType: string;
  delivery_vendor: DeliveryVendor;
  description: string;
  duration: number;
  external_id: unknown;
  file_display_name: string;
  fileSize: number;
  folder_id: FolderId;
  hide_mobile_download: boolean;
  high_stakes: boolean;
  id: string;
  ios_compatibility: string;
  is_dirty: boolean;
  is_eval: boolean;
  is_hide_exit_option: boolean;
  is_hide_exit_without_saving: boolean;
  is_public: boolean;
  is_scoring: boolean;
  is_secure: boolean;
  keywords: unknown;
  language?: string;
  mark_complete_externally: boolean;
  microlearning: boolean;
  name: string;
  owners: Owner[];
  parent_id: unknown;
  player_template: PlayerTemplate;
  relax_exit_au: boolean;
  relax_scorm_2004: boolean;
  require_esignature: boolean;
  security_context: unknown;
  securityDomain: SecurityDomain;
  stage_content_id: unknown;
  status: number;
  toc: string;
  upload_info: string;
  url: string;
  use_aicc_bridge: boolean;
  use_tincanVerbs: boolean;
  valid_till: unknown;
  version_no?: string;
  video_markcomplete_criteria: number;
}

export interface WorkspaceId {
  contentId: string | undefined;
  contentLocation: string | undefined;
}
