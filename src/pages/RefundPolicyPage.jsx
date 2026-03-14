import { Icon } from '@iconify/react';
import Footer from '../components/Footer';

const SECTIONS = [
  {
    icon: 'mdi:cash-refund',
    title: 'เงื่อนไขการคืนเงิน',
    content: [
      'ผู้ป่วยสามารถขอคืนเงินได้ภายใน 7 วันนับจากวันที่ชำระเงิน หากบริการยังไม่ได้รับการดำเนินการ',
      'การขอคืนเงินต้องแจ้งผ่านช่องทางที่โรงพยาบาลกำหนดพร้อมเหตุผลที่ชัดเจน',
      'โรงพยาบาลขอสงวนสิทธิ์ในการพิจารณาการขอคืนเงินเป็นรายกรณี',
    ],
  },
  {
    icon: 'mdi:calendar-remove',
    title: 'การยกเลิกนัดหมาย',
    content: [
      'ยกเลิกล่วงหน้าอย่างน้อย 24 ชั่วโมง: คืนเงินเต็มจำนวน (100%)',
      'ยกเลิกล่วงหน้า 12–24 ชั่วโมง: คืนเงิน 50% ของราคาบริการ',
      'ยกเลิกน้อยกว่า 12 ชั่วโมงหรือไม่มาตามนัด (No Show): ไม่สามารถคืนเงินได้',
      'กรณีฉุกเฉินทางการแพทย์ สามารถยื่นหลักฐานเพื่อพิจารณาคืนเงินเป็นกรณีพิเศษ',
    ],
  },
  {
    icon: 'mdi:package-variant',
    title: 'แพ็กเกจและโปรโมชั่น',
    content: [
      'แพ็กเกจที่ซื้อแล้วไม่สามารถโอนสิทธิ์ให้ผู้อื่นได้ ยกเว้นได้รับการอนุมัติเป็นลายลักษณ์อักษร',
      'แพ็กเกจที่ใช้บริการไปแล้วบางส่วนจะคำนวณคืนเงินตามส่วนที่ยังไม่ได้ใช้',
      'โปรโมชั่นพิเศษและแพ็กเกจลดราคาอาจมีเงื่อนไขเฉพาะแตกต่างกัน โปรดตรวจสอบก่อนซื้อ',
    ],
  },
  {
    icon: 'mdi:clock-check',
    title: 'ระยะเวลาการคืนเงิน',
    content: [
      'เงินจะถูกโอนคืนภายใน 7–14 วันทำการ หลังจากได้รับการอนุมัติ',
      'การคืนเงินผ่านบัตรเครดิต/เดบิต อาจใช้เวลา 1–3 รอบบิล ขึ้นอยู่กับธนาคาร',
      'การคืนเงินผ่านการโอนธนาคาร จะดำเนินการภายใน 3–5 วันทำการ',
    ],
  },
  {
    icon: 'mdi:alert-circle-outline',
    title: 'กรณีที่ไม่สามารถคืนเงินได้',
    content: [
      'บริการที่ดำเนินการเสร็จสิ้นแล้วทั้งหมด',
      'ค่าธรรมเนียมการจัดการและค่าดำเนินการต่าง ๆ',
      'สินค้าหรือยาที่เปิดใช้งานแล้ว',
      'บริการฉุกเฉินที่ได้รับการรักษาแล้ว',
    ],
  },
  {
    icon: 'mdi:phone-in-talk',
    title: 'ช่องทางการติดต่อ',
    content: [
      'โทรศัพท์: 02-XXX-XXXX (จันทร์–ศุกร์ 08:00–17:00 น.)',
      'อีเมล: refund@whocare.th',
      'Line Official: @whocare',
      'เคาน์เตอร์ผู้ป่วย: ชั้น 1 อาคารหลัก',
    ],
  },
];

const RefundPolicyPage = () => {
  return (
    <>
      <div className="min-h-screen bg-section dark:bg-darkmode pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">

          {/* Header */}
          <div className="text-center mb-10" data-aos="fade-up">
            <h1 className="text-3xl sm:text-4xl font-bold text-midnight_text dark:text-white">
              นโยบายการคืนเงิน
            </h1>
            <div className="w-12 h-1 bg-primary rounded-full mt-3 mx-auto" />
            <p className="text-grey dark:text-white/50 mt-3">
              Whocare Clinic & Wellness — อัปเดตล่าสุด: มกราคม 2568
            </p>
          </div>

          {/* Intro card */}
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5 mb-8 flex gap-4" data-aos="fade-up">
            <Icon icon="mdi:information" width="24" className="text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-midnight_text dark:text-white/80 leading-relaxed">
              โรงพยาบาล Whocare มุ่งมั่นให้บริการที่มีคุณภาพสูงสุด หากคุณไม่พึงพอใจในบริการ เราพร้อมรับฟังและพิจารณาคืนเงินตามเงื่อนไขที่กำหนดด้านล่าง
            </p>
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-5">
            {SECTIONS.map((sec, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 50}
                className="bg-white dark:bg-darklight rounded-2xl border border-border dark:border-dark_border p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon icon={sec.icon} width="22" className="text-primary" />
                  </div>
                  <h2 className="font-bold text-midnight_text dark:text-white text-lg">
                    {sec.title}
                  </h2>
                </div>
                <ul className="flex flex-col gap-2.5">
                  {sec.content.map((line, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-grey dark:text-white/70 leading-relaxed">
                      <Icon icon="mdi:circle-small" width="18" className="text-primary flex-shrink-0 mt-0.5" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-8 text-center text-xs text-grey dark:text-white/30 leading-relaxed" data-aos="fade-up">
            นโยบายนี้อาจมีการเปลี่ยนแปลงได้โดยไม่แจ้งล่วงหน้า<br />
            การดำเนินการใด ๆ ถือว่าท่านได้อ่านและยอมรับข้อกำหนดข้างต้นแล้ว
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RefundPolicyPage;
