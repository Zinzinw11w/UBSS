import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import { LanguageProvider } from './contexts/LanguageContext';
import { WalletProvider } from './contexts/WalletContext';
import { DatabaseProvider } from './contexts/DatabaseContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Header from './components/Header';
import DesktopLanding from './components/DesktopLanding';
import MobileLanding from './components/MobileLanding';
import MobileMarket from './components/MobileMarket';
import MobileSmartTrading from './components/MobileSmartTrading';
import MobileLoan from './components/MobileLoan';
import MobileAccount from './components/MobileAccount';
import MobileNotifications from './components/MobileNotifications';
import Account from './components/Account';
import Market from './components/Market';
import InviteFriends from './components/InviteFriends';
import HelpCenter from './components/HelpCenter';
import Loan from './components/Loan';
import SmartTrading from './components/SmartTrading';
import SignMessageModal from './components/SignMessageModal';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import CreateAdminUser from './components/CreateAdminUser';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import AlertSystem from './components/AlertSystem';
import useIsMobile from './hooks/useIsMobile';

function App() {
  const isMobile = useIsMobile();
  return (
    <LanguageProvider>
      <WalletProvider>
        <DatabaseProvider>
          <NotificationProvider>
          <Router>
          <div className="App">
          <Routes>
            <Route path="/" element={isMobile ? <MobileLanding /> : <DesktopLanding />} />
            <Route path="/market" element={
              isMobile ? <MobileMarket /> : (
                <>
                  <Header />
                  <Market />
                </>
              )
            } />
            <Route path="/smart-trading" element={
              isMobile ? <MobileSmartTrading /> : (
                <>
                  <Header />
                  <SmartTrading />
                </>
              )
            } />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/create" element={<CreateAdminUser />} />
            <Route path="/admin" element={
              <ProtectedAdminRoute>
                <AdminPanel />
              </ProtectedAdminRoute>
            } />
            <Route path="/account" element={
              isMobile ? <MobileAccount /> : (
                <>
                  <Header />
                  <Account />
                </>
              )
            } />
            <Route path="/invite-friends" element={
              <>
                <Header />
                <InviteFriends />
              </>
            } />
            <Route path="/help-center" element={
              <>
                <Header />
                <HelpCenter />
              </>
            } />
            <Route path="/loan" element={
              isMobile ? <MobileLoan /> : (
                <>
                  <Header />
                  <Loan />
                </>
              )
            } />
            <Route path="/notifications" element={<MobileNotifications />} />
                        </Routes>
                        <SignMessageModal />
                        <AlertSystem />
                      </div>
                    </Router>
                  </NotificationProvider>
                </DatabaseProvider>
                </WalletProvider>
              </LanguageProvider>
            );
          }

          export default App;
