import {useState} from "react";
import type {Post} from "../types";
import {useDeletePost} from "./useDeletePost";
import {usePostsWithIdeas} from "./usePostsWithIdeas";

// Hook for PostList
export const usePostList = () => {
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState<string>("feed");
    const {
        data: postsResponse,
        isLoading,
        error,
        refetch,
    } = usePostsWithIdeas(selectedTab);
    const deletePostMutation = useDeletePost();

    // Extract posts array from response
    const posts = postsResponse?.posts || [];

    const handlePostClick = (post: Post) => {
        setSelectedPost(post);
        setIsViewDialogOpen(true);
    };

    const handleCloseViewDialog = () => {
        setIsViewDialogOpen(false);
        setSelectedPost(null);
    };

    const handleDeletePost = async (post: Post) => {
        if (
            !confirm(
                `Tem certeza que deseja excluir o post "${
                    post.name || `Post ${post.id}`
                }"?`
            )
        ) {
            return;
        }

        try {
            await deletePostMutation.mutateAsync(post.id);
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Erro ao excluir o post. Tente novamente.");
        }
    };

    return {
        posts,
        isLoading,
        error,
        selectedPost,
        isViewDialogOpen,
        handlePostClick,
        handleCloseViewDialog,
        handleDeletePost,
        isDeleting: deletePostMutation.isPending,
        refetch,
        selectedTab, setSelectedTab
    };
};
