import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

const plans = [
    {
        name: 'Free',
        price: 0,
        color: '#6b7280',
        features: [
            '20 journal trades',
            '3 AI chart analyses/day',
            '3 currency pairs',
            'Risk calculator',
            'Backtest access',
        ],
        notIncluded: [
            'Community posting',
            'Strategy builder',
            'Price alerts',
            'Mentor access',
        ],
        cta: 'Current Plan',
        plan: 'free'
    },
    {
        name: 'Pro',
        price: 9.99,
        color: '#3b82f6',
        popular: true,
        features: [
            'Unlimited journal trades',
            '20 AI chart analyses/day',
            'Unlimited currency pairs',
            'Community posting',
            'Strategy builder',
            'Price alerts',
            'Risk calculator',
            'Backtest access',
        ],
        notIncluded: [
            'Mentor access',
        ],
        cta: 'Upgrade to Pro',
        plan: 'pro'
    },
    {
        name: 'Premium',
        price: 19.99,
        color: '#f59e0b',
        features: [
            'Everything in Pro',
            'Unlimited AI analyses',
            'Mentor access',
            'Priority support',
            'Early access to features',
        ],
        notIncluded: [],
        cta: 'Upgrade to Premium',
        plan: 'premium'
    }
]

const Pricing = () => {
    const navigate = useNavigate()
    const { user } = useAuth()

    const handleUpgrade = (plan) => {
        if (plan === 'free') return
        // We'll wire Paystack here next
        alert(`Paystack checkout for ${plan} coming next!`)
    }

    return (
        <div style={{ maxWidth: 900, margin: '40px auto', padding: 24 }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                <h1 style={{ fontSize: 36, marginBottom: 8 }}>Simple Pricing</h1>
                <p style={{ color: 'gray', fontSize: 16 }}>Start free. Upgrade when you're ready.</p>
            </div>

            {/* Plans */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                {plans.map(plan => (
                    <div
                        key={plan.name}
                        style={{
                            border: plan.popular ? `2px solid ${plan.color}` : '1px solid #ccc',
                            borderRadius: 12,
                            padding: 28,
                            position: 'relative',
                            background: plan.popular ? plan.color + '08' : 'transparent'
                        }}
                    >
                        {/* Popular badge */}
                        {plan.popular && (
                            <div style={{
                                position: 'absolute', top: -12, left: '50%',
                                transform: 'translateX(-50%)',
                                background: plan.color, color: 'white',
                                padding: '2px 16px', borderRadius: 20,
                                fontSize: 12, fontWeight: 'bold'
                            }}>
                                MOST POPULAR
                            </div>
                        )}

                        {/* Plan name */}
                        <h2 style={{ margin: '0 0 4px', color: plan.color }}>{plan.name}</h2>

                        {/* Price */}
                        <div style={{ marginBottom: 24 }}>
                            {plan.price === 0 ? (
                                <p style={{ fontSize: 32, fontWeight: 'bold', margin: 0 }}>Free</p>
                            ) : (
                                <p style={{ fontSize: 32, fontWeight: 'bold', margin: 0 }}>
                                    ${plan.price}
                                    <span style={{ fontSize: 14, color: 'gray', fontWeight: 'normal' }}>/mo</span>
                                </p>
                            )}
                        </div>

                        {/* Features */}
                        <div style={{ marginBottom: 24 }}>
                            {plan.features.map(f => (
                                <div key={f} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                                    <span style={{ color: '#22c55e', fontSize: 16 }}>✓</span>
                                    <span style={{ fontSize: 14 }}>{f}</span>
                                </div>
                            ))}
                            {plan.notIncluded.map(f => (
                                <div key={f} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center', opacity: 0.4 }}>
                                    <span style={{ fontSize: 16 }}>✗</span>
                                    <span style={{ fontSize: 14 }}>{f}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={() => handleUpgrade(plan.plan)}
                            disabled={plan.plan === 'free'}
                            style={{
                                width: '100%',
                                padding: '12px 0',
                                background: plan.plan === 'free' ? 'transparent' : plan.color,
                                color: plan.plan === 'free' ? 'gray' : 'white',
                                border: plan.plan === 'free' ? '1px solid #ccc' : 'none',
                                borderRadius: 8,
                                cursor: plan.plan === 'free' ? 'default' : 'pointer',
                                fontWeight: 'bold',
                                fontSize: 15
                            }}
                        >
                            {plan.cta}
                        </button>
                    </div>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 32 }}>
                <button
                    onClick={() => navigate('/dashboard')}
                    style={{ background: 'none', border: 'none', color: 'gray', cursor: 'pointer' }}
                >
                    ← Back to Dashboard
                </button>
            </div>
        </div>
    )
}

export default Pricing