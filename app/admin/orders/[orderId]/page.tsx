import { AdminOrderDetail } from '@/components/admin/AdminOrderDetail';

export default function AdminOrderPage({ params }: { params: { orderId: string } }) {
  return (
    <div className="container mx-auto max-w-5xl space-y-6 py-12">
      <AdminOrderDetail orderId={params.orderId} />
    </div>
  );
}
