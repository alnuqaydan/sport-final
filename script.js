// Sports Dashboard JavaScript
class SportsApp {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.initTheme();
        this.initNavigation();
        this.initCounters();
        this.loadMockData();
        this.initFilters();
        this.initScrollAnimations();
    }

    // Theme Management
    initTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        const themeToggle = document.getElementById('themeToggle');
        const icon = themeToggle.querySelector('i');
        
        icon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        
        themeToggle.addEventListener('click', () => {
            this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', this.currentTheme);
            localStorage.setItem('theme', this.currentTheme);
            icon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        });
    }

    // Navigation
    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                link.classList.add('active');
                
                // Smooth scroll to section
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // Animated Counters
    initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        };

        // Intersection Observer for counter animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
    }

    // Mock Data Generation
    generateMockData() {
        const teams = [
            { name: 'Lakers', logo: 'LAL', city: 'Los Angeles' },
            { name: 'Warriors', logo: 'GSW', city: 'Golden State' },
            { name: 'Celtics', logo: 'BOS', city: 'Boston' },
            { name: 'Heat', logo: 'MIA', city: 'Miami' },
            { name: 'Nuggets', logo: 'DEN', city: 'Denver' },
            { name: 'Suns', logo: 'PHX', city: 'Phoenix' },
            { name: 'Bucks', logo: 'MIL', city: 'Milwaukee' },
            { name: 'Nets', logo: 'BKN', city: 'Brooklyn' }
        ];

        const players = [
            { name: 'LeBron James', position: 'Forward', team: 'Lakers', points: 28.5, assists: 7.2, rebounds: 8.1 },
            { name: 'Stephen Curry', position: 'Guard', team: 'Warriors', points: 31.2, assists: 6.8, rebounds: 4.9 },
            { name: 'Jayson Tatum', position: 'Forward', team: 'Celtics', points: 26.8, assists: 4.1, rebounds: 7.8 },
            { name: 'Jimmy Butler', position: 'Forward', team: 'Heat', points: 22.1, assists: 5.3, rebounds: 6.5 },
            { name: 'Nikola Jokic', position: 'Center', team: 'Nuggets', points: 24.8, assists: 9.2, rebounds: 11.1 },
            { name: 'Devin Booker', position: 'Guard', team: 'Suns', points: 29.3, assists: 5.8, rebounds: 4.2 }
        ];

        const sports = ['basketball', 'football', 'soccer'];

        return { teams, players, sports };
    }

    // Load Mock Data
    loadMockData() {
        this.loadLiveScores();
        this.loadStandings();
        this.loadPlayers();
        this.loadSchedule();
    }

    loadLiveScores() {
        const scoresGrid = document.getElementById('scoresGrid');
        const { teams } = this.generateMockData();
        
        const scores = [];
        for (let i = 0; i < 6; i++) {
            const team1 = teams[Math.floor(Math.random() * teams.length)];
            let team2 = teams[Math.floor(Math.random() * teams.length)];
            while (team2 === team1) {
                team2 = teams[Math.floor(Math.random() * teams.length)];
            }
            
            scores.push({
                team1,
                team2,
                score1: Math.floor(Math.random() * 120) + 80,
                score2: Math.floor(Math.random() * 120) + 80,
                status: i < 3 ? 'live' : 'final',
                time: i < 3 ? `Q${Math.floor(Math.random() * 4) + 1} ${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : 'Final',
                sport: 'basketball'
            });
        }

        scoresGrid.innerHTML = scores.map(match => `
            <div class="score-card fade-in" data-sport="${match.sport}">
                <div class="match-status">
                    ${match.status === 'live' ? '<span class="live-indicator">LIVE</span>' : ''}
                    <span class="match-time">${match.time}</span>
                </div>
                <div class="teams">
                    <div class="team">
                        <div class="team-logo">${match.team1.logo}</div>
                        <div class="team-info">
                            <div class="team-name">${match.team1.name}</div>
                            <div class="team-city">${match.team1.city}</div>
                        </div>
                    </div>
                    <div class="score">${match.score1} - ${match.score2}</div>
                    <div class="team">
                        <div class="team-info" style="text-align: right;">
                            <div class="team-name">${match.team2.name}</div>
                            <div class="team-city">${match.team2.city}</div>
                        </div>
                        <div class="team-logo">${match.team2.logo}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadStandings() {
        const standingsBody = document.getElementById('standingsBody');
        const { teams } = this.generateMockData();
        
        const standings = teams.map((team, index) => ({
            ...team,
            rank: index + 1,
            played: Math.floor(Math.random() * 20) + 40,
            won: Math.floor(Math.random() * 30) + 20,
            lost: Math.floor(Math.random() * 20) + 10,
            points: Math.floor(Math.random() * 50) + 60
        })).sort((a, b) => b.points - a.points);

        standingsBody.innerHTML = standings.map(team => `
            <tr class="fade-in">
                <td><span class="rank-badge">${team.rank}</span></td>
                <td>
                    <div class="team">
                        <div class="team-logo" style="width: 30px; height: 30px; font-size: 0.8rem;">${team.logo}</div>
                        <span>${team.name}</span>
                    </div>
                </td>
                <td>${team.played}</td>
                <td>${team.won}</td>
                <td>${team.lost}</td>
                <td><strong>${team.points}</strong></td>
            </tr>
        `).join('');
    }

    loadPlayers() {
        const playersGrid = document.getElementById('playersGrid');
        const { players } = this.generateMockData();
        
        playersGrid.innerHTML = players.map(player => `
            <div class="player-card fade-in">
                <div class="player-avatar">${player.name.split(' ').map(n => n[0]).join('')}</div>
                <div class="player-name">${player.name}</div>
                <div class="player-position">${player.position} • ${player.team}</div>
                <div class="player-stats">
                    <div class="player-stat">
                        <div class="player-stat-value">${player.points}</div>
                        <div class="player-stat-label">PPG</div>
                    </div>
                    <div class="player-stat">
                        <div class="player-stat-value">${player.assists}</div>
                        <div class="player-stat-label">APG</div>
                    </div>
                    <div class="player-stat">
                        <div class="player-stat-value">${player.rebounds}</div>
                        <div class="player-stat-label">RPG</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadSchedule() {
        const scheduleContainer = document.getElementById('scheduleContainer');
        const { teams } = this.generateMockData();
        
        const schedule = [];
        const today = new Date();
        
        for (let i = 1; i <= 5; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            const team1 = teams[Math.floor(Math.random() * teams.length)];
            let team2 = teams[Math.floor(Math.random() * teams.length)];
            while (team2 === team1) {
                team2 = teams[Math.floor(Math.random() * teams.length)];
            }
            
            schedule.push({
                date,
                team1,
                team2,
                time: `${Math.floor(Math.random() * 4) + 7}:${Math.random() < 0.5 ? '00' : '30'} PM`
            });
        }

        scheduleContainer.innerHTML = schedule.map(match => `
            <div class="schedule-item fade-in">
                <div class="schedule-date">
                    <div class="schedule-day">${match.date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}</div>
                    <div class="schedule-date-num">${match.date.getDate()}</div>
                </div>
                <div class="schedule-match">
                    <div class="schedule-teams">
                        <div class="team">
                            <div class="team-logo" style="width: 30px; height: 30px; font-size: 0.8rem;">${match.team1.logo}</div>
                            <span>${match.team1.name}</span>
                        </div>
                        <span style="margin: 0 1rem; color: var(--text-secondary);">vs</span>
                        <div class="team">
                            <div class="team-logo" style="width: 30px; height: 30px; font-size: 0.8rem;">${match.team2.logo}</div>
                            <span>${match.team2.name}</span>
                        </div>
                    </div>
                    <div class="schedule-time">${match.time}</div>
                </div>
            </div>
        `).join('');
    }

    // Filters
    initFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                const sport = btn.getAttribute('data-sport');
                this.filterScores(sport);
            });
        });
    }

    filterScores(sport) {
        const scoreCards = document.querySelectorAll('.score-card');
        
        scoreCards.forEach(card => {
            if (sport === 'all' || card.getAttribute('data-sport') === sport) {
                card.style.display = 'block';
                card.classList.add('fade-in');
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Scroll Animations
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        const animatedElements = document.querySelectorAll(
            '.score-card, .player-card, .schedule-item, .section'
        );
        
        animatedElements.forEach(el => observer.observe(el));
    }

    // Utility method to simulate live score updates
    startLiveUpdates() {
        setInterval(() => {
            const liveCards = document.querySelectorAll('.score-card .live-indicator');
            liveCards.forEach(card => {
                const scoreElement = card.closest('.score-card').querySelector('.score');
                if (Math.random() < 0.1) { // 10% chance of score update
                    const scores = scoreElement.textContent.split(' - ');
                    if (Math.random() < 0.5) {
                        scores[0] = parseInt(scores[0]) + 1;
                    } else {
                        scores[1] = parseInt(scores[1]) + 1;
                    }
                    scoreElement.textContent = scores.join(' - ');
                    
                    // Add animation effect
                    scoreElement.style.transform = 'scale(1.1)';
                    scoreElement.style.color = 'var(--success-color)';
                    setTimeout(() => {
                        scoreElement.style.transform = 'scale(1)';
                        scoreElement.style.color = 'var(--primary-color)';
                    }, 300);
                }
            });
        }, 5000); // Update every 5 seconds
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new SportsApp();
    
    // Start live updates after a delay
    setTimeout(() => {
        app.startLiveUpdates();
    }, 2000);
});

// Add some interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add click effects to cards
    document.addEventListener('click', (e) => {
        if (e.target.closest('.score-card, .player-card, .schedule-item')) {
            const card = e.target.closest('.score-card, .player-card, .schedule-item');
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
        }
    });

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const sections = document.querySelectorAll('.section');
            const currentSection = Array.from(sections).find(section => {
                const rect = section.getBoundingClientRect();
                return rect.top <= 100 && rect.bottom > 100;
            });
            
            if (currentSection) {
                const currentIndex = Array.from(sections).indexOf(currentSection);
                const nextIndex = e.key === 'ArrowDown' 
                    ? Math.min(currentIndex + 1, sections.length - 1)
                    : Math.max(currentIndex - 1, 0);
                
                sections[nextIndex].scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // Add search functionality (if search input exists)
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const searchableElements = document.querySelectorAll('.team-name, .player-name');
            
            searchableElements.forEach(element => {
                const card = element.closest('.score-card, .player-card, tr');
                if (element.textContent.toLowerCase().includes(query)) {
                    card.style.display = '';
                    element.innerHTML = element.textContent.replace(
                        new RegExp(query, 'gi'),
                        match => `<mark>${match}</mark>`
                    );
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
});