import { useState } from 'react';
import { hospitals } from '../data/data';
import { Icon } from '@iconify/react';

const HospitalModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('thailand');

  if (!isOpen) return null;

  const currentHospitals =
    activeTab === 'thailand' ? hospitals.thailand : hospitals.international;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div
          className="bg-white dark:bg-darkmode rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-border dark:border-dark_border">
            <div>
              <h2 className="text-2xl font-bold text-midnight_text dark:text-white">
                เลือกสาขา
              </h2>
              <p className="text-grey dark:text-white/50 text-sm mt-1">
                เลือกสาขาคลินิกที่สะดวกสำหรับคุณ
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-darklight transition-colors"
              aria-label="ปิด"
            >
              <Icon
                icon="ic:round-close"
                className="text-2xl text-midnight_text dark:text-white"
              />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex px-8 pt-4 gap-2">
            <button
              onClick={() => setActiveTab('thailand')}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'thailand'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-darklight text-grey dark:text-white/60 hover:bg-gray-200 dark:hover:bg-dark_border'
              }`}
            >
              <Icon icon="twemoji:flag-thailand" width="18" />
              ในประเทศไทย
            </button>
            <button
              onClick={() => setActiveTab('international')}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'international'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-darklight text-grey dark:text-white/60 hover:bg-gray-200 dark:hover:bg-dark_border'
              }`}
            >
              <Icon icon="mdi:earth" width="18" />
              ต่างประเทศ
            </button>
          </div>

          {/* Hospital List */}
          <div className="p-8 overflow-y-auto max-h-[55vh]">
            <div className="grid md:grid-cols-2 gap-4">
              {currentHospitals.map((hospital, index) => (
                <div
                  key={index}
                  className="group border border-border dark:border-dark_border rounded-xl p-5 hover:border-primary hover:shadow-lg dark:hover:border-primary transition-all cursor-pointer"
                >
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={hospital.image}
                        alt={hospital.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-midnight_text dark:text-white group-hover:text-primary transition-colors">
                        {hospital.name}
                      </h3>
                      <div className="flex items-center gap-1 text-grey dark:text-white/50 text-sm mt-0.5">
                        <Icon icon="mdi:map-marker" width="14" />
                        {hospital.location}
                      </div>
                      <div className="flex items-center gap-1 text-grey dark:text-white/50 text-sm mt-0.5">
                        <Icon icon="mdi:phone" width="14" />
                        {hospital.phone}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {hospital.services.map((service, sIndex) => (
                      <span
                        key={sIndex}
                        className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary dark:bg-primary/20 font-medium"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                  <button className="mt-3 w-full py-2 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary hover:text-white transition-colors">
                    นัดหมายสาขานี้
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 border-t border-border dark:border-dark_border bg-section dark:bg-darklight text-center">
            <p className="text-sm text-grey dark:text-white/50">
              โทรนัดหมาย{' '}
              <a href="tel:021234567" className="text-primary font-bold hover:underline">
                02-123-4567
              </a>{' '}
              หรือ Line @whocareclinic
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HospitalModal;
