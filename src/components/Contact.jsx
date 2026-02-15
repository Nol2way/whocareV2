const Contact = () => {
  return (
    <section className="overflow-x-hidden bg-white dark:bg-darkmode" id="contact">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-0 bg-white dark:bg-darklight rounded-2xl shadow-deatail_shadow border border-border dark:border-dark_border overflow-hidden">
          {/* Left side - Google Map */}
          <div
            className="w-full min-h-[400px] lg:min-h-[550px]"
            data-aos="fade-right"
            data-aos-delay="200"
            data-aos-duration="1000"
          >
            <iframe
              title="Whocare Clinic Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3873.6546!2d100.5766!3d13.8723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29c3ca7446f2b%3A0xeb8fed6174e40bc7!2sSripatum%20University!5e0!3m2!1sen!2sth!4v1700000000000!5m2!1sen!2sth"
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Right side - Contact info */}
          <div
            className="p-8 lg:p-12 flex flex-col justify-center"
            data-aos="fade-left"
            data-aos-delay="200"
            data-aos-duration="1000"
          >
            {/* Header */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-midnight_text dark:text-white">
                ติดต่อเรา
              </h2>
              <div className="w-16 h-1.5 bg-primary rounded-full mt-4 mb-8" />
            </div>

            {/* Contact details */}
            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-phone text-primary" />
                </div>
                <div>
                  <p className="text-sm text-grey dark:text-white/50 mb-1">โทรศัพท์</p>
                  <a href="tel:021234567" className="text-lg font-semibold text-midnight_text dark:text-white hover:text-primary transition-colors">
                    02-123-4567
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-envelope text-primary" />
                </div>
                <div>
                  <p className="text-sm text-grey dark:text-white/50 mb-1">อีเมล</p>
                  <a href="mailto:info@whocare.co.th" className="text-lg font-semibold text-midnight_text dark:text-white hover:text-primary transition-colors">
                    info@whocare.co.th
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-location-dot text-primary" />
                </div>
                <div>
                  <p className="text-sm text-grey dark:text-white/50 mb-1">ที่อยู่</p>
                  <p className="text-lg font-semibold text-midnight_text dark:text-white leading-relaxed">
                    2410/2 ถนนพหลโยธิน แขวงเสนานิคม
                    <br />
                    เขตจตุจักร กรุงเทพมหานคร 10900
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-clock text-primary" />
                </div>
                <div>
                  <p className="text-sm text-grey dark:text-white/50 mb-1">เวลาทำการ</p>
                  <p className="text-lg font-semibold text-midnight_text dark:text-white">
                    เปิดให้บริการทุกวัน 10:00 - 20:00 น.
                  </p>
                </div>
              </div>
            </div>

            {/* Action button */}
            <div className="mt-10">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Sripatum+University+Bangkok"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary/25"
              >
                เส้นทาง
                <i className="fa-solid fa-arrow-right text-xs" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
