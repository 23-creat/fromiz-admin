'use client';

import { AdminPanel } from '@/components/AdminPanel';
import { AuthGuard } from '@/components/AuthGuard';

export default function Home() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-white">
        <AdminPanel />
      </div>
    </AuthGuard>
  );
}