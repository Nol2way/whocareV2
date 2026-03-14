import { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import AOS from 'aos';
import { apiGetPublicDoctors } from '../services/api';
import Footer from '../components/Footer';

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGetPublicDoctors();
      if (res.success) {
        setDoctors(res.data || []);
        setTimeout(() => AOS.refresh(), 50);
      } else {
        setError(res.message || 'ไม่สามารถโหลดข้อมูลแพทย์ได้');
        console.error('Doctors API error:', res);
      }
    } catch (err) {
      setError('ไม่สามารถเชื่อมต่อ server ได้');
      console.error('Doctors fetch error:', err);
    }
    setLoading(false);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return doctors;
    return doctors.filter((d) =>
      d.name.toLowerCase().includes(q) ||
      (d.nationality || '').toLowerCase().includes(q)
    );
  }, [search, doctors]);

  const getInitials = (name) => {
    const parts = name.replace(/^[^\s]+\.\s*/, '').trim().split(' ');
    return parts.slice(0, 2).map((p) => p[0] || '').join('').toUpperCase() || 'DR';
  };

  const AVATAR_COLORS = [
    'from-blue-400 to-blue-600',
    'from-teal-400 to-teal-600',
    'from-violet-400 to-violet-600',
    'from-rose-400 to-rose-600',
    'from-amber-400 to-amber-600',
    'from-emerald-400 to-emerald-600',
  ];

  return (
    <>
      <div className="min-h-screen bg-section dark:bg-darkmode pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">

          {/* Header */}
          <div className="text-center mb-10" data-aos="fade-up">
            <h1 className="text-3xl sm:text-4xl font-bold text-midnight_text dark:text-white">
              ทีมแพทย์ผู้เชี่ยวชาญ
            </h1>
            <div className="w-12 h-1 bg-primary rounded-full mt-3 mx-auto" />
            <p className="text-grey dark:text-white/50 mt-3">
              พบกับแพทย์ผู้เชี่ยวชาญของเราที่พร้อมดูแลคุณทุกก้าว
            </p>
          </div>

          {/* Search */}
          <div className="flex gap-2 max-w-md mx-auto mb-10" data-aos="fade-up">
            <div className="relative flex-1">
              <Icon
                icon="mdi:magnify"
                width="20"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-grey"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหาชื่อแพทย์..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border dark:border-dark_border bg-white dark:bg-darklight text-midnight_text dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-grey hover:text-primary"
                >
                  <Icon icon="mdi:close" width="16" />
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          {!loading && !error && (
            <p className="text-center text-sm text-grey dark:text-white/40 mb-8">
              {search
                ? `พบ ${filtered.length} จาก ${doctors.length} คน`
                : `แพทย์ทั้งหมด ${doctors.length} คน`}
            </p>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="text-center py-16">
              <Icon icon="mdi:alert-circle-outline" width="56" className="mx-auto mb-3 text-red-400" />
              <p className="text-red-500 font-semibold">{error}</p>
              <button
                onClick={loadDoctors}
                className="mt-4 px-5 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
              >
                ลองใหม่
              </button>
            </div>
          )}

          {/* Loading skeleton / grid */}
          {!error && loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white dark:bg-darklight rounded-2xl p-6 flex flex-col items-center gap-3 border border-border dark:border-dark_border">
                  <div className="w-20 h-20 rounded-full bg-section dark:bg-darkmode" />
                  <div className="h-4 bg-section dark:bg-darkmode rounded w-3/4" />
                  <div className="h-3 bg-section dark:bg-darkmode rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : !error && filtered.length === 0 ? (
            <div className="text-center py-20">
              <Icon icon="mdi:doctor" width="64" className="mx-auto mb-3 text-grey/30" />
              <p className="text-grey dark:text-white/40 text-lg">
                {search ? `ไม่พบแพทย์ที่ค้นหา "${search}"` : 'ยังไม่มีข้อมูลแพทย์'}
              </p>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="mt-4 px-5 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  ล้างการค้นหา
                </button>
              )}
            </div>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"

            >
              {filtered.map((d, i) => (
                <div
                  key={d.id}
                  className="bg-white dark:bg-darklight rounded-2xl border border-border dark:border-dark_border shadow-service hover:shadow-deatail_shadow hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col items-center text-center gap-3"
                >
                  {/* Avatar */}
                  <div
                    className={`w-20 h-20 rounded-full bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-2xl font-bold shadow-md`}
                  >
                    {getInitials(d.name)}
                  </div>

                  {/* Name */}
                  <div>
                    <h3 className="font-bold text-midnight_text dark:text-white leading-snug">
                      {d.name}
                    </h3>
                    {d.nationality && (
                      <p className="text-xs text-grey dark:text-white/40 mt-0.5">
                        {d.nationality}
                      </p>
                    )}
                  </div>

                  {/* Badge */}
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                    <Icon icon="mdi:stethoscope" width="13" />
                    แพทย์
                  </span>

                  {/* Contact */}
                  {(d.phone || d.email) && (
                    <div className="w-full pt-3 border-t border-border dark:border-dark_border flex flex-col gap-1.5">
                      {d.phone && (
                        <a
                          href={`tel:${d.phone}`}
                          className="inline-flex items-center justify-center gap-1.5 text-xs text-grey dark:text-white/50 hover:text-primary transition-colors"
                        >
                          <Icon icon="mdi:phone" width="13" />
                          {d.phone}
                        </a>
                      )}
                      {d.email && (
                        <a
                          href={`mailto:${d.email}`}
                          className="inline-flex items-center justify-center gap-1.5 text-xs text-grey dark:text-white/50 hover:text-primary transition-colors truncate max-w-full"
                        >
                          <Icon icon="mdi:email" width="13" />
                          <span className="truncate">{d.email}</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DoctorsPage;
