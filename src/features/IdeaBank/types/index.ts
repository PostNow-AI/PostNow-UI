export interface Post {
  id: number;
  name: string;
  objective: string;
  objective_display: string;
  type: string;
  type_display: string;
  target_gender?: string;
  target_gender_display?: string;
  target_age?: string;
  target_location?: string;
  target_salary?: string;
  target_interests?: string;
  has_target_audience: boolean;
  ideas_count: number;
  created_at: string;
  updated_at: string;
  ideas?: PostIdea[];
}

export interface PostIdea {
  id: number;
  content: string;
  content_preview: string;
  image_url?: string;
  status: "draft" | "approved" | "archived";
  status_display: string;
  ai_provider: string;
  ai_model: string;
  post_name: string;
  post_type: string;
  created_at: string;
  updated_at: string;
  post_id: number;
  image_text: { feed_image_text: ImageTextData | null };
}

export interface ImageTextElement {
  text?: string;
  color?: string;
  typography?: {
    font_size?: string;
    font_family?: string;
    font_weight?: string;
    line_height?: string;
    letter_spacing?: string;
  };
  position?: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    padding?: string;
  };
  text_align?: "left" | "center" | "right" | "justify";
  text_transform?: "uppercase" | "lowercase" | "capitalize" | "none";
  effects?: {
    text_shadow?: string;
    background?: string;
    border?: string;
    border_radius?: string;
    backdrop_filter?: string;
    opacity?: string;
    padding?: string;
    box_shadow?: string;
    hover_effects?: string;
    gradient?: string;
  };
}

export interface ImageTextData {
  title?: ImageTextElement;
  subtitle?: ImageTextElement;
  cta?: ImageTextElement;
}

export interface PostStats {
  posts: {
    total: number;
    with_ideas: number;
    without_ideas: number;
  };
  ideas: {
    total: number;
    approved: number;
    draft: number;
    archived: number;
  };
}

export interface PostsWithIdeasResponse {
  posts: Post[];
  total_posts: number;
  total_ideas: number;
}

export interface PostCreationData {
  name: string;
  objective:
    | "sales"
    | "branding"
    | "engagement"
    | "awareness"
    | "lead_generation"
    | "education";
  type: "post" | "story" | "reel" | "carousel";
  further_details?: string;
  include_image: boolean;
}

export interface PostCreationResponse {
  post: Post;
  idea: PostIdea;
}
