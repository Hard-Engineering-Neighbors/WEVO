import React, { useState } from "react";
import { X, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReserveStep1Modal from "./ReserveStep1Modal";

export default function VenueDetailsModal({ open, onClose, venue }) {
  const [reserveOpen, setReserveOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  if (!open || !venue) return null;

  // Carousel state
  const images = venue.images || [venue.image];

  const next = () => setCurrent((c) => (c + 1) % images.length);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);

  return (
    <AnimatePresence>
      {open && venue && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          onClick={onClose}
        >
          <motion.div
            className="relative bg-white rounded-2xl shadow-xl max-w-6xl w-full mx-2 my-8 flex flex-col md:flex-row p-4 md:p-8 gap-6 overflow-y-auto max-h-[95vh]"
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              className="absolute top-3 right-3 z-10 p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100"
              onClick={onClose}
              aria-label="Close modal"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={20} />
            </motion.button>
            {/* Left: Carousel & Venue Details */}
            <motion.div
              className="md:w-1/2 w-full flex flex-col gap-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.05 }}
            >
              {/* Carousel */}
              <motion.div
                className="relative w-full aspect-video rounded-2xl overflow-hidden"
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <img
                  src={images[current]}
                  alt={venue.name}
                  className="object-cover w-full h-full"
                />
                {images.length > 1 && (
                  <>
                    <motion.button
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white"
                      onClick={prev}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <span className="text-2xl">&#8592;</span>
                    </motion.button>
                    <motion.button
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white"
                      onClick={next}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <span className="text-2xl">&#8594;</span>
                    </motion.button>
                  </>
                )}
                {/* Dots */}
                {images.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {images.map((_, i) => (
                      <motion.span
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i === current ? "bg-white" : "bg-gray-400/60"
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.15 + i * 0.02 }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
              {/* Venue Details - MOVED HERE */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.15 }}
                className="space-y-3"
              >
                <motion.h2
                  className="text-2xl md:text-3xl font-bold text-[#0458A9] leading-tight"
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.2 }}
                >
                  {venue.name}
                </motion.h2>
                <motion.div
                  className="text-gray-400 text-sm"
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.25 }}
                >
                  Managed by (Insert Department Name)
                </motion.div>
                <motion.div
                  className="flex items-center gap-2 text-gray-700 font-medium pt-2"
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.3 }}
                >
                  <Users size={20} />
                  {venue.participants} Participants Max
                </motion.div>
                <motion.div
                  className="text-gray-700 text-sm max-h-32 overflow-y-auto pt-2 leading-relaxed"
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.15, delay: 0.35 }}
                >
                  {venue.description}
                </motion.div>
              </motion.div>
            </motion.div>
            {/* Right: Map & Reserve Button */}
            <motion.div
              className="flex-1 flex flex-col min-w-0 md:ml-6"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              {/* Location / Map - MOVED UP */}
              <motion.div
                className="flex-grow"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.2 }}
              >
                <h3 className="text-lg font-bold mb-2">Location</h3>
                <div className="w-full aspect-video rounded-xl overflow-hidden border">
                  {/* Replace src with venue.mapUrl or similar if available */}
                  <iframe
                    src="https://www.openstreetmap.org/export/embed.html?bbox=122.545%2C10.720%2C122.550%2C10.725&amp;layer=mapnik"
                    title="Venue Location"
                    className="w-full h-full border-0"
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
              </motion.div>

              {/* Reserve Button - MOVED HERE & MODIFIED */}
              <motion.button
                className="bg-[#0458A9] text-white rounded-full px-10 py-3 font-semibold text-base w-full hover:bg-[#03407a] transition mt-auto"
                onClick={() => setReserveOpen(true)}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Reserve
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
      {/* Reserve Step 1 Modal */}
      <ReserveStep1Modal
        open={reserveOpen}
        onClose={() => setReserveOpen(false)}
        venue={venue}
        onChangeVenue={() => {
          setReserveOpen(false);
          onClose();
        }}
        onNext={(_) => {
          // TODO: handle next step
          setReserveOpen(false);
          onClose();
        }}
      />
    </AnimatePresence>
  );
}
