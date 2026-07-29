"use client";

import { useState } from "react";
import { contentStatusLabels } from "../../lib/enums";
import type { AdminNewsItem } from "../../lib/news-data";
import AddNewsModal from "./AddNewsModal";
import DeleteNewsModal from "./DeleteNewsModal";
import EditNewsModal from "./EditNewsModal";

type NewsManagerProps = {
  items: AdminNewsItem[];
};

function formatUpdated(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function NewsManager({ items }: NewsManagerProps) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<AdminNewsItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<AdminNewsItem | null>(null);

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">{items.length} news items</p>
        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
        >
          + Add News
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-sm">
        <table className="w-full min-w-3xl text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-background/50 text-xs uppercase tracking-wider text-muted">
              <th className="px-6 py-3 font-semibold">Title</th>
              <th className="px-6 py-3 font-semibold">Category</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Updated</th>
              <th className="px-6 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted">
                  No news yet. Add the first homepage update.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border last:border-0 hover:bg-background/50"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="mt-1 max-w-md truncate text-xs text-muted">
                      {item.description}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-muted">{item.category}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        item.status === "PUBLISHED"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {contentStatusLabels[item.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted">{formatUpdated(item.updatedAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setItemToEdit(item)}
                        className="text-sm font-medium text-primary hover:text-primary-light"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setItemToDelete(item)}
                        className="text-sm font-medium text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AddNewsModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
      <EditNewsModal item={itemToEdit} onClose={() => setItemToEdit(null)} />
      <DeleteNewsModal item={itemToDelete} onClose={() => setItemToDelete(null)} />
    </>
  );
}
