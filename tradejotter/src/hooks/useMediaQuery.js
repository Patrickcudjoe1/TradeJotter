import { useState, useEffect } from 'react'

const useMediaQuery = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
    const [isTablet, setIsTablet] = useState(window.innerWidth < 1024)

    useEffect(() => {
        const handle = () => {
            setIsMobile(window.innerWidth < 768)
            setIsTablet(window.innerWidth < 1024)
        }
        window.addEventListener('resize', handle)
        return () => window.removeEventListener('resize', handle)
    }, [])

    return { isMobile, isTablet }
}

export default useMediaQuery