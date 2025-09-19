// Smart Tour - Analytics Dashboard for Tourism Officials

class SmartTourAnalytics {
    constructor() {
        this.charts = {};
        this.currentTimeRange = '30d';
        this.currentRegion = 'all';
        this.analyticsData = {};
        this.sentimentData = {};
        
        this.init();
    }

    init() {
        this.loadAnalyticsData();
        this.initializeCharts();
        this.setupEventListeners();
        this.startRealTimeUpdates();
    }

    setupEventListeners() {
        // Time range selector
        const timeRangeSelect = document.getElementById('time-range');
        if (timeRangeSelect) {
            timeRangeSelect.addEventListener('change', (e) => {
                this.currentTimeRange = e.target.value;
                this.updateAnalytics();
            });
        }

        // Region filter
        const regionFilter = document.getElementById('region-filter');
        if (regionFilter) {
            regionFilter.addEventListener('change', (e) => {
                this.currentRegion = e.target.value;
                this.updateAnalytics();
            });
        }
    }

    loadAnalyticsData() {
        // Simulate loading analytics data
        this.analyticsData = {
            visitors: this.generateVisitorData(),
            revenue: this.generateRevenueData(),
            satisfaction: this.generateSatisfactionData(),
            destinations: this.generateDestinationData(),
            sentiment: this.generateSentimentData(),
            trends: this.generateTrendData()
        };

        this.updateMetrics();
    }

    generateVisitorData() {
        const data = [];
        const days = this.getDaysForTimeRange();
        
        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            data.push({
                date: date.toISOString().split('T')[0],
                visitors: Math.floor(Math.random() * 1000) + 500,
                newVisitors: Math.floor(Math.random() * 200) + 100,
                returningVisitors: Math.floor(Math.random() * 800) + 300
            });
        }
        
        return data;
    }

    generateRevenueData() {
        const data = [];
        const days = this.getDaysForTimeRange();
        
        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            data.push({
                date: date.toISOString().split('T')[0],
                revenue: Math.floor(Math.random() * 50000) + 20000,
                bookings: Math.floor(Math.random() * 100) + 50,
                averageSpending: Math.floor(Math.random() * 200) + 100
            });
        }
        
        return data;
    }

    generateSatisfactionData() {
        const data = [];
        const days = this.getDaysForTimeRange();
        
        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            data.push({
                date: date.toISOString().split('T')[0],
                rating: Math.random() * 2 + 3.5, // 3.5 to 5.5
                reviews: Math.floor(Math.random() * 50) + 20,
                complaints: Math.floor(Math.random() * 10) + 1
            });
        }
        
        return data;
    }

    generateDestinationData() {
        return [
            { name: 'Central Park', visitors: 12500, revenue: 450000, rating: 4.7 },
            { name: 'Times Square', visitors: 9800, revenue: 320000, rating: 4.2 },
            { name: 'Statue of Liberty', visitors: 8700, revenue: 280000, rating: 4.6 },
            { name: 'Brooklyn Bridge', visitors: 6500, revenue: 180000, rating: 4.4 },
            { name: 'High Line', visitors: 4200, revenue: 120000, rating: 4.5 },
            { name: '9/11 Memorial', visitors: 3800, revenue: 95000, rating: 4.8 },
            { name: 'Metropolitan Museum', visitors: 3600, revenue: 110000, rating: 4.6 },
            { name: 'Empire State Building', visitors: 3200, revenue: 140000, rating: 4.3 }
        ];
    }

    generateSentimentData() {
        return {
            positive: 68,
            neutral: 22,
            negative: 10
        };
    }

    generateTrendData() {
        const trends = [];
        const months = 12;
        
        for (let i = months; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            
            trends.push({
                month: date.toLocaleDateString('en-US', { month: 'short' }),
                visitors: Math.floor(Math.random() * 5000) + 10000,
                revenue: Math.floor(Math.random() * 200000) + 500000,
                satisfaction: Math.random() * 1 + 4.0
            });
        }
        
        return trends;
    }

    getDaysForTimeRange() {
        const ranges = {
            '7d': 7,
            '30d': 30,
            '90d': 90,
            '1y': 365
        };
        return ranges[this.currentTimeRange] || 30;
    }

    initializeCharts() {
        this.initializeVisitorTrendsChart();
        this.initializeDestinationsChart();
        this.initializeSentimentChart();
    }

    initializeVisitorTrendsChart() {
        const ctx = document.getElementById('visitor-trends-chart');
        if (!ctx) return;

        const data = this.analyticsData.visitors;
        const labels = data.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        const visitorData = data.map(d => d.visitors);
        const newVisitorData = data.map(d => d.newVisitors);
        const returningVisitorData = data.map(d => d.returningVisitors);

        this.charts.visitorTrends = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Total Visitors',
                        data: visitorData,
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'New Visitors',
                        data: newVisitorData,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Returning Visitors',
                        data: returningVisitorData,
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Visitor Trends Over Time'
                    },
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Visitors'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                }
            }
        });
    }

    initializeDestinationsChart() {
        const ctx = document.getElementById('destinations-chart');
        if (!ctx) return;

        const data = this.analyticsData.destinations;
        const labels = data.map(d => d.name);
        const visitorData = data.map(d => d.visitors);

        this.charts.destinations = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Visitors',
                        data: visitorData,
                        backgroundColor: [
                            '#6366f1',
                            '#10b981',
                            '#f59e0b',
                            '#ef4444',
                            '#8b5cf6',
                            '#06b6d4',
                            '#84cc16',
                            '#f97316'
                        ],
                        borderColor: [
                            '#4f46e5',
                            '#059669',
                            '#d97706',
                            '#dc2626',
                            '#7c3aed',
                            '#0891b2',
                            '#65a30d',
                            '#ea580c'
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Popular Destinations'
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Visitors'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Destinations'
                        }
                    }
                }
            }
        });
    }

    initializeSentimentChart() {
        const ctx = document.getElementById('sentiment-chart');
        if (!ctx) return;

        const data = this.analyticsData.sentiment;

        this.charts.sentiment = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Positive', 'Neutral', 'Negative'],
                datasets: [
                    {
                        data: [data.positive, data.neutral, data.negative],
                        backgroundColor: [
                            '#10b981',
                            '#f59e0b',
                            '#ef4444'
                        ],
                        borderColor: [
                            '#059669',
                            '#d97706',
                            '#dc2626'
                        ],
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Sentiment Analysis'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    updateAnalytics() {
        this.loadAnalyticsData();
        this.updateCharts();
        this.updateMetrics();
    }

    updateCharts() {
        // Update visitor trends chart
        if (this.charts.visitorTrends) {
            const data = this.analyticsData.visitors;
            const labels = data.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            const visitorData = data.map(d => d.visitors);
            const newVisitorData = data.map(d => d.newVisitors);
            const returningVisitorData = data.map(d => d.returningVisitors);

            this.charts.visitorTrends.data.labels = labels;
            this.charts.visitorTrends.data.datasets[0].data = visitorData;
            this.charts.visitorTrends.data.datasets[1].data = newVisitorData;
            this.charts.visitorTrends.data.datasets[2].data = returningVisitorData;
            this.charts.visitorTrends.update();
        }

        // Update destinations chart
        if (this.charts.destinations) {
            const data = this.analyticsData.destinations;
            const labels = data.map(d => d.name);
            const visitorData = data.map(d => d.visitors);

            this.charts.destinations.data.labels = labels;
            this.charts.destinations.data.datasets[0].data = visitorData;
            this.charts.destinations.update();
        }

        // Update sentiment chart
        if (this.charts.sentiment) {
            const data = this.analyticsData.sentiment;
            this.charts.sentiment.data.datasets[0].data = [data.positive, data.neutral, data.negative];
            this.charts.sentiment.update();
        }
    }

    updateMetrics() {
        // Update total visitors
        const totalVisitors = this.analyticsData.visitors.reduce((sum, day) => sum + day.visitors, 0);
        const visitorsElement = document.getElementById('total-visitors');
        if (visitorsElement) {
            visitorsElement.textContent = totalVisitors.toLocaleString();
        }

        // Update revenue
        const totalRevenue = this.analyticsData.revenue.reduce((sum, day) => sum + day.revenue, 0);
        const revenueElement = document.getElementById('revenue');
        if (revenueElement) {
            revenueElement.textContent = `$${(totalRevenue / 1000000).toFixed(1)}M`;
        }

        // Update satisfaction
        const avgSatisfaction = this.analyticsData.satisfaction.reduce((sum, day) => sum + day.rating, 0) / this.analyticsData.satisfaction.length;
        const satisfactionElement = document.getElementById('satisfaction');
        if (satisfactionElement) {
            satisfactionElement.textContent = avgSatisfaction.toFixed(1);
        }

        // Update active locations
        const activeLocations = this.analyticsData.destinations.length;
        const locationsElement = document.getElementById('active-locations');
        if (locationsElement) {
            locationsElement.textContent = activeLocations;
        }
    }

    startRealTimeUpdates() {
        // Update analytics every 5 minutes
        setInterval(() => {
            this.updateRealTimeData();
        }, 300000);

        // Initial real-time update
        this.updateRealTimeData();
    }

    updateRealTimeData() {
        // Simulate real-time data updates
        const newVisitorData = this.generateVisitorData();
        const newRevenueData = this.generateRevenueData();
        const newSatisfactionData = this.generateSatisfactionData();

        // Update only the latest data points
        this.analyticsData.visitors = newVisitorData;
        this.analyticsData.revenue = newRevenueData;
        this.analyticsData.satisfaction = newSatisfactionData;

        this.updateCharts();
        this.updateMetrics();
    }

    // Advanced Analytics Features
    generateInsights() {
        const insights = [];
        
        // Visitor trend insights
        const recentVisitors = this.analyticsData.visitors.slice(-7);
        const previousVisitors = this.analyticsData.visitors.slice(-14, -7);
        const visitorGrowth = this.calculateGrowthRate(recentVisitors, previousVisitors);
        
        if (visitorGrowth > 10) {
            insights.push({
                type: 'positive',
                title: 'Visitor Growth',
                message: `Visitor numbers increased by ${visitorGrowth.toFixed(1)}% this week`,
                icon: 'fas fa-arrow-up'
            });
        } else if (visitorGrowth < -10) {
            insights.push({
                type: 'negative',
                title: 'Visitor Decline',
                message: `Visitor numbers decreased by ${Math.abs(visitorGrowth).toFixed(1)}% this week`,
                icon: 'fas fa-arrow-down'
            });
        }

        // Revenue insights
        const recentRevenue = this.analyticsData.revenue.slice(-7);
        const previousRevenue = this.analyticsData.revenue.slice(-14, -7);
        const revenueGrowth = this.calculateGrowthRate(recentRevenue, previousRevenue);
        
        if (revenueGrowth > 15) {
            insights.push({
                type: 'positive',
                title: 'Revenue Growth',
                message: `Revenue increased by ${revenueGrowth.toFixed(1)}% this week`,
                icon: 'fas fa-dollar-sign'
            });
        }

        // Satisfaction insights
        const avgSatisfaction = this.analyticsData.satisfaction.reduce((sum, day) => sum + day.rating, 0) / this.analyticsData.satisfaction.length;
        
        if (avgSatisfaction > 4.5) {
            insights.push({
                type: 'positive',
                title: 'High Satisfaction',
                message: `Average satisfaction rating is ${avgSatisfaction.toFixed(1)}/5`,
                icon: 'fas fa-star'
            });
        } else if (avgSatisfaction < 3.5) {
            insights.push({
                type: 'negative',
                title: 'Low Satisfaction',
                message: `Average satisfaction rating is ${avgSatisfaction.toFixed(1)}/5 - needs attention`,
                icon: 'fas fa-exclamation-triangle'
            });
        }

        return insights;
    }

    calculateGrowthRate(recent, previous) {
        const recentAvg = recent.reduce((sum, item) => sum + (item.visitors || item.revenue), 0) / recent.length;
        const previousAvg = previous.reduce((sum, item) => sum + (item.visitors || item.revenue), 0) / previous.length;
        
        return ((recentAvg - previousAvg) / previousAvg) * 100;
    }

    // Export functionality
    exportAnalytics() {
        const exportData = {
            timeRange: this.currentTimeRange,
            region: this.currentRegion,
            generatedAt: new Date().toISOString(),
            metrics: {
                totalVisitors: this.analyticsData.visitors.reduce((sum, day) => sum + day.visitors, 0),
                totalRevenue: this.analyticsData.revenue.reduce((sum, day) => sum + day.revenue, 0),
                averageSatisfaction: this.analyticsData.satisfaction.reduce((sum, day) => sum + day.rating, 0) / this.analyticsData.satisfaction.length,
                activeLocations: this.analyticsData.destinations.length
            },
            data: this.analyticsData,
            insights: this.generateInsights()
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `smart-tour-analytics-${this.currentTimeRange}-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }

    // Sentiment Analysis
    analyzeSentiment(text) {
        // Simple sentiment analysis (in a real app, this would use AI/ML)
        const positiveWords = ['good', 'great', 'amazing', 'wonderful', 'excellent', 'love', 'like', 'happy', 'fantastic', 'perfect'];
        const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'angry', 'sad', 'disappointed', 'horrible', 'worst'];
        
        const lowerText = text.toLowerCase();
        const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
        const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
        
        if (positiveCount > negativeCount) return 'positive';
        if (negativeCount > positiveCount) return 'negative';
        return 'neutral';
    }

    // Predictive Analytics
    predictFutureTrends() {
        const predictions = {
            nextWeek: {
                visitors: this.predictVisitors(7),
                revenue: this.predictRevenue(7),
                satisfaction: this.predictSatisfaction(7)
            },
            nextMonth: {
                visitors: this.predictVisitors(30),
                revenue: this.predictRevenue(30),
                satisfaction: this.predictSatisfaction(30)
            }
        };
        
        return predictions;
    }

    predictVisitors(days) {
        const recentData = this.analyticsData.visitors.slice(-7);
        const trend = this.calculateTrend(recentData.map(d => d.visitors));
        const currentAvg = recentData.reduce((sum, d) => sum + d.visitors, 0) / recentData.length;
        
        return Math.floor(currentAvg + (trend * days));
    }

    predictRevenue(days) {
        const recentData = this.analyticsData.revenue.slice(-7);
        const trend = this.calculateTrend(recentData.map(d => d.revenue));
        const currentAvg = recentData.reduce((sum, d) => sum + d.revenue, 0) / recentData.length;
        
        return Math.floor(currentAvg + (trend * days));
    }

    predictSatisfaction(days) {
        const recentData = this.analyticsData.satisfaction.slice(-7);
        const trend = this.calculateTrend(recentData.map(d => d.rating));
        const currentAvg = recentData.reduce((sum, d) => sum + d.rating, 0) / recentData.length;
        
        return Math.max(1, Math.min(5, currentAvg + (trend * days / 30)));
    }

    calculateTrend(data) {
        if (data.length < 2) return 0;
        
        const n = data.length;
        const sumX = (n * (n - 1)) / 2;
        const sumY = data.reduce((sum, val) => sum + val, 0);
        const sumXY = data.reduce((sum, val, index) => sum + (index * val), 0);
        const sumXX = (n * (n - 1) * (2 * n - 1)) / 6;
        
        return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    }

    // Real-time monitoring
    setupRealTimeMonitoring() {
        // Simulate real-time data stream
        setInterval(() => {
            this.processRealTimeEvent();
        }, 10000); // Every 10 seconds
    }

    processRealTimeEvent() {
        const events = [
            { type: 'visitor_arrival', location: 'Central Park', timestamp: new Date() },
            { type: 'booking_made', service: 'Tour Guide', amount: 150, timestamp: new Date() },
            { type: 'review_submitted', rating: 5, location: 'Times Square', timestamp: new Date() },
            { type: 'complaint_received', category: 'service', timestamp: new Date() }
        ];
        
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        this.handleRealTimeEvent(randomEvent);
    }

    handleRealTimeEvent(event) {
        console.log('Real-time event:', event);
        
        // Update real-time metrics
        switch (event.type) {
            case 'visitor_arrival':
                this.updateRealTimeVisitors();
                break;
            case 'booking_made':
                this.updateRealTimeRevenue(event.amount);
                break;
            case 'review_submitted':
                this.updateRealTimeSatisfaction(event.rating);
                break;
            case 'complaint_received':
                this.updateRealTimeComplaints();
                break;
        }
    }

    updateRealTimeVisitors() {
        // Update visitor count in real-time
        const visitorsElement = document.getElementById('total-visitors');
        if (visitorsElement) {
            const currentCount = parseInt(visitorsElement.textContent.replace(/,/g, ''));
            visitorsElement.textContent = (currentCount + 1).toLocaleString();
        }
    }

    updateRealTimeRevenue(amount) {
        // Update revenue in real-time
        const revenueElement = document.getElementById('revenue');
        if (revenueElement) {
            const currentRevenue = parseFloat(revenueElement.textContent.replace('$', '').replace('M', '')) * 1000000;
            const newRevenue = (currentRevenue + amount) / 1000000;
            revenueElement.textContent = `$${newRevenue.toFixed(1)}M`;
        }
    }

    updateRealTimeSatisfaction(rating) {
        // Update satisfaction in real-time
        const satisfactionElement = document.getElementById('satisfaction');
        if (satisfactionElement) {
            const currentRating = parseFloat(satisfactionElement.textContent);
            const newRating = (currentRating + rating) / 2; // Simple average
            satisfactionElement.textContent = newRating.toFixed(1);
        }
    }

    updateRealTimeComplaints() {
        // Update complaint count (if displayed)
        console.log('New complaint received');
    }
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.smartTourAnalytics = new SmartTourAnalytics();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmartTourAnalytics;
}
