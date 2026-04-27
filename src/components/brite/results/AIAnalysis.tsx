import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles } from "lucide-react";

interface Props {
  analysis: string;
  loading: boolean;
  error: string | null;
}

export function AIAnalysis({ analysis, loading, error }: Props) {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Powered by Gemini</p>
              <p className="text-lg font-bold text-foreground">Generating AI Diagnosis…</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-5 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <Skeleton className="h-28 w-full mt-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-border/50 bg-indigo-50/50 dark:bg-indigo-950/20">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Powered by Gemini</p>
            <p className="text-lg font-bold text-foreground">AI Architecture Diagnosis</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-5">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ children }) => (
                <div className="overflow-x-auto my-4 rounded-xl border border-border">
                  <table className="w-full border-collapse text-sm">{children}</table>
                </div>
              ),
              th: ({ children }) => (
                <th className="bg-indigo-50 dark:bg-indigo-950/30 px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300 border-b border-border">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-2.5 text-sm border-b border-border/50 last:border-0">{children}</td>
              ),
              h2: ({ children }) => (
                <h2 className="flex items-center gap-2 text-base font-bold mt-7 mb-2 text-foreground before:content-[''] before:block before:w-1 before:h-5 before:rounded-full before:bg-indigo-500 before:flex-shrink-0">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-sm font-semibold mt-4 mb-1.5 text-foreground">{children}</h3>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">{children}</strong>
              ),
              ul: ({ children }) => <ul className="list-disc pl-5 space-y-1.5 my-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1.5 my-2">{children}</ol>,
              li: ({ children }) => <li className="text-foreground/90 leading-relaxed">{children}</li>,
              p: ({ children }) => <p className="mb-3 text-foreground/85 leading-relaxed">{children}</p>,
              code: ({ children }) => (
                <code className="px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-mono">
                  {children}
                </code>
              ),
            }}
          >
            {analysis}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
