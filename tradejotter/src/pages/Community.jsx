import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthProvider'
import { supabase } from '../lib/supabase'

const Community = () => {
    const { user } = useAuth()
    const [posts, setPosts] = useState([])
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(true)
    const [posting, setPosting] = useState(false)

    useEffect(() => { fetchPosts() }, [])

    const fetchPosts = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('community_posts')
            .select('*, profiles (username)')
            .order('created_at', { ascending: false })
            .limit(50)
        if (!error) setPosts(data || [])
        setLoading(false)
    }

    const handlePost = async () => {
        if (!content.trim()) return
        setPosting(true)
        const { error } = await supabase.from('community_posts').insert({ user_id: user.id, content: content.trim() })
        if (!error) { setContent(''); fetchPosts() }
        setPosting(false)
    }

    const handleLike = async (post) => {
        await supabase.from('community_posts').update({ likes: post.likes + 1 }).eq('id', post.id)
        fetchPosts()
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this post?')) return
        await supabase.from('community_posts').delete().eq('id', id)
        fetchPosts()
    }

    const timeAgo = (date) => {
        const s = Math.floor((new Date() - new Date(date)) / 1000)
        if (s < 60) return 'just now'
        if (s < 3600) return `${Math.floor(s / 60)}m ago`
        if (s < 86400) return `${Math.floor(s / 3600)}h ago`
        return `${Math.floor(s / 86400)}d ago`
    }

    return (
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px' }}>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>🌐 Community</h1>
                <p style={{ color: '#444', margin: '6px 0 0', fontSize: 13 }}>Share trade ideas and setups with other traders</p>
            </div>

            {/* Composer */}
            <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 20, marginBottom: 24 }}>
                <textarea
                    placeholder="Share a trade idea, setup or market observation..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    maxLength={500}
                    rows={3}
                    style={{ resize: 'vertical', fontSize: 14 }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                    <span style={{ color: '#333', fontSize: 12 }}>{content.length}/500</span>
                    <button
                        onClick={handlePost}
                        disabled={posting || !content.trim()}
                        style={{ padding: '8px 20px', background: posting || !content.trim() ? '#1a1a1a' : '#00ff88', color: posting || !content.trim() ? '#444' : '#000', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}
                    >
                        {posting ? 'Posting...' : 'Post →'}
                    </button>
                </div>
            </div>

            {/* Feed */}
            {loading ? (
                <p style={{ textAlign: 'center', color: '#333', padding: 40 }}>Loading feed...</p>
            ) : posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, background: '#111', border: '1px solid #1e1e1e', borderRadius: 12 }}>
                    <p style={{ color: '#333', fontSize: 32, margin: '0 0 12px' }}>💬</p>
                    <p style={{ color: '#444' }}>No posts yet. Be the first to share!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {posts.map(post => (
                        <div key={post.id} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 20, transition: 'border-color 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = '#2a2a2a'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e1e'}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#00ff8820', border: '1px solid #00ff8840', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00ff88', fontWeight: 700, fontSize: 13 }}>
                                        {post.profiles?.username?.[0]?.toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 600, fontSize: 13 }}>{post.profiles?.username || 'Anonymous'}</p>
                                        <p style={{ margin: 0, color: '#333', fontSize: 11 }}>{timeAgo(post.created_at)}</p>
                                    </div>
                                </div>
                                {post.user_id === user.id && (
                                    <button onClick={() => handleDelete(post.id)} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', fontSize: 14, padding: 4 }}
                                        onMouseEnter={e => e.target.style.color = '#ff4466'}
                                        onMouseLeave={e => e.target.style.color = '#333'}
                                    >🗑</button>
                                )}
                            </div>
                            <p style={{ margin: '0 0 14px', lineHeight: 1.6, fontSize: 14, color: '#ccc' }}>{post.content}</p>
                            <button onClick={() => handleLike(post)} style={{ background: 'none', border: 'none', color: '#444', cursor: 'pointer', fontSize: 13, padding: 0 }}
                                onMouseEnter={e => e.target.style.color = '#ff4466'}
                                onMouseLeave={e => e.target.style.color = '#444'}
                            >
                                ❤️ {post.likes}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Community