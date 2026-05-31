import { useNavigate } from 'react-router-dom'
import useMediaQuery from '../hooks/useMediaQuery'

const Landing = () => {
    const navigate = useNavigate()
    const { isMobile, isTablet } = useMediaQuery()

    const features = [
        { icon: '📓', title: 'Trade Journal', desc: 'Log every trade with entry, exit, R:R, tags and lessons learned. Never repeat the same mistake twice.' },
        { icon: '🤖', title: 'AI Chart Analysis', desc: 'Upload any chart and get instant pattern recognition, bias detection and entry zone suggestions.' },
        { icon: '⚖️', title: 'Risk Calculator', desc: 'Calculate exact lot sizes, pip values and R:R ratios before entering any trade.' },
        { icon: '📊', title: 'Portfolio Analytics', desc: 'Track your equity curve, win rate per pair, best and worst trades over any time period.' },
        { icon: '🌐', title: 'Community Feed', desc: 'Share trade ideas and setups with a community of serious traders.' },
        { icon: '🏆', title: 'Leaderboard', desc: 'See where you rank against other traders. Compete on win rate, pips and R:R.' },
    ]

    const stats = [
        { value: '10,000+', label: 'Trades Logged' },
        { value: '500+', label: 'Active Traders' },
        { value: '68%', label: 'Avg Win Rate' },
        { value: '2.4', label: 'Avg R:R Ratio' },
    ]

    const testimonials = [
        { name: 'Alex K.', role: 'Forex Trader', text: 'TradeJotter helped me identify I was overtrading the NY session. My win rate went from 42% to 61% in 6 weeks.' },
        { name: 'Sarah M.', role: 'Prop Firm Trader', text: 'The AI chart analysis is insane. It catches patterns I miss and gives me a second opinion before I enter.' },
        { name: 'James O.', role: 'Crypto Trader', text: 'Best trading journal I have used. Clean, fast and the risk calculator saves me every single session.' },
    ]

    const pad = isMobile ? '0 16px' : '0 48px'

    return (
        <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

            {/* Navbar */}
            <nav style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: isMobile ? '16px 20px' : '24px 64px',
                borderBottom: '1px solid #111', position: 'sticky', top: 0,
                background: '#0a0a0aee', backdropFilter: 'blur(12px)', zIndex: 100
            }}>
                <span style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, letterSpacing: '-0.02em' }}>
                    <span style={{ color: '#00ff88' }}>Trade</span><span style={{ color: '#fff' }}>Jotter</span>
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                    {!isMobile && (
                        <button onClick={() => navigate('/login')} style={{ padding: '10px 22px', background: 'transparent', border: '1px solid #222', color: '#888', borderRadius: 8, cursor: 'pointer', fontSize: 15 }}
                            onMouseEnter={e => { e.target.style.borderColor = '#00ff88'; e.target.style.color = '#00ff88' }}
                            onMouseLeave={e => { e.target.style.borderColor = '#222'; e.target.style.color = '#888' }}
                        >Sign In</button>
                    )}
                    <button onClick={() => navigate('/signup')} style={{ padding: isMobile ? '9px 16px' : '10px 22px', background: '#00ff88', border: 'none', color: '#000', borderRadius: 8, cursor: 'pointer', fontSize: isMobile ? 13 : 15, fontWeight: 800 }}>
                        {isMobile ? 'Get Started' : 'Get Started Free'}
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <section style={{ textAlign: 'center', padding: isMobile ? '72px 20px 60px' : '120px 24px 100px', maxWidth: 900, margin: '0 auto' }}>
                <div style={{ display: 'inline-block', padding: '7px 18px', background: '#00ff8815', border: '1px solid #00ff8830', borderRadius: 20, color: '#00ff88', fontSize: isMobile ? 11 : 13, fontWeight: 700, marginBottom: 28, letterSpacing: '0.05em' }}>
                    ⚡ AI-POWERED TRADING JOURNAL
                </div>
                <h1 style={{ fontSize: isMobile ? 44 : 'clamp(56px, 9vw, 96px)', fontWeight: 800, lineHeight: 1.05, margin: '0 0 24px', letterSpacing: '-0.04em' }}>
                    Trade smarter.<br />
                    <span style={{ color: '#00ff88' }}>Journal better.</span><br />
                    Win more.
                </h1>
                <p style={{ fontSize: isMobile ? 16 : 20, color: '#555', margin: '0 auto 40px', lineHeight: 1.7, maxWidth: 560 }}>
                    TradeJotter is the all-in-one platform for serious traders. Journal your trades, analyze charts with AI, and track your performance — all in one place.
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button onClick={() => navigate('/signup')} style={{ padding: isMobile ? '14px 28px' : '18px 40px', background: '#00ff88', color: '#000', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: isMobile ? 15 : 18, cursor: 'pointer' }}>
                        Start for free →
                    </button>
                    <button onClick={() => navigate('/pricing')} style={{ padding: isMobile ? '14px 28px' : '18px 40px', background: 'transparent', color: '#888', border: '1px solid #222', borderRadius: 12, fontWeight: 600, fontSize: isMobile ? 15 : 18, cursor: 'pointer' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#444' }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#222' }}
                    >
                        View pricing
                    </button>
                </div>
                <p style={{ color: '#333', fontSize: 13, marginTop: 20 }}>No credit card required · Free forever plan available</p>
            </section>

            {/* Stats */}
            <section style={{ borderTop: '1px solid #111', borderBottom: '1px solid #111', padding: '48px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', maxWidth: 900, margin: '0 auto', gap: isMobile ? 32 : 24 }}>
                    {stats.map(s => (
                        <div key={s.label} style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: isMobile ? 36 : 48, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace', color: '#00ff88', margin: '0 0 6px', letterSpacing: '-0.03em' }}>{s.value}</p>
                            <p style={{ color: '#444', fontSize: isMobile ? 13 : 15, margin: 0 }}>{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '72px 20px' : '120px 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: isMobile ? 48 : 72 }}>
                    <h2 style={{ fontSize: isMobile ? 32 : 52, fontWeight: 800, margin: '0 0 14px', letterSpacing: '-0.03em' }}>
                        Everything you need to <span style={{ color: '#00ff88' }}>trade better</span>
                    </h2>
                    <p style={{ color: '#444', fontSize: isMobile ? 15 : 18, margin: 0 }}>Built by traders, for traders.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 20 }}>
                    {features.map(f => (
                        <div key={f.title} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 20, padding: isMobile ? 24 : 36, transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#00ff8830'; e.currentTarget.style.background = '#00ff8806' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.background = '#111' }}
                        >
                            <p style={{ fontSize: 36, margin: '0 0 16px' }}>{f.icon}</p>
                            <h3 style={{ fontSize: isMobile ? 17 : 20, fontWeight: 700, margin: '0 0 10px' }}>{f.title}</h3>
                            <p style={{ color: '#555', fontSize: isMobile ? 14 : 16, margin: 0, lineHeight: 1.7 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section style={{ borderTop: '1px solid #111', padding: isMobile ? '72px 20px' : '120px 24px' }}>
                <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: isMobile ? 32 : 52, fontWeight: 800, margin: '0 0 14px', letterSpacing: '-0.03em' }}>
                        Get started in <span style={{ color: '#00ff88' }}>3 steps</span>
                    </h2>
                    <p style={{ color: '#444', fontSize: isMobile ? 15 : 18, margin: '0 0 48px' }}>No complicated setup. Just sign up and start trading smarter.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {[
                            { step: '01', title: 'Create your free account', desc: 'Sign up in 30 seconds. No credit card required.' },
                            { step: '02', title: 'Log your first trade', desc: 'Add pair, direction, result, R:R and your lesson learned.' },
                            { step: '03', title: 'Analyze and improve', desc: 'See your win rate, equity curve and AI-powered insights.' },
                        ].map(s => (
                            <div key={s.step} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', textAlign: 'left', background: '#111', border: '1px solid #1a1a1a', borderRadius: 16, padding: isMobile ? 24 : 32 }}>
                                <span style={{ fontSize: isMobile ? 28 : 40, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace', color: '#00ff8840', flexShrink: 0, lineHeight: 1 }}>{s.step}</span>
                                <div>
                                    <h3 style={{ fontSize: isMobile ? 16 : 20, fontWeight: 700, margin: '0 0 8px' }}>{s.title}</h3>
                                    <p style={{ color: '#555', fontSize: isMobile ? 14 : 16, margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section style={{ borderTop: '1px solid #111', padding: isMobile ? '72px 20px' : '120px 24px' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: isMobile ? 48 : 72 }}>
                        <h2 style={{ fontSize: isMobile ? 32 : 52, fontWeight: 800, margin: '0 0 14px', letterSpacing: '-0.03em' }}>
                            Trusted by <span style={{ color: '#00ff88' }}>serious traders</span>
                        </h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 20 }}>
                        {testimonials.map(t => (
                            <div key={t.name} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 20, padding: isMobile ? 24 : 36 }}>
                                <p style={{ color: '#777', fontSize: isMobile ? 14 : 17, lineHeight: 1.8, margin: '0 0 24px' }}>"{t.text}"</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#00ff8820', border: '1px solid #00ff8840', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00ff88', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>{t.name}</p>
                                        <p style={{ margin: 0, color: '#444', fontSize: 13 }}>{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ borderTop: '1px solid #111', padding: isMobile ? '72px 20px' : '120px 24px', textAlign: 'center' }}>
                <div style={{ maxWidth: 700, margin: '0 auto' }}>
                    <h2 style={{ fontSize: isMobile ? 36 : 60, fontWeight: 800, margin: '0 0 20px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                        Ready to trade <span style={{ color: '#00ff88' }}>smarter?</span>
                    </h2>
                    <p style={{ color: '#444', fontSize: isMobile ? 16 : 20, margin: '0 0 40px', lineHeight: 1.7 }}>
                        Join hundreds of traders already using TradeJotter to improve their performance.
                    </p>
                    <button onClick={() => navigate('/signup')} style={{ padding: isMobile ? '16px 36px' : '20px 56px', background: '#00ff88', color: '#000', border: 'none', borderRadius: 14, fontWeight: 800, fontSize: isMobile ? 16 : 20, cursor: 'pointer' }}>
                        Get started for free →
                    </button>
                    <p style={{ color: '#333', fontSize: 14, marginTop: 18 }}>Free forever plan · No credit card · Setup in 30 seconds</p>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid #111', padding: isMobile ? '28px 20px' : '40px 64px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', gap: isMobile ? 16 : 0 }}>
                <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>
                    <span style={{ color: '#00ff88' }}>Trade</span><span style={{ color: '#fff' }}>Jotter</span>
                </span>
                <p style={{ color: '#333', fontSize: 13, margin: 0 }}>© 2026 TradeJotter. Built for serious traders.</p>
                <div style={{ display: 'flex', gap: 24 }}>
                    {['Pricing', 'Login', 'Sign Up'].map(l => (
                        <span key={l} onClick={() => navigate('/' + l.toLowerCase().replace(' ', ''))} style={{ color: '#444', fontSize: 14, cursor: 'pointer' }}
                            onMouseEnter={e => e.target.style.color = '#00ff88'}
                            onMouseLeave={e => e.target.style.color = '#444'}
                        >{l}</span>
                    ))}
                </div>
            </footer>
        </div>
    )
}

export default Landing