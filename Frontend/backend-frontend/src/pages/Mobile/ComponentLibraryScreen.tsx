import React from 'react';
import {
    Sparkles,
    Send,
    Eye,
    Shield,
    CreditCard,
    Lock,
    CheckCircle2,
    ArrowRight
} from 'lucide-react';
import './MobileScreens.css';

const ComponentLibraryScreen: React.FC = () => {
    const colorSwatches = [
        { name: 'Pure White', hex: '#FFFFFF', border: true },
        { name: 'Light Gray-Blue', hex: '#F5F8FF', border: true },
        { name: 'Primary Blue', hex: '#1E5EFF', textLight: true },
        { name: 'Dark Blue', hex: '#1446C7', textLight: true },
        { name: 'Light Blue Tint', hex: '#E8F0FF', border: true },
        { name: 'Heading Black', hex: '#0B0B0B', textLight: true },
        { name: 'Body Text', hex: '#1A1A1A', textLight: true },
        { name: 'Secondary Gray', hex: '#6B7280', textLight: true },
        { name: 'Success Green', hex: '#16A34A', textLight: true },
        { name: 'Error Red', hex: '#DC2626', textLight: true },
    ];

    return (
        <div className="mobile-screen-content animate-fade-in">
            <span className="section-heading">Design System & Component Library</span>
            <p className="caption-label mt-1">
                Strict specifications based on ChatGPT's clean, conversation-first interface guidelines.
            </p>

            {/* 1. Color Palette System */}
            <div className="mt-4">
                <span className="caption-label font-medium">1. COLOR SYSTEM (STRICT SPEC)</span>
                <div className="color-swatches-grid mt-2">
                    {colorSwatches.map((c) => (
                        <div key={c.hex} className="color-swatch-item">
                            <div
                                className={`color-swatch-box ${c.border ? 'has-border' : ''}`}
                                style={{ backgroundColor: c.hex }}
                            >
                                <span style={{ color: c.textLight ? '#FFFFFF' : '#0B0B0B', fontSize: '11px', fontWeight: 600 }}>
                                    {c.hex}
                                </span>
                            </div>
                            <span className="caption-label font-xs">{c.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Typography Hierarchy */}
            <div className="mt-4">
                <span className="caption-label font-medium">2. TYPOGRAPHY SCALE (INTER)</span>
                <div className="card-clean mt-2">
                    <div className="type-sample">
                        <span className="caption-label">Balance Amount (34px, semibold)</span>
                        <div className="balance-amount">$24,850.75</div>
                    </div>
                    <div className="divider-line" />
                    <div className="type-sample">
                        <span className="caption-label">Screen Title (22px, semibold)</span>
                        <div className="screen-title">Account Statements</div>
                    </div>
                    <div className="divider-line" />
                    <div className="type-sample">
                        <span className="caption-label">Section Heading (16px, medium)</span>
                        <div className="section-heading">Recent Transactions</div>
                    </div>
                    <div className="divider-line" />
                    <div className="type-sample">
                        <span className="caption-label">Body Text (14-15px, regular)</span>
                        <div className="body-text">Instant settlement with double-entry cryptographic verification.</div>
                    </div>
                    <div className="divider-line" />
                    <div className="type-sample">
                        <span className="caption-label">Caption Label (12px, regular, gray)</span>
                        <div className="caption-label">Total Liquid Reserves &bull; FDIC Insured</div>
                    </div>
                </div>
            </div>

            {/* 3. Button Components */}
            <div className="mt-4">
                <span className="caption-label font-medium">3. BUTTON VARIANTS</span>
                <div className="card-clean mt-2 flex-col gap-3">
                    <div>
                        <span className="caption-label mb-1 block">Primary Button (52px, 14px radius, #1E5EFF)</span>
                        <button className="btn-primary">
                            <span>Primary Action</span>
                            <ArrowRight size={16} />
                        </button>
                    </div>

                    <div>
                        <span className="caption-label mb-1 block">Secondary Button (White fill, 1.5px blue border)</span>
                        <button className="btn-secondary">
                            <span>Secondary Action</span>
                        </button>
                    </div>

                    <div>
                        <span className="caption-label mb-1 block">Text Button (Blue text, zero padding)</span>
                        <button className="btn-text">
                            <span>Text Button Link &rarr;</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 4. Chips & Inputs */}
            <div className="mt-4">
                <span className="caption-label font-medium">4. CHIPS & INPUT FIELDS</span>
                <div className="card-clean mt-2">
                    <span className="caption-label mb-1 block">Chips (Pill shape, #E8F0FF tint)</span>
                    <div className="flex-wrap gap-2 mt-1">
                        <span className="chip-pill active">Selected Chip</span>
                        <span className="chip-pill">Suggested Prompt</span>
                        <span className="chip-pill">Freeze Card</span>
                    </div>

                    <div className="divider-line" />

                    <span className="caption-label mb-1 block">Input Field (52px, #F5F8FF fill, 12px radius)</span>
                    <input
                        type="text"
                        placeholder="Search transactions, payees..."
                        className="input-box mt-1"
                    />
                </div>
            </div>
        </div>
    );
};

export default ComponentLibraryScreen;
