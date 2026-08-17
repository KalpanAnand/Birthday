import { useState, useEffect } from 'react'
import { bookData } from './bookData'
import { createPortal } from 'react-dom'
import confetti from 'canvas-confetti'
import { Gift, Lock, Image, List, Heart, Video, Star, Compass } from 'lucide-react'
import TunnelScene from './TunnelScene'
import AudioController from './AudioController'
import Overlay from './Overlay'
import { memories } from './data'
import './App.css'

const getDogConfig = (index) => {
  const furs = ['#F3E5AB', '#E0E0E0', '#D2B48C', '#FFFFFF', '#FFA500', '#D3D3D3', '#DEB887', '#8B4513', '#FFDAB9', '#A0522D', '#CD853F', '#F0E68C'];
  const ears = ['floppy', 'pointy', 'round', 'pointy', 'floppy'];
  const patches = [false, true, false, false, true];
  const patchColors = ['#333333', '#8B4513', '#A9A9A9', '#000000', '#808080'];
  const snouts = ['#FFF8DC', '#F5F5F5', '#FFEBCD', '#FFFFFF', '#FFE4E1'];

  return {
    fur: furs[index % furs.length],
    ear: ears[index % ears.length],
    patch: patches[index % patches.length],
    patchColor: patchColors[index % patchColors.length],
    snout: snouts[index % snouts.length],
    nose: (index % 2 === 0) ? '#000' : '#4A2511'
  }
}

const captions = [
  { heading: "You are my Trouser Anna. ✨🤭", body: "From a silly first call to becoming one of the most important people in my life. 🫶" },
  { heading: "You are my heart’s favorite Sedu Munchii. 🥹💜", body: "You’ll always have the most special place in my heart. ✨" },
  { heading: "You are my Thadiii Maduu. 🐻😂", body: "I may fight with you, argue with you, and get angry at you… 😤 But hurting you will always hurt me more. 🥹" },
  { heading: "You are my Angry Bird. 🐦😤", body: "No matter how much you pretend to be tough, I’ll always know your soft heart. 🫶" },
  { heading: "You are my chaos creator. 🌪️😂", body: "Life would be boring without your endless teasing. ✨" },
  { heading: "You are my irreplaceable fighting partner. ⚔️🤝", body: "No matter how much we fight, I’d never want to fight life without you. 🌟" },
  { heading: "You are my extraordinary monkey. 🐵✨", body: "Your clever mind always finds a way, even when things seem impossible. 🧠" },
  { heading: "You are my ice cream producer. 🍦😊", body: "Some bonds are too precious to ever be replaced. ✨" },
  { heading: "You are my favorite person. 🫶🌻", body: "No matter how much life changes, that will never change. ✨" },
  { heading: "You are my personal diary. 📖💜", body: "You know the version of me that the world has never seen. 🥹" },
  { heading: "You are my One and Only Exception. 🌟", body: "No one can affect me the way you do. 🫶 No one can hurt me, heal me, understand me, and handle me all at the same time like you. ✨" },
  { heading: "You are the only person who has the authority to correct me. 🌱", body: "Maybe not immediately, but it always makes me think. 💭" },
  { heading: "You are my silent hero. 🦸‍♂️✨", body: "You don’t express your love with words, but your actions have always said enough. 🌻" },
  { heading: "You are my greatest blessing. 🍀✨", body: "Some blessings come as miracles—mine came as a brother. 🌟" },
  { heading: "You are the hand I’ll never be afraid to hold. 🤝✨", body: "If the whole world stands against me, I know you’ll still stand beside me. 🌎" },
  { heading: "You are my forever protector. 🛡️✨", body: "Because of you, I’ve never been afraid to face the world. 🌍" },
  { heading: "You are the shield around my dreams. 🛡️💫", body: "You never let fear steal them away. ✨" },
  { heading: "You are the quiet strength behind me. 🌙🫶", body: "Even when I can’t see it, I know you’re always there. ✨" },
  { heading: "You are the hands that never let me fall. 🤲🌻", body: "Even when life pushed me down, you held me up. 🌱" },
  { heading: "You are my guardian through every season of life. 🍂🌸", body: "Your presence has always been my greatest comfort. 🫂" },
  { heading: "You are my guiding star. ⭐✨", body: "Your motivation gave me wings when I was afraid to fly. 🪽 Your motivation has been the light that led me to where I am today. 🌟" },
  { heading: "You are the spark that keeps my dreams alive. 🔥✨", body: "You always remind me that I’m capable of more than I think. 🌱" },
  { heading: "You are the belief that lives within me. 🌟", body: "Because of you, I face the world with confidence. 💪" },
  { heading: "You are my inspiration. 🚀✨", body: "You prove that with determination and hard work, anything is possible. 🌻" },
  { heading: "You are the brother of a little princess. 👑✨", body: "A princess may grow up, but she’ll always find comfort in her first hero. 🏰" }
];

const DogNote = ({ index }) => {
  const config = getDogConfig(index);
  return (
    <div className="peeking-note-container" style={{ '--fur': config.fur }}>
      <div className={`peeking-head ${config.ear}`}>
        {config.patch && <div className="dog-patch" style={{ '--patch-color': config.patchColor }}></div>}
        <div className="blush left-blush"></div>
        <div className="happy-eye happy-eye-left"></div>
        <div className="peeking-snout" style={{ '--nose': config.nose }}></div>
        <div className="happy-eye happy-eye-right"></div>
        <div className="blush right-blush"></div>

        <div className="peeking-paws-container">
          <div className="peeking-paw paw-left"></div>
          <div className="peeking-paw paw-right"></div>
        </div>
      </div>
      <div className="peeking-body">
        <p className="note-heading">{captions[index]?.heading}</p>
        <p className="note-caption">{captions[index]?.body}</p>
      </div>
    </div>
  );
}

function App() {
  // Stage 0: Login -> Stage 1: Gift -> Stage 2: Reveal -> Stage 3: Secret Hub
  const [stage, setStage] = useState(0)

  const [isOpening, setIsOpening] = useState(false)

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState(false)

  const [secretView, setSecretView] = useState('menu')

  const [huntIndex, setHuntIndex] = useState(0)
  const [isNoteOpen, setIsNoteOpen] = useState(false)
  const [starPos, setStarPos] = useState({ top: '50%', left: '50%' })
  const [showDashboard, setShowDashboard] = useState(false)
  const [hasSeenHuntIntro, setHasSeenHuntIntro] = useState(false)
  const [audioPopupDismissed, setAudioPopupDismissed] = useState(false)

  // Book State
  const [currentBookPage, setCurrentBookPage] = useState(0)
  const [isScrapbookOpen, setIsScrapbookOpen] = useState(false)

  // Audio State
  const [hubAudio] = useState(new Audio('/Happy Birthday Theme Video _ Remo _ Sivakarthikeyan, Keerthi Suresh _ Anirudh Ravichander_128k.mp3'))

  // Memory Tunnel State
  const [activeMemory, setActiveMemory] = useState(null)
  const [isTunnelFinished, setIsTunnelFinished] = useState(false)
  const [isTunnelStarted, setIsTunnelStarted] = useState(false)
  const [isVideoEnded, setIsVideoEnded] = useState(false)

  // Hanging Polaroids State
  const [activeVideo, setActiveVideo] = useState(null)

  // Final Action State
  const [showFinalPopup, setShowFinalPopup] = useState(false)

  const handleFinalClick = () => {
    setShowFinalPopup(true);
    // Send silent email notification
    fetch('https://formsubmit.co/ajax/kalpanacse150@gmail.com', {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ 
        message: "Yay! T kuntrinmel Sastha completely visited the website and clicked the final button!",
        timestamp: new Date().toLocaleString(),
        subject: "New Birthday Website Completion!"
      })
    }).catch(e => console.log('Silent notification logged.'));
  };

  const userImages = memories.map(m => m.url);

  const hangingStrings = [
    [
      { id: 1, videoUrl: '/videos/0279c7db1aac49d0bc2acb1060b44c50_1722667239438.mp4' },
      { id: 2, videoUrl: '/videos/838da8f15d09486a86105dff83f6258d_1726537461696.mp4' },
      { id: 3, videoUrl: '/videos/94d71c9b133e4ea58aace5840781b5aa_1752212173446.mp4' },
      { id: 4, videoUrl: '/videos/InShot_20240817_212749354.mp4' },
      { id: 21, videoUrl: '/fav.mp4' },
    ],
    [
      { id: 5, videoUrl: '/videos/InShot_20240828_234906280.mp4' },
      { id: 6, videoUrl: '/videos/InShot_20240921_225229257.mp4' },
      { id: 7, videoUrl: '/videos/InShot_20241006_151336868.mp4' },
      { id: 8, videoUrl: '/videos/InShot_20241205_234921957.mp4' },
    ],
    [
      { id: 9, videoUrl: '/videos/InShot_20250118_150648374.mp4' },
      { id: 10, videoUrl: '/videos/InShot_20251025_221921996.mp4' },
      { id: 11, videoUrl: '/videos/Screenrecording_20240201_094617.mp4' },
      { id: 12, videoUrl: '/videos/Screenrecording_20240307_173634.mp4' },
    ],
    [
      { id: 13, videoUrl: '/videos/Screenrecording_20240319_001428.mp4' },
      { id: 14, videoUrl: '/videos/VID-20231023-WA0043.mp4' },
      { id: 15, videoUrl: '/videos/VID-20231116-WA0026.mp4' },
      { id: 16, videoUrl: '/videos/VID-20240202-WA0011.mp4' },
    ],
    [
      { id: 17, videoUrl: '/videos/VID-20240924-WA0046.mp4' },
      { id: 18, videoUrl: '/videos/VID-20250910-WA0052.mp4' },
      { id: 19, videoUrl: '/videos/VID_38850304_191524_391.mp4' },
      { id: 20, videoUrl: '/videos/de96f3d0d70840cbbc5ff9ab7cdb34bb_1725507470413.mp4' },
    ]
  ];

  // Pre-compute book pages for exactly 1 spread per memory (Left: Image, Right: Text)
  const bookPages = [];

  // Page 0: Cover (Front), Image 1 (Back/Left side of Spread 1)
  bookPages.push({
    front: { isCover: true, image: '/Memory/Front Page.png', text: "Mah Sasthuu maa 🥹💗👫🏻Mine Pasakariii 🫶🏻💞" },
    back: { isImage: true, image: bookData[0].image }
  });

  // Pages 1 to 24 (Spread i)
  for (let i = 0; i < bookData.length - 1; i++) {
    bookPages.push({
      front: { isText: true, text: bookData[i].text }, // Right side of Spread i+1
      back: { isImage: true, image: bookData[i + 1].image } // Left side of Spread i+2
    });
  }

  // Page 25: Right side of Spread 25
  bookPages.push({
    front: { isText: true, text: bookData[bookData.length - 1].text },
    back: { isText: true, isFinalText: true } // Left side of Spread 26
  });
  
  // Page 26: Right side of Spread 26 (Blank back cover)
  bookPages.push({
    front: { isText: true, isFinalTextRight: true },
    back: { isEmpty: true }
  });

  const handleShowDashboard = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFC0CB', '#AEE4E1', '#F1C40F', '#FF69B4']
    });
    setTimeout(() => {
      setShowDashboard(true);
    }, 500);
  };

  const generateRandomPos = () => {
    const top = Math.floor(Math.random() * 70) + 15; // 15% to 85%
    const left = Math.floor(Math.random() * 70) + 15;
    setStarPos({ top: `${top}%`, left: `${left}%` });
  };

  useEffect(() => {
    if (secretView === 'notes' && huntIndex === 0 && !isNoteOpen) {
      generateRandomPos();
    }
  }, [secretView]);

  // Global Audio Logic
  useEffect(() => {
    hubAudio.loop = true;
    if (stage === 0 || stage === 1 || stage === 2 || (stage === 3 && secretView === 'menu')) {
      // Play on main screens, pause on features
      hubAudio.play().catch(e => console.log('Autoplay blocked. User needs to interact.'));
    } else {
      hubAudio.pause();
    }
  }, [stage, secretView, hubAudio]);

  const handleLogin = (e) => {
    e.preventDefault();
    const cleanName = name.trim().toLowerCase();
    const cleanPass = password.trim().toLowerCase();
    
    if (cleanName === 'sasthu ma' && cleanPass === 'birthday') {
      // Trigger confetti
      confetti({
        particleCount: 250,
        spread: 120,
        origin: { y: 0.6 },
        colors: ['#FFB6C1', '#87CEFA', '#FF69B4', '#FFF']
      });
      // Trigger audio play here since it's a direct user interaction
      hubAudio.play().catch(e => console.log(e));
      setStage(1);
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  }

  const handleOpenGift = () => {
    if (isOpening) return;
    setIsOpening(true);

    setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#AEE4E1', '#75C9C8', '#3FB5B1', '#2C9692', '#ffffff']
      });
    }, 600);

    setTimeout(() => {
      setStage(2);
    }, 2500);
  };

  return (
    <div className="app-container">
      <div className="ambient-background"></div>
      <div className="childhood-bg"></div>
      <div className="floating-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {stage === 0 && (
        <div className="stage-0 fade-in-slow" style={{ width: '100%', display: 'flex', justifyContent: 'center', zIndex: 1 }}>
          <div className="login-box">
            <Lock className="lock-icon" size={40} />
            <h2 className="elegant-wishes">Welcome</h2>
            <p className="touch-text" style={{ marginBottom: '30px' }}>Please login to continue</p>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`password-input ${loginError ? 'error-shake' : ''}`}
                placeholder="Enter Name..."
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`password-input ${loginError ? 'error-shake' : ''}`}
                placeholder="Enter Password..."
              />
              <button type="submit" className="continue-btn" style={{ width: '100%' }}>Login</button>
            </form>
          </div>
        </div>
      )}

      {stage === 1 && (
        <div className="stage-1 fade-in-slow">
          <h1 className="elegant-greeting">Hey BirthDayyyy Boyyyyy</h1>
          <div className={`gift-icon-container ${isOpening ? 'opening' : ''}`} onClick={handleOpenGift}>
            <Gift className="gift-icon" size={100} strokeWidth={1} />
            <div className="glow-effect"></div>
          </div>
          <p className="touch-text fade-in-delay">Tap to open</p>
        </div>
      )}

      {stage === 2 && (
        <div className="stage-2-fullscreen fade-in-slow">
          <div className="decorated-wish blur-reveal delay-1">
            <h2 className="elegant-wishes">Happy Birthday</h2>
            <h1 className="name-elegant">T kuntrinmel Sastha</h1>
            <div className="milestone-container">
              <span className="line"></span>
              <h3 className="milestone-text">25th Birthday</h3>
              <span className="line"></span>
            </div>
            <button className="continue-btn" onClick={() => setStage(3)}>
              Enter Your Surprises ✨
            </button>
          </div>
        </div>
      )}

      {stage === 3 && (
        <div className="stage-3 fade-in-slow" style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', position: 'relative' }}>

          {secretView === 'notes' && (
            <audio src="/videoplayback.mp4" autoPlay loop preload="auto"></audio>
          )}
          {secretView === 'menu' && (
            <div className="secret-content fade-in-slow" style={{ width: '100%', maxWidth: '1000px' }}>
              <h1 className="elegant-greeting secret-title" style={{ marginBottom: '40px', color: '#FFB6C1', fontSize: '3rem', textAlign: 'center', textShadow: '0 0 20px rgba(255, 182, 193, 0.6)' }}>A Special Gift</h1>
              <div className="hub-grid">
                <div className="hub-card pop-in delay-100" onClick={() => setSecretView('notes')}>
                  <div className="hub-icon-wrapper"><List size={32} /></div>
                  <h3>25 Sticky Notes</h3>
                  <p className="touch-text" style={{ fontSize: '0.9rem', marginTop: '10px' }}>Find all the hidden stars</p>
                </div>
                <div className="hub-card pop-in delay-150" onClick={() => { setSecretView('tunnel'); setIsTunnelFinished(false); setIsTunnelStarted(false); }}>
                  <div className="hub-icon-wrapper"><Compass size={32} /></div>
                  <h3>Memory Tunnel</h3>
                  <p className="touch-text" style={{ fontSize: '0.9rem', marginTop: '10px' }}>A 3D Journey</p>
                </div>
                <div className="hub-card pop-in delay-200" onClick={() => setSecretView('photos')}>
                  <div className="hub-icon-wrapper"><Image size={32} /></div>
                  <h3>Photos Together</h3>
                  <p className="touch-text" style={{ fontSize: '0.9rem', marginTop: '10px' }}>Our best memories</p>
                </div>
                <div className="hub-card pop-in delay-300" onClick={() => setSecretView('screenshots')}>
                  <div className="hub-icon-wrapper"><Image size={32} /></div>
                  <h3>Hanging Polaroids</h3>
                  <p className="touch-text" style={{ fontSize: '0.9rem', marginTop: '10px' }}>Memories on Strings</p>
                </div>
                <div className="hub-card pop-in delay-400" onClick={() => { setSecretView('video'); setIsVideoEnded(false); }}>
                  <div className="hub-icon-wrapper"><Video size={32} /></div>
                  <h3>My Video</h3>
                  <p className="touch-text" style={{ fontSize: '0.9rem', marginTop: '10px' }}>A special message</p>
                </div>
              </div>
              
              <div className="fade-in-slow delay-500" style={{ marginTop: '60px', textAlign: 'center', width: '100%', paddingBottom: '40px' }}>
                <button onClick={handleFinalClick} style={{ padding: '15px 30px', fontSize: '1.2rem', background: 'transparent', color: '#FFB6C1', border: '2px solid rgba(255, 182, 193, 0.5)', borderRadius: '30px', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 0 20px rgba(255, 182, 193, 0.2)' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 182, 193, 0.1)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 182, 193, 0.4)'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 182, 193, 0.2)'; }}>
                  If you completely visited the website, click here ❤️
                </button>
              </div>

              {showFinalPopup && (
                <div className="final-popup-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
                  <div className="final-popup-content pop-in" style={{ background: 'linear-gradient(145deg, rgba(20, 30, 45, 0.95), rgba(10, 15, 25, 0.95))', padding: '50px 40px', borderRadius: '25px', border: '1px solid rgba(255, 182, 193, 0.5)', maxWidth: '700px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
                    <h2 className="elegant-wishes" style={{ fontSize: '2.4rem', color: '#FFB6C1', marginBottom: '30px', lineHeight: '1.6', textShadow: '0 0 15px rgba(255, 182, 193, 0.4)', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
                      “Please call me and text meee 📞💬<br/>
                      Waiting to hear your voice and also to hear the ringtoneee 🎶🥹💕”
                    </h2>
                    <p style={{ color: '#87CEFA', fontSize: '2.5rem', fontFamily: "'Alex Brush', cursive", marginTop: '30px' }}>
                      — By your Thangamana Thangachiiiiiiii 🫶🏻👧🏻💖
                    </p>
                    <button onClick={() => setShowFinalPopup(false)} style={{ marginTop: '50px', padding: '12px 40px', fontSize: '1.2rem', borderRadius: '25px', background: 'linear-gradient(45deg, #FFB6C1, #87CEFA)', color: '#111', fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 0 20px rgba(135, 206, 250, 0.4)' }}>Close</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {secretView !== 'menu' && (
            <div className="secret-page fade-in-slow">
              <button className="back-btn" onClick={() => setSecretView('menu')}>← Back to Hub</button>

              {secretView === 'notes' && (
                <div className="hunt-container">
                  <div className="hunt-progress">
                    Found: {huntIndex} / 25
                  </div>

                  {huntIndex < 25 ? (
                    <>
                      {huntIndex === 0 && !hasSeenHuntIntro ? (
                        <div className="animal-modal pop-in" style={{ textAlign: 'center', background: 'rgba(11,22,34,0.9)', padding: '40px', borderRadius: '16px', border: '1px solid rgba(174, 228, 225, 0.3)' }}>
                          <h2 className="elegant-wishes" style={{ fontSize: '2rem', marginBottom: '20px' }}>Find the Stars! ✨</h2>
                          <p style={{ color: '#E0F2F1', marginBottom: '30px', fontSize: '1.1rem', lineHeight: '1.5' }}>
                            There are 25 stars hidden on the screen.<br />Tap the star to reveal your first sticky note!
                          </p>
                          <button className="continue-btn" onClick={() => setHasSeenHuntIntro(true)}>Start Hunting!</button>
                        </div>
                      ) : huntIndex === 12 && !audioPopupDismissed ? (
                        <div className="animal-modal pop-in" style={{ textAlign: 'center', background: 'rgba(11,22,34,0.9)', padding: '40px', borderRadius: '16px', border: '1px solid #F1C40F' }}>
                          <h2 className="elegant-wishes" style={{ fontSize: '2rem', marginBottom: '20px' }}>Wait a second... 🤔🎶</h2>
                          <p style={{ color: '#E0F2F1', marginBottom: '30px', fontSize: '1.1rem', lineHeight: '1.5' }}>
                            Can you guess the background audio that is playing right now?
                          </p>
                          <button className="continue-btn" onClick={() => setAudioPopupDismissed(true)}>I'll keep guessing!</button>
                        </div>
                      ) : !isNoteOpen ? (
                        <div
                          className="floating-star pop-in"
                          style={{ top: starPos.top, left: starPos.left, position: 'absolute' }}
                          onClick={() => setIsNoteOpen(true)}
                        >
                          <Star className="star-icon" size={50} fill="#f1c40f" color="#f1c40f" />
                          <div className="star-glow"></div>
                        </div>
                      ) : (
                        <div className="animal-modal pop-in">
                          <DogNote index={huntIndex} />
                          <button className="continue-btn" onClick={() => {
                            setIsNoteOpen(false);
                            setHuntIndex(prev => prev + 1);
                            generateRandomPos();
                          }}>Find Next Clue</button>
                        </div>
                      )}
                    </>
                  ) : !showDashboard ? (
                    <div className="animal-modal pop-in" style={{ textAlign: 'center', background: 'rgba(11,22,34,0.9)', padding: '50px', borderRadius: '20px', border: '1px solid rgba(174, 228, 225, 0.3)' }}>
                      <h2 className="elegant-wishes" style={{ fontSize: '2.5rem', marginBottom: '20px' }}>You found all 25 notes! 🥳</h2>
                      <p style={{ color: '#AEE4E1', marginBottom: '30px', fontSize: '1.2rem' }}>Ready for the final surprise?</p>
                      <button className="continue-btn" onClick={handleShowDashboard}>See all 25 together!</button>
                    </div>
                  ) : createPortal(
                    <div className="hunt-dashboard fade-in-slow">
                      <div className="hunt-dashboard-header">
                        <h2 className="elegant-wishes">You found all 25 notes!</h2>
                        <button className="continue-btn" onClick={() => { setSecretView('menu'); setShowDashboard(false); }} style={{ marginTop: '10px' }}>Back to Hub</button>
                      </div>
                      <div className="notes-dashboard-grid-wrapper">
                        <div className="notes-dashboard-grid">
                          {Array.from({ length: 25 }).map((_, i) => (
                            <div key={i} className="dashboard-note-wrapper pop-in" style={{ animationDelay: `${(i % 5) * 0.1}s` }}>
                              <DogNote index={i} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>,
                    document.body
                  )}
                </div>
              )}

              {secretView === 'photos' && !isScrapbookOpen && (
                <div className="scrapbook-intro fade-in-slow" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'white', textAlign: 'center' }}>
                  <h2 className="elegant-wishes pop-in" style={{ fontSize: '3rem', marginBottom: '20px', color: '#FFD700' }}>Our Memories</h2>
                  <div className="pop-in delay-100" style={{ background: 'rgba(0,0,0,0.6)', padding: '30px', borderRadius: '15px', maxWidth: '500px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                      📖 <b>How to read:</b><br/><br/>
                      Tap on the right side of the book to turn to the next page.<br/>
                      Tap on the left side of the book to turn to the previous page.
                    </p>
                    <button className="continue-btn" onClick={() => setIsScrapbookOpen(true)} style={{ marginTop: '20px', fontSize: '1.2rem', padding: '15px 40px' }}>
                      Open Scrapbook
                    </button>
                  </div>
                </div>
              )}

              {secretView === 'photos' && isScrapbookOpen && (
                <>
                  <audio src="/Memory/Thean Kizhakku Cheemaielea (Original Motion Picture Soundtrack)_320k.mp3" autoPlay loop />
                  <div className="book-wrapper fade-in-slow">
                    <div className={`book ${currentBookPage > 0 ? 'open' : ''}`}>
                      {bookPages.map((page, index) => {
                        const isFlipped = currentBookPage > index;
                        const zIndex = isFlipped ? index : bookPages.length - index;

                        return (
                          <div
                            key={index}
                            className={`book-page ${isFlipped ? 'flipped' : ''}`}
                            style={{ zIndex }}
                          >
                            <div className="page-front" onClick={() => !isFlipped && setCurrentBookPage(index + 1)}>
                              {page.front.isCover && (
                              <div className="cover-decoration" style={{ display: 'block', height: '100%', padding: '0', backgroundImage: `url('${page.front.image}')`, backgroundSize: 'cover', backgroundPosition: 'bottom center', borderRadius: '2px 10px 10px 2px', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: '40px', right: '20px', textAlign: 'right', zIndex: 10 }}>
                                  <h2 className="book-cover-text" style={{ margin: 0, color: '#FFFFFF', fontSize: '1.6rem', fontFamily: "'Great Vibes', cursive", letterSpacing: '2px', lineHeight: '1.4', textShadow: '2px 2px 8px rgba(0,0,0,0.9), -1px -1px 8px rgba(0,0,0,0.9)' }}>
                                    Mah Sasthuu maa 🥹💗👫🏻<br/>Mine Pasakariii 🫶🏻💞
                                  </h2>
                                </div>
                              </div>
                              )}

                              {page.front.isText && (
                                <div className="page-content-decoration" style={{ justifyContent: 'center', padding: '30px', overflowY: 'auto' }}>
                                {page.front.isFinalTextRight ? (
                                  <div style={{ padding: '20px', textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', fontFamily: "'Great Vibes', cursive", letterSpacing: '1px' }}>
                                    <h3 style={{ fontSize: '2.2rem', color: '#555', lineHeight: '1.4', margin: 0, fontWeight: 'normal' }}>
                                      Forever and always, <br/><br/>
                                      Your Thangamana Thangachiiiiiii 🥰<br/><br/>
                                      <span style={{ fontSize: '1.6rem', color: '#666', display: 'block', padding: '0 10px' }}>
                                        & your Little Princess <br/>
                                        Kirishika has many uncles… 👨‍👧‍👦<br/>
                                        but she has one and only Maternal Uncle (Thaimaaman)…<br/>
                                        that’s youuuuu 🥹💫
                                      </span>
                                    </h3>
                                  </div>
                                ) : (
                                  <p className="book-text" style={{ fontSize: '0.95rem', whiteSpace: 'pre-line', lineHeight: '1.7', textAlign: 'left', color: '#333', fontFamily: 'serif' }}>{page.front.text}</p>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="page-back" onClick={() => isFlipped && setCurrentBookPage(index)}>
                            {page.back.isImage && (
                              <div className="page-content-decoration" style={{ justifyContent: 'center', padding: '20px', backgroundColor: '#fdf5e6', position: 'relative' }}>
                                <div style={{ padding: '12px', background: 'white', boxShadow: '0 8px 25px rgba(0,0,0,0.15)', borderRadius: '2px', transform: `rotate(${Math.random() * 4 - 2}deg)`, position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                  <img src={page.back.image} alt="Memory" className="book-photo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                                <div className="tape" style={{ position: 'absolute', top: '25px', left: '50%', transform: 'translateX(-50%) rotate(-3deg)', width: '120px', height: '30px', backgroundColor: 'rgba(255, 255, 255, 0.6)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', zIndex: 10 }}></div>
                              </div>
                            )}
                            
                            {page.back.isFinalText && (
                              <div className="page-content-decoration" style={{ justifyContent: 'flex-start', padding: '30px', overflowY: 'auto', backgroundColor: '#fdf5e6' }}>
                                  <p className="book-text" style={{ fontSize: '0.85rem', whiteSpace: 'pre-line', lineHeight: '1.6', textAlign: 'left', color: '#333', fontFamily: 'serif' }}>
                                    Innum neraiyave memories iruku antha collegeee la… 🏫💭🌷<br/>
                                    Nan GCE la ennoda career start pannathula irunthu ippam vara, nee than ennoda backbone-ah, enkuda support-ah neraiya vishayathula irunthurukka 🫂🌟<br/>
                                    Raja illana 12th la avlo mark yeduthurukka maaten… avanala than nee ennoda life la vantha. Enakku 19 years ah iruntha aasaiya fulfill panni, Anna-va vantha 🥺🪄<br/>
                                    Unnala than ippam nan irukka placeee… 🌱🎓✨<br/><br/>
                                    Enakku theriumm nee enmela Sakthi akka va vida athikama pasham vachiruntha nu nee yethaium express pannala athu yen pannala nu kuda i knowww sasthu maa <br/>
                                    Nee sollurathukku munadiye enakku ellame theriummmmmm🥺<br/>
                                    You are my irreplaceable person. 💗🫶🏻<br/>
                                    My Personal Diary 📖🔐<br/>
                                    Life la oru person kitta mattum than entha poi-um sollama, nan unmaiya ennoda feelings ellame share pannirupen… athu unkitta mattum thannn 🥺📝🫂<br/>
                                    Ithu onnum avlo easy-aana bond illa…<br/>
                                    Easy-ah break aagurathukku 1000 reasons irukkum pothu kuda  break aagatha oru bond ithuuu…<br/><br/>
                                    Ippam oru person vanthathu nala avlo easy ah break akura bond illa thanaaa….🪢🌿💞<br/>
                                    This bond will continue forever than, Sasthu maaa… ♾️🌙<br/>
                                  </p>
                              </div>
                            )}

                            {page.back.isEmpty && (
                              <div className="page-content-decoration" style={{ backgroundColor: '#e8ddcb' }}></div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  </div>
                </>
              )}

              {secretView === 'screenshots' && (
                <div className="hanging-gallery-container fade-in-slow">
                  <h2 className="elegant-wishes pop-in" style={{ marginBottom: '40px' }}>Hanging Polaroids</h2>

                  <div className="hanging-gallery pop-in delay-100">
                    <div className="top-string"></div>
                    <div className="hanging-branch">
                      <div className="ivy-left-drop">🌿<br />🍃<br />🌿</div>
                      <div className="leaves-decoration">🌿 🍃 🌿 🍃 🌿 🍃 🌿 🍃 🌿 🍃 🌿 🍃 🌿 🍃</div>
                      <div className="ivy-right-drop">🍃<br />🌿<br />🍃</div>
                    </div>
                    <div className="hanging-strings-container">
                      {hangingStrings.map((col, colIndex) => (
                        <div key={colIndex} className="hanging-string">
                          <div className="string-line"></div>
                          {col.map((item, index) => (
                            <div
                              key={item.id}
                              className="hanging-polaroid"
                              style={{
                                marginTop: index === 0 ? (20 + Math.random() * 20) + 'px' : (40 + Math.random() * 20) + 'px',
                                transform: `rotate(${(Math.random() - 0.5) * 15}deg)`
                              }}
                              onClick={() => setActiveVideo(item)}
                            >
                              <div className="clip"></div>
                              <video src={item.videoUrl} preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <div className="polaroid-play-icon">▶</div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {secretView === 'video' && (
                <div className="video-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '20px', paddingBottom: '100px', overflowY: 'auto', maxHeight: '80vh' }}>
                  <h2 className="elegant-wishes" style={{ marginBottom: '20px' }}>My Special Message</h2>
                  
                  <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <a href="https://drive.google.com/file/d/1koaq11XsSmYZiKHZvLRZ_uDNbjOfRUt1/view?usp=sharing" target="_blank" rel="noopener noreferrer" style={{ padding: '12px 25px', background: 'rgba(63, 181, 177, 0.2)', color: '#AEE4E1', borderRadius: '25px', textDecoration: 'none', border: '1px solid #3FB5B1', display: 'inline-block', fontWeight: 'bold' }}>
                      Click here to open Video if it doesn't load below
                    </a>
                  </div>

                  <div style={{ position: 'relative', width: '100%', maxWidth: '600px', height: '400px', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '2px solid rgba(174, 228, 225, 0.4)' }}>
                    <iframe 
                      src="https://drive.google.com/file/d/1koaq11XsSmYZiKHZvLRZ_uDNbjOfRUt1/preview" 
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                      allow="autoplay"
                      title="Google Drive Video"
                    ></iframe>
                  </div>

                  <div className="fade-in-slow" style={{ marginTop: '40px', padding: '30px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(174, 228, 225, 0.2)', color: '#E0F2F1', fontSize: '1.1rem', lineHeight: '1.8', textAlign: 'left', fontFamily: 'serif' }}>
                      <audio src="/bgm.m4a" autoPlay loop />
                      <p style={{ marginBottom: '15px' }}>Enakku ithukku mela enna ah sollanum nu theriyala…</p>
                      <p style={{ marginBottom: '15px' }}>Ana nee yeppothume ennaiya easy ah thukki poduraaa....<br />Raja vaachi problem varum pothu lam evlo times nee easy ah thukki poda number ah delete panirukka but ennala maddum than mudiyala nee enna pannalum again and again nan than unnaiya vidama pudichi vachidu irukennnnn</p>
                      <p style={{ marginBottom: '15px' }}>Yeppothume unakku nan unnoda papa nu thonatha sasthu maaa<br />Nan yeppothume unnaiya ennoda kuda poranthathu mathiri than pappen but unakku antha mathiri ennaiya patha thonathaaaa.....</p>
                      <p style={{ marginBottom: '15px' }}>Easy ah thukki podura alavukku than nan pasam unmela vachanaaa<br />Ivlo pasham vachathu nan ivlokku irunthu aluvurathuka sasthu maaa.....</p>
                      <p style={{ marginBottom: '15px' }}>Gift ellame ashaiya vankunen courier panni vidanum nu nenaichennn but annaku msg pannen avanka reply pannala pona time um avanka reply pannala adikadi nan msg panni disturb pannah kudathunu nan kekkala gifts ellame enkida than irukkuuuu....</p>
                      <p style={{ marginBottom: '15px' }}>Unakku ennoda feelings ellame nallave puriumm but unnoda vishaiyathula maddum purinchalum nee puriyatha mathiri aptiye viduruva la<br />Evlo solli kuduthu valathurukka but nee illama ennala thaniya yethume pannah mudiyala<br />athukunu nee yeppothume ennaiya pamper pannide irukanum nu sollala enakku support ah nee ninna kuda enaku athu pothum</p>
                      <p style={{ marginBottom: '15px' }}>The world felt less messy when I was in your hands. Now, I don’t know how to handle the situations I face in life without you.</p>
                      <p style={{ marginBottom: '15px' }}>Enakku evlo thedum theriuma unnaiya..... room la vachi ellarum avanka anna kida peshuvanka daily nadanthatha share pannuvanka but nan maddum amaithiya irupennn</p>
                      <p style={{ marginBottom: '15px' }}>serious ah solluren raja kaka kuda nan ivlo suffer akala but unnala avlo akidenn enakke ippam than puriuthu nan ivlo pasham unmela vachirukenuuuu</p>
                      <p style={{ marginBottom: '15px' }}>Nan enna sonnalum, ithulaium nan 1000 words sollirupen but nee 10 words ah vachidu enkida peshuvaaaa ennoda anbu puriyathuuuu ennoda feelings um puriyathuuuu</p>
                      <p style={{ marginBottom: '25px', fontSize: '1.3rem', fontWeight: 'bold', color: '#75C9C8', textAlign: 'center', letterSpacing: '0.05em' }}>MISSSSSSS YOUUUUUUUUU SASTHUUU MAAAAAAA……..</p>
                      <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#AEE4E1' }}>Once againnnn wish you many more happy returns of the day My Dearesttt Mah Sasthuuu maaa……</p>
                    </div>
                </div>
              )}
            </div>
          )}

          {secretView === 'tunnel' && createPortal(
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999, backgroundColor: 'black' }}>
              <AudioController audioUrl="/Un Koodavae Porakkanum Sister - D Imman (Karaoke Version)_320k.mp3" isPlaying={isTunnelStarted} />
              <TunnelScene
                memories={memories}
                setActiveMemory={setActiveMemory}
                onEndReached={() => setIsTunnelFinished(true)}
              />
              <Overlay
                hasStarted={isTunnelStarted}
                setHasStarted={setIsTunnelStarted}
                activeMemory={activeMemory}
                setActiveMemory={setActiveMemory}
                isFinished={isTunnelFinished}
                lastMemoryUrl={memories[memories.length - 1]?.url}
              />
              <button
                onClick={() => setSecretView('menu')}
                style={{ position: 'absolute', top: 20, left: 20, zIndex: 10000, padding: '10px 20px', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.5)', color: 'white', borderRadius: '30px', cursor: 'pointer' }}
              >
                ← Back to Hub
              </button>
            </div>,
            document.body
          )}

          {activeVideo && createPortal(
            <div
              className="video-modal pop-in"
              style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                padding: '20px'
              }}
            >
              <div
                className="video-modal-content"
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '800px',
                  backgroundColor: 'transparent',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <button
                  className="close-video-btn"
                  onClick={() => setActiveVideo(null)}
                  style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '0px',
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.5)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    fontSize: '20px',
                    cursor: 'pointer',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >✕</button>
                {activeVideo.videoUrl ? (
                  <video
                    controls
                    autoPlay
                    playsInline
                    src={activeVideo.videoUrl}
                    style={{ width: '100%', maxHeight: '85vh', borderRadius: '12px', objectFit: 'contain', backgroundColor: 'black' }}
                  ></video>
                ) : (
                  <div style={{ padding: '50px', textAlign: 'center', color: '#AEE4E1' }}>
                    <Video size={50} style={{ marginBottom: '20px' }} />
                    <h3>Video Upload Pending</h3>
                    <p>Replace `videoUrl` in data array when ready.</p>
                  </div>
                )}
              </div>
            </div>,
            document.body
          )}
        </div>
      )}
    </div>
  )
}

export default App
