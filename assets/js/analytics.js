// Advanced Analytics for Portfolio
class PortfolioAnalytics {
    constructor() {
        this.apiKey = 'your-api-key'; // Replace with actual API key
        this.baseUrl = 'https://api.ipgeolocation.io/ipgeo';
        this.init();
    }

    async init() {
        await this.trackVisit();
    }

    async getVisitorInfo() {
        try {
            // Get IP address
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipResponse.json();
            
            // Get detailed location info using multiple free services for reliability
            let locationData = {};
            
            try {
                // Try ipapi.co first (most reliable)
                const locationResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
                locationData = await locationResponse.json();
            } catch (error) {
                try {
                    // Fallback to ip-api.com
                    const fallbackResponse = await fetch(`http://ip-api.com/json/${ipData.ip}`);
                    const fallbackData = await fallbackResponse.json();
                    locationData = {
                        country_name: fallbackData.country,
                        city: fallbackData.city,
                        region: fallbackData.regionName,
                        timezone: fallbackData.timezone,
                        org: fallbackData.isp
                    };
                } catch (fallbackError) {
                    // Final fallback - basic info
                    locationData = {
                        country_name: 'Unknown',
                        city: 'Unknown',
                        region: 'Unknown',
                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        org: 'Unknown'
                    };
                }
            }
            
            return {
                ip: ipData.ip,
                country: locationData.country_name || 'Unknown',
                city: locationData.city || 'Unknown',
                region: locationData.region || 'Unknown',
                timezone: locationData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
                isp: locationData.org || 'Unknown',
                latitude: locationData.latitude || null,
                longitude: locationData.longitude || null
            };
        } catch (error) {
            console.log('Using fallback visitor info');
            return {
                ip: 'Unknown',
                country: 'Unknown',
                city: 'Unknown',
                region: 'Unknown',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                isp: 'Unknown',
                latitude: null,
                longitude: null
            };
        }
    }

    getDeviceInfo() {
        const userAgent = navigator.userAgent;
        let device = 'Desktop';
        let browser = 'Unknown';
        let os = 'Unknown';

        // Detect device
        if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
            device = /iPad/.test(userAgent) ? 'Tablet' : 'Mobile';
        }

        // Detect browser
        if (userAgent.includes('Chrome')) browser = 'Chrome';
        else if (userAgent.includes('Firefox')) browser = 'Firefox';
        else if (userAgent.includes('Safari')) browser = 'Safari';
        else if (userAgent.includes('Edge')) browser = 'Edge';

        // Detect OS
        if (userAgent.includes('Windows')) os = 'Windows';
        else if (userAgent.includes('Mac')) os = 'macOS';
        else if (userAgent.includes('Linux')) os = 'Linux';
        else if (userAgent.includes('Android')) os = 'Android';
        else if (userAgent.includes('iOS')) os = 'iOS';

        return { device, browser, os };
    }

    getPageInfo() {
        return {
            url: window.location.href,
            title: document.title,
            referrer: document.referrer || 'Direct',
            timestamp: new Date().toISOString(),
            screen: `${screen.width}x${screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }

    async trackVisit() {
        try {
            const visitorInfo = await this.getVisitorInfo();
            const deviceInfo = this.getDeviceInfo();
            const pageInfo = this.getPageInfo();

            const visitData = {
                ...visitorInfo,
                ...deviceInfo,
                ...pageInfo,
                sessionId: this.generateSessionId(),
                visitId: this.generateVisitId()
            };

            // Store in localStorage
            this.storeVisit(visitData);

            // Send to analytics service (optional)
            // this.sendToAnalytics(visitData);

        } catch (error) {
            console.error('Analytics tracking error:', error);
        }
    }

    generateSessionId() {
        let sessionId = sessionStorage.getItem('portfolioSessionId');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('portfolioSessionId', sessionId);
        }
        return sessionId;
    }

    generateVisitId() {
        return 'visit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    storeVisit(visitData) {
        let analyticsData = JSON.parse(localStorage.getItem('portfolioAnalytics')) || {
            visitors: [],
            pageViews: 0,
            uniqueIPs: new Set(),
            sessions: new Set(),
            lastUpdated: new Date().toISOString()
        };

        // Convert Set to Array for storage
        if (analyticsData.uniqueIPs instanceof Set) {
            analyticsData.uniqueIPs = Array.from(analyticsData.uniqueIPs);
        }
        if (analyticsData.sessions instanceof Set) {
            analyticsData.sessions = Array.from(analyticsData.sessions);
        }

        analyticsData.visitors.push(visitData);
        analyticsData.pageViews++;
        
        if (!analyticsData.uniqueIPs.includes(visitData.ip)) {
            analyticsData.uniqueIPs.push(visitData.ip);
        }
        
        if (!analyticsData.sessions.includes(visitData.sessionId)) {
            analyticsData.sessions.push(visitData.sessionId);
        }

        analyticsData.lastUpdated = new Date().toISOString();

        // Keep only last 1000 visitors to prevent storage bloat
        if (analyticsData.visitors.length > 1000) {
            analyticsData.visitors = analyticsData.visitors.slice(-1000);
        }

        localStorage.setItem('portfolioAnalytics', JSON.stringify(analyticsData));
    }

    // Optional: Send data to external analytics service
    async sendToAnalytics(data) {
        try {
            await fetch('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.log('Analytics service unavailable');
        }
    }

    // Track page interactions
    trackInteraction(type, element, value = null) {
        const interaction = {
            type,
            element,
            value,
            timestamp: new Date().toISOString(),
            sessionId: this.generateSessionId()
        };

        let interactions = JSON.parse(localStorage.getItem('portfolioInteractions')) || [];
        interactions.push(interaction);
        
        // Keep only last 500 interactions
        if (interactions.length > 500) {
            interactions = interactions.slice(-500);
        }
        
        localStorage.setItem('portfolioInteractions', JSON.stringify(interactions));
    }
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const analytics = new PortfolioAnalytics();
    
    // Track button clicks
    document.addEventListener('click', (e) => {
        if (e.target.matches('a, button')) {
            analytics.trackInteraction('click', e.target.tagName, e.target.textContent.trim());
        }
    });
    
    // Track form submissions
    document.addEventListener('submit', (e) => {
        analytics.trackInteraction('form_submit', e.target.tagName, e.target.action);
    });
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            analytics.trackInteraction('scroll', 'page', maxScroll);
        }
    });
    
    // Track time on page
    let startTime = Date.now();
    window.addEventListener('beforeunload', () => {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        analytics.trackInteraction('time_on_page', 'page', timeOnPage);
    });
});

// Export for use in analytics dashboard
window.PortfolioAnalytics = PortfolioAnalytics;
