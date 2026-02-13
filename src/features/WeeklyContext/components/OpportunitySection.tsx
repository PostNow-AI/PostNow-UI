import { ChevronDown, ChevronRight } from "lucide-react";
import type { OpportunityItem, OpportunitySection as OpportunitySectionType, SectionKey } from "../types";
import { SECTION_CONFIG } from "../types";
import { OpportunityCard } from "./OpportunityCard";
import { Badge } from "@/components/ui";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface OpportunitySectionProps {
  sectionKey: SectionKey;
  section: OpportunitySectionType;
  isExpanded: boolean;
  onToggle: () => void;
  onCreatePost: (item: OpportunityItem) => void;
}

export const OpportunitySection = ({
  sectionKey,
  section,
  isExpanded,
  onToggle,
  onCreatePost,
}: OpportunitySectionProps) => {
  const config = SECTION_CONFIG[sectionKey];

  if (!section || !section.items || section.items.length === 0) {
    return null;
  }

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle} className="mb-4">
      <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800">
        <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{config.emoji}</span>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {section.titulo}
            </h2>
            <Badge variant="secondary">{section.count}</Badge>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-500" />
          )}
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="p-4 border-t">
            {section.items.map((item, index) => (
              <OpportunityCard
                key={index}
                item={item}
                borderColor={config.borderColor}
                bgColor={config.bgColor}
                onCreatePost={onCreatePost}
              />
            ))}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

