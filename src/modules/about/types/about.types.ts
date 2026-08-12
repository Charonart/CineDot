export interface AboutStatCounter {
  label: string;
  value: string;
  icon: string;
}

export interface AboutCoreValue {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
}

export interface AboutTimelineItem {
  year: string;
  title: string;
  description: string;
  badgeText?: string;
}

export interface AboutFaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface AboutGalleryItem {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}
