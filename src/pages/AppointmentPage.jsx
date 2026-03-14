import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import AOS from 'aos';
import { apiGetPublicServices, apiGetServiceCategories } from '../services/api';
import Footer from '../components/Footer';

const formatPrice = (min, max) => {
  if (!min && !max) return 'สอบถามราคา';
  const fmt = (n) => parseFloat(n).toLocaleString('th-TH');
  if (min && max && min !== max) return `฿${fmt(min)} – ฿${fmt(max)}`;
  return `฿${fmt(min || max)}`;
};

const AppointmentPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('all');

  useEffect(() => {
    Promise.all([
      apiGetPublicServices({ limit: 100 }),
      apiGetServiceCategories(),
    ]).then(([sRes, cRes]) => {
      if (sRes.success) {
        setServices(sRes.data || sRes.services || []);
        setTimeout(() => AOS.refresh(), 50);
      }
      if (cRes.success) setCategories(cRes.data || cRes.categories || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = services;
    if (activeCat !== 'all') list = list.filter((s) => String(s.category_id) === String(activeCat));
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((s) => (s.name || s.name_th || '').toLowerCase().includes(q));
    }
    return list;
  }, [services, activeCat, search]);

  return (
    <>
      <div className="min-h-screen bg-section dark:bg-darkmode pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">

          {/* Header */}
          <div className="text-center mb-10" data-aos="fade-up">
            <h1 className="text-3xl sm:text-4xl font-bold text-midnight_text dark:text-white">
              นัดหมายแพทย์ออนไลน์
            </h1>
            <div className="w-12 h-1 bg-primary rounded-full mt-3 mx-auto" />
            <p className="text-grey dark:text-white/50 mt-3">
              เลือกบริการที่ต้องการเพื่อทำการนัดหมาย
            </p>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-2 mb-10" data-aos="fade-up">
            {['เลือกบริการ', 'เลือกวันเวลา', 'ยืนยันนัดหมาย'].map((label, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${i === 0 ? 'bg-primary text-white' : 'bg-white dark:bg-darklight text-grey dark:text-white/40 border border-border dark:border-dark_border'}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? 'bg-white text-primary' : 'bg-grey/20 text-grey'}`}>{i + 1}</span>
                  {label}
                </div>
                {i < 2 && <Icon icon="mdi:chevron-right" width="16" className="text-grey/40" />}
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-md mx-auto mb-6">
            <Icon icon="mdi:magnify" width="20" className="absolute left-3 top-1/2 -translate-y-1/2 text-grey" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาบริการ..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border dark:border-dark_border bg-white dark:bg-darklight text-midnight_text dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-grey hover:text-primary">
                <Icon icon="mdi:close" width="16" />
              </button>
            )}
          </div>

          {/* Category tabs */}
          {categories.length > 0 && (
            <div className="flex gap-2 flex-wrap justify-center mb-8">
              <button
                onClick={() => setActiveCat('all')}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors cursor-pointer ${activeCat === 'all' ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-darklight text-grey dark:text-white/60 border-border dark:border-dark_border hover:border-primary hover:text-primary'}`}
              >
                ทั้งหมด
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCat(String(c.id))}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors cursor-pointer ${activeCat === String(c.id) ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-darklight text-grey dark:text-white/60 border-border dark:border-dark_border hover:border-primary hover:text-primary'}`}
                >
                  {c.name || c.name_th}
                </button>
              ))}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white dark:bg-darklight rounded-2xl border border-border dark:border-dark_border p-5 flex gap-4">
                  <div className="w-14 h-14 rounded-xl bg-section dark:bg-darkmode flex-shrink-0" />
                  <div className="flex-1 flex flex-col gap-2 pt-1">
                    <div className="h-4 bg-section dark:bg-darkmode rounded w-3/4" />
                    <div className="h-3 bg-section dark:bg-darkmode rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Icon icon="mdi:calendar-remove" width="64" className="mx-auto mb-3 text-grey/30" />
              <p className="text-grey dark:text-white/40 text-lg">ไม่พบบริการที่ค้นหา</p>
              {(search || activeCat !== 'all') && (
                <button
                  onClick={() => { setSearch(''); setActiveCat('all'); }}
                  className="mt-4 px-5 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  ล้างตัวกรอง
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((s) => (
                <button
                  key={s.id}
                  onClick={() => navigate(`/booking/${s.id}`)}
                  className="bg-white dark:bg-darklight rounded-2xl border border-border dark:border-dark_border hover:border-primary hover:shadow-deatail_shadow hover:-translate-y-1 transition-all duration-300 p-5 cursor-pointer flex gap-4 items-start text-left w-full"
                >
                  {/* Icon / image */}
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {s.image_url ? (
                      <img src={s.image_url} alt={s.name || s.name_th} className="w-full h-full object-cover" />
                    ) : (
                      <Icon icon="mdi:hospital-box" width="28" className="text-primary" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-midnight_text dark:text-white leading-snug line-clamp-2 text-sm">
                      {s.name || s.name_th}
                    </p>
                    {(s.short_description || s.description) && (
                      <p className="text-xs text-grey dark:text-white/40 mt-1 line-clamp-1">
                        {s.short_description || s.description}
                      </p>
                    )}
                    <p className="text-primary font-bold text-sm mt-2">
                      {formatPrice(s.price_min, s.price_max)}
                    </p>
                  </div>

                  <Icon icon="mdi:calendar-plus" width="20" className="text-primary flex-shrink-0 mt-1" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AppointmentPage;
