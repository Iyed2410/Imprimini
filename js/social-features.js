class SocialFeatures {
    constructor() {
        this.currentUser = null;
        this.designs = new Map();
        this.likes = new Map();
        this.comments = new Map();
        this.contests = new Map();
    }
    
    // User Management
    async login(username, password) {
        // Implement actual authentication here
        this.currentUser = {
            id: 'user123',
            username: username,
            level: 1,
            points: 0,
            badges: [],
            designs: []
        };
        return this.currentUser;
    }
    
    // Design Management
    async saveDesign(design) {
        const designId = 'design_' + Date.now();
        design.id = designId;
        design.userId = this.currentUser.id;
        design.timestamp = new Date();
        design.likes = 0;
        design.comments = [];
        
        this.designs.set(designId, design);
        this.currentUser.designs.push(designId);
        
        // Award points for creating a design
        this.awardPoints(50, 'design_created');
        
        return designId;
    }
    
    async shareDesign(designId, platform) {
        const design = this.designs.get(designId);
        if (!design) throw new Error('Design not found');
        
        const shareUrls = {
            facebook: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('Check out my custom design!')}`,
            pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(design.preview)}&description=${encodeURIComponent('My custom design')}`
        };
        
        window.open(shareUrls[platform], '_blank');
        this.awardPoints(10, 'design_shared');
    }
    
    // Community Features
    async likeDesign(designId) {
        const design = this.designs.get(designId);
        if (!design) throw new Error('Design not found');
        
        const likeId = `${this.currentUser.id}_${designId}`;
        if (this.likes.has(likeId)) {
            this.likes.delete(likeId);
            design.likes--;
        } else {
            this.likes.set(likeId, true);
            design.likes++;
            this.awardPoints(5, 'gave_like');
        }
        
        return design.likes;
    }
    
    async commentOnDesign(designId, comment) {
        const design = this.designs.get(designId);
        if (!design) throw new Error('Design not found');
        
        const commentObj = {
            id: 'comment_' + Date.now(),
            userId: this.currentUser.id,
            text: comment,
            timestamp: new Date()
        };
        
        design.comments.push(commentObj);
        this.comments.set(commentObj.id, commentObj);
        this.awardPoints(10, 'posted_comment');
        
        return commentObj;
    }
    
    // Contests
    async createContest(contest) {
        const contestId = 'contest_' + Date.now();
        contest.id = contestId;
        contest.entries = [];
        contest.startDate = new Date();
        
        this.contests.set(contestId, contest);
        return contestId;
    }
    
    async submitContestEntry(contestId, designId) {
        const contest = this.contests.get(contestId);
        const design = this.designs.get(designId);
        
        if (!contest || !design) throw new Error('Contest or design not found');
        
        contest.entries.push({
            designId: designId,
            userId: this.currentUser.id,
            timestamp: new Date(),
            votes: 0
        });
        
        this.awardPoints(100, 'contest_entry');
    }
    
    async voteForEntry(contestId, designId) {
        const contest = this.contests.get(contestId);
        if (!contest) throw new Error('Contest not found');
        
        const entry = contest.entries.find(e => e.designId === designId);
        if (!entry) throw new Error('Entry not found');
        
        entry.votes++;
        this.awardPoints(5, 'contest_vote');
        
        return entry.votes;
    }
    
    // Gamification
    awardPoints(points, reason) {
        if (!this.currentUser) return;
        
        this.currentUser.points += points;
        this.checkLevelUp();
        this.checkBadges(reason);
    }
    
    checkLevelUp() {
        const pointsPerLevel = 1000;
        const newLevel = Math.floor(this.currentUser.points / pointsPerLevel) + 1;
        
        if (newLevel > this.currentUser.level) {
            this.currentUser.level = newLevel;
            this.showAchievement('Level Up!', `You've reached level ${newLevel}!`);
        }
    }
    
    checkBadges(action) {
        const badges = {
            'first_design': {
                name: 'Designer Rookie',
                condition: user => user.designs.length >= 1
            },
            'design_master': {
                name: 'Design Master',
                condition: user => user.designs.length >= 10
            },
            'social_butterfly': {
                name: 'Social Butterfly',
                condition: user => this.comments.size >= 10
            },
            'contest_winner': {
                name: 'Contest Winner',
                condition: user => this.hasWonContest(user.id)
            }
        };
        
        Object.entries(badges).forEach(([id, badge]) => {
            if (!this.currentUser.badges.includes(id) && badge.condition(this.currentUser)) {
                this.currentUser.badges.push(id);
                this.showAchievement('New Badge!', `You've earned the ${badge.name} badge!`);
            }
        });
    }
    
    hasWonContest(userId) {
        return Array.from(this.contests.values()).some(contest => {
            if (!contest.ended) return false;
            const winner = contest.entries.reduce((a, b) => a.votes > b.votes ? a : b);
            return winner.userId === userId;
        });
    }
    
    showAchievement(title, message) {
        // Create achievement notification
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">🏆</div>
            <div class="achievement-content">
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after animation
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
}

export default SocialFeatures;
