import React, { useState, useEffect } from 'react';
import MobileFrame from '../components/MobileFrame/MobileFrame';
import TopBar from '../components/Navigation/TopBar';
import SidebarDrawer from '../components/Navigation/SidebarDrawer';
import BottomNav from '../components/Navigation/BottomNav';
import DesktopLayout from '../components/DesktopLayout/DesktopLayout';

// Screens
import OnboardingLoginScreen from '../pages/Mobile/OnboardingLoginScreen';
import HomeDashboardScreen from '../pages/Mobile/HomeDashboardScreen';
import DesktopDashboardScreen from '../pages/Desktop/DesktopDashboardScreen';
import AIAssistantScreen from '../pages/Mobile/AIAssistantScreen';
import AccountsCardsScreen from '../pages/Mobile/AccountsCardsScreen';
import TransferFlowScreen from '../pages/Mobile/TransferFlowScreen';
import TransactionHistoryScreen from '../pages/Mobile/TransactionHistoryScreen';
import ProfileSettingsScreen from '../pages/Mobile/ProfileSettingsScreen';
import ComponentLibraryScreen from '../pages/Mobile/ComponentLibraryScreen';

import { Smartphone, Monitor, Shield, Zap, Sparkles } from 'lucide-react';
import './App.css';

const App: React.FC = () => {
    // Mode: 'auto' (automatically shifts based on screen width), 'desktop' (force), 'mobile' (force)
    const [viewMode, setViewMode] = useState<'auto' | 'desktop' | 'mobile'>('auto');
    const [windowWidth, setWindowWidth] = useState<number>(() => typeof window !== 'undefined' ? window.innerWidth : 1200);

    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [userName, setUserName] = useState('Alexander Wright');
    const [userEmail, setUserEmail] = useState('alex.wright@apexbank.io');
    const [activeTab, setActiveTab] = useState<string>('home');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [assistantPrompt, setAssistantPrompt] = useState<string>('');

    // Automatic screen width listener for seamless responsive shifting
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Determine active layout based on auto-detection or manual override
    const isMobileLayout = viewMode === 'auto' ? windowWidth < 840 : viewMode === 'mobile';

    const handleLoginSuccess = (name: string, email: string) => {
        setUserName(name);
        setUserEmail(email);
        setIsLoggedIn(true);
        setActiveTab('home');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setActiveTab('login');
        setIsDrawerOpen(false);
    };

    const handleSelectPrompt = (prompt: string) => {
        setAssistantPrompt(prompt);
        setActiveTab('assistant');
    };

    const isLoginView = !isLoggedIn || activeTab === 'login';

    const renderScreenContent = (isDesktopView: boolean) => {
        if (isLoginView) {
            return <OnboardingLoginScreen onLoginSuccess={handleLoginSuccess} />;
        }

        switch (activeTab) {
            case 'home':
                return isDesktopView ? (
                    <DesktopDashboardScreen
                        userName={userName}
                        onNavigateTab={setActiveTab}
                        onSelectSuggestion={handleSelectPrompt}
                    />
                ) : (
                    <HomeDashboardScreen
                        userName={userName}
                        onNavigateTab={setActiveTab}
                        onSelectSuggestion={handleSelectPrompt}
                        onOpenSendMoney={() => setActiveTab('transfers')}
                    />
                );

            case 'assistant':
                return (
                    <AIAssistantScreen
                        initialPrompt={assistantPrompt}
                        onExecuteTransfer={(to, amount) => {
                            console.log(`Executed transfer to ${to} of $${amount}`);
                        }}
                    />
                );

            case 'cards':
            case 'accounts':
                return <AccountsCardsScreen />;

            case 'transfers':
                return <TransferFlowScreen onDone={() => setActiveTab('home')} />;

            case 'transactions':
                return <TransactionHistoryScreen />;

            case 'settings':
                return <ProfileSettingsScreen onLogout={handleLogout} />;

            case 'components':
                return <ComponentLibraryScreen />;

            default:
                return (
                    <HomeDashboardScreen
                        userName={userName}
                        onNavigateTab={setActiveTab}
                        onSelectSuggestion={handleSelectPrompt}
                    />
                );
        }
    };

    return (
        <div className="apex-app-root">
            {/* Top Auto-Shift Toolbar */}
            <div className="global-view-bar">
                <div className="view-bar-brand">
                    <div className="view-bar-badge">
                        <Shield size={16} color="#FFFFFF" />
                    </div>
                    <div>
                        <span className="view-bar-title">Apex Banking Suite</span>
                        <span className="view-bar-sub">
                            {viewMode === 'auto'
                                ? `⚡ Auto-Shift (${windowWidth}px &bull; ${isMobileLayout ? 'Mobile' : 'Desktop'})`
                                : `Forced ${viewMode === 'desktop' ? 'Desktop' : 'Mobile'}`}
                        </span>
                    </div>
                </div>

                {/* View Switcher: Auto Responsive vs Manual */}
                <div className="view-mode-pill-toggle">
                    <button
                        className={`view-mode-btn ${viewMode === 'auto' ? 'active' : ''}`}
                        onClick={() => setViewMode('auto')}
                        title="Automatically shifts layout when resizing browser"
                    >
                        <Zap size={14} />
                        <span>Auto Shift</span>
                    </button>
                    <button
                        className={`view-mode-btn ${viewMode === 'desktop' ? 'active' : ''}`}
                        onClick={() => setViewMode('desktop')}
                        title="Force Desktop full-screen layout"
                    >
                        <Monitor size={14} />
                        <span>Desktop</span>
                    </button>
                    <button
                        className={`view-mode-btn ${viewMode === 'mobile' ? 'active' : ''}`}
                        onClick={() => setViewMode('mobile')}
                        title="Force Mobile 390x844 frame layout"
                    >
                        <Smartphone size={14} />
                        <span>Mobile (390×844)</span>
                    </button>
                </div>
            </div>

            {/* Render Desktop or Mobile according to automatic screen detection */}
            {!isMobileLayout ? (
                /* DESKTOP VIEW */
                isLoginView ? (
                    <div className="desktop-login-wrapper">
                        <div className="card-clean" style={{ maxWidth: '440px', width: '100%', margin: '60px auto' }}>
                            <OnboardingLoginScreen onLoginSuccess={handleLoginSuccess} />
                        </div>
                    </div>
                ) : (
                    <DesktopLayout
                        activeTab={activeTab}
                        onSelectTab={setActiveTab}
                        userName={userName}
                        userEmail={userEmail}
                        onLogout={handleLogout}
                    >
                        {renderScreenContent(true)}
                    </DesktopLayout>
                )
            ) : (
                /* MOBILE VIEW */
                viewMode === 'mobile' ? (
                    /* Centered Frame View when manually previewing on desktop */
                    <MobileFrame
                        activeScreenId={activeTab}
                        onSelectScreen={(screenId) => {
                            if (screenId === 'login') {
                                setIsLoggedIn(false);
                            } else {
                                setIsLoggedIn(true);
                            }
                            setActiveTab(screenId);
                        }}
                    >
                        {isLoginView ? (
                            <OnboardingLoginScreen onLoginSuccess={handleLoginSuccess} />
                        ) : (
                            <div className="mobile-app-shell">
                                <TopBar
                                    title={
                                        activeTab === 'home' ? 'Apex Mobile' :
                                        activeTab === 'assistant' ? 'AI Assistant' :
                                        activeTab === 'cards' ? 'Cards' :
                                        activeTab === 'transfers' ? 'Send Money' :
                                        activeTab === 'transactions' ? 'Statements' :
                                        activeTab === 'settings' ? 'Settings' : 'Design System'
                                    }
                                    onOpenDrawer={() => setIsDrawerOpen(true)}
                                    onOpenProfile={() => setActiveTab('settings')}
                                    onOpenNotifications={() => setActiveTab('transactions')}
                                />

                                <SidebarDrawer
                                    isOpen={isDrawerOpen}
                                    onClose={() => setIsDrawerOpen(false)}
                                    activeTab={activeTab}
                                    onSelectTab={(tabId) => {
                                        setActiveTab(tabId);
                                        setIsDrawerOpen(false);
                                    }}
                                    userName={userName}
                                    userEmail={userEmail}
                                    onLogout={handleLogout}
                                />

                                <main className="mobile-main-body">
                                    {renderScreenContent(false)}
                                </main>

                                {activeTab !== 'assistant' && (
                                    <BottomNav
                                        activeTab={activeTab === 'accounts' ? 'cards' : activeTab}
                                        onSelectTab={setActiveTab}
                                    />
                                )}
                            </div>
                        )}
                    </MobileFrame>
                ) : (
                    /* Full-Screen Native Mobile View when screen width < 840px */
                    <div className="native-mobile-container">
                        {isLoginView ? (
                            <OnboardingLoginScreen onLoginSuccess={handleLoginSuccess} />
                        ) : (
                            <div className="mobile-app-shell">
                                <TopBar
                                    title={
                                        activeTab === 'home' ? 'Apex Mobile' :
                                        activeTab === 'assistant' ? 'AI Assistant' :
                                        activeTab === 'cards' ? 'Cards' :
                                        activeTab === 'transfers' ? 'Send Money' :
                                        activeTab === 'transactions' ? 'Statements' :
                                        activeTab === 'settings' ? 'Settings' : 'Design System'
                                    }
                                    onOpenDrawer={() => setIsDrawerOpen(true)}
                                    onOpenProfile={() => setActiveTab('settings')}
                                    onOpenNotifications={() => setActiveTab('transactions')}
                                />

                                <SidebarDrawer
                                    isOpen={isDrawerOpen}
                                    onClose={() => setIsDrawerOpen(false)}
                                    activeTab={activeTab}
                                    onSelectTab={(tabId) => {
                                        setActiveTab(tabId);
                                        setIsDrawerOpen(false);
                                    }}
                                    userName={userName}
                                    userEmail={userEmail}
                                    onLogout={handleLogout}
                                />

                                <main className="mobile-main-body">
                                    {renderScreenContent(false)}
                                </main>

                                {activeTab !== 'assistant' && (
                                    <BottomNav
                                        activeTab={activeTab === 'accounts' ? 'cards' : activeTab}
                                        onSelectTab={setActiveTab}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                )
            )}
        </div>
    );
};

export default App;