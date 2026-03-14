import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const PACKAGES = [
  {
    id: 1,
    icon: 'mdi:heart-pulse',
    badge: 'ยอดนิยม',
    badgeColor: 'bg-primary text-white',
    title: 'แพ็กเกจตรวจสุขภาพพื้นฐาน',
    desc: 'ตรวจสุขภาพครบถ้วน เหมาะสำหรับผู้ที่ต้องการตรวจร่างกายประจำปี รวมการตรวจเลือด ความดัน ระดับน้ำตาล และ EKG',
    price: 1990,
    priceOld: 3500,
    duration: '3–4 ชั่วโมง',
    items: ['ตรวจเลือด CBC + ชีวเคมี', 'วัดความดันโลหิต', 'ระดับน้ำตาลในเลือด', 'คลื่นไฟฟ้าหัวใจ (EKG)', 'ตรวจปัสสาวะ'],
    color: 'border-primary/30 hover:border-primary',
    iconBg: 'bg-primary/10 text-primary',
  },
  {
    id: 2,
    icon: 'mdi:shield-heart',
    badge: 'แนะนำ',
    badgeColor: 'bg-emerald-500 text-white',
    title: 'แพ็กเกจตรวจสุขภาพครบวงจร',
    desc: 'ตรวจสุขภาพอย่างละเอียดรอบด้าน เหมาะสำหรับผู้ที่ต้องการดูแลสุขภาพอย่างจริงจัง ครอบคลุมทุกระบบของร่างกาย',
    price: 4990,
    priceOld: 8500,
    duration: '5–6 ชั่วโมง',
    items: ['ตรวจเลือดครบชุด (30+ รายการ)', 'เอกซเรย์ปอด', 'อัลตราซาวด์ช่องท้อง', 'ตรวจสายตาและการได้ยิน', 'ปรึกษาแพทย์'],
    color: 'border-emerald-300 hover:border-emerald-500',
    iconBg: 'bg-emerald-100 text-emerald-600',
  },
  {
    id: 3,
    icon: 'mdi:tooth',
    badge: 'ใหม่',
    badgeColor: 'bg-violet-500 text-white',
    title: 'แพ็กเกจทันตกรรม',
    desc: 'ดูแลช่องปากและฟันอย่างครบถ้วน รวมการขูดหินปูน อุดฟัน และตรวจฟันโดยทันตแพทย์ผู้เชี่ยวชาญ',
    price: 990,
    priceOld: 1800,
    duration: '1–2 ชั่วโมง',
    items: ['ตรวจช่องปาก', 'ขูดหินปูน', 'ขัดฟัน', 'เอกซเรย์ฟัน', 'คำแนะนำจากทันตแพทย์'],
    color: 'border-violet-300 hover:border-violet-500',
    iconBg: 'bg-violet-100 text-violet-600',
  },
  {
    id: 4,
    icon: 'mdi:eye',
    badge: null,
    badgeColor: '',
    title: 'แพ็กเกจตรวจตา',
    desc: 'ตรวจสุขภาพดวงตาอย่างละเอียด วัดสายตา ตรวจต้อหิน ต้อกระจก และความดันลูกตา',
    price: 1490,
    priceOld: 2500,
    duration: '1–2 ชั่วโมง',
    items: ['วัดสายตา', 'ตรวจต้อหิน', 'ตรวจต้อกระจก', 'วัดความดันลูกตา', 'ปรึกษาจักษุแพทย์'],
    color: 'border-amber-300 hover:border-amber-500',
    iconBg: 'bg-amber-100 text-amber-600',
  },
  {
    id: 5,
    icon: 'mdi:mother-heart',
    badge: 'สุดคุ้ม',
    badgeColor: 'bg-rose-500 text-white',
    title: 'แพ็กเกจฝากครรภ์',
    desc: 'ดูแลคุณแม่ตั้งครรภ์ตลอดช่วงตั้งครรภ์ พร้อมตรวจอัลตราซาวด์และพบสูติแพทย์',
    price: 12900,
    priceOld: 20000,
    duration: 'ตลอดช่วงตั้งครรภ์',
    items: ['ฝากครรภ์ 10 ครั้ง', 'อัลตราซาวด์ 4 ครั้ง', 'ตรวจเลือดครบชุด', 'คลาสเตรียมคลอด', 'ปรึกษาสูติแพทย์ตลอด 24 ชม.'],
    color: 'border-rose-300 hover:border-rose-500',
    iconBg: 'bg-rose-100 text-rose-600',
  },
  {
    id: 6,
    icon: 'mdi:run-fast',
    badge: null,
    badgeColor: '',
    title: 'แพ็กเกจกีฬาและฟื้นฟู',
    desc: 'ตรวจร่างกายสำหรับนักกีฬาและผู้รักสุขภาพ พร้อมโปรแกรมฟื้นฟูร่างกายหลังการบาดเจ็บ',
    price: 2990,
    priceOld: 5000,
    duration: '2–3 ชั่วโมง',
    items: ['ตรวจสมรรถภาพร่างกาย', 'ตรวจหัวใจระหว่างออกกำลังกาย', 'ประเมินความเสี่ยงข้อต่อ', 'โภชนาการนักกีฬา', 'โปรแกรมฟื้นฟู'],
    color: 'border-teal-300 hover:border-teal-500',
    iconBg: 'bg-teal-100 text-teal-600',
  },
];

const PackagesPage = () => {
  const navigate = useNavigate();
  const fmt = (n) => n.toLocaleString('th-TH');

  return (
    <>
      <div className="min-h-screen bg-section dark:bg-darkmode pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">

          {/* Header */}
          <div className="text-center mb-4" data-aos="fade-up">
            <h1 className="text-3xl sm:text-4xl font-bold text-midnight_text dark:text-white">
              แพ็กเกจ & โปรโมชั่น
            </h1>
            <div className="w-12 h-1 bg-primary rounded-full mt-3 mx-auto" />
            <p className="text-grey dark:text-white/50 mt-3">
              แพ็กเกจดูแลสุขภาพราคาพิเศษ คัดสรรมาเพื่อคุณ
            </p>
          </div>

          {/* Promo banner */}
          <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4" data-aos="fade-up">
            <div className="text-white">
              <p className="text-sm font-semibold opacity-80">โปรโมชั่นพิเศษ</p>
              <p className="text-xl font-bold mt-0.5">ลดสูงสุด 50% สำหรับสมาชิกใหม่</p>
              <p className="text-sm opacity-70 mt-1">* ใช้ได้ถึงสิ้นเดือนนี้เท่านั้น</p>
            </div>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-2.5 rounded-xl bg-white text-primary font-bold text-sm hover:bg-blue-50 transition-colors cursor-pointer flex-shrink-0"
            >
              สมัครสมาชิก
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PACKAGES.map((pkg, i) => (
              <div
                key={pkg.id}
                data-aos="fade-up"
                data-aos-delay={i * 60}
                className={`bg-white dark:bg-darklight rounded-2xl border-2 transition-all duration-300 hover:shadow-deatail_shadow hover:-translate-y-1 flex flex-col ${pkg.color}`}
              >
                <div className="p-6 flex flex-col flex-1 gap-4">
                  {/* Icon + badge */}
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${pkg.iconBg}`}>
                      <Icon icon={pkg.icon} width="26" />
                    </div>
                    {pkg.badge && (
                      <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${pkg.badgeColor}`}>
                        {pkg.badge}
                      </span>
                    )}
                  </div>

                  {/* Title + desc */}
                  <div>
                    <h3 className="font-bold text-midnight_text dark:text-white leading-snug">
                      {pkg.title}
                    </h3>
                    <p className="text-sm text-grey dark:text-white/50 mt-1.5 leading-relaxed">
                      {pkg.desc}
                    </p>
                  </div>

                  {/* Items */}
                  <ul className="flex flex-col gap-1.5">
                    {pkg.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-midnight_text dark:text-white/80">
                        <Icon icon="mdi:check-circle" width="15" className="text-emerald-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {/* Duration */}
                  <div className="flex items-center gap-1.5 text-xs text-grey dark:text-white/40">
                    <Icon icon="mdi:clock-outline" width="14" />
                    ระยะเวลา: {pkg.duration}
                  </div>

                  {/* Price + CTA */}
                  <div className="mt-auto pt-4 border-t border-border dark:border-dark_border flex items-end justify-between gap-3">
                    <div>
                      <p className="text-grey dark:text-white/30 text-xs line-through">฿{fmt(pkg.priceOld)}</p>
                      <p className="text-2xl font-bold text-primary">฿{fmt(pkg.price)}</p>
                    </div>
                    <button
                      onClick={() => navigate('/appointment')}
                      className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      นัดหมาย
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom note */}
          <p className="text-center text-xs text-grey dark:text-white/30 mt-10">
            * ราคาดังกล่าวเป็นราคาโปรโมชั่น ไม่รวมค่าใช้จ่ายเพิ่มเติม สอบถามรายละเอียดเพิ่มเติมได้ที่เคาน์เตอร์
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PackagesPage;
