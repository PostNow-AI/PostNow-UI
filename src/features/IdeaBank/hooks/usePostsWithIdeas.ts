import {useQuery} from "@tanstack/react-query";
import {ideaBankService} from "../services";
import type {PostsWithIdeasResponse} from "../types";

export const usePostsWithIdeas = (postType: string) => {
    return useQuery<PostsWithIdeasResponse>({
        queryKey: ["posts-with-ideas", postType],
        queryFn: async () => {
            const data = await ideaBankService.getPostsWithIdeas(postType);
            return data;
        },
    });
};
