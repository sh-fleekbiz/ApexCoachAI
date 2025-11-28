import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { apiBaseUrl } from '../../services/index.js';
import { OnboardingTour } from '../../components/Onboarding/OnboardingTour.tsx';
import { useAuth } from '../../contexts/AuthContext.js';
import Settings from '../settings/Settings.tsx';

import styles from './Layout.module.css';

interface Chat {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Helper to detect mobile devices
  function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(
      navigator.userAgent
    );
  }

  // Check if user has completed onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
    if (!hasCompletedOnboarding) {
      // Wait for page to be fully loaded and stable
      function showTourWhenReady() {
        // Use longer delay on mobile devices
        const delay = isMobileDevice() ? 1200 : 500;
        setTimeout(() => {
          setShowOnboarding(true);
        }, delay);
      }
      if (document.readyState === 'complete') {
        showTourWhenReady();
      } else {
        window.addEventListener('load', showTourWhenReady, { once: true });
      }
    }
  }, []);

  // Fetch chats on mount
  useEffect(() => {
    fetchChats();
  }, []);

  // Listen for chat creation events to refresh the list
  useEffect(() => {
    const handleChatCreated = () => {
      fetchChats();
    };
    window.addEventListener('chat-created', handleChatCreated);
    return () => {
      window.removeEventListener('chat-created', handleChatCreated);
    };
  }, []);

  const fetchChats = async () => {
    setIsLoadingChats(true);
    try {
      const response = await fetch(`${apiBaseUrl}/chats`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setChats(data.chats);
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    } finally {
      setIsLoadingChats(false);
    }
  };

  const handleNewChat = () => {
    // Navigate to root without chatId to start a new chat
    navigate('/');
    // Refresh chat list after a short delay to allow new chat to be created
    setTimeout(() => {
      fetchChats();
    }, 500);
  };

  const handleChatClick = (chatId: number) => {
    // Navigate to chat with the chatId
    navigate(`/?chatId=${chatId}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  return (
    <div className={styles.appShell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>AC</div>
          <h2 className={styles.brandName}>Apex Coach AI</h2>
        </div>
        <button
          className={styles.newChatButton}
          type="button"
          aria-label="Start a new chat conversation"
          onClick={handleNewChat}
        >
          + New Chat
        </button>
        <nav className={styles.sidebarNav}>
          <div className={styles.navSection}>
            <h3 className={styles.navSectionTitle}>Chats</h3>
            {isLoadingChats ? (
              <div className={styles.loadingChats}>Loading...</div>
            ) : chats.length > 0 ? (
              <div className={styles.chatsList}>
                {chats.map((chat) => (
                  <button
                    key={chat.id}
                    className={styles.chatItem}
                    onClick={() => handleChatClick(chat.id)}
                    type="button"
                  >
                    {chat.title}
                  </button>
                ))}
              </div>
            ) : (
              <div className={styles.noChats}>No chats yet</div>
            )}
          </div>
          <div className={styles.navSection}>
            <h3 className={styles.navSectionTitle}>Settings</h3>
            <button
              className={styles.navSectionButton}
              onClick={() => navigate('/library')}
              type="button"
            >
              📚 Library
            </button>
            <button
              className={styles.navSectionButton}
              onClick={() => navigate('/settings')}
              type="button"
            >
              Profile & Preferences
            </button>
            <button
              className={styles.navSectionButton}
              onClick={() => setIsSettingsOpen(true)}
              type="button"
            >
              Data & Privacy
            </button>
            <button
              className={styles.navSectionButton}
              onClick={() => setShowOnboarding(true)}
              type="button"
            >
              Replay Tour
            </button>
          </div>
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name || user?.email}</span>
          </div>
          {user?.role === 'admin' && (
            <button
              className={styles.adminButton}
              onClick={() => navigate('/admin')}
              type="button"
            >
              ⚙️ Admin Panel
            </button>
          )}
          <button
            className={styles.logoutButton}
            onClick={handleLogout}
            type="button"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      {isSettingsOpen && <Settings onClose={() => setIsSettingsOpen(false)} />}
      {showOnboarding && (
        <OnboardingTour
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}
    </div>
  );
};

export default Layout;
