import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { apiGetFinanceDashboard, apiGetRefundRequests, apiApproveRefund, apiRejectRefund } from '../services/api';
import Footer from '../components/Footer';

const formatPrice = (v) => { const n = parseFloat(v); return (!n && n !== 0) ? '0' : n.toLocaleString('th-TH'); };
const formatDateTime = (s) => s ? new Date(s).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' }) : '-';

const REFUND_STATUS = {
  pending: { label: 'รออนุมัติ', color: 'bg-amber-100 text-amber-600 dark:bg-amber-500/10' },
  approved: { label: 'อนุมัติแล้ว', color: 'bg-green-100 text-green-600 dark:bg-green-500/10' },
  rejected: { label: 'ปฏิเสธ', color: 'bg-red-100 text-red-500 dark:bg-red-500/10' },
};

const FinanceDashboardPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, hasRole, getUserRole } = useAuth();
  const role = getUserRole();

  const [dashboard, setDashboard] = useState(null);
  const [refundRequests, setRefundRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview'); // overview | refunds

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }
    if (!hasRole('accountant', 'reception', 'manager', 'super_admin')) { navigate('/dashboard'); return; }
    loadAll();
  }, [user, authLoading]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [dRes, rRes] = await Promise.all([apiGetFinanceDashboard(), apiGetRefundRequests()]);
      if (dRes.success) setDashboard(dRes.data);
      if (rRes.success) setRefundRequests(rRes.data?.requests || []);
    } catch {} finally { setLoading(false); }
  };

  const handleApprove = async (id) => {
    const { isConfirmed } = await Swal.fire({
      icon: 'question', title: 'อนุมัติคืนเงิน?', text: 'ยอดเงินจะถูกคืนเข้ากระเป๋าผู้ใช้ (เมื่อครบทุกฝ่ายอนุมัติ)',
      confirmButtonText: 'อนุมัติ', cancelButtonText: 'ยกเลิก', showCancelButton: true, confirmButtonColor: '#22c55e'
    });
    if (!isConfirmed) return;
    try {
      const r = await apiApproveRefund(id);
      if (r.success) {
        Swal.fire({ icon: 'success', title: r.message || 'อนุมัติแล้ว', timer: 2000, showConfirmButton: false });
        loadAll();
      } else Swal.fire({ icon: 'error', title: 'ผิดพลาด', text: r.message, confirmButtonColor: '#3b82f6' });
    } catch { Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', confirmButtonColor: '#3b82f6' }); }
  };

  const handleReject = async (id) => {
    const { isConfirmed } = await Swal.fire({
      icon: 'warning', title: 'ปฏิเสธคืนเงิน?', text: 'การจองจะถูกเปลี่ยนกลับเป็นรอยืนยัน',
      confirmButtonText: 'ปฏิเสธ', cancelButtonText: 'ยกเลิก', showCancelButton: true, confirmButtonColor: '#ef4444'
    });
    if (!isConfirmed) return;
    try {
      const r = await apiRejectRefund(id);
      if (r.success) { Swal.fire({ icon: 'success', title: 'ปฏิเสธแล้ว', timer: 2000, showConfirmButton: false }); loadAll(); }
      else Swal.fire({ icon: 'error', title: 'ผิดพลาด', text: r.message, confirmButtonColor: '#3b82f6' });
    } catch { Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', confirmButtonColor: '#3b82f6' }); }
  };

  // Check if current user already approved a refund (based on role)
  const hasApproved = (req) => {
    if (role === 'super_admin') return req.approved_by_accountant && req.approved_by_reception && req.approved_by_manager;
    if (role === 'accountant') return !!req.approved_by_accountant;
    if (role === 'reception') return !!req.approved_by_reception;
    if (role === 'manager') return !!req.approved_by_manager;
    return false;
  };

  if (authLoading || loading) return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-indigo-50 dark:bg-darkmode">
      <Icon icon="mdi:loading" width="40" className="text-primary animate-spin" />
    </div>
  );

  const d = dashboard || {};
  const statCards = [
    { label: 'ยอดเติมเงิน', value: d.totalDeposits, icon: 'mdi:arrow-down-bold-circle', color: 'from-green-400 to-emerald-500', textC: 'text-green-500' },
    { label: 'ยอดชำระมัดจำ', value: d.totalPayments, icon: 'mdi:cash-register', color: 'from-blue-400 to-indigo-500', textC: 'text-blue-500' },
    { label: 'ยอดคืนเงิน', value: d.totalRefunds, icon: 'mdi:cash-refund', color: 'from-red-400 to-pink-500', textC: 'text-red-500' },
    { label: 'รายได้จากจอง', value: d.totalBookingRevenue, icon: 'mdi:chart-line', color: 'from-purple-400 to-violet-500', textC: 'text-purple-500' },
  ];

  const pendingRefunds = refundRequests.filter(r => r.status === 'pending');
  const processedRefunds = refundRequests.filter(r => r.status !== 'pending');

  return (
    <>
      <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 dark:bg-darkmode">
        <div className="container mx-auto max-w-5xl px-4 pt-28 pb-20">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-blue-400 flex items-center justify-center shadow-md shadow-blue-200">
                <Icon icon="mdi:finance" width="22" className="text-white" />
              </div>
              จัดการการเงิน
            </h1>
            <button onClick={loadAll} className="p-2 rounded-lg hover:bg-white dark:hover:bg-darklight transition cursor-pointer" title="รีเฟรช">
              <Icon icon="mdi:refresh" width="20" className="text-gray-400" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {statCards.map(s => (
              <div key={s.label} className="bg-white dark:bg-darklight rounded-2xl border border-blue-100/50 dark:border-dark_border p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${s.color} flex items-center justify-center shadow-md`}>
                    <Icon icon={s.icon} width="20" className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">{s.label}</p>
                    <p className={`text-lg font-bold ${s.textC}`}>฿{formatPrice(s.value)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pending refund alert */}
          {(d.pendingRefundCount > 0) && (
            <div className="bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
              <Icon icon="mdi:alert-circle" width="22" className="text-amber-500 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">มี {d.pendingRefundCount} คำขอคืนเงินรออนุมัติ</p>
                <p className="text-xs text-amber-600/70">ยอดรวม ฿{formatPrice(d.pendingRefundAmount)}</p>
              </div>
              <button onClick={() => setTab('refunds')} className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-semibold cursor-pointer">ดูคำขอ</button>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[['overview', 'ภาพรวม', 'mdi:chart-box'], ['refunds', 'คำขอคืนเงิน', 'mdi:cash-refund']].map(([k, l, ic]) => (
              <button key={k} onClick={() => setTab(k)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${tab === k ? 'bg-linear-to-r from-primary to-blue-400 text-white shadow-md' : 'bg-white dark:bg-darklight text-gray-500 border border-gray-200 dark:border-dark_border hover:border-blue-300'}`}>
                <Icon icon={ic} width="16" />{l}
                {k === 'refunds' && pendingRefunds.length > 0 && <span className="ml-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{pendingRefunds.length}</span>}
              </button>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {tab === 'overview' && (
            <div className="space-y-5">
              {/* Recent transactions */}
              <div className="bg-white dark:bg-darklight rounded-2xl border border-blue-100/50 dark:border-dark_border p-5">
                <h3 className="text-base font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Icon icon="mdi:history" width="18" className="text-purple-500" />ธุรกรรมล่าสุด
                </h3>
                {(!d.recentTransactions || d.recentTransactions.length === 0) ? (
                  <p className="text-gray-400 text-sm text-center py-6">ยังไม่มีธุรกรรม</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-gray-400 border-b border-gray-100 dark:border-dark_border">
                          <th className="pb-2 font-medium">ประเภท</th>
                          <th className="pb-2 font-medium">จำนวน</th>
                          <th className="pb-2 font-medium">คงเหลือ</th>
                          <th className="pb-2 font-medium">รายละเอียด</th>
                          <th className="pb-2 font-medium">เวลา</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 dark:divide-dark_border">
                        {d.recentTransactions.map(tx => {
                          const isPlus = tx.type === 'deposit' || tx.type === 'refund';
                          return (
                            <tr key={tx.id}>
                              <td className="py-2">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${isPlus ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                                  {tx.type}
                                </span>
                              </td>
                              <td className={`py-2 font-bold ${isPlus ? 'text-green-500' : 'text-red-500'}`}>{isPlus ? '+' : '-'}฿{formatPrice(Math.abs(parseFloat(tx.amount)))}</td>
                              <td className="py-2 text-gray-600 dark:text-white/60">฿{formatPrice(tx.balance_after)}</td>
                              <td className="py-2 text-gray-500 text-xs max-w-[200px] truncate">{tx.description || '-'}</td>
                              <td className="py-2 text-gray-400 text-xs">{formatDateTime(tx.created_at)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* REFUNDS TAB */}
          {tab === 'refunds' && (
            <div className="space-y-5">
              {/* Pending */}
              {pendingRefunds.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Icon icon="mdi:clock-alert" width="14" />รออนุมัติ ({pendingRefunds.length})
                  </h3>
                  <div className="space-y-3">
                    {pendingRefunds.map(r => (
                      <RefundCard key={r.id} r={r} role={role} approved={hasApproved(r)} onApprove={() => handleApprove(r.id)} onReject={() => handleReject(r.id)} />
                    ))}
                  </div>
                </div>
              )}

              {/* Processed */}
              {processedRefunds.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Icon icon="mdi:check-circle" width="14" />ดำเนินการแล้ว ({processedRefunds.length})
                  </h3>
                  <div className="space-y-3">
                    {processedRefunds.map(r => <RefundCard key={r.id} r={r} role={role} processed />)}
                  </div>
                </div>
              )}

              {refundRequests.length === 0 && (
                <div className="bg-white dark:bg-darklight rounded-2xl border border-blue-100 dark:border-dark_border p-10 text-center">
                  <Icon icon="mdi:check-circle" width="48" className="text-green-300 mx-auto mb-3" />
                  <p className="text-gray-400">ไม่มีคำขอคืนเงิน</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

const RefundCard = ({ r, role, approved, onApprove, onReject, processed }) => {
  const st = REFUND_STATUS[r.status] || REFUND_STATUS.pending;
  const approvals = [
    { key: 'accountant', label: 'บัญชี', done: !!r.approved_by_accountant },
    { key: 'reception', label: 'ต้อนรับ', done: !!r.approved_by_reception },
    { key: 'manager', label: 'ผู้จัดการ', done: !!r.approved_by_manager },
  ];

  return (
    <div className="bg-white dark:bg-darklight rounded-2xl border border-blue-100/50 dark:border-dark_border p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-800 dark:text-white">คำขอ #{r.id}</p>
          <p className="text-xs text-gray-400 mt-0.5">Booking #{r.booking_id} — {formatDateTime(r.created_at)}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${st.color}`}>{st.label}</span>
          <span className="text-lg font-bold text-primary">฿{formatPrice(r.amount)}</span>
        </div>
      </div>

      {r.reason && <p className="text-xs text-gray-500 bg-gray-50 dark:bg-darkmode rounded-lg p-2 mb-3">{r.reason}</p>}

      {/* Approval progress */}
      <div className="flex items-center gap-3 mb-3">
        {approvals.map(a => (
          <div key={a.key} className="flex items-center gap-1.5">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${a.done ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
              <Icon icon={a.done ? 'mdi:check' : 'mdi:clock'} width="12" className={a.done ? 'text-white' : 'text-gray-400'} />
            </div>
            <span className={`text-[10px] font-medium ${a.done ? 'text-green-600' : 'text-gray-400'}`}>{a.label}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      {!processed && r.status === 'pending' && (
        <div className="flex gap-2">
          {!approved ? (
            <button onClick={onApprove} className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition cursor-pointer">
              <Icon icon="mdi:check" width="14" />อนุมัติ ({role === 'super_admin' ? 'ทั้งหมด' : REFUND_STATUS.pending.label})
            </button>
          ) : (
            <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-100 text-green-600 text-xs font-semibold">
              <Icon icon="mdi:check-circle" width="14" />คุณอนุมัติแล้ว
            </span>
          )}
          <button onClick={onReject} className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-100 transition cursor-pointer">
            <Icon icon="mdi:close" width="14" />ปฏิเสธ
          </button>
        </div>
      )}
    </div>
  );
};

export default FinanceDashboardPage;
