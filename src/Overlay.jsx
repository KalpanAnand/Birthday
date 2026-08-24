import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { memories } from './data';

export default function Overlay({ 
  hasStarted, 
  setHasStarted, 
  activeMemory, 
  setActiveMemory,
  isFinished,
  lastMemoryUrl
}) {
  
  const [introStep, setIntroStep] = useState(0); // 0: unstarted, 1: message, 2: instruction, 3: done
  const [hasScrolled, setHasScrolled] = useState(false);

  // Manage Intro Sequence within 14s
  useEffect(() => {
    if (!hasStarted) return;
    
    setIntroStep(1); // Show message first
    
    // After 6s, switch to instructions
    const t1 = setTimeout(() => {
      setIntroStep(2);
    }, 6000);
    
    // After 12s, hide instructions if not already scrolled
    const t2 = setTimeout(() => {
      setIntroStep(3);
    }, 12000);
    
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [hasStarted]);

  // Track if user has scrolled
  useEffect(() => {
    if (!hasStarted) return;
    
    const handleScroll = () => {
      setHasScrolled(true);
      if (introStep === 2) setIntroStep(3); // Hide instructions on scroll
    };
    
    window.addEventListener('wheel', handleScroll);
    window.addEventListener('touchmove', handleScroll);
    
    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
    };
  }, [hasStarted, introStep]);

  // Handle Esc key to close active memory
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeMemory) {
        setActiveMemory(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeMemory, setActiveMemory]);

  return (
    <div className="overlay-container">
      <AnimatePresence>
        {!hasStarted && (
          <motion.div 
            className="overlay-content"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5 } }}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'black',
              zIndex: 50
            }}
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 300, letterSpacing: '0.1em' }}
            >
              For You
            </motion.h1>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              onClick={() => setHasStarted(true)}
              style={{
                padding: '12px 32px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.5)',
                color: 'white',
                fontSize: '1rem',
                cursor: 'pointer',
                borderRadius: '30px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
              }}
            >
              Start Journey
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeMemory && !isFinished && (
          <motion.div
            className="overlay-content"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
            onClick={() => setActiveMemory(null)}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.8)',
              zIndex: 40,
              cursor: 'pointer'
            }}
          >
            <motion.img 
              src={activeMemory.url}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {introStep === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'black',
              zIndex: 90, // Covers tunnel
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              textAlign: 'center'
            }}
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              style={{
                color: 'white',
                fontSize: '1.4rem',
                fontStyle: 'italic',
                lineHeight: '1.8',
                maxWidth: '800px',
                letterSpacing: '0.05em',
                fontWeight: 300
              }}
            >
              "This is very close to my heart. You already know that I have one habit whenever I love something in a chat, I capture it. So, you can see my 4 years of collections"
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {introStep === 2 && !hasScrolled && !activeMemory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute',
              bottom: '10%',
              left: 0, right: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              pointerEvents: 'none',
              zIndex: 100
            }}
          >
            <div style={{
              width: '30px',
              height: '50px',
              border: '2px solid rgba(255,255,255,0.6)',
              borderRadius: '15px',
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '5px'
            }}>
              <motion.div
                animate={{ y: [0, 15, 0], opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{
                  width: '4px',
                  height: '8px',
                  backgroundColor: 'white',
                  borderRadius: '2px'
                }}
              />
            </div>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: '10px', fontSize: '0.9rem', letterSpacing: '0.05em' }}>
              Scroll down or Swipe up to explore
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinished && (
          <motion.div
            className="overlay-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 4 }} // Slow cinematic fade in for the end
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex',
              flexWrap: 'wrap',
              alignContent: 'center',
              justifyContent: 'center',
              backgroundColor: 'black', // The final fade to black
              zIndex: 60,
              overflow: 'hidden'
            }}
          >
            {memories.map((mem, index) => (
              <motion.img 
                key={mem.id}
                src={mem.url}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + (Math.random() * 1.5), duration: 0.8 }} // Much faster stagger effect
                style={{
                  width: 'calc(100vw / 10)', // approx 10 cols
                  height: 'calc(100vh / 9)', // approx 9 rows
                  objectFit: 'cover',
                  padding: '2px',
                  borderRadius: '6px'
                }}
              />
            ))}
            
            {/* Semi-transparent dark overlay to make text readable */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5, duration: 1 }}
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.75)',
                pointerEvents: 'none',
                zIndex: 100
              }}
            />

            {/* The Final Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.2, duration: 1.5 }}
              style={{
                position: 'absolute',
                zIndex: 110,
                textAlign: 'center',
                color: 'white',
                pointerEvents: 'none'
              }}
            >
              <h1 style={{ fontSize: '3.5rem', fontWeight: 300, letterSpacing: '0.1em', marginBottom: '20px', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                Happy 25th Birthday
              </h1>
              <p style={{ fontSize: '1.5rem', color: '#AEE4E1', letterSpacing: '0.05em', fontWeight: 300 }}>
                To a lifetime of more beautiful memories. ✨
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
