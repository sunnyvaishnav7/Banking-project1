import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    PieChart,
    TrendingUp,
    TrendingDown,
    Award,
    Target,
    Zap,
    Shield,
    Calendar,
    ArrowUpRight,
    ArrowDownLeft,
    Sparkles
} from 'lucide-react';
import './AnalyticsPage.css';

const AnalyticsPage: React.FC = () => {
    const { totalBalanceINR, transactions, isPrivacyEnabled } = useAuth();

    // Category breakdown
    const categories = [
        { name: 'Wire Transfers', percent: 45, amount: '₹145,000', color: 'var(--accent-emerald)' },
        { name: 'Cloud & Tech Infra', percent: 22, amount: '₹72,400', color: 'var(--accent-cyan)' },
        { name: 'Investments & Equities', percent: 18, amount: '₹58,000', color: 'var(--accent-indigo)' },
        { name: 'Executive Travel & Dining', percent: 15, amount: '₹48,200', color: 'var(--accent-purple)' },
    ];

    // Savings Goals
    const savingsGoals = [
        { title: 'Global Treasury Liquidity Buffer', current: 485000, target: 600000, currency: 'INR', color: 'var(--accent-emerald)' },
        { title: 'Silicon Valley Angel Syndicate', current: 14250, target: 20000, currency: 'USD', color: 'var(--accent-cyan)' },
        { title: 'Zurich Swiss Vault Real Estate', current: 6420, target: 10000, currency: 'EUR', color: 'var(--accent-purple)' }
    ];

    // Cashflow Bar Data
    const monthlyCashflow = [
        { month: 'May', in: 65000, out: 32000 },
        { month: 'Jun', in: 82000, out: 41000 },
        { month: 'Jul', in: 74000, out: 38000 },
        { month: 'Aug', in: 95000, out: 52000 },
        { month: 'Sep', in: 88000, out: 46000 },
        { month: 'Oct', in: 110000, out: 54000 },
    ];

    return (
        <div className="analytics-page animate-fade-in">
            <div className="page-header-row">
                <div>
                    <h1>Financial Intelligence & Cash Flow Analytics</h1>
                    <p className="page-sub">
                        Real-time AI spending insights, savings goal velocity, and institutional liquidity tracking.
                    </p>
                </div>
            </div>

            {/* Top Score Banner */}
            <div className="health-score-banner glass-card">
                <div className="score-left">
                    <div className="score-radial">
                        <span className="score-num amount-mono">96</span>
                        <span className="score-label">OUT OF 100</span>
                    </div>
                    <div>
                        <span className="badge badge-success mb-1">
                            <Sparkles size={13} /> Institutional Tier 1
                        </span>
                        <h3>Optimal Wealth & Liquidity Score</h3>
                        <p className="score-desc">
                            Your debt-to-liquid ratio is in the top 2% of private banking accounts. No overdue commitments detected.
                        </p>
                    </div>
                </div>

                <div className="score-stats-row">
                    <div className="score-stat">
                        <span className="stat-label">Savings Velocity</span>
                        <span className="stat-value amount-mono text-positive">+24.5%</span>
                    </div>
                    <div className="score-stat">
                        <span className="stat-label">Runway Duration</span>
                        <span className="stat-value amount-mono">18.4 Mo</span>
                    </div>
                    <div className="score-stat">
                        <span className="stat-label">Yield Earned</span>
                        <span className="stat-value amount-mono text-positive">₹34,810</span>
                    </div>
                </div>
            </div>

            {/* Middle Grid: Cash Flow Chart & Category Breakdown */}
            <div className="analytics-main-grid">
                {/* Cashflow Visualizer */}
                <div className="analytics-card glass-card">
                    <div className="section-header">
                        <div>
                            <h3>Monthly Cashflow (Inflow vs Outflow)</h3>
                            <p className="section-sub">Last 6 months comparison</p>
                        </div>
                        <div className="chart-legend">
                            <span className="legend-item"><span className="legend-dot in"></span> Inflow</span>
                            <span className="legend-item"><span className="legend-dot out"></span> Outflow</span>
                        </div>
                    </div>

                    <div className="cashflow-bar-chart">
                        {monthlyCashflow.map((cf) => {
                            const inHeight = (cf.in / 120000) * 160;
                            const outHeight = (cf.out / 120000) * 160;

                            return (
                                <div key={cf.month} className="bar-group">
                                    <div className="bars-container">
                                        <div
                                            className="chart-bar bar-in"
                                            style={{ height: `${inHeight}px` }}
                                            title={`Inflow: ₹${cf.in.toLocaleString()}`}
                                        ></div>
                                        <div
                                            className="chart-bar bar-out"
                                            style={{ height: `${outHeight}px` }}
                                            title={`Outflow: ₹${cf.out.toLocaleString()}`}
                                        ></div>
                                    </div>
                                    <span className="bar-label">{cf.month}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Expense Categories */}
                <div className="analytics-card glass-card">
                    <div className="section-header">
                        <div>
                            <h3>Spend Breakdown</h3>
                            <p className="section-sub">Expenditure distribution</p>
                        </div>
                    </div>

                    <div className="categories-list">
                        {categories.map((c) => (
                            <div key={c.name} className="category-item">
                                <div className="flex-between font-xs mb-1">
                                    <span className="cat-name">{c.name}</span>
                                    <span className="amount-mono">{isPrivacyEnabled ? '••••' : c.amount} ({c.percent}%)</span>
                                </div>
                                <div className="progress-track">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${c.percent}%`, background: c.color }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Savings Goals */}
            <div className="section-card glass-card">
                <div className="section-header">
                    <div>
                        <h3>Strategic Reserves & Savings Goals</h3>
                        <p className="section-sub">Automated sweep targets</p>
                    </div>
                </div>

                <div className="grid-3">
                    {savingsGoals.map((g) => {
                        const progress = Math.min(100, Math.round((g.current / g.target) * 100));

                        return (
                            <div key={g.title} className="savings-goal-card glass-card">
                                <div className="goal-top">
                                    <Target size={20} className="text-emerald" />
                                    <span className="badge badge-neutral">{progress}% Complete</span>
                                </div>
                                <h4 className="goal-title">{g.title}</h4>
                                <div className="goal-amount amount-mono">
                                    {isPrivacyEnabled ? '••••' : `${g.currency} ${g.current.toLocaleString()}`}
                                    <span className="goal-target"> / {g.currency} {g.target.toLocaleString()}</span>
                                </div>
                                <div className="progress-track mt-2">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${progress}%`, background: g.color }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
