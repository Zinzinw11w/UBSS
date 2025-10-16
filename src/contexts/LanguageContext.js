import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navigation
    home: 'Home',
    market: 'Market',
    smartTrading: 'Smart trading',
    loan: 'Loan',
    account: 'Account',
    language: 'Language',
    
    // Market Page
    marketTitle: 'Market',
    forex: 'Forex',
    crypto: 'Crypto',
    stocks: 'Stocks',
    etf: 'ETF',
    futures: 'Futures',
    
    // Smart Trading Page
    smartTradingTitle: 'Smart trading',
    spotPrice: 'Spot price',
    chart: 'Chart',
    
    // Account Page
    accountTitle: 'Account',
    balance: 'Balance',
    totalBalance: 'Total Balance',
    availableBalance: 'Available Balance',
    pendingBalance: 'Pending Balance',
    
    // Loan Page
    loanTitle: 'Investment & Lending',
    borrowNow: 'Borrow now',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    
    // Footer
    products: 'Products',
    company: 'Company',
    policies: 'Policies',
    aboutUs: 'About Us',
    helpCenter: 'Help Center',
    termsConditions: 'Terms & Conditions',
    privacyPolicy: 'Privacy Policy',
    copyright: 'All rights reserved.',
    
    // Home Page
    heroTitle: 'Advanced Trading Platform',
    heroSubtitle: 'Experience the future of trading with AI-powered algorithms, real-time market data, and comprehensive investment solutions.',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    statsTitle: 'Trusted by Millions',
    featuresTitle: 'Why Choose UBS Tokenize?',
    servicesTitle: 'Our Services',
    
    // Hero Section
    heroDescription: 'Join millions of traders worldwide who trust UBS Tokenize for their trading needs. Our platform offers cutting-edge technology, real-time data, and expert support.',
    startTradingNow: 'Start Trading Now',
    viewMarkets: 'View Markets',
    
    // Stats Section
    activeUsers: 'Active Users',
    totalVolume: 'Total Volume',
    countries: 'Countries',
    satisfaction: 'Satisfaction Rate',
    
    // Features Section
    smartTradingFeature: 'Smart Trading',
    smartTradingDesc: 'Leverage AI-powered algorithms for optimal trading decisions.',
    investmentFeature: 'Investment & Lending',
    investmentDesc: 'Grow your assets with diverse investment options and flexible lending.',
    marketsFeature: 'Markets',
    marketsDesc: 'Access real-time data across various markets: crypto, forex, stocks, ETFs, futures.',
    securityFeature: 'Security',
    securityDesc: 'Bank-level security with advanced encryption and fraud protection.',
    supportFeature: '24/7 Support',
    supportDesc: 'Round-the-clock customer support from our expert team.',
    mobileFeature: 'Mobile Trading',
    mobileDesc: 'Trade anywhere with our intuitive mobile application.',
    
    // Services Section
    smartTradingService: 'Smart Trading',
    smartTradingServiceDesc: 'Leverage AI-powered algorithms for optimal trading decisions.',
    investmentService: 'Investment & Lending',
    investmentServiceDesc: 'Grow your assets with diverse investment options and flexible lending.',
    marketsService: 'Markets',
    marketsServiceDesc: 'Access real-time data across various markets: crypto, forex, stocks, ETFs, futures.',
    
    // Market Page
    marketSubtitle: 'Real-time market data across all asset classes',
    featuredMarkets: 'Featured Markets',
    marketTable: 'Market Data',
    loadingMarketData: 'Loading market data...',
    failedToLoad: 'Failed to load market data',
    
    // Account Page
    accountSubtitle: 'Manage your trading account and settings',
    accountSummary: 'Account Summary',
    orders: 'Orders',
    settings: 'Settings',
    verification: 'Account Verification',
    inviteFriends: 'Invite Friends',
    liveChat: 'Live Chat',
    notifications: 'Notifications',
    
    // Loan Page
    loanSubtitle: 'Flexible investment and lending solutions',
    loanAmount: 'Loan Amount',
    currency: 'Currency',
    loanTerm: 'Loan Term',
    interestRate: 'Interest Rate',
    monthlyPayment: 'Monthly Payment',
    
    // Trading Detail Page
    tradingOptions: 'Trading Options',
    investment: 'Investment',
    available: 'Available',
    fee: 'Fee',
    callUp: 'Call (Up)',
    putDown: 'Put (Down)',
    createPlan: 'Create a plan to trade!',
    smartTradingInfo: 'What is smart trading?',
    tradingStrategy: 'Trading Strategy',
    marketAnalysis: 'Market Analysis',
    riskWarning: 'Risk Warning',
    
    // Modals
    createPlanTitle: 'Create Trading Plan',
    amount: 'Amount',
    timeframe: 'Timeframe',
    amountLimit: 'Amount Limit',
    dailyYield: 'Daily Yield',
    product: 'Product',
    create: 'Create',
    faqTitle: 'Smart Trading FAQ',
    
    // Common UI
    name: 'Name',
    price: 'Price',
    change: 'Change',
    volume: 'Volume',
    high: 'High',
    low: 'Low',
    open: 'Open',
    buy: 'Buy',
    sell: 'Sell',
    watchlist: 'Watchlist',
    details: 'Details'
  },
  
  vi: {
    // Navigation
    home: 'Trang chủ',
    market: 'Thị trường',
    smartTrading: 'Giao dịch thông minh',
    loan: 'Cho vay',
    account: 'Tài khoản',
    language: 'Ngôn ngữ',
    
    // Market Page
    marketTitle: 'Thị trường',
    forex: 'Ngoại hối',
    crypto: 'Tiền điện tử',
    stocks: 'Cổ phiếu',
    etf: 'ETF',
    futures: 'Hợp đồng tương lai',
    
    // Smart Trading Page
    smartTradingTitle: 'Giao dịch thông minh',
    spotPrice: 'Giá giao ngay',
    chart: 'Biểu đồ',
    
    // Account Page
    accountTitle: 'Tài khoản',
    balance: 'Số dư',
    totalBalance: 'Tổng số dư',
    availableBalance: 'Số dư khả dụng',
    pendingBalance: 'Số dư chờ xử lý',
    
    // Loan Page
    loanTitle: 'Đầu tư & Cho vay',
    borrowNow: 'Vay ngay',
    
    // Common
    loading: 'Đang tải...',
    error: 'Lỗi',
    retry: 'Thử lại',
    close: 'Đóng',
    save: 'Lưu',
    cancel: 'Hủy',
    
    // Footer
    products: 'Sản phẩm',
    company: 'Công ty',
    policies: 'Chính sách',
    aboutUs: 'Về chúng tôi',
    helpCenter: 'Trung tâm trợ giúp',
    termsConditions: 'Điều khoản & Điều kiện',
    privacyPolicy: 'Chính sách bảo mật',
    copyright: 'Bảo lưu mọi quyền.',
    
    // Home Page
    heroTitle: 'Nền tảng giao dịch tiên tiến',
    heroSubtitle: 'Trải nghiệm tương lai của giao dịch với thuật toán AI, dữ liệu thị trường thời gian thực và giải pháp đầu tư toàn diện.',
    getStarted: 'Bắt đầu',
    learnMore: 'Tìm hiểu thêm',
    statsTitle: 'Được tin tưởng bởi hàng triệu người',
    featuresTitle: 'Tại sao chọn UBS Tokenize?',
    servicesTitle: 'Dịch vụ của chúng tôi',
    
    // Hero Section
    heroDescription: 'Tham gia cùng hàng triệu nhà giao dịch trên toàn thế giới tin tưởng UBS Tokenize cho nhu cầu giao dịch của họ. Nền tảng của chúng tôi cung cấp công nghệ tiên tiến, dữ liệu thời gian thực và hỗ trợ chuyên gia.',
    startTradingNow: 'Bắt đầu giao dịch ngay',
    viewMarkets: 'Xem thị trường',
    
    // Stats Section
    activeUsers: 'Người dùng hoạt động',
    totalVolume: 'Tổng khối lượng',
    countries: 'Quốc gia',
    satisfaction: 'Tỷ lệ hài lòng',
    
    // Features Section
    smartTradingFeature: 'Giao dịch thông minh',
    smartTradingDesc: 'Tận dụng thuật toán AI để đưa ra quyết định giao dịch tối ưu.',
    investmentFeature: 'Đầu tư & Cho vay',
    investmentDesc: 'Tăng trưởng tài sản với các lựa chọn đầu tư đa dạng và cho vay linh hoạt.',
    marketsFeature: 'Thị trường',
    marketsDesc: 'Truy cập dữ liệu thời gian thực trên các thị trường khác nhau: tiền điện tử, ngoại hối, cổ phiếu, ETF, hợp đồng tương lai.',
    securityFeature: 'Bảo mật',
    securityDesc: 'Bảo mật cấp ngân hàng với mã hóa tiên tiến và bảo vệ chống gian lận.',
    supportFeature: 'Hỗ trợ 24/7',
    supportDesc: 'Hỗ trợ khách hàng suốt ngày đêm từ đội ngũ chuyên gia của chúng tôi.',
    mobileFeature: 'Giao dịch di động',
    mobileDesc: 'Giao dịch mọi nơi với ứng dụng di động trực quan của chúng tôi.',
    
    // Services Section
    smartTradingService: 'Giao dịch thông minh',
    smartTradingServiceDesc: 'Tận dụng thuật toán AI để đưa ra quyết định giao dịch tối ưu.',
    investmentService: 'Đầu tư & Cho vay',
    investmentServiceDesc: 'Tăng trưởng tài sản với các lựa chọn đầu tư đa dạng và cho vay linh hoạt.',
    marketsService: 'Thị trường',
    marketsServiceDesc: 'Truy cập dữ liệu thời gian thực trên các thị trường khác nhau: tiền điện tử, ngoại hối, cổ phiếu, ETF, hợp đồng tương lai.',
    
    // Market Page
    marketSubtitle: 'Dữ liệu thị trường thời gian thực trên tất cả các loại tài sản',
    featuredMarkets: 'Thị trường nổi bật',
    marketTable: 'Dữ liệu thị trường',
    loadingMarketData: 'Đang tải dữ liệu thị trường...',
    failedToLoad: 'Không thể tải dữ liệu thị trường',
    
    // Account Page
    accountSubtitle: 'Quản lý tài khoản giao dịch và cài đặt của bạn',
    accountSummary: 'Tóm tắt tài khoản',
    orders: 'Lệnh',
    settings: 'Cài đặt',
    verification: 'Xác minh tài khoản',
    inviteFriends: 'Mời bạn bè',
    liveChat: 'Trò chuyện trực tiếp',
    notifications: 'Thông báo',
    
    // Loan Page
    loanSubtitle: 'Giải pháp đầu tư và cho vay linh hoạt',
    loanAmount: 'Số tiền vay',
    currency: 'Tiền tệ',
    loanTerm: 'Kỳ hạn vay',
    interestRate: 'Lãi suất',
    monthlyPayment: 'Thanh toán hàng tháng',
    
    // Trading Detail Page
    tradingOptions: 'Tùy chọn giao dịch',
    investment: 'Đầu tư',
    available: 'Có sẵn',
    fee: 'Phí',
    callUp: 'Mua (Lên)',
    putDown: 'Bán (Xuống)',
    createPlan: 'Tạo kế hoạch giao dịch!',
    smartTradingInfo: 'Giao dịch thông minh là gì?',
    tradingStrategy: 'Chiến lược giao dịch',
    marketAnalysis: 'Phân tích thị trường',
    riskWarning: 'Cảnh báo rủi ro',
    
    // Modals
    createPlanTitle: 'Tạo kế hoạch giao dịch',
    amount: 'Số tiền',
    timeframe: 'Khung thời gian',
    amountLimit: 'Giới hạn số tiền',
    dailyYield: 'Lợi nhuận hàng ngày',
    product: 'Sản phẩm',
    create: 'Tạo',
    faqTitle: 'Câu hỏi thường gặp về giao dịch thông minh',
    
    // Common UI
    name: 'Tên',
    price: 'Giá',
    change: 'Thay đổi',
    volume: 'Khối lượng',
    high: 'Cao',
    low: 'Thấp',
    open: 'Mở',
    buy: 'Mua',
    sell: 'Bán',
    watchlist: 'Danh sách theo dõi',
    details: 'Chi tiết'
  },
  
  ja: {
    // Navigation
    home: 'ホーム',
    market: 'マーケット',
    smartTrading: 'スマートトレーディング',
    loan: 'ローン',
    account: 'アカウント',
    language: '言語',
    
    // Market Page
    marketTitle: 'マーケット',
    forex: '外国為替',
    crypto: '暗号通貨',
    stocks: '株式',
    etf: 'ETF',
    futures: '先物',
    
    // Smart Trading Page
    smartTradingTitle: 'スマートトレーディング',
    spotPrice: 'スポット価格',
    chart: 'チャート',
    
    // Account Page
    accountTitle: 'アカウント',
    balance: '残高',
    totalBalance: '総残高',
    availableBalance: '利用可能残高',
    pendingBalance: '保留中残高',
    
    // Loan Page
    loanTitle: '投資・融資',
    borrowNow: '今すぐ借りる',
    
    // Common
    loading: '読み込み中...',
    error: 'エラー',
    retry: '再試行',
    close: '閉じる',
    save: '保存',
    cancel: 'キャンセル',
    
    // Footer
    products: '商品',
    company: '会社',
    policies: 'ポリシー',
    aboutUs: '私たちについて',
    helpCenter: 'ヘルプセンター',
    termsConditions: '利用規約',
    privacyPolicy: 'プライバシーポリシー',
    copyright: '全著作権所有.'
  },
  
  ko: {
    // Navigation
    home: '홈',
    market: '마켓',
    smartTrading: '스마트 트레이딩',
    loan: '대출',
    account: '계정',
    language: '언어',
    
    // Market Page
    marketTitle: '마켓',
    forex: '외환',
    crypto: '암호화폐',
    stocks: '주식',
    etf: 'ETF',
    futures: '선물',
    
    // Smart Trading Page
    smartTradingTitle: '스마트 트레이딩',
    spotPrice: '현물 가격',
    chart: '차트',
    
    // Account Page
    accountTitle: '계정',
    balance: '잔액',
    totalBalance: '총 잔액',
    availableBalance: '사용 가능 잔액',
    pendingBalance: '대기 중 잔액',
    
    // Loan Page
    loanTitle: '투자 및 대출',
    borrowNow: '지금 대출받기',
    
    // Common
    loading: '로딩 중...',
    error: '오류',
    retry: '다시 시도',
    close: '닫기',
    save: '저장',
    cancel: '취소',
    
    // Footer
    products: '상품',
    company: '회사',
    policies: '정책',
    aboutUs: '회사 소개',
    helpCenter: '도움말 센터',
    termsConditions: '이용약관',
    privacyPolicy: '개인정보처리방침',
    copyright: '모든 권리 보유.'
  },
  
  zh: {
    // Navigation
    home: '首页',
    market: '市场',
    smartTrading: '智能交易',
    loan: '贷款',
    account: '账户',
    language: '语言',
    
    // Market Page
    marketTitle: '市场',
    forex: '外汇',
    crypto: '加密货币',
    stocks: '股票',
    etf: 'ETF',
    futures: '期货',
    
    // Smart Trading Page
    smartTradingTitle: '智能交易',
    spotPrice: '现货价格',
    chart: '图表',
    
    // Account Page
    accountTitle: '账户',
    balance: '余额',
    totalBalance: '总余额',
    availableBalance: '可用余额',
    pendingBalance: '待处理余额',
    
    // Loan Page
    loanTitle: '投资与贷款',
    borrowNow: '立即借款',
    
    // Common
    loading: '加载中...',
    error: '错误',
    retry: '重试',
    close: '关闭',
    save: '保存',
    cancel: '取消',
    
    // Footer
    products: '产品',
    company: '公司',
    policies: '政策',
    aboutUs: '关于我们',
    helpCenter: '帮助中心',
    termsConditions: '条款和条件',
    privacyPolicy: '隐私政策',
    copyright: '版权所有.'
  },
  
  es: {
    // Navigation
    home: 'Inicio',
    market: 'Mercado',
    smartTrading: 'Trading inteligente',
    loan: 'Préstamo',
    account: 'Cuenta',
    language: 'Idioma',
    
    // Market Page
    marketTitle: 'Mercado',
    forex: 'Forex',
    crypto: 'Criptomonedas',
    stocks: 'Acciones',
    etf: 'ETF',
    futures: 'Futuros',
    
    // Smart Trading Page
    smartTradingTitle: 'Trading inteligente',
    spotPrice: 'Precio spot',
    chart: 'Gráfico',
    
    // Account Page
    accountTitle: 'Cuenta',
    balance: 'Saldo',
    totalBalance: 'Saldo total',
    availableBalance: 'Saldo disponible',
    pendingBalance: 'Saldo pendiente',
    
    // Loan Page
    loanTitle: 'Inversión y préstamos',
    borrowNow: 'Pedir préstamo',
    
    // Common
    loading: 'Cargando...',
    error: 'Error',
    retry: 'Reintentar',
    close: 'Cerrar',
    save: 'Guardar',
    cancel: 'Cancelar',
    
    // Footer
    products: 'Productos',
    company: 'Empresa',
    policies: 'Políticas',
    aboutUs: 'Acerca de nosotros',
    helpCenter: 'Centro de ayuda',
    termsConditions: 'Términos y condiciones',
    privacyPolicy: 'Política de privacidad',
    copyright: 'Todos los derechos reservados.'
  },
  
  fr: {
    // Navigation
    home: 'Accueil',
    market: 'Marché',
    smartTrading: 'Trading intelligent',
    loan: 'Prêt',
    account: 'Compte',
    language: 'Langue',
    
    // Market Page
    marketTitle: 'Marché',
    forex: 'Forex',
    crypto: 'Cryptomonnaies',
    stocks: 'Actions',
    etf: 'ETF',
    futures: 'Futurs',
    
    // Smart Trading Page
    smartTradingTitle: 'Trading intelligent',
    spotPrice: 'Prix au comptant',
    chart: 'Graphique',
    
    // Account Page
    accountTitle: 'Compte',
    balance: 'Solde',
    totalBalance: 'Solde total',
    availableBalance: 'Solde disponible',
    pendingBalance: 'Solde en attente',
    
    // Loan Page
    loanTitle: 'Investissement et prêts',
    borrowNow: 'Emprunter maintenant',
    
    // Common
    loading: 'Chargement...',
    error: 'Erreur',
    retry: 'Réessayer',
    close: 'Fermer',
    save: 'Enregistrer',
    cancel: 'Annuler',
    
    // Footer
    products: 'Produits',
    company: 'Entreprise',
    policies: 'Politiques',
    aboutUs: 'À propos de nous',
    helpCenter: 'Centre d\'aide',
    termsConditions: 'Termes et conditions',
    privacyPolicy: 'Politique de confidentialité',
    copyright: 'Tous droits réservés.'
  },
  
  de: {
    // Navigation
    home: 'Startseite',
    market: 'Markt',
    smartTrading: 'Intelligenter Handel',
    loan: 'Darlehen',
    account: 'Konto',
    language: 'Sprache',
    
    // Market Page
    marketTitle: 'Markt',
    forex: 'Forex',
    crypto: 'Kryptowährungen',
    stocks: 'Aktien',
    etf: 'ETF',
    futures: 'Terminkontrakte',
    
    // Smart Trading Page
    smartTradingTitle: 'Intelligenter Handel',
    spotPrice: 'Kassakurs',
    chart: 'Diagramm',
    
    // Account Page
    accountTitle: 'Konto',
    balance: 'Guthaben',
    totalBalance: 'Gesamtguthaben',
    availableBalance: 'Verfügbares Guthaben',
    pendingBalance: 'Ausstehendes Guthaben',
    
    // Loan Page
    loanTitle: 'Investition und Darlehen',
    borrowNow: 'Jetzt leihen',
    
    // Common
    loading: 'Laden...',
    error: 'Fehler',
    retry: 'Wiederholen',
    close: 'Schließen',
    save: 'Speichern',
    cancel: 'Abbrechen',
    
    // Footer
    products: 'Produkte',
    company: 'Unternehmen',
    policies: 'Richtlinien',
    aboutUs: 'Über uns',
    helpCenter: 'Hilfezentrum',
    termsConditions: 'Geschäftsbedingungen',
    privacyPolicy: 'Datenschutzrichtlinie',
    copyright: 'Alle Rechte vorbehalten.'
  },
  
  pt: {
    // Navigation
    home: 'Início',
    market: 'Mercado',
    smartTrading: 'Trading inteligente',
    loan: 'Empréstimo',
    account: 'Conta',
    language: 'Idioma',
    
    // Market Page
    marketTitle: 'Mercado',
    forex: 'Forex',
    crypto: 'Criptomoedas',
    stocks: 'Ações',
    etf: 'ETF',
    futures: 'Futuros',
    
    // Smart Trading Page
    smartTradingTitle: 'Trading inteligente',
    spotPrice: 'Preço à vista',
    chart: 'Gráfico',
    
    // Account Page
    accountTitle: 'Conta',
    balance: 'Saldo',
    totalBalance: 'Saldo total',
    availableBalance: 'Saldo disponível',
    pendingBalance: 'Saldo pendente',
    
    // Loan Page
    loanTitle: 'Investimento e empréstimos',
    borrowNow: 'Pegar empréstimo',
    
    // Common
    loading: 'Carregando...',
    error: 'Erro',
    retry: 'Tentar novamente',
    close: 'Fechar',
    save: 'Salvar',
    cancel: 'Cancelar',
    
    // Footer
    products: 'Produtos',
    company: 'Empresa',
    policies: 'Políticas',
    aboutUs: 'Sobre nós',
    helpCenter: 'Central de ajuda',
    termsConditions: 'Termos e condições',
    privacyPolicy: 'Política de privacidade',
    copyright: 'Todos os direitos reservados.'
  },
  
  ru: {
    // Navigation
    home: 'Главная',
    market: 'Рынок',
    smartTrading: 'Умная торговля',
    loan: 'Кредит',
    account: 'Аккаунт',
    language: 'Язык',
    
    // Market Page
    marketTitle: 'Рынок',
    forex: 'Форекс',
    crypto: 'Криптовалюты',
    stocks: 'Акции',
    etf: 'ETF',
    futures: 'Фьючерсы',
    
    // Smart Trading Page
    smartTradingTitle: 'Умная торговля',
    spotPrice: 'Спот цена',
    chart: 'График',
    
    // Account Page
    accountTitle: 'Аккаунт',
    balance: 'Баланс',
    totalBalance: 'Общий баланс',
    availableBalance: 'Доступный баланс',
    pendingBalance: 'Ожидающий баланс',
    
    // Loan Page
    loanTitle: 'Инвестиции и кредиты',
    borrowNow: 'Взять кредит',
    
    // Common
    loading: 'Загрузка...',
    error: 'Ошибка',
    retry: 'Повторить',
    close: 'Закрыть',
    save: 'Сохранить',
    cancel: 'Отмена',
    
    // Footer
    products: 'Продукты',
    company: 'Компания',
    policies: 'Политики',
    aboutUs: 'О нас',
    helpCenter: 'Центр помощи',
    termsConditions: 'Условия использования',
    privacyPolicy: 'Политика конфиденциальности',
    copyright: 'Все права защищены.'
  },
  
  th: {
    // Navigation
    home: 'หน้าแรก',
    market: 'ตลาด',
    smartTrading: 'การเทรดอัจฉริยะ',
    loan: 'เงินกู้',
    account: 'บัญชี',
    language: 'ภาษา',
    
    // Market Page
    marketTitle: 'ตลาด',
    forex: 'ฟอเร็กซ์',
    crypto: 'สกุลเงินดิจิทัล',
    stocks: 'หุ้น',
    etf: 'ETF',
    futures: 'ฟิวเจอร์ส',
    
    // Smart Trading Page
    smartTradingTitle: 'การเทรดอัจฉริยะ',
    spotPrice: 'ราคาสปอต',
    chart: 'กราฟ',
    
    // Account Page
    accountTitle: 'บัญชี',
    balance: 'ยอดเงิน',
    totalBalance: 'ยอดเงินรวม',
    availableBalance: 'ยอดเงินที่ใช้ได้',
    pendingBalance: 'ยอดเงินรอดำเนินการ',
    
    // Loan Page
    loanTitle: 'การลงทุนและเงินกู้',
    borrowNow: 'กู้เงินตอนนี้',
    
    // Common
    loading: 'กำลังโหลด...',
    error: 'ข้อผิดพลาด',
    retry: 'ลองใหม่',
    close: 'ปิด',
    save: 'บันทึก',
    cancel: 'ยกเลิก',
    
    // Footer
    products: 'ผลิตภัณฑ์',
    company: 'บริษัท',
    policies: 'นโยบาย',
    aboutUs: 'เกี่ยวกับเรา',
    helpCenter: 'ศูนย์ช่วยเหลือ',
    termsConditions: 'ข้อกำหนดและเงื่อนไข',
    privacyPolicy: 'นโยบายความเป็นส่วนตัว',
    copyright: 'สงวนลิขสิทธิ์.'
  },
  
  id: {
    // Navigation
    home: 'Beranda',
    market: 'Pasar',
    smartTrading: 'Trading pintar',
    loan: 'Pinjaman',
    account: 'Akun',
    language: 'Bahasa',
    
    // Market Page
    marketTitle: 'Pasar',
    forex: 'Forex',
    crypto: 'Kripto',
    stocks: 'Saham',
    etf: 'ETF',
    futures: 'Berjangka',
    
    // Smart Trading Page
    smartTradingTitle: 'Trading pintar',
    spotPrice: 'Harga spot',
    chart: 'Grafik',
    
    // Account Page
    accountTitle: 'Akun',
    balance: 'Saldo',
    totalBalance: 'Total saldo',
    availableBalance: 'Saldo tersedia',
    pendingBalance: 'Saldo tertunda',
    
    // Loan Page
    loanTitle: 'Investasi dan pinjaman',
    borrowNow: 'Pinjam sekarang',
    
    // Common
    loading: 'Memuat...',
    error: 'Kesalahan',
    retry: 'Coba lagi',
    close: 'Tutup',
    save: 'Simpan',
    cancel: 'Batal',
    
    // Footer
    products: 'Produk',
    company: 'Perusahaan',
    policies: 'Kebijakan',
    aboutUs: 'Tentang kami',
    helpCenter: 'Pusat bantuan',
    termsConditions: 'Syarat dan ketentuan',
    privacyPolicy: 'Kebijakan privasi',
    copyright: 'Semua hak dilindungi.'
  },
  
  ms: {
    // Navigation
    home: 'Laman utama',
    market: 'Pasaran',
    smartTrading: 'Perdagangan pintar',
    loan: 'Pinjaman',
    account: 'Akaun',
    language: 'Bahasa',
    
    // Market Page
    marketTitle: 'Pasaran',
    forex: 'Forex',
    crypto: 'Kripto',
    stocks: 'Saham',
    etf: 'ETF',
    futures: 'Hadapan',
    
    // Smart Trading Page
    smartTradingTitle: 'Perdagangan pintar',
    spotPrice: 'Harga spot',
    chart: 'Carta',
    
    // Account Page
    accountTitle: 'Akaun',
    balance: 'Baki',
    totalBalance: 'Jumlah baki',
    availableBalance: 'Baki tersedia',
    pendingBalance: 'Baki tertunda',
    
    // Loan Page
    loanTitle: 'Pelaburan dan pinjaman',
    borrowNow: 'Pinjam sekarang',
    
    // Common
    loading: 'Memuatkan...',
    error: 'Ralat',
    retry: 'Cuba lagi',
    close: 'Tutup',
    save: 'Simpan',
    cancel: 'Batal',
    
    // Footer
    products: 'Produk',
    company: 'Syarikat',
    policies: 'Dasar',
    aboutUs: 'Tentang kami',
    helpCenter: 'Pusat bantuan',
    termsConditions: 'Terma dan syarat',
    privacyPolicy: 'Dasar privasi',
    copyright: 'Hak cipta terpelihara.'
  }
};

const languageNames = {
  en: 'English',
  vi: 'Tiếng Việt',
  ja: '日本語',
  ko: '한국어',
  zh: '简体中文',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
  ru: 'Русский язык',
  th: 'ภาษาไทย',
  id: 'Indonesian',
  ms: 'Melayu'
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('selectedLanguage') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('selectedLanguage', currentLanguage);
  }, [currentLanguage]);

  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode);
  };

  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    languageNames,
    translations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
