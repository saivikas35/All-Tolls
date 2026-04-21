import BaseResumeTemplate from "./BaseResumeTemplate";
import { templateVariants } from "./templateVariants";

export default function TemplateSelector({ data }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {templateVariants.map((t) => (
        <div key={t.id} className="border p-2">
          <BaseResumeTemplate
            data={data}
            layout={t.layout}
            variants={t.variants}
          />
        </div>
      ))}
    </div>
  );
}
