import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

const plans = [
    {
        name: 'Free', price: 0, color: '#555', plan: 'free',
        features: ['20 journal trades', '3 AI analyses/day', '3 currency pairs', 'Risk calculator', 'Backtest access'],
        locked: ['Community posting', 'Strategy builder', 'Price alerts', 'Mentor access'],
        cta: 'Current Plan'
    },
    {
        name: 'Pro', price: 9.99, color: '#3b82f6', plan: 'pro', popular: true,
        features: ['Unlimited journal trades', '20 AI analyses/day', 'Unlimited pairs', 'Community posting', 'Strategy builder', 'Price alerts', 'Risk calculator'],
        locked: ['Mentor access'],
        cta: 'Upgrade to Pro'
    },
    {
        name: 'Premium', price: 19.99, color: '#ffbb00', plan: 'premium',
        features: ['Everything in Pro', 'Unlimited AI analyses', 'Mentor access', 'Priority support', 'Early feature access'],
        locked: [],
        cta: 'Upgrade to Premium'
    }
]

const Pricing = () => {
    const navigate = useNavigate()
    const { user } = useAuth()

    return (
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '60px 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
                <h1 style={{ fontSize: 40, fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
                    Simple, <span style={{ color: '#00ff88' }}>transparent</span> pricing
                </h1>
                <p style={{ color: '#444', fontSize: 16, margin: 0 }}>Start free. Upgrade when you're ready to level up.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                {plans.map(plan => (
                    <div key={plan.name} style={{ background: '#111', border: `1px solid ${plan.popular ? plan.color + '50' : '#1e1e1e'}`, borderRadius: 16, padding: 28, position: 'relative', boxShadow: plan.popular ? `0 0 40px ${plan.color}15` : 'none' }}>
                        {plan.popular && (
                            <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: plan.color, color: '#fff', padding: '4px 16px', borderRadius: 20, fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                                MOST POPULAR
                            </div>
                        )}

                        <div style={{ marginBottom: 24 }}>
                            <p style={{ color: plan.color, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>{plan.name}</p>
                            {plan.price === 0 ? (
                                <p style={{ fontSize: 36, fontWeight: 800, margin: 0, fontFamily: 'JetBrains Mono, monospace' }}>Free</p>
                            ) : (
                                <p style={{ fontSize: 36, fontWeight: 800, margin: 0, fontFamily: 'JetBrains Mono, monospace' }}>
                                    ${plan.price}<span style={{ fontSize: 14, color: '#444', fontWeight: 400 }}>/mo</span>
                                </p>
                            )}
                        </div>

                        <div style={{ marginBottom: 28 }}>
                            {plan.features.map(f => (
                                <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                                    <span style={{ color: '#00ff88', fontSize: 14, flexShrink: 0 }}>✓</span>
                                    <span style={{ fontSize: 13, color: '#ccc' }}>{f}</span>
                                </div>
                            ))}
                            {plan.locked.map(f => (
                                <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10, opacity: 0.3 }}>
                                    <span style={{ fontSize: 14, flexShrink: 0 }}>✗</span>
                                    <span style={{ fontSize: 13 }}>{f}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            disabled={plan.plan === 'free'}
                            style={{
                                width: '100%', padding: '13px 0',
                                background: plan.plan === 'free' ? 'transparent' : plan.color,
                                color: plan.plan === 'free' ? '#333' : plan.plan === 'pro' ? '#fff' : '#000',
                                border: plan.plan === 'free' ? '1px solid #1e1e1e' : 'none',
                                borderRadius: 10, fontWeight: 700, fontSize: 14,
                                cursor: plan.plan === 'free' ? 'default' : 'pointer',
                                letterSpacing: '0.02em'
                            }}
                        >
                            {plan.cta}
                        </button>
                    </div>
                ))}
            </div>

            <p style={{ textAlign: 'center', color: '#333', marginTop: 40, fontSize: 13 }}>
                All plans include a 7-day free trial · Cancel anytime · Secure payments via Paystack
            </p>

            {user && (
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: 13 }}>
                        ← Back to Dashboard
                    </button>
                </div>
            )}
        </div>
    )
}

export default Pricing