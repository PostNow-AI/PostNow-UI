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
  element?: string;
  text?: string;
  position?: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
  };
  style?: {
    display?: string;
    "flex-direction"?: string;
    "align-items"?: string;
    "justify-content"?: string;
    gap?: string;
    "align-self"?: string;
    padding?: string;
    "margin-top"?: string;
    background?: string;
    "border-radius"?: string;
    border?: string;
    "font-family"?: string;
    font_size?: string;
    font_weight?: string;
    "line-height"?: string;
    "letter-spacing"?: string;
    color?: string;
    "text-align"?: string;
    "text-transform"?: string;
    "text-shadow"?: string;
    "box-shadow"?: string;
    opacity?: string;
    "backdrop-filter"?: string;
  };
  children?: ImageTextElement[];
}

export interface ImageTextData {
  main_container?: ImageTextElement;
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
