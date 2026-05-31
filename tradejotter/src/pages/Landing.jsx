import { useNavigate } from 'react-router-dom'

const Landing = () => {
    const navigate = useNavigate()

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

    return (
        <div style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

            {/* Navbar */}
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 48px', borderBottom: '1px solid #111', position: 'sticky', top: 0, background: '#0a0a0aee', backdropFilter: 'blur(12px)', zIndex: 100 }}>
                <span style={{ fontSize: 20, fontWeight: 800 }}>
                    <span style={{ color: '#00ff88' }}>Trade</span><span style={{ color: '#fff' }}>Jotter</span>
                </span>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={() => navigate('/login')} style={{ padding: '9px 20px', background: 'transparent', border: '1px solid #222', color: '#888', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}
                        onMouseEnter={e => { e.target.style.borderColor = '#00ff88'; e.target.style.color = '#00ff88' }}
                        onMouseLeave={e => { e.target.style.borderColor = '#222'; e.target.style.color = '#888' }}
                    >
                        Sign In
                    </button>
                    <button onClick={() => navigate('/signup')} style={{ padding: '9px 20px', background: '#00ff88', border: 'none', color: '#000', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>
                        Get Started Free
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <section style={{ textAlign: 'center', padding: '100px 24px 80px', maxWidth: 800, margin: '0 auto' }}>
                {/* Badge */}
                <div style={{ display: 'inline-block', padding: '6px 16px', background: '#00ff8815', border: '1px solid #00ff8830', borderRadius: 20, color: '#00ff88', fontSize: 12, fontWeight: 600, marginBottom: 28, letterSpacing: '0.05em' }}>
                    ⚡ AI-POWERED TRADING JOURNAL
                </div>

                <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, lineHeight: 1.1, margin: '0 0 24px', letterSpacing: '-0.03em' }}>
                    Trade smarter.<br />
                    <span style={{ color: '#00ff88' }}>Journal better.</span><br />
                    Win more.
                </h1>

                <p style={{ fontSize: 18, color: '#555', margin: '0 0 40px', lineHeight: 1.7, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
                    TradeJotter is the all-in-one platform for serious traders. Journal your trades, analyze charts with AI, and track your performance — all in one place.
                </p>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => navigate('/signup')}
                        style={{ padding: '14px 32px', background: '#00ff88', color: '#000', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: 16, cursor: 'pointer', letterSpacing: '-0.01em' }}
                    >
                        Start for free →
                    </button>
                    <button
                        onClick={() => navigate('/pricing')}
                        style={{ padding: '14px 32px', background: 'transparent', color: '#888', border: '1px solid #222', borderRadius: 10, fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#fff' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = '#888' }}
                    >
                        View pricing
                    </button>
                </div>

                <p style={{ color: '#333', fontSize: 13, marginTop: 20 }}>No credit card required · Free forever plan available</p>
            </section>

            {/* Stats bar */}
            <section style={{ borderTop: '1px solid #111', borderBottom: '1px solid #111', padding: '40px 48px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', maxWidth: 800, margin: '0 auto', gap: 24 }}>
                    {stats.map(s => (
                        <div key={s.label} style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: 32, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace', color: '#00ff88', margin: '0 0 6px' }}>{s.value}</p>
                            <p style={{ color: '#444', fontSize: 13, margin: 0 }}>{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section style={{ maxWidth: 1000, margin: '0 auto', padding: '100px 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: 60 }}>
                    <h2 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
                        Everything you need to <span style={{ color: '#00ff88' }}>trade better</span>
                    </h2>
                    <p style={{ color: '#444', fontSize: 16, margin: 0 }}>Built by traders, for traders.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                    {features.map(f => (
                        <div key={f.title}
                            style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 16, padding: 28, transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#00ff8830'; e.currentTarget.style.background = '#00ff8806' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.background = '#111' }}
                        >
                            <p style={{ fontSize: 32, margin: '0 0 16px' }}>{f.icon}</p>
                            <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 10px' }}>{f.title}</h3>
                            <p style={{ color: '#555', fontSize: 14, margin: 0, lineHeight: 1.7 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section style={{ borderTop: '1px solid #111', padding: '100px 24px' }}>
                <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
                        Get started in <span style={{ color: '#00ff88' }}>3 steps</span>
                    </h2>
                    <p style={{ color: '#444', fontSize: 16, margin: '0 0 60px' }}>No complicated setup. Just sign up and start trading smarter.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {[
                            { step: '01', title: 'Create your free account', desc: 'Sign up in 30 seconds. No credit card required.' },
                            { step: '02', title: 'Log your first trade', desc: 'Add pair, direction, result, R:R and your lesson learned.' },
                            { step: '03', title: 'Analyze and improve', desc: 'See your win rate, equity curve and AI-powered insights.' },
                        ].map(s => (
                            <div key={s.step} style={{ display: 'flex', gap: 24, alignItems: 'flex-start', textAlign: 'left', background: '#111', border: '1px solid #1a1a1a', borderRadius: 16, padding: 28 }}>
                                <span style={{ fontSize: 32, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace', color: '#00ff8840', flexShrink: 0 }}>{s.step}</span>
                                <div>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>{s.title}</h3>
                                    <p style={{ color: '#555', fontSize: 14, margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section style={{ borderTop: '1px solid #111', padding: '100px 24px' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 60 }}>
                        <h2 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
                            Trusted by <span style={{ color: '#00ff88' }}>serious traders</span>
                        </h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                        {testimonials.map(t => (
                            <div key={t.name} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 16, padding: 28 }}>
                                <p style={{ color: '#888', fontSize: 14, lineHeight: 1.7, margin: '0 0 20px' }}>"{t.text}"</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#00ff8820', border: '1px solid #00ff8840', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00ff88', fontWeight: 700, fontSize: 14 }}>
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 600, fontSize: 13 }}>{t.name}</p>
                                        <p style={{ margin: 0, color: '#444', fontSize: 12 }}>{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ borderTop: '1px solid #111', padding: '100px 24px', textAlign: 'center' }}>
                <div style={{ maxWidth: 600, margin: '0 auto' }}>
                    <h2 style={{ fontSize: 40, fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
                        Ready to trade <span style={{ color: '#00ff88' }}>smarter?</span>
                    </h2>
                    <p style={{ color: '#444', fontSize: 16, margin: '0 0 40px', lineHeight: 1.7 }}>
                        Join hundreds of traders already using TradeJotter to improve their performance and hit their trading goals.
                    </p>
                    <button
                        onClick={() => navigate('/signup')}
                        style={{ padding: '16px 40px', background: '#00ff88', color: '#000', border: 'none', borderRadius: 12, fontWeight: 800, fontSize: 18, cursor: 'pointer', letterSpacing: '-0.01em' }}
                    >
                        Get started for free →
                    </button>
                    <p style={{ color: '#333', fontSize: 13, marginTop: 16 }}>Free forever plan · No credit card · Setup in 30 seconds</p>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid #111', padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 16, fontWeight: 800 }}>
                    <span style={{ color: '#00ff88' }}>Trade</span><span style={{ color: '#fff' }}>Jotter</span>
                </span>
                <p style={{ color: '#333', fontSize: 13, margin: 0 }}>© 2026 TradeJotter. Built for serious traders.</p>
                <div style={{ display: 'flex', gap: 20 }}>
                    {['Pricing', 'Login', 'Sign Up'].map(l => (
                        <span key={l} onClick={() => navigate('/' + l.toLowerCase().replace(' ', ''))} style={{ color: '#444', fontSize: 13, cursor: 'pointer' }}
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