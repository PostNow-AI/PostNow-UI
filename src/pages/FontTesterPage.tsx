import FontDebugger from "@/components/FontDebugger";
import FontLoadingTest from "@/components/FontLoadingTest";
import FontTester from "@/components/FontTester";

export const FontTesterPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Font Tester</h1>
        <p className="text-muted-foreground mt-2">
          Test all available Google Fonts in your PostNow application. These
          fonts are available for text overlays on images.
        </p>
      </div>

      {/* Font Loading Status Report */}
      <div className="mb-8">
        <FontLoadingTest />
      </div>

      {/* Debug information */}
      <div className="mb-6">
        <FontDebugger />
      </div>

      <FontTester />
    </div>
  );
};

export default FontTesterPage;
