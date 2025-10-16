import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import { LanguageProvider } from './contexts/LanguageContext';
import { WalletProvider } from './contexts/WalletContext';
import { DatabaseProvider } from './contexts/DatabaseContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Features from './components/Features';
import Services from './components/Services';
import Footer from './components/Footer';
import Account from './components/Account';
import Market from './components/Market';
import InviteFriends from './components/InviteFriends';
import HelpCenter from './components/HelpCenter';
import Loan from './components/Loan';
import TradingDetail from './components/TradingDetail';
import SmartTrading from './components/SmartTrading';
import SignMessageModal from './components/SignMessageModal';
import AdminPanel from './components/AdminPanel';
import AlertSystem from './components/AlertSystem';

function App() {
  return (
    <LanguageProvider>
      <WalletProvider>
        <DatabaseProvider>
          <Router>
          <div className="App">
          <Routes>
            <Route path="/" element={
              <>
                <Header />
                <Hero />
                <Stats />
                <Features />
                <Services />
                <Footer />
              </>
            } />
            <Route path="/market" element={
              <>
                <Header />
                <Market />
              </>
            } />
            <Route path="/smart-trading" element={
              <>
                <Header />
                <SmartTrading />
              </>
            } />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/account" element={
              <>
                <Header />
                <Account />
              </>
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
              <>
                <Header />
                <Loan />
              </>
            } />
            <Route path="/trading/:category/*" element={
              <>
                <Header />
                <TradingDetail />
              </>
            } />
                        </Routes>
                        <SignMessageModal />
                        <AlertSystem />
                      </div>
                    </Router>
                  </DatabaseProvider>
                </WalletProvider>
              </LanguageProvider>
            );
          }

          export default App;
