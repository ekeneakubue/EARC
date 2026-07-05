"use client";

import Link from "next/link";
import { useState } from "react";
import { contentStatusLabels } from "../../lib/enums";
import type { ContentSectionRow } from "../../lib/content-data";
import { StatusBadge } from "../components/AdminUI";
import EditContentModal from "./EditContentModal";

type ContentManagerProps = {
  sections: ContentSectionRow[];
};

function formatUpdated(date: Date) {
  if (date.getTime() === 0) {
    return "Not saved yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function ContentManager({ sections }: ContentManagerProps) {
  const [sectionToEdit, setSectionToEdit] = useState<ContentSectionRow | null>(null);

  return (
    <>
      <div className="mb-6">
        <p className="text-sm text-muted">
          {sections.length} website sections. Edits are published to the homepage when status is
          Published.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((page) => (
          <div
            key={page.id}
            className="rounded-xl border border-border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-3 flex items-start justify-between">
              <span className="rounded-md bg-background px-2 py-1 text-xs font-medium text-muted">
                {page.section}
              </span>
              <StatusBadge status={contentStatusLabels[page.status]} />
            </div>
            <h3 className="font-semibold text-foreground">{page.title}</h3>
            <p className="mt-1 text-xs text-muted">Updated {formatUpdated(page.updatedAt)}</p>
            <div className="mt-4 flex gap-2">
              {page.editHref ? (
                <Link
                  href={page.editHref}
                  className="flex-1 rounded-lg border border-border py-2 text-center text-sm font-medium hover:bg-background"
                >
                  Manage
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setSectionToEdit(page)}
                  className="flex-1 rounded-lg border border-border py-2 text-sm font-medium hover:bg-background"
                >
                  Edit
                </button>
              )}
              <Link
                href={page.previewPath}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-lg bg-primary/10 py-2 text-center text-sm font-medium text-primary hover:bg-primary/20"
              >
                Preview
              </Link>
            </div>
          </div>
        ))}
      </div>

      <EditContentModal section={sectionToEdit} onClose={() => setSectionToEdit(null)} />
    </>
  );
}
