const STATUS_MAP: Record<string, { bg: string; text: string; label: string }> = {
  new: { bg: "#EFF6FF", text: "#2563EB", label: "New" },
  contacted: { bg: "#FFF7ED", text: "#EA580C", label: "Contacted" },
  converted: { bg: "#F0FDF4", text: "#16A34A", label: "Converted" },
  pending: { bg: "#FFF7ED", text: "#D97706", label: "Pending" },
  confirmed: { bg: "#EFF6FF", text: "#2563EB", label: "Confirmed" },
  "out-for-delivery": { bg: "#F5F3FF", text: "#7C3AED", label: "Out for Delivery" },
  delivered: { bg: "#F0FDF4", text: "#16A34A", label: "Delivered" },
  cancelled: { bg: "#FFF1F2", text: "#E11D48", label: "Cancelled" },
  active: { bg: "#F0FDF4", text: "#16A34A", label: "Active" },
  inactive: { bg: "#F9FAFB", text: "#6B7280", label: "Inactive" },
};

/** A coloured pill that maps an order/query/user status to a styled label. */
export function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] || { bg: "#F9FAFB", text: "#6B7280", label: status };
  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs font-bold"
      style={{ background: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  );
}
