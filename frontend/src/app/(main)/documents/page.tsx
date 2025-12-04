import { readFile } from "fs/promises";
import { join } from "path";
import { DocumentContent } from "@/modules/documents/document-content";

export const metadata = {
  title: "Documentation - PEN2-Stack",
  description: "Architecture patterns and code structure documentation",
};

async function getMarkdownContent(): Promise<string> {
  const filePath = join(process.cwd(), "src/app/(main)/documents/patterns.md");
  const content = await readFile(filePath, "utf-8");
  return content;
}

export default async function DocumentsPage() {
  const markdownContent = await getMarkdownContent();

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <DocumentContent content={markdownContent} />
    </div>
  );
}
