"use client";

import Link from "next/link";
import { useState } from "react";
import type { ServiceStatus } from "../../lib/enums";
import { serviceStatusLabels } from "../../lib/enums";
import { StatusBadge } from "../components/AdminUI";
import AddServiceModal from "./AddServiceModal";
import EditServiceModal from "./EditServiceModal";

export type ServiceRow = {
  id: string;
  title: string;
  description: string;
  note: string;
  items: string[];
  amountNgn: number | null;
  duration: string | null;
  imageUrl: string | null;
  status: ServiceStatus;
};

type ServicesManagerProps = {
  services: ServiceRow[];
};

export default function ServicesManager({ services }: ServicesManagerProps) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<ServiceRow | null>(null);

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">{services.length} services in the catalog</p>
        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
        >
          + Add Service
        </button>
      </div>

      <div className="space-y-4">
        {services.map((service, index) => (
          <div
            key={service.id}
            className="rounded-xl border border-border bg-surface p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-display text-sm font-bold text-primary/40">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-semibold text-foreground">{service.title}</h3>
                  <StatusBadge status={serviceStatusLabels[service.status]} />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{service.description}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {service.items.slice(0, 4).map((item) => (
                    <li
                      key={item}
                      className="rounded-full bg-background px-3 py-1 text-xs text-muted"
                    >
                      {item}
                    </li>
                  ))}
                  {service.items.length > 4 && (
                    <li className="rounded-full bg-background px-3 py-1 text-xs text-muted">
                      +{service.items.length - 4} more
                    </li>
                  )}
                </ul>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => setServiceToEdit(service)}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-background"
                >
                  Edit
                </button>
                <Link
                  href={`/services/${service.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20"
                >
                  Preview
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddServiceModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
      <EditServiceModal service={serviceToEdit} onClose={() => setServiceToEdit(null)} />
    </>
  );
}
