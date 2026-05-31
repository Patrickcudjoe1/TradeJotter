import { useState } from 'react'
import { useAuth } from '../context/AuthProvider'
import { useNavigate } from 'react-router-dom'

const Community = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [threads, setThreads] = useState([
        {
            id: 1,
            title: "📈 EURUSD Analysis - Next Major Resistance Level?",
            author: "FXLegend",
            replies: 12,
            category: "Technical Analysis",
            time: "2h ago",
            likes: 18,
            hasLiked: false
        },
        {
            id: 2,
            title: "⚖️ Risk Management rules for scaling accounts",
            author: "RiskFirst",
            replies: 8,
            category: "Education",
            time: "5h ago",
            likes: 24,
            hasLiked: false
        },
        {
            id: 3,
            title: "🤖 Backtesting AI models for gold (XAUUSD)",
            author: "QuantDev",
            replies: 15,
            category: "AI Trading",
            time: "1d ago",
            likes: 31,
            hasLiked: false
        }
    ])
    
    const [activeTab, setActiveTab] = useState('All')
    const [newPostTitle, setNewPostTitle] = useState('')
    const [newPostCategory, setNewPostCategory] = useState('General')

    const handleLike = (id) => {
        setThreads(threads.map(t => {
            if (t.id === id) {
                return {
                    ...t,
                    likes: t.hasLiked ? t.likes - 1 : t.likes + 1,
                    hasLiked: !t.hasLiked
                }
            }
            return t
        }))
    }

    const handleCreatePost = (e) => {
        e.preventDefault()
        if (!newPostTitle.trim()) return

        const newThread = {
            id: Date.now(),
            title: newPostTitle,
            author: user?.email ? user.email.split('@')[0] : 'Trader',
            replies: 0,
            category: newPostCategory,
            time: "Just now",
            likes: 0,
            hasLiked: false
        }

        setThreads([newThread, ...threads])
        setNewPostTitle('')
    }

    return (
        <div style={{ maxWidth: 900, margin: '40px auto', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '2rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                        💬 Trading Community
                    </h1>
                    <p style={{ color: 'gray', margin: '4px 0 0 0' }}>
                        Share ideas, ask questions, and collaborate with other traders.
                    </p>
                </div>
                <button 
                    onClick={() => navigate('/dashboard')} 
                    style={{ 
                        padding: '10px 18px', 
                        background: 'transparent', 
                        border: '1px solid #ccc', 
                        borderRadius: 8, 
                        cursor: 'pointer',
                        fontWeight: '500',
                        transition: 'all 0.2s'
                    }}
                >
                    ← Back to Dashboard
                </button>
            </div>

            <hr style={{ margin: '24px 0', border: 'none', borderBottom: '1px solid #eee' }} />

            {/* Main Content Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24 }}>
                
                {/* Discussion Feed */}
                <div>
                    {/* Navigation/Filters */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                        {['All', 'Technical Analysis', 'Education', 'AI Trading', 'General'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: '8px 14px',
                                    border: 'none',
                                    borderRadius: 6,
                                    fontSize: 14,
                                    cursor: 'pointer',
                                    background: activeTab === tab ? '#22c55e' : '#f4f4f5',
                                    color: activeTab === tab ? 'white' : '#71717a',
                                    fontWeight: '500',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Create New Post Form */}
                    <form onSubmit={handleCreatePost} style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 20 }}>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: 15 }}>Create a New Discussion</h4>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <input 
                                type="text" 
                                placeholder="What trading topic do you want to discuss?" 
                                value={newPostTitle}
                                onChange={(e) => setNewPostTitle(e.target.value)}
                                style={{ 
                                    flex: 1, 
                                    padding: '10px 14px', 
                                    borderRadius: 8, 
                                    border: '1px solid #cbd5e1',
                                    fontSize: 14
                                }}
                            />
                            <select
                                value={newPostCategory}
                                onChange={(e) => setNewPostCategory(e.target.value)}
                                style={{
                                    padding: '10px',
                                    borderRadius: 8,
                                    border: '1px solid #cbd5e1',
                                    background: 'white',
                                    fontSize: 14
                                }}
                            >
                                <option value="General">General</option>
                                <option value="Technical Analysis">Technical Analysis</option>
                                <option value="Education">Education</option>
                                <option value="AI Trading">AI Trading</option>
                            </select>
                            <button 
                                type="submit"
                                style={{ 
                                    padding: '10px 20px', 
                                    background: '#22c55e', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: 8, 
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                Post
                            </button>
                        </div>
                    </form>

                    {/* Discussion List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {threads
                            .filter(t => activeTab === 'All' || t.category === activeTab)
                            .map(thread => (
                                <div 
                                    key={thread.id} 
                                    style={{ 
                                        padding: 16, 
                                        border: '1px solid #e2e8f0', 
                                        borderRadius: 12, 
                                        background: 'white',
                                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div>
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                                            <span style={{ fontSize: 11, background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: 12, fontWeight: 'bold' }}>
                                                {thread.category}
                                            </span>
                                            <span style={{ color: '#94a3b8', fontSize: 12 }}>• posted by {thread.author} • {thread.time}</span>
                                        </div>
                                        <h3 style={{ margin: '0 0 8px 0', fontSize: 16, color: '#0f172a', fontWeight: '600' }}>
                                            {thread.title}
                                        </h3>
                                        <div style={{ display: 'flex', gap: 16, color: '#64748b', fontSize: 13 }}>
                                            <span>💬 {thread.replies} replies</span>
                                            <span 
                                                onClick={() => handleLike(thread.id)} 
                                                style={{ cursor: 'pointer', color: thread.hasLiked ? '#22c55e' : '#64748b', fontWeight: thread.hasLiked ? 'bold' : 'normal' }}
                                            >
                                                👍 {thread.likes} likes
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>

                {/* Sidebar Info */}
                <div>
                    <div style={{ background: '#f8fafc', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 16 }}>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: 15 }}>🟢 Active Traders</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {['FXLegend', 'RiskFirst', 'QuantDev', 'PipsMaster'].map((trader, i) => (
                                <div key={trader} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                                    <div style={{ width: 8, height: 8, background: '#22c55e', borderRadius: '50%' }}></div>
                                    <span>{trader}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ background: '#f0fdf4', padding: 20, borderRadius: 12, border: '1px solid #bbf7d0', color: '#166534' }}>
                        <h4 style={{ margin: '0 0 6px 0', fontSize: 15 }}>🎯 Weekly Challenge</h4>
                        <p style={{ fontSize: 13, margin: 0, lineHeight: '1.4' }}>
                            Achieve a 60%+ win rate with a minimum of 5 trades this week to earn the <strong>Risk Master</strong> profile badge!
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Community
