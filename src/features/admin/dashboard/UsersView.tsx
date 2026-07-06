"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Search, Edit2, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TablePagination } from "@/components/shared/TablePagination";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useAdminUsers } from "@/lib/query/hooks/useAdminUsers";
import { useDeleteUser } from "@/lib/query/hooks/useUserMutations";
import { usePagination } from "@/lib/hooks/usePagination";
import type { User } from "@/types";
import { UserEditModal } from "./UserEditModal";

const COLUMNS = ["ID", "Name", "Email", "Phone", "City", "Joined", "Orders", "Status", "Actions"];
const STATUS_OPTIONS = [
  { value: "all", label: "All Users" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("");

export function UsersView() {
  const { data: users = [] } = useAdminUsers();
  const deleteUser = useDeleteUser();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const filtered = users.filter(
    (u) =>
      (filter === "all" || u.status === filter) &&
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.city.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())),
  );
  const activeCount = users.filter((u) => u.status === "active").length;
  const { page, setPage, totalPages, pageItems } = usePagination(filtered);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteUser.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">All Users</h2>
          <p className="text-gray-500 text-sm mt-0.5">{activeCount} active users</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="pl-9 pr-4 py-2.5 text-sm rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0D6EFD] w-56"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter by status"
            className="px-4 py-2.5 text-sm rounded-xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0D6EFD] appearance-none cursor-pointer"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div
        className="bg-white rounded-2xl border overflow-hidden"
        style={{
          borderColor: "rgba(13,110,253,0.08)",
          boxShadow: "0 2px 16px rgba(13,110,253,0.06)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ background: "#F8FAFC" }}>
              <tr>
                {COLUMNS.map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageItems.map((u) => (
                <tr
                  key={u.id}
                  className="border-t hover:bg-blue-50/30 transition-colors"
                  style={{ borderColor: "rgba(13,110,253,0.05)" }}
                >
                  <td className="px-5 py-4 font-mono text-xs text-gray-400">{u.id}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ background: "linear-gradient(135deg, #0D6EFD, #00B4D8)" }}
                      >
                        {initials(u.name)}
                      </div>
                      <span className="font-semibold text-gray-900 whitespace-nowrap">
                        {u.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{u.email}</td>
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{u.phone}</td>
                  <td className="px-5 py-4 text-gray-500">{u.city}</td>
                  <td className="px-5 py-4 text-gray-400 whitespace-nowrap">{u.joined}</td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-gray-900">{u.orders}</span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditUser(u)}
                        aria-label={`Edit ${u.name}`}
                        className="w-8 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 flex items-center justify-center transition-colors"
                      >
                        <Edit2 size={14} className="text-amber-500" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(u)}
                        aria-label={`Delete ${u.name}`}
                        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                      >
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">No users match your search.</div>
        ) : (
          <TablePagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            label={`${filtered.length} users · Page ${page} of ${totalPages}`}
          />
        )}
      </div>

      <AnimatePresence>
        {editUser && <UserEditModal user={editUser} onClose={() => setEditUser(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <ConfirmDialog
            title="Delete user"
            message={`Delete ${deleteTarget.name} (${deleteTarget.email})? This can't be undone.`}
            loading={deleteUser.isPending}
            onConfirm={confirmDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
