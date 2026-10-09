import React, { useState, useEffect } from 'react';
import MobileFrame from '../components/MobileFrame/MobileFrame';
import TopBar from '../components/Navigation/TopBar';
import SidebarDrawer from '../components/Navigation/SidebarDrawer';
import BottomNav from '../components/Navigation/BottomNav';
import DesktopLayout from '../components/DesktopLayout/DesktopLayout';

// Security & Toast Modals
import { SessionExpiringModal, ToastContainer } from '../shared/ui/SecurityModals';
import { useInactivityTimer } from '../shared/hooks/useInactivityTimer';
import { useAppStore } from '../shared/lib/useAppStore';

// Screens
import { AuthScreens } from '../features/auth/AuthScreens';
import HomeDashboardScreen from '../pages/Mobile/HomeDashboardScreen';
import DesktopDashboardScreen from '../pages/Desktop/DesktopDashboardScreen';
import AIAssistantScreen from '../pages/Mobile/AIAssistantScreen';
import AccountsCardsScreen from '../pages/Mobile/AccountsCardsScreen';
import TransferFlowScreen from '../pages/Mobile/TransferFlowScreen';
import TransactionHistoryScreen from '../pages/Mobile/TransactionHistoryScreen';
import ProfileSettingsScreen from '../pages/Mobile/ProfileSettingsScreen';
import ComponentLibraryScreen from '../pages/Mobile/ComponentLibraryScreen';

import { Smartphone, Monitor, Shield, Zap } from 'lucide-react';
import './App.css';

const App: React.FC = () => {
    // Enable 3-minute inactivity timer & tab blur privacy mask
    useInactivityTimer();

    const { user, isAuthenticated, activeTab, setActiveTab, logout } = useAppStore();

    // Responsive Mode: 'auto' (automatically shifts based on screen width), 'desktop' (force), 'mobile' (force)
    const [viewMode, setViewMode] = useState<'auto' | 'desktop' | 'mobile'>('auto');
    const [windowWidth, setWindowWidth] = useState<number>(() => typeof window !== 'undefined' ? window.innerWidth : 1200);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [assistantPrompt, setAssistantPrompt] = useState<string>('');

    // Window resize listener
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Determine active layout (mobile if < 840px in auto mode)
    const isMobileLayout = viewMode === 'auto' ? windowWidth < 840 : viewMode === 'mobile';

    const handleSelectPrompt = (prompt: string) => {
        setAssistantPrompt(prompt);
        setActiveTab('assistant');
    };

    const isLoginView = !isAuthenticated || activeTab === 'login';

    const renderScreenContent = (isDesktopView: boolean) => {
        if (isLoginView) {
            return <AuthScreens onSuccess={() => setActiveTab('home')} />;
        }

        switch (activeTab) {
            case 'home':
                return isDesktopView ? (
                    <DesktopDashboardScreen
                        userName={user?.name || 'Alexander Wright'}
                        onNavigateTab={setActiveTab}
                        onSelectSuggestion={handleSelectPrompt}
                    />
                ) : (
                    <HomeDashboardScreen
                        userName={user?.name || 'Alexander Wright'}
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
                return <ProfileSettingsScreen onLogout={logout} />;

            case 'components':
                return <ComponentLibraryScreen />;

            default:
                return (
                    <HomeDashboardScreen
                        userName={user?.name || 'Alexander Wright'}
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

                {/* View Switcher: Auto Responsive vs Manual Override */}
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
                        title="Force Desktop layout"
                    >
                        <Monitor size={14} />
                        <span>Desktop</span>
                    </button>
                    <button
                        className={`view-mode-btn ${viewMode === 'mobile' ? 'active' : ''}`}
                        onClick={() => setViewMode('mobile')}
                        title="Force Mobile (390×844) frame"
                    >
                        <Smartphone size={14} />
                        <span>Mobile (390×844)</span>
                    </button>
                </div>
            </div>

            {/* Layout Rendering */}
            {!isMobileLayout ? (
                /* DESKTOP VIEW */
                isLoginView ? (
                    <div className="desktop-login-wrapper">
                        <div className="card-clean" style={{ maxWidth: '440px', width: '100%', margin: '60px auto' }}>
                            <AuthScreens onSuccess={() => setActiveTab('home')} />
                        </div>
                    </div>
                ) : (
                    <DesktopLayout
                        activeTab={activeTab}
                        onSelectTab={setActiveTab}
                        userName={user?.name || 'Alexander Wright'}
                        userEmail={user?.email || 'alex.wright@apexbank.io'}
                        onLogout={logout}
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
                            setActiveTab(screenId);
                        }}
                    >
                        {isLoginView ? (
                            <AuthScreens onSuccess={() => setActiveTab('home')} />
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
                                    userName={user?.name || 'Alexander Wright'}
                                    userEmail={user?.email || 'alex.wright@apexbank.io'}
                                    onLogout={logout}
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
                            <AuthScreens onSuccess={() => setActiveTab('home')} />
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
                                    userName={user?.name || 'Alexander Wright'}
                                    userEmail={user?.email || 'alex.wright@apexbank.io'}
                                    onLogout={logout}
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

            {/* Global Security Modals */}
            <SessionExpiringModal />
            <ToastContainer />
        </div>
    );
};

export default App;