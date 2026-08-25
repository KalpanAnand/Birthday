import React, { useRef } from 'react';
import { motion } from 'framer-motion';

export default function MobileTimeline({ memories, setActiveMemory, onEndReached }) {
  const containerRef = useRef(null);

  return (
    <div 
      ref={containerRef}
      style={{ 
        padding: '20px', 
        minHeight: '100%', 
        background: 'radial-gradient(circle at center, #1a2a3a 0%, #0b1111 100%)', 
        paddingBottom: '100px',
        color: 'white'
      }}
    >
      <div style={{ textAlign: 'center', marginTop: '60px', marginBottom: '50px' }}>
        <h2 style={{ color: '#FFB6C1', fontFamily: "'Great Vibes', cursive", fontSize: '3.5rem', margin: 0, textShadow: '0 0 15px rgba(255, 182, 193, 0.4)' }}>
          Memory Lane
        </h2>
        <p style={{ color: '#AEE4E1', fontStyle: 'italic', marginTop: '10px', fontSize: '1.1rem' }}>
          Scroll down to journey through our moments...
        </p>
      </div>
      
      <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
        {/* Center glowing line */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '2px', height: '100%', background: 'linear-gradient(to bottom, rgba(174, 228, 225, 0), rgba(174, 228, 225, 0.5), rgba(174, 228, 225, 0))' }} />
        
        {memories.map((mem, index) => {
          const isLeft = index % 2 === 0;
          return (
            <motion.div 
              key={mem.id}
              initial={{ opacity: 0, x: isLeft ? -40 : 40, y: 30 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              style={{
                display: 'flex',
                justifyContent: isLeft ? 'flex-start' : 'flex-end',
                marginBottom: '50px',
                width: '100%',
                position: 'relative'
              }}
            >
              {/* Node on the center line */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#AEE4E1',
                boxShadow: '0 0 10px #AEE4E1, 0 0 20px #AEE4E1'
              }} />

              <div 
                style={{ 
                  width: '45%', 
                  background: 'rgba(255,255,255,0.05)', 
                  padding: '8px', 
                  borderRadius: '12px',
                  border: '1px solid rgba(174, 228, 225, 0.2)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  cursor: 'pointer',
                  backdropFilter: 'blur(5px)',
                  position: 'relative',
                  zIndex: 2
                }}
                onClick={() => setActiveMemory({ id: mem.id, url: mem.url })}
              >
                <img src={mem.url} alt="Memory" style={{ width: '100%', borderRadius: '8px', display: 'block', objectFit: 'cover' }} loading="lazy" />
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginTop: '80px', paddingBottom: '40px' }}
      >
        <p style={{ color: '#FFB6C1', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '1.2rem', marginBottom: '25px' }}>
          You've reached the end of this path...
        </p>
        <button 
          onClick={() => onEndReached()}
          style={{ padding: '15px 40px', background: 'transparent', border: '1px solid #FFB6C1', color: '#FFB6C1', borderRadius: '30px', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 0 15px rgba(255, 182, 193, 0.2)' }}
        >
          Continue Journey
        </button>
      </motion.div>
    </div>
  );
}
