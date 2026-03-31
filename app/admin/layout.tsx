import AdminSidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto admin-scroll pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
