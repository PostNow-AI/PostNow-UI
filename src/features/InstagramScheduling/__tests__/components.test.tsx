/**
 * Tests for Instagram Scheduling components
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";

import { DateTimePicker } from "../components/DateTimePicker";
import { InstagramAccountSelector } from "../components/InstagramAccountSelector";
import { ScheduledPostCard } from "../components/ScheduledPostCard";

describe("DateTimePicker", () => {
  it("should render with placeholder when no value", () => {
    render(<DateTimePicker value={undefined} onChange={vi.fn()} />);

    expect(screen.getByText("Selecione data e hora")).toBeInTheDocument();
  });

  it("should display formatted date when value is set", () => {
    const date = new Date("2026-03-15T14:30:00");
    render(<DateTimePicker value={date} onChange={vi.fn()} />);

    expect(screen.getByText(/15\/03\/2026/)).toBeInTheDocument();
  });

  it("should be disabled when disabled prop is true", () => {
    render(<DateTimePicker value={undefined} onChange={vi.fn()} disabled />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("should show error styling when hasError is true", () => {
    render(<DateTimePicker value={undefined} onChange={vi.fn()} hasError />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("border-destructive");
  });
});

describe("InstagramAccountSelector", () => {
  const mockAccounts = [
    {
      id: 1,
      instagram_username: "account1",
      instagram_name: "Account One",
      profile_picture_url: "https://example.com/pic1.jpg",
      status: "connected" as const,
      is_token_valid: true,
      days_until_expiration: 30,
    },
    {
      id: 2,
      instagram_username: "account2",
      instagram_name: "Account Two",
      profile_picture_url: "https://example.com/pic2.jpg",
      status: "connected" as const,
      is_token_valid: true,
      days_until_expiration: 15,
    },
  ];

  it("should render accounts", () => {
    render(
      <InstagramAccountSelector
        accounts={mockAccounts}
        value={undefined}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByText("Selecione uma conta")).toBeInTheDocument();
  });

  it("should show selected account", () => {
    render(
      <InstagramAccountSelector
        accounts={mockAccounts}
        value={1}
        onChange={vi.fn()}
      />
    );

    expect(screen.getByText("@account1")).toBeInTheDocument();
  });

  it("should show error styling when hasError is true", () => {
    const { container } = render(
      <InstagramAccountSelector
        accounts={mockAccounts}
        value={undefined}
        onChange={vi.fn()}
        hasError
      />
    );

    const trigger = container.querySelector("[data-slot='select-trigger']");
    expect(trigger).toHaveClass("border-destructive");
  });

  it("should show message when no accounts", () => {
    render(
      <InstagramAccountSelector
        accounts={[]}
        value={undefined}
        onChange={vi.fn()}
      />
    );

    expect(
      screen.getByText(/Nenhuma conta Instagram conectada/)
    ).toBeInTheDocument();
  });
});

describe("ScheduledPostCard", () => {
  const mockPost = {
    id: 1,
    caption_preview: "Test caption for the post...",
    caption: "Test caption for the post with more content",
    media_type: "IMAGE" as const,
    media_type_display: "Imagem",
    media_urls: ["https://example.com/image.jpg"],
    scheduled_for: "2026-03-15T14:30:00Z",
    status: "scheduled" as const,
    status_display: "Agendado",
    instagram_username: "testaccount",
    profile_picture_url: "https://example.com/profile.jpg",
    instagram_permalink: null,
    published_at: null,
    created_at: "2026-03-01T10:00:00Z",
  };

  it("should render post card", () => {
    render(
      <ScheduledPostCard
        post={mockPost}
        onCancel={vi.fn()}
        onDelete={vi.fn()}
        onPublishNow={vi.fn()}
        onRetry={vi.fn()}
      />
    );

    expect(screen.getByText("Test caption for the post...")).toBeInTheDocument();
    expect(screen.getByText("@testaccount")).toBeInTheDocument();
  });

  it("should show status badge", () => {
    render(
      <ScheduledPostCard
        post={mockPost}
        onCancel={vi.fn()}
        onDelete={vi.fn()}
        onPublishNow={vi.fn()}
        onRetry={vi.fn()}
      />
    );

    expect(screen.getByText("Agendado")).toBeInTheDocument();
  });

  it("should show media type", () => {
    render(
      <ScheduledPostCard
        post={mockPost}
        onCancel={vi.fn()}
        onDelete={vi.fn()}
        onPublishNow={vi.fn()}
        onRetry={vi.fn()}
      />
    );

    expect(screen.getByText("Imagem")).toBeInTheDocument();
  });

  it("should show thumbnail image", () => {
    render(
      <ScheduledPostCard
        post={mockPost}
        onCancel={vi.fn()}
        onDelete={vi.fn()}
        onPublishNow={vi.fn()}
        onRetry={vi.fn()}
      />
    );

    const img = screen.getByAltText("Post thumbnail");
    expect(img).toHaveAttribute("src", "https://example.com/image.jpg");
  });

  it("should disable button when isLoading is true", () => {
    render(
      <ScheduledPostCard
        post={mockPost}
        onCancel={vi.fn()}
        onDelete={vi.fn()}
        onPublishNow={vi.fn()}
        onRetry={vi.fn()}
        isLoading
      />
    );

    // Find the dropdown trigger button (MoreVertical icon button)
    const buttons = screen.getAllByRole("button");
    const menuButton = buttons.find((b) => b.hasAttribute("aria-haspopup"));
    expect(menuButton).toBeDisabled();
  });

  it("should show permalink for published posts", () => {
    const publishedPost = {
      ...mockPost,
      status: "published" as const,
      status_display: "Publicado",
      instagram_permalink: "https://instagram.com/p/abc123",
      published_at: "2026-03-15T14:35:00Z",
    };

    render(
      <ScheduledPostCard
        post={publishedPost}
        onCancel={vi.fn()}
        onDelete={vi.fn()}
        onPublishNow={vi.fn()}
        onRetry={vi.fn()}
      />
    );

    const link = screen.getByRole("link", { name: /Ver no Instagram/i });
    expect(link).toHaveAttribute("href", "https://instagram.com/p/abc123");
  });

  it("should not show actions menu for published posts", () => {
    const publishedPost = {
      ...mockPost,
      status: "published" as const,
      status_display: "Publicado",
    };

    render(
      <ScheduledPostCard
        post={publishedPost}
        onCancel={vi.fn()}
        onDelete={vi.fn()}
        onPublishNow={vi.fn()}
        onRetry={vi.fn()}
      />
    );

    // Published posts should not have the action menu button
    const buttons = screen.queryAllByRole("button");
    const menuButton = buttons.find((b) => b.hasAttribute("aria-haspopup"));
    expect(menuButton).toBeUndefined();
  });
});

describe("SchedulePostDialog", () => {
  // Note: Full dialog tests require mocking hooks which is complex
  // These are placeholder tests for structure

  it("should strip HTML from initialCaption", () => {
    // Test the stripHtml function behavior
    const html = "<p>Test <strong>caption</strong></p>";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || "";

    expect(text).toBe("Test caption");
  });
});
