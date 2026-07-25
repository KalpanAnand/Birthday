import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import confetti from 'canvas-confetti'
import { Gift, Lock, Image, List, Heart, Video, Star } from 'lucide-react'
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
  const [stage, setStage] = useState(() => {
    const saved = localStorage.getItem('birthdayStage');
    const parsed = saved ? parseInt(saved, 10) : 0;
    return (parsed >= 0 && parsed <= 3) ? parsed : 0;
  })
  
  const [isOpening, setIsOpening] = useState(false)
  
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState(false)
  
  const [secretView, setSecretView] = useState('menu')
  
  // Treasure Hunt State
  const [huntIndex, setHuntIndex] = useState(0)
  const [isNoteOpen, setIsNoteOpen] = useState(false)
  const [starPos, setStarPos] = useState({ top: '50%', left: '50%' })
  const [showDashboard, setShowDashboard] = useState(false)
  const [hasSeenHuntIntro, setHasSeenHuntIntro] = useState(false)
  const [audioPopupDismissed, setAudioPopupDismissed] = useState(false)

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

  // Persist stage state
  useEffect(() => {
    localStorage.setItem('birthdayStage', stage.toString());
  }, [stage]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (name.toLowerCase() === 'sasthu ma' && password.toLowerCase() === 'birthday') {
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
         <div className="stage-0 fade-in-slow" style={{width: '100%', display: 'flex', justifyContent: 'center', zIndex: 1}}>
            <div className="login-box">
               <Lock className="lock-icon" size={40} />
               <h2 className="elegant-wishes">Welcome</h2>
               <p className="touch-text" style={{marginBottom: '30px'}}>Please login to continue</p>
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
                 <button type="submit" className="continue-btn" style={{width: '100%'}}>Login</button>
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
         <div className="stage-2 fade-in-slow">
            <h2 className="elegant-wishes blur-reveal delay-1">Wish you many more happy returns of the day</h2>
            <h1 className="name-elegant blur-reveal delay-2">T Kuntrinmel Sastha</h1>
            <div className="milestone-container blur-reveal delay-3">
               <span className="line"></span>
               <h3 className="milestone-text">25th Birthday</h3>
               <span className="line"></span>
            </div>
            
            <button className="continue-btn blur-reveal delay-4" onClick={() => setStage(3)}>
               Continue
            </button>
         </div>
       )}

       {stage === 3 && (
         <div className="stage-3 fade-in-slow" style={{width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', position: 'relative'}}>
            
            {secretView === 'notes' && (
              <audio src="/videoplayback.mp4" autoPlay loop preload="auto"></audio>
            )}            
            {secretView === 'menu' && (
              <div className="secret-content fade-in-slow">
                <h1 className="elegant-greeting secret-title" style={{marginBottom: '20px', color: '#AEE4E1'}}>The Real Surprise</h1>
                <div className="hub-grid">
                   <div className="hub-card pop-in delay-100" onClick={() => setSecretView('notes')}>
                      <div className="hub-icon-wrapper"><List size={32} /></div>
                      <h3>25 Sticky Notes</h3>
                      <p className="touch-text" style={{fontSize: '0.9rem', marginTop: '10px'}}>Find all the hidden stars</p>
                   </div>
                   <div className="hub-card pop-in delay-200" onClick={() => setSecretView('photos')}>
                      <div className="hub-icon-wrapper"><Image size={32} /></div>
                      <h3>Photos Together</h3>
                      <p className="touch-text" style={{fontSize: '0.9rem', marginTop: '10px'}}>Our best memories</p>
                   </div>
                   <div className="hub-card pop-in delay-300" onClick={() => setSecretView('screenshots')}>
                      <div className="hub-icon-wrapper"><Image size={32} /></div>
                      <h3>Funny Screenshots</h3>
                      <p className="touch-text" style={{fontSize: '0.9rem', marginTop: '10px'}}>Random moments</p>
                   </div>
                   <div className="hub-card pop-in delay-400" onClick={() => setSecretView('wishes')}>
                      <div className="hub-icon-wrapper"><Heart size={32} /></div>
                      <h3>Birthday Wishes</h3>
                      <p className="touch-text" style={{fontSize: '0.9rem', marginTop: '10px'}}>Messages from loved ones</p>
                   </div>
                   <div className="hub-card pop-in delay-500" onClick={() => setSecretView('video')}>
                      <div className="hub-icon-wrapper"><Video size={32} /></div>
                      <h3>My Video</h3>
                      <p className="touch-text" style={{fontSize: '0.9rem', marginTop: '10px'}}>A special message</p>
                   </div>
                </div>
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
                          <div className="animal-modal pop-in" style={{textAlign: 'center', background: 'rgba(11,22,34,0.9)', padding: '40px', borderRadius: '16px', border: '1px solid rgba(174, 228, 225, 0.3)'}}>
                            <h2 className="elegant-wishes" style={{fontSize: '2rem', marginBottom: '20px'}}>Find the Stars! ✨</h2>
                            <p style={{color: '#E0F2F1', marginBottom: '30px', fontSize: '1.1rem', lineHeight: '1.5'}}>
                               There are 25 stars hidden on the screen.<br/>Tap the star to reveal your first sticky note!
                            </p>
                            <button className="continue-btn" onClick={() => setHasSeenHuntIntro(true)}>Start Hunting!</button>
                          </div>
                        ) : huntIndex === 12 && !audioPopupDismissed ? (
                          <div className="animal-modal pop-in" style={{textAlign: 'center', background: 'rgba(11,22,34,0.9)', padding: '40px', borderRadius: '16px', border: '1px solid #F1C40F'}}>
                            <h2 className="elegant-wishes" style={{fontSize: '2rem', marginBottom: '20px'}}>Wait a second... 🤔🎶</h2>
                            <p style={{color: '#E0F2F1', marginBottom: '30px', fontSize: '1.1rem', lineHeight: '1.5'}}>
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
                      <div className="animal-modal pop-in" style={{textAlign: 'center', background: 'rgba(11,22,34,0.9)', padding: '50px', borderRadius: '20px', border: '1px solid rgba(174, 228, 225, 0.3)'}}>
                        <h2 className="elegant-wishes" style={{fontSize: '2.5rem', marginBottom: '20px'}}>You found all 25 notes! 🥳</h2>
                        <p style={{color: '#AEE4E1', marginBottom: '30px', fontSize: '1.2rem'}}>Ready for the final surprise?</p>
                        <button className="continue-btn" onClick={handleShowDashboard}>See all 25 together!</button>
                      </div>
                    ) : createPortal(
                      <div className="hunt-dashboard fade-in-slow">
                        <div className="hunt-dashboard-header">
                          <h2 className="elegant-wishes">You found all 25 notes!</h2>
                          <button className="continue-btn" onClick={() => { setSecretView('menu'); setShowDashboard(false); }} style={{marginTop: '10px'}}>Back to Hub</button>
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

                {secretView === 'photos' && (
                  <div className="gallery-container">
                    <h2 className="elegant-wishes pop-in">Our Memories</h2>
                    <div className="masonry-grid">
                      {[1,2,3,4,5,6].map(i => (
                        <img key={i} className="masonry-img pop-in" style={{animationDelay: `${i * 0.1}s`}} src={`https://picsum.photos/seed/photo${i}/400/${300 + (i%3)*100}`} alt={`Memory ${i}`} />
                      ))}
                    </div>
                  </div>
                )}

                {secretView === 'screenshots' && (
                  <div className="gallery-container">
                    <h2 className="elegant-wishes pop-in">Funny Screenshots</h2>
                    <div className="masonry-grid">
                      {[1,2,3,4].map(i => (
                         <img key={i} className="masonry-img screenshot pop-in" style={{animationDelay: `${i * 0.1}s`}} src={`https://picsum.photos/seed/screen${i}/300/600`} alt={`Screenshot ${i}`} />
                      ))}
                    </div>
                  </div>
                )}

                {secretView === 'wishes' && (
                  <div className="wishes-container">
                    <h2 className="elegant-wishes pop-in">Birthday Wishes</h2>
                    <div className="wishes-list">
                      <div className="wish-card slide-up-fade delay-100">"Happy 25th! Wishing you all the best." - Mom</div>
                      <div className="wish-card slide-up-fade delay-200">"Have a blast bro!" - Friend</div>
                    </div>
                  </div>
                )}

                {secretView === 'video' && (
                  <div className="video-container">
                    <h2 className="elegant-wishes">My Special Message</h2>
                    <video className="birthday-video" controls src=""></video>
                  </div>
                )}
              </div>
            )}
         </div>
       )}
    </div>
  )
}

export default App
