import {
  creatorProfileApi,
  type CreatorProfile,
} from "@/lib/creator-profile-api";
import {
  profileCompletionSchema,
  type ProfileCompletionData,
} from "@/types/profile-completion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const useProfileCompletion = (profile: CreatorProfile) => {
  const [expertiseInput, setExpertiseInput] = useState("");
  const [toolsInput, setToolsInput] = useState("");
  const queryClient = useQueryClient();

  // Form setup
  const form = useForm<ProfileCompletionData>({
    resolver: zodResolver(profileCompletionSchema),
    defaultValues: {
      specific_profession: profile.specific_profession || "",
      target_audience: profile.target_audience || "",
      communication_tone: profile.communication_tone || "",
      expertise_areas: profile.expertise_areas || [],
      preferred_duration: profile.preferred_duration || "",
      complexity_level: profile.complexity_level || "",
      theme_diversity: profile.theme_diversity || 5,
      publication_frequency: profile.publication_frequency || "",
      instagram_username: profile.instagram_username || "",
      linkedin_url: profile.linkedin_url || "",
      twitter_username: profile.twitter_username || "",
      tiktok_username: profile.tiktok_username || "",
      revenue_stage: profile.revenue_stage || "",
      team_size: profile.team_size || "",
      revenue_goal: profile.revenue_goal || "",
      authority_goal: profile.authority_goal || "",
      leads_goal: profile.leads_goal || "",
      has_designer: profile.has_designer || false,
      current_tools: profile.current_tools || [],
      tools_budget: profile.tools_budget || "",
      preferred_hours: profile.preferred_hours || [],
    },
  });

  const { register, handleSubmit, setValue, watch } = form;

  // Fetch choices and suggestions
  const { data: choices } = useQuery({
    queryKey: ["profile-choices"],
    queryFn: creatorProfileApi.getChoices,
  });

  const { data: suggestions } = useQuery({
    queryKey: ["profile-suggestions"],
    queryFn: creatorProfileApi.getSuggestions,
  });

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: creatorProfileApi.updateProfile,
    onSuccess: (data) => {
      toast.success("Perfil atualizado!", {
        description: `${data.profile.completeness_percentage}% completo`,
      });

      queryClient.invalidateQueries({ queryKey: ["creator-profile"] });
      queryClient.invalidateQueries({
        queryKey: ["profile-completion-status"],
      });
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        const message =
          error.response?.data?.message || "Erro ao atualizar perfil";
        toast.error("Erro na atualização", {
          description: message,
        });
      }
    },
  });

  // Handle form submission
  const onSubmit = (data: ProfileCompletionData) => {
    updateMutation.mutate(data);
  };

  // Handle adding expertise areas
  const handleAddExpertise = () => {
    if (expertiseInput.trim()) {
      const currentAreas = watch("expertise_areas") || [];
      if (!currentAreas.includes(expertiseInput.trim())) {
        setValue("expertise_areas", [...currentAreas, expertiseInput.trim()]);
      }
      setExpertiseInput("");
    }
  };

  // Handle removing expertise area
  const handleRemoveExpertise = (area: string) => {
    const currentAreas = watch("expertise_areas") || [];
    setValue(
      "expertise_areas",
      currentAreas.filter((a) => a !== area)
    );
  };

  // Handle adding tools
  const handleAddTool = () => {
    if (toolsInput.trim()) {
      const currentTools = watch("current_tools") || [];
      if (!currentTools.includes(toolsInput.trim())) {
        setValue("current_tools", [...currentTools, toolsInput.trim()]);
      }
      setToolsInput("");
    }
  };

  // Handle removing tool
  const handleRemoveTool = (tool: string) => {
    const currentTools = watch("current_tools") || [];
    setValue(
      "current_tools",
      currentTools.filter((t) => t !== tool)
    );
  };

  // Handle toggling preferred hours
  const handleToggleHour = (hour: string) => {
    const currentHours = watch("preferred_hours") || [];
    if (currentHours.includes(hour)) {
      setValue(
        "preferred_hours",
        currentHours.filter((h) => h !== hour)
      );
    } else {
      setValue("preferred_hours", [...currentHours, hour]);
    }
  };

  return {
    // Form
    form,
    register,
    handleSubmit,
    setValue,
    watch,
    onSubmit,

    // State
    expertiseInput,
    setExpertiseInput,
    toolsInput,
    setToolsInput,

    // Data
    choices,
    suggestions,
    updateMutation,

    // Handlers
    handleAddExpertise,
    handleRemoveExpertise,
    handleAddTool,
    handleRemoveTool,
    handleToggleHour,
  };
};
