"use client";

import { useState } from "react";
import { UserRole, UserStatus } from "@prisma/client";
import { StatusBadge } from "../components/AdminUI";
import { userRoleLabels, userStatusLabels } from "../../lib/models";
import AddUserModal from "./AddUserModal";
import DeleteUserModal from "./DeleteUserModal";
import EditUserModal from "./EditUserModal";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastActive: string;
};

type UsersManagerProps = {
  users: UserRow[];
};

export default function UsersManager({ users }: UsersManagerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserRow | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserRow | null>(null);

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">{users.length} users registered</p>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
        >
          + Add User
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-background/50 text-xs uppercase tracking-wider text-muted">
              <th className="px-6 py-3 font-semibold">User</th>
              <th className="px-6 py-3 font-semibold">Role</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Last Active</th>
              <th className="px-6 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted">
                  No users found. Add your first user to get started.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border last:border-0 hover:bg-background/50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                      {userRoleLabels[user.role]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={userStatusLabels[user.status]} />
                  </td>
                  <td className="px-6 py-4 text-muted">{user.lastActive}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setUserToEdit(user)}
                        className="text-sm font-medium text-primary hover:text-primary-light"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setUserToDelete(user)}
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

      <AddUserModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <EditUserModal user={userToEdit} onClose={() => setUserToEdit(null)} />
      <DeleteUserModal user={userToDelete} onClose={() => setUserToDelete(null)} />
    </>
  );
}
