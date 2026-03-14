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

const ServicesListPage = () => {
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
              บริการทั้งหมดของเรา
            </h1>
            <div className="w-12 h-1 bg-primary rounded-full mt-3 mx-auto" />
            <p className="text-grey dark:text-white/50 mt-3">
              ค้นพบบริการและการรักษาที่หลากหลายจากทีมแพทย์ผู้เชี่ยวชาญ
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md mx-auto mb-6" data-aos="fade-up">
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
            <div className="flex gap-2 flex-wrap justify-center mb-8" data-aos="fade-up">
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

          {/* Count */}
          {!loading && (
            <p className="text-center text-sm text-grey dark:text-white/40 mb-8">
              {filtered.length} รายการ
            </p>
          )}

          {/* Loading */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white dark:bg-darklight rounded-2xl border border-border dark:border-dark_border overflow-hidden">
                  <div className="h-44 bg-section dark:bg-darkmode" />
                  <div className="p-5 flex flex-col gap-2">
                    <div className="h-4 bg-section dark:bg-darkmode rounded w-3/4" />
                    <div className="h-3 bg-section dark:bg-darkmode rounded w-full" />
                    <div className="h-3 bg-section dark:bg-darkmode rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Icon icon="mdi:heart-pulse" width="64" className="mx-auto mb-3 text-grey/30" />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((s) => (
                <div
                  key={s.id}
                  onClick={() => navigate(`/services/${s.id}`)}
                  className="bg-white dark:bg-darklight rounded-2xl border border-border dark:border-dark_border shadow-service hover:shadow-deatail_shadow hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-44 bg-section dark:bg-darkmode overflow-hidden">
                    {s.image_url ? (
                      <img src={s.image_url} alt={s.name || s.name_th} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon icon="mdi:hospital-box" width="48" className="text-primary/30" />
                      </div>
                    )}
                    {s.is_featured && (
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-white">
                        แนะนำ
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1 gap-2">
                    <h3 className="font-bold text-midnight_text dark:text-white leading-snug line-clamp-2">
                      {s.name || s.name_th}
                    </h3>
                    {(s.short_description || s.description) && (
                      <p className="text-sm text-grey dark:text-white/50 line-clamp-2">
                        {s.short_description || s.description}
                      </p>
                    )}
                    <div className="mt-auto pt-3 flex items-center justify-between">
                      <span className="text-primary font-bold text-sm">
                        {formatPrice(s.price_min, s.price_max)}
                      </span>
                      <span className="text-xs text-grey dark:text-white/40 flex items-center gap-1">
                        <Icon icon="mdi:arrow-right" width="14" />
                        ดูรายละเอียด
                      </span>
                    </div>
                  </div>
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

export default ServicesListPage;
