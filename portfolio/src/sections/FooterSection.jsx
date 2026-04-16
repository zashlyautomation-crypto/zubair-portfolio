import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '@/styles/footer.css';

const FooterSection = () => {
    const [isAtBottom, setIsAtBottom] = useState(false);
    const navigate = useNavigate();
    
    // Spring for the bounce effect
    const bounceY = useSpring(0, {
        stiffness: 300,
        damping: 15,
        mass: 1
    });

    useEffect(() => {
        const lenis = window.__lenis;
        if (!lenis) return;

        const handleScroll = () => {
            const scrollLimit = lenis.limit;
            const scrollProgress = lenis.scroll;
            
            // Check if we hit the bottom boundary
            if (scrollProgress >= scrollLimit - 5) {
                if (!isAtBottom) {
                    setIsAtBottom(true);
                    // Trigger a sudden 'impact' bounce
                    bounceY.set(-30);
                    setTimeout(() => bounceY.set(0), 100);
                }
            } else {
                setIsAtBottom(false);
            }
        };

        lenis.on('scroll', handleScroll);
        return () => lenis.off('scroll', handleScroll);
    }, [isAtBottom, bounceY]);

    const navigateLinks = [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: 'Projects', href: '#projects' },
        { name: 'Contact', href: '/contact', isRoute: true }
    ];

    const handleNavClick = (e, link) => {
        if (link.isRoute) {
            e.preventDefault();
            navigate(link.href);
            window.scrollTo(0, 0);
        }
        // Anchor links are handled by browser/lenis (Navbar has separate logic but footer seems simple)
    };

    const connectLinks = [
        { name: 'GitHub', href: 'https://github.com' },
        { name: 'LinkedIn', href: 'https://linkedin.com' },
        { name: 'Instagram', href: 'https://instagram.com' },
        { name: 'yt', href: 'https://youtube.com' }
    ];

    return (
        <footer className="footer-section">
            <motion.div 
                style={{ y: bounceY, width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
                className="footer-inner-wrapper"
            >
                {/* Background Large Text */}
                <div className="footer-bg-text">
                    ZUBAIR
                </div>

                <div className="footer-top">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            zashly
                        </div>
                        <p className="footer-description">
                            Designed visuals, branding, and systems built with clarity and intent.
                        </p>
                    </div>

                    <div className="footer-links-container">
                        <div className="footer-links-group">
                            <span className="footer-links-title">NAVIGATE</span>
                            <div className="footer-links-list">
                                {navigateLinks.map((link) => (
                                    <a 
                                        key={link.name} 
                                        href={link.href} 
                                        className="footer-link"
                                        onClick={(e) => handleNavClick(e, link)}
                                    >
                                        {link.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="footer-links-group">
                            <span className="footer-links-title">CONNECT</span>
                            <div className="footer-links-list">
                                {connectLinks.map((link) => (
                                    <a key={link.name} href={link.href} className="footer-link" target="_blank" rel="noopener noreferrer">
                                        {link.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="copyright-text">
                        © 2026 Zubair • Built with code, not templates
                    </p>
                </div>
            </motion.div>
        </footer>
    );
};

export default FooterSection;

