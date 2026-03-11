import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { apiGetPublicServiceById } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchService();
  }, [id]);

  const fetchService = async () => {
    setLoading(true);
    try {
      const result = await apiGetPublicServiceById(id);
      if (result.success) {
        setService(result.data);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (val) => {
    const num = parseFloat(val);
    if (!num && num !== 0) return '-';
    return num.toLocaleString('th-TH');
  };

  const origPrice = parseFloat(service?.original_price || 0);
  const currPrice = parseFloat(service?.price || 0);
  const discountPct =
    service?.is_promotion && origPrice > 0 && origPrice > currPrice
      ? Math.round((1 - currPrice / origPrice) * 100)
      : null;

  const handleBooking = () => {
    if (!user) {
      navigate(`/login?redirect=/booking/${id}`);
    } else {
      navigate(`/booking/${id}`);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-section dark:bg-darklight">
        <div className="container mx-auto max-w-5xl px-4 pt-28 pb-20">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-grey dark:text-white/50 hover:text-primary dark:hover:text-primary transition-colors mb-6 group cursor-pointer"
          >
            <Icon
              icon="mdi:arrow-left"
              width="18"
              className="group-hover:-translate-x-1 transition-transform duration-200"
            />
            กลับหน้าก่อนหน้า
          </button>

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 animate-pulse">
                <div className="h-[320px] bg-white dark:bg-darkmode rounded-2xl" />
                <div className="mt-6 space-y-3">
                  <div className="h-8 bg-white dark:bg-darkmode rounded-xl w-2/3" />
                  <div className="h-4 bg-white dark:bg-darkmode rounded w-1/3" />
                  <div className="h-24 bg-white dark:bg-darkmode rounded-xl mt-4" />
                </div>
              </div>
              <div className="lg:col-span-2 animate-pulse">
                <div className="h-64 bg-white dark:bg-darkmode rounded-2xl" />
              </div>
            </div>
          )}

          {/* Not found */}
          {!loading && notFound && (
            <div className="text-center py-24">
              <Icon icon="mdi:package-variant-remove" width="64" className="mx-auto text-grey/30 mb-4" />
              <h2 className="text-xl font-semibold text-midnight_text dark:text-white mb-2">ไม่พบบริการนี้</h2>
              <p className="text-grey dark:text-white/40 text-sm mb-6">บริการที่คุณค้นหาอาจถูกลบหรือไม่มีอยู่ในระบบ</p>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <Icon icon="mdi:home" width="18" />
                กลับหน้าหลัก
              </button>
            </div>
          )}

          {/* Service detail */}
          {!loading && service && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
              {/* Left column: Image + Info */}
              <div className="lg:col-span-3 space-y-6">
                {/* Image card */}
                <div className="relative bg-white dark:bg-darkmode rounded-2xl overflow-hidden shadow-sm">
                  <div className="relative h-[280px] md:h-[360px]">
                    {service.image_url ? (
                      <img
                        src={service.image_url}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                        <Icon icon="mdi:medical-bag" width="80" className="text-primary/20" />
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                      {service.branch && (
                        <span className="bg-white/90 dark:bg-darkmode/90 backdrop-blur-sm text-xs font-medium px-3 py-1.5 rounded-full text-midnight_text dark:text-white flex items-center gap-1 shadow-sm">
                          <Icon icon="mdi:map-marker" width="13" className="text-primary" />
                          {service.branch}
                        </span>
                      )}
                      {service.is_recommended && (
                        <span className="bg-yellow-400/90 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full text-yellow-900 flex items-center gap-1">
                          <Icon icon="mdi:star" width="13" />
                          แนะนำ
                        </span>
                      )}
                      {discountPct && (
                        <span className="bg-red-500/90 backdrop-blur-sm text-xs font-bold px-3 py-1.5 rounded-full text-white">
                          -{discountPct}%
                        </span>
                      )}
                    </div>

                    {/* Price overlay */}
                    <div className="absolute bottom-4 right-4">
                      <div className="text-right">
                        {discountPct && (
                          <p className="text-white/60 text-sm line-through mb-0.5">
                            ฿{formatPrice(service.original_price)}
                          </p>
                        )}
                        <div className="bg-primary/95 backdrop-blur-sm text-white font-bold text-lg px-5 py-2 rounded-xl shadow-lg">
                          ฿{formatPrice(service.price)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info card */}
                <div className="bg-white dark:bg-darkmode rounded-2xl shadow-sm p-6 md:p-8">
                  <h1 className="text-2xl md:text-3xl font-bold text-midnight_text dark:text-white leading-snug">
                    {service.name}
                  </h1>

                  {service.branch && (
                    <p className="mt-2 text-sm text-grey dark:text-white/50 flex items-center gap-1.5">
                      <Icon icon="mdi:hospital-building" width="15" className="text-primary" />
                      {service.branch}
                    </p>
                  )}

                  {/* Price row */}
                  <div className="flex items-center gap-3 mt-5 p-4 bg-section dark:bg-darklight rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon icon="mdi:tag" width="20" className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-grey dark:text-white/40 mb-0.5">
                        {discountPct ? 'ราคาโปรโมชั่น' : 'ราคา'}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-2xl font-bold text-primary">฿{formatPrice(service.price)}</span>
                        {discountPct && (
                          <>
                            <span className="text-sm text-grey dark:text-white/40 line-through">
                              ฿{formatPrice(service.original_price)}
                            </span>
                            <span className="text-xs font-semibold bg-red-100 dark:bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full">
                              ประหยัด {discountPct}%
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {service.description && (
                    <div className="mt-6">
                      <h2 className="text-base font-semibold text-midnight_text dark:text-white mb-3 flex items-center gap-2">
                        <Icon icon="mdi:text-box-outline" width="18" className="text-primary" />
                        รายละเอียดบริการ
                      </h2>
                      <p className="text-sm text-grey dark:text-white/60 leading-relaxed whitespace-pre-line">
                        {service.description}
                      </p>
                    </div>
                  )}

                  {/* Tags */}
                  {(service.category || service.is_recommended || service.is_promotion) && (
                    <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-border dark:border-dark_border">
                      {service.category && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium bg-primary/5 text-primary px-3 py-1.5 rounded-full border border-primary/10">
                          <Icon icon="mdi:shape" width="12" />
                          {service.category}
                        </span>
                      )}
                      {service.is_recommended && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-3 py-1.5 rounded-full border border-yellow-200 dark:border-yellow-500/20">
                          <Icon icon="mdi:star" width="12" />
                          แนะนำ
                        </span>
                      )}
                      {service.is_promotion && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium bg-red-50 dark:bg-red-500/10 text-red-500 px-3 py-1.5 rounded-full border border-red-200 dark:border-red-500/20">
                          <Icon icon="mdi:tag" width="12" />
                          โปรโมชั่น
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right column: Booking CTA */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-darkmode rounded-2xl shadow-sm p-6 sticky top-28">
                  <p className="text-sm font-semibold text-midnight_text dark:text-white mb-1">
                    {discountPct ? 'ราคาพิเศษ' : 'ราคาบริการ'}
                  </p>
                  <p className="text-3xl font-bold text-primary mb-1">
                    ฿{formatPrice(service.price)}
                  </p>
                  {discountPct && (
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm text-grey dark:text-white/40 line-through">
                        ฿{formatPrice(service.original_price)}
                      </span>
                      <span className="text-xs font-semibold bg-red-100 dark:bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full">
                        -{discountPct}%
                      </span>
                    </div>
                  )}

                  {!discountPct && <div className="mb-4" />}

                  <button
                    onClick={handleBooking}
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200 cursor-pointer text-sm"
                  >
                    <Icon icon="mdi:calendar-check" width="18" />
                    สนใจแพ็กเกจ (จอง)
                  </button>

                  <button className="w-full mt-3 inline-flex items-center justify-center gap-2 border-2 border-border dark:border-dark_border text-midnight_text dark:text-white font-semibold py-3 rounded-xl hover:bg-section dark:hover:bg-darklight transition-colors cursor-pointer text-sm">
                    <Icon icon="mdi:phone" width="18" />
                    ติดต่อสอบถาม
                  </button>

                  {/* Info pills */}
                  <div className="grid grid-cols-2 gap-2 mt-5">
                    <div className="flex items-center gap-2 bg-section dark:bg-darklight rounded-lg p-2.5">
                      <Icon icon="mdi:shield-check" width="16" className="text-green-500 shrink-0" />
                      <span className="text-[11px] text-grey dark:text-white/50">ปลอดภัย</span>
                    </div>
                    <div className="flex items-center gap-2 bg-section dark:bg-darklight rounded-lg p-2.5">
                      <Icon icon="mdi:clock-check" width="16" className="text-blue-500 shrink-0" />
                      <span className="text-[11px] text-grey dark:text-white/50">ยืนยันทันที</span>
                    </div>
                    <div className="flex items-center gap-2 bg-section dark:bg-darklight rounded-lg p-2.5">
                      <Icon icon="mdi:account-check" width="16" className="text-purple-500 shrink-0" />
                      <span className="text-[11px] text-grey dark:text-white/50">ผู้เชี่ยวชาญ</span>
                    </div>
                    <div className="flex items-center gap-2 bg-section dark:bg-darklight rounded-lg p-2.5">
                      <Icon icon="mdi:certificate" width="16" className="text-amber-500 shrink-0" />
                      <span className="text-[11px] text-grey dark:text-white/50">ได้มาตรฐาน</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ServiceDetailPage;
