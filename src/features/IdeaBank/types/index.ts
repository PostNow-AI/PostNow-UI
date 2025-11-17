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

export interface Position {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  width?: string;
  height?: string;
  transform?: string; // For centering with translateX(-50%), etc.
}

export interface ElementStyle {
  display?: string;
  "flex-direction"?: string;
  "align-items"?: string;
  "justify-content"?: string;
  gap?: string;
  "align-self"?: string;
  padding?: string;
  margin?: string;
  "margin-top"?: string;
  "margin-bottom"?: string;
  "margin-left"?: string;
  "margin-right"?: string;
  background?: string;
  "border-radius"?: string;
  border_radius?: string; // Support underscore version
  border?: string;
  "font-family"?: string;
  font_family?: string; // Support underscore version
  font_size?: string;
  "font-size"?: string; // Support hyphenated version
  font_weight?: string;
  "font-weight"?: string; // Support hyphenated version
  "line-height"?: string;
  "letter-spacing"?: string;
  color?: string;
  "text-align"?: string;
  "text-transform"?: string;
  "text-shadow"?: string;
  text_shadow?: string; // Support underscore version
  "box-shadow"?: string;
  opacity?: string;
  "backdrop-filter"?: string;
  "z-index"?: string;
  transform?: string;
  transition?: string;
}

export interface ImageTextElement {
  element?: string;
  text?: string;
  position?: Position;
  style?: ElementStyle;
  children?: ImageTextElement[];
}

export interface TextElement {
  text: string;
  position?: Position;
  style?: ElementStyle;
}

export interface ContainerElement {
  position: Position;
  style: ElementStyle;
  elements: string[]; // Array of element names contained within
}

export interface OuterBorder {
  color: string;
  padding: string;
  border_radius?: string;
}

export interface ImageTextData {
  // Layout type for new creative system
  layout_type?: string;

  // Outer border for cafe-style designs
  outer_border?: OuterBorder;

  // Individual elements (new structure)
  title?: TextElement;
  subtitle?: TextElement;
  cta?: TextElement;

  // Container-based approach
  main_container?: ImageTextElement & {
    elements?: string[];
  };

  // Legacy support for backwards compatibility
  elements?: ImageTextElement[];
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
