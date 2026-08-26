
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';

type Language = 'en' | 'hi';
const VALID_LANGUAGES: Language[] = ['en', 'hi'];


interface Translations {
  [key: string]: {
    [lang in Language]?: string;
  };
}

const interpolate = (text: string, params?: Record<string, string | number>): string => {
  if (!params) return text;
  let result = text;
  for (const key in params) {
    // Escape the key itself in case it contains special regex characters (good practice)
    const escapedKey = String(key).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Construct regex to match literal {key}, escaping the curly braces
    const regex = new RegExp(`\\{${escapedKey}\\}`, 'g');
    result = result.replace(regex, String(params[key]));
  }
  return result;
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translate: (key: string, params?: Record<string, string | number>, fallback?: string) => string;
}

const translations: Translations = {
  // App General
  appName: { en: 'Kisan Mitra', hi: 'किसान मित्र' },
  copyright: { en: '© {year} Kisan Mitra', hi: '© {year} किसान मित्र' },
  userProfile: { en: 'User Profile', hi: 'उपयोगकर्ता प्रोफ़ाइल' },
  // Sidebar Navigation
  navHome: { en: 'Home', hi: 'मुख्य पृष्ठ' },
  navPrices: { en: 'Crop Prices', hi: 'फसल कीमतें' },
  navAiAdvisor: { en: 'AI Advisor', hi: 'एआई सलाहकार' },
  navDashboard: { en: 'Dashboard', hi: 'डैशबोर्ड' },
  navMandis: { en: 'Mandis', hi: 'मंडियां' },
  navGovtSchemes: { en: 'Govt. Schemes', hi: 'सरकारी योजनाएँ' },
  navEducation: { en: "Education & Resources", hi: "शिक्षा और संसाधन" },
  navTransportEstimator: { en: "Transport Estimator", hi: "परिवहन अनुमानक" },
  Settings: { en: 'Settings', hi: 'सेटिंग्स'},
  navMarketplace: { en: "Marketplace", hi: "बाज़ार" },
  navDiseaseDetection: { en: "Disease Detection", hi: "रोग पहचान" },

  // Header
  appHeaderMobileTitle: { en: 'Kisan Mitra', hi: 'किसान मित्र' },
  homeTitle: { en: "Kisan Mitra Home", hi: "किसान मित्र मुख्य पृष्ठ" },
  // Theme Switcher
  theme: { en: 'Theme', hi: 'थीम' },
  lightTheme: { en: 'Light', hi: 'हल्का' },
  darkTheme: { en: 'Dark', hi: 'गहरा' },
  oceanicTheme: { en: 'Oceanic', hi: 'समुद्री' },
  desertTheme: { en: 'Desert Mirage', hi: 'रेगिस्तानी मृगतृष्णा' },
  systemTheme: { en: 'System', hi: 'सिस्टम' },
  // Language Switcher
  languageLabel: { en: 'Language', hi: 'भाषा' },
  english: { en: 'English', hi: 'अंग्रेज़ी' },
  hindi: { en: 'Hindi', hi: 'हिन्दी' },
  tamil: { en: 'Tamil', hi: 'तमिल' },
  punjabi: { en: 'Punjabi', hi: 'पंजाबी' },

  // General UI
  refresh: { en: "Refresh", hi: "ताज़ा करें" },
  loading: { en: "Loading...", hi: "लोड हो रहा है..." },
  error: { en: "Error", hi: "त्रुटि" },
  noDataAvailable: { en: "No Data Available", hi: "कोई डेटा उपलब्ध नहीं है" },
  tryRefreshing: { en: "Please try refreshing.", hi: "कृपया ताज़ा करने का प्रयास करें।" },
  selectPlaceholder: { en: "Select...", hi: "चुनें..." },
  readMoreButton: { en: "Read More", hi: "और पढ़ें" },
  exploreNowButton: { en: "Explore Now", hi: "अभी देखें" },
  getAdviceButton: { en: "Get Advice", hi: "सलाह लें" },
  findMandisButton: { en: "Find Mandis", hi: "मंडियां खोजें" },
  learnMoreButton: { en: "Learn More", hi: "और अधिक जानें" },
  allStates: { en: "All States", hi: "सभी राज्य" },
  allCrops: { en: "All Crops", hi: "सभी फसलें" },
  filterButton: { en: "Apply Filters", hi: "फ़िल्टर लागू करें" },
  resetFiltersButton: { en: "Reset Filters", hi: "फ़िल्टर रीसेट करें" },
  closeButton: { en: "Close", hi: "बंद करें"},

  // Home Page
  heroTitle: { en: "Welcome to Kisan Mitra", hi: "किसान मित्र में आपका स्वागत है" },
  heroSubtitle: { en: "Empowering Indian Farmers with Technology, Information, and Market Access.", hi: "प्रौद्योगिकी, सूचना और बाजार पहुंच के साथ भारतीय किसानों को सशक्त बनाना।" },
  heroAltText: { en: "Indian agriculture landscape", hi: "भारतीय कृषि परिदृश्य" },
  explorePricesButton: { en: "Explore Market Prices", hi: "बाजार मूल्य देखें" },
  viewSchemesButton: { en: "Schemes & Resources", hi: "योजनाएं और संसाधन" },
  keyFeaturesTitle: { en: "Our Key Features", hi: "हमारी मुख्य विशेषताएं" },
  featurePriceTrackingTitle: { en: "Real-time Price Tracking", hi: "वास्तविक समय मूल्य ट्रैकिंग" },
  featurePriceTrackingDesc: { en: "Access up-to-date crop prices from mandis across India.", hi: "पूरे भारत की मंडियों से नवीनतम फसल कीमतों तक पहुंचें।" },
  featureAIAdviceTitle: { en: "AI-Powered Advice", hi: "एआई-संचालित सलाह" },
  featureAIAdviceDesc: { en: "Get smart recommendations for selling your produce.", hi: "अपनी उपज बेचने के लिए स्मार्ट सिफारिशें प्राप्त करें।" },
  featureMandiLocatorTitle: { en: "Mandi Locator", hi: "मंडी लोकेटर" },
  featureMandiLocatorDesc: { en: "Find nearby agricultural markets with ease.", hi: "आसानी से आस-पास के कृषि बाजारों का पता लगाएं।" },
  featureEducationTitle: { en: "Knowledge Hub", hi: "ज्ञान केंद्र" },
  featureEducationDesc: { en: "Access guides, scheme details, and farming best practices.", hi: "गाइड, योजना विवरण और सर्वोत्तम कृषि पद्धतियों तक पहुंचें।" },
  govSchemesTitle: { en: "Government Initiatives for Farmers", hi: "किसानों के लिए सरकारी पहल" },
  schemePMKisanTitle: { en: "PM-KISAN Scheme", hi: "पीएम-किसान योजना" },
  schemePMKisanDesc: { en: "Direct income support to eligible farmer families.", hi: "पात्र किसान परिवारों को प्रत्यक्ष आय सहायता।" },
  schemeENAMTitle: { en: "e-NAM Platform", hi: "ई-नाम प्लेटफॉर्म" },
  schemeENAMDesc: { en: "Online trading for better price discovery of agricultural produce.", hi: "कृषि उपज की बेहतर कीमत खोज के लिए ऑनलाइन ट्रेडिंग।" },
  latestNewsTitle: { en: "Latest News & Announcements", hi: "नवीनतम समाचार और घोषणाएँ" },
  newsItem1Title: { en: "New MSP Rates Announced for Kharif Crops", hi: "खरीफ फसलों के लिए नए एमएसपी दरों की घोषणा" },
  newsItem1Summary: { en: "The government has approved an increase in the Minimum Support Prices (MSP) for all mandated Kharif crops for Marketing Season 2024-25.", hi: "सरकार ने विपणन सीजन 2024-25 के लिए सभी अनिवार्य खरीफ फसलों के लिए न्यूनतम समर्थन मूल्य (एमएसपी) में वृद्धि को मंजूरी दे दी है।" },
  newsItem2Title: { en: "Weather Advisory for Northern States", hi: "उत्तरी राज्यों के लिए मौसम सलाह" },
  newsItem2Summary: { en: "Farmers in northern India are advised to take necessary precautions due to expected heavy rainfall in the coming week.", hi: "उत्तरी भारत के किसानों को अगले सप्ताह में अपेक्षित भारी वर्षा के कारण आवश्यक सावधानी बरतने की सलाह दी जाती है।" },

  // PricesPage
  selectCropPlaceholder: { en: "Select crop", hi: "फसल चुनें" },
  refreshPricesSr: { en: "Refresh prices", hi: "कीमतें ताज़ा करें" },
  noPricesAvailableTitle: { en: "No Prices Available", hi: "कोई कीमत उपलब्ध नहीं है" },
  noPricesAvailableDesc: { en: "Could not fetch price data. Please try refreshing or select a different crop.", hi: "मूल्य डेटा प्राप्त नहीं हो सका। कृपया ताज़ा करने का प्रयास करें या कोई भिन्न फसल चुनें।" },
  varietyLabel: { en: "Variety:", hi: "किस्म:" },
  dateLabel: { en: "Date:", hi: "तारीख:" },
  rangeLabel: { en: "Range:", hi: "रेंज:" },

  // DashboardPage
  dashboardTitle: { en: "Price Fluctuation Dashboard", hi: "मूल्य उतार-चढ़ाव डैशबोर्ड" },
  selectCropPlaceholderDashboard: { en: "Select a crop", hi: "एक फसल चुनें" },
  refreshTrendsSr: { en: "Refresh trends", hi: "रुझान ताज़ा करें" },
  loadingPriceTrends: { en: "Loading Price Trends...", hi: "मूल्य रुझान लोड हो रहे हैं..." },
  fetchingHistoricalData: { en: "Fetching historical price data.", hi: "ऐतिहासिक मूल्य डेटा प्राप्त किया जा रहा है।" },

  // CropPriceChart
  chartLoadingPriceTrends: { en: "Loading Price Trends...", hi: "मूल्य रुझान लोड हो रहे हैं..." },
  chartFetchingHistoricalData: { en: "Fetching historical price data.", hi: "ऐतिहासिक मूल्य डेटा प्राप्त किया जा रहा है।" },
  chartNoPriceDataAvailable: { en: "No Price Data Available", hi: "कोई मूल्य डेटा उपलब्ध नहीं है" },
  chartCouldNotLoadTrends: { en: "Could not load price trends for {cropName}.", hi: "{cropName} के लिए मूल्य रुझान लोड नहीं हो सके।" },
  chartTryAnotherCrop: { en: "Please try selecting another crop or check back later.", hi: "कृपया दूसरी फसल चुनने का प्रयास करें या बाद में जांचें।" },
  chartPriceTrendsTitle: { en: "Price Trends: {cropName}", hi: "मूल्य रुझान: {cropName}" },
  chartPriceFluctuationsDesc: { en: "Fluctuations across different states over the last 12 months.", hi: "पिछले 12 महीनों में विभिन्न राज्यों में उतार-चढ़ाव।" },

  // LocatorPage
  locatorTitle: { en: "Mandi Locator", hi: "मंडी लोकेटर" },
  refreshMandis: { en: "Refresh Mandis", hi: "मंडियां ताज़ा करें" },
  noMandisFoundTitle: { en: "No Mandis Found", hi: "कोई मंडी नहीं मिली" },
  noMandisFoundDesc: { en: "Could not fetch mandi locations. Please try refreshing.", hi: "मंडी स्थानों को प्राप्त नहीं किया जा सका। कृपया ताज़ा करने का प्रयास करें।" },

  // GoogleMapComponent
  mapsApiErrorTitle: { en: "Google Maps API Error", hi: "गूगल मैप्स एपीआई त्रुटि" },
  mapsApiKeyMissing: { en: "Google Maps API key is missing. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env file.", hi: "गूगल मैप्स एपीआई कुंजी गायब है। कृपया अपनी .env फ़ाइल में NEXT_PUBLIC_GOOGLE_MAPS_API_KEY सेट करें।" },
  mapsApiKeyRestartNote: { en: "You may need to restart your development server after adding the key.", hi: "कुंजी जोड़ने के बाद आपको अपने डेवलपमेंट सर्वर को पुनरारंभ करने की आवश्यकता हो सकती है।" },

  // MandiInfoCard
  currentPricesLabel: { en: "Current Prices:", hi: "वर्तमान कीमतें:" },
  noCurrentPriceData: { en: "No current price data available.", hi: "कोई वर्तमान मूल्य डेटा उपलब्ध नहीं है।" },
  viewDetailsButton: { en: "View Details", hi: "विवरण देखें" },

  // RecommendationsPage
  recommendationsTitle: { en: "AI Powered Recommendations", hi: "एआई संचालित सिफारिशें" },

  // RecommendationClientForm
  aiAdvisorTitle: { en: "AI Selling Advisor", hi: "एआई बिक्री सलाहकार" },
  aiAdvisorDescription: { en: "Get AI-powered recommendations on when and where to sell your crops for maximum profit.", hi: "अपनी फसलों को अधिकतम लाभ के लिए कब और कहाँ बेचना है, इस पर एआई-संचालित सिफारिशें प्राप्त करें।" },
  cropLabel: { en: "Crop", hi: "फसल" },
  selectCropPlaceholderForm: { en: "Select a crop", hi: "एक फसल चुनें" },
  quantityLabel: { en: "Quantity (in Quintals)", hi: "मात्रा (क्विंटल में)" },
  quantityPlaceholder: { en: "e.g., 100", hi: "उदा., 100" },
  locationLabel: { en: "Your Location (State)", hi: "आपका स्थान (राज्य)" },
  selectStatePlaceholder: { en: "Select your state", hi: "अपना राज्य चुनें" },
  locationDescription: { en: "This helps in generating relevant suggestions.", hi: "यह प्रासंगिक सुझाव उत्पन्न करने में मदद करता है।" },
  historicalDataLabel: { en: "Historical Production Data", hi: "ऐतिहासिक उत्पादन डेटा" },
  histProdDataAutoText: { en: "For {crop} in {location}, detail past yields (e.g., X quintals/acre over last 3 seasons), average prices fetched (e.g., Y INR/quintal range), and any significant events (e.g., drought in 2021 reduced yield by Z%, pest attack on specific variety). Mention local storage practices if any.", hi: "{location} में {crop} के लिए, पिछली पैदावार का विवरण दें (उदा., पिछले 3 मौसमों में X क्विंटल/एकड़), प्राप्त औसत कीमतें (उदा., Y रुपये/क्विंटल रेंज), और कोई महत्वपूर्ण घटनाएं (उदा., 2021 में सूखे से उपज में Z% की कमी, विशिष्ट किस्म पर कीट हमला)। यदि कोई हो तो स्थानीय भंडारण प्रथाओं का उल्लेख करें।" },
  historicalDataDescStatic: { en: "Provide context like past yields, prices, and major farm events.", hi: "पिछली पैदावार, कीमतें और खेत की प्रमुख घटनाओं जैसा संदर्भ प्रदान करें।" },
  weatherDataLabel: { en: "Current Weather & Forecast Context", hi: "वर्तमान मौसम और पूर्वानुमान संदर्भ" },
  weatherDataAutoText: { en: "For {crop} in {location}, describe current weather (e.g., temperature range, recent rainfall in mm/inches) and upcoming forecasts (e.g., monsoon expected by X date, heatwave warning for Y days). How might this impact your {crop} quality or harvest time?", hi: "{location} में {crop} के लिए, वर्तमान मौसम का वर्णन करें (उदा., तापमान सीमा, हाल की वर्षा मिमी/इंच में) और आगामी पूर्वानुमान (उदा., X तारीख तक मानसून की उम्मीद, Y दिनों के लिए लू की चेतावनी)। यह आपकी {crop} की गुणवत्ता या कटाई के समय को कैसे प्रभावित कर सकता है?" },
  weatherDataDescStatic: { en: "Include local weather, rainfall, temperature trends, and forecasts.", hi: "स्थानीय मौसम, वर्षा, तापमान के रुझान और पूर्वानुमान शामिल करें।" },
  getRecommendationButton: { en: "Get Recommendation", hi: "सिफारिश प्राप्त करें" },
  generatingButton: { en: "Generating...", hi: "उत्पन्न हो रहा है..." },
  toastRecGeneratedTitle: { en: "Recommendation Generated!", hi: "सिफारिश उत्पन्न हुई!" },
  toastRecGeneratedDesc: { en: "AI advisor has provided selling insights.", hi: "एआई सलाहकार ने बिक्री संबंधी अंतर्दृष्टि प्रदान की है।" },
  toastErrorTitle: { en: "Error", hi: "त्रुटि" },
  toastErrorDesc: { en: "Could not generate recommendation: {errorMessage}", hi: "सिफारिश उत्पन्न नहीं की जा सकी: {errorMessage}" },
  formErrorOccurred: { en: "Failed to {action}: {errorMessage}", hi: "{action} में विफल: {errorMessage}" },
  aiRecommendationTitle: { en: "AI Recommendation", hi: "एआई सिफारिश" },
  suggestionLabel: { en: "Suggestion:", hi: "सुझाव:" },
  reasoningLabel: { en: "Reasoning:", hi: "तर्क:" },

  // Settings Page
  settingsTitle: { en: "Farmer Profile & Settings", hi: "किसान प्रोफ़ाइल और सेटिंग्स" },
  profileSetupTitle: { en: "Profile Setup", hi: "प्रोफ़ाइल सेटअप" },
  profileSetupDesc: { en: "Personalize your app experience.", hi: "अपने ऐप अनुभव को वैयक्तिकृत करें।" },
  locationLabelSettings: { en: "Your Primary Location", hi: "आपका प्राथमिक स्थान" },
  locationPlaceholderSettings: { en: "e.g., Patiala, Punjab", hi: "उदा., पटियाला, पंजाब" },
  locationHintSettings: { en: "Used for localized information and recommendations.", hi: "स्थानीय जानकारी और सिफारिशों के लिए उपयोग किया जाता है।" },
  primaryCropsLabel: { en: "Primary Crops You Grow", hi: "आपके द्वारा उगाई जाने वाली प्राथमिक फसलें" },
  primaryCropsPlaceholder: { en: "Select your main crops", hi: "अपनी मुख्य फसलें चुनें" },
  primaryCropsHint: { en: "Helps tailor content related to these crops.", hi: "इन फसलों से संबंधित सामग्री को अनुकूलित करने में मदद करता है।" },
  preferredMandisLabel: { en: "Preferred Mandis (Markets)", hi: "पसंदीदा मंडियां (बाजार)" },
  preferredMandisPlaceholder: { en: "Select your preferred mandis", hi: "अपनी पसंदीदा मंडियां चुनें" },
  preferredMandisHint: { en: "For quick access to their price data.", hi: "उनके मूल्य डेटा तक त्वरित पहुंच के लिए।" },
  saveProfileButton: { en: "Save Profile", hi: "प्रोफ़ाइल सहेजें" },
  savingProfileButton: { en: "Saving Profile...", hi: "प्रोफ़ाइल सहेजा जा रहा है..."},
  toastSettingsSavedTitle: { en: "Settings Saved", hi: "सेटिंग्स सहेजी गईं" },
  toastProfileSettingsSavedDesc: { en: "Your profile information has been updated.", hi: "आपकी प्रोफ़ाइल जानकारी अपडेट कर दी गई है।" },
  toastErrorFetchingProfile: { en: "Error fetching profile.", hi: "प्रोफ़ाइल लाने में त्रुटि।"},
  toastErrorSavingProfile: { en: "Error saving profile.", hi: "प्रोफ़ाइल सहेजने में त्रुटि।"},
  priceAlertsTitle: { en: "Price Alerts", hi: "मूल्य अलर्ट" },
  priceAlertsDesc: { en: "Get notified when crop prices reach your target.", hi: "फसल की कीमतें आपके लक्ष्य तक पहुंचने पर सूचित करें।" },
  enablePriceAlertsLabel: { en: "Enable Price Alerts", hi: "मूल्य अलर्ट सक्षम करें" },
  alertThresholdLabel: { en: "Alert Condition", hi: "अलर्ट शर्त" },
  alertThresholdPlaceholder: { en: "e.g., Wheat > 2300 in Punjab", hi: "उदा., पंजाब में गेहूं > 2300" },
  addAlertButton: { en: "Add Alert", hi: "अलर्ट जोड़ें" },
  currentAlertsLabel: { en: "Current Alerts", hi: "वर्तमान अलर्ट" },
  noActiveAlerts: { en: "No active alerts.", hi: "कोई सक्रिय अलर्ट नहीं।" },
  removeButton: { en: "Remove", hi: "हटाएं" },
  toastAlertAddedTitle: { en: "Alert Added", hi: "अलर्ट जोड़ा गया" },
  toastPriceAlertSetDesc: { en: "Your new price alert has been set.", hi: "आपका नया मूल्य अलर्ट सेट कर दिया गया है।" },
  toastAlertRemovedTitle: { en: "Alert Removed", hi: "अलर्ट हटाया गया" },
  toastPriceAlertRemovedDesc: { en: "The price alert has been removed.", hi: "मूल्य अलर्ट हटा दिया गया है।" },
  toastEnterAlertCondition: { en: "Please enter an alert condition.", hi: "कृपया एक अलर्ट शर्त दर्ज करें।" },
  languageSupportTitle: { en: "Language Support", hi: "भाषा समर्थन" },
  languageSupportDesc: { en: "Choose your preferred language for the app.", hi: "ऐप के लिए अपनी पसंदीदा भाषा चुनें।" },
  selectLanguageLabel: { en: "Select Language", hi: "भाषा चुनें" },
  selectLanguagePlaceholder: { en: "Choose language", hi: "भाषा चुनें" },
  toastLanguageChangedTitle: { en: "Language Changed", hi: "भाषा बदली गई" },
  toastLanguageChangedDesc: { en: "App language set to {lang}.", hi: "ऐप की भाषा {lang} पर सेट की गई।" },
  dataPreferencesTitle: { en: "Data Preferences", hi: "डेटा प्राथमिकताएँ" },
  dataPreferencesDesc: { en: "Manage data sources and refresh settings.", hi: "डेटा स्रोतों और रीफ्रेश सेटिंग्स का प्रबंधन करें।" },
  enableWeatherDataLabel: { en: "Include Weather Data in Analysis", hi: "विश्लेषण में मौसम डेटा शामिल करें" },
  apiRefreshFrequencyLabel: { en: "Data Refresh Frequency (minutes)", hi: "डेटा रीफ्रेश आवृत्ति (मिनट)" },
  apiRefreshFrequencyHint: {en: "How often to check for new data (e.g., prices).", hi: "कितनी बार नया डेटा (जैसे कीमतें) जांचना है।"},
  savePreferencesButton: { en: "Save Preferences", hi: "प्राथमिकताएं सहेजें" },
  savingPreferencesButton: { en: "Saving Preferences...", hi: "प्राथमिकताएँ सहेजी जा रही हैं..."},
  toastDataPreferencesSavedDesc: { en: "Your data preferences have been updated.", hi: "आपकी डेटा प्राथमिकताएं अपडेट कर दी गई हैं।" },
  toastErrorFetchingPrefs: { en: "Error fetching preferences.", hi: "प्राथमिकताएँ लाने में त्रुटि।"},
  toastErrorSavingPrefs: { en: "Error saving preferences.", hi: "प्राथमिकताएँ सहेजने में त्रुटि।"},
  feedbackFormTitle: { en: "Feedback & Suggestions", hi: "प्रतिक्रिया और सुझाव" },
  feedbackFormDesc: { en: "Help us improve Kisan Mitra.", hi: "किसान मित्र को बेहतर बनाने में हमारी मदद करें।" },
  yourFeedbackLabel: { en: "Your Feedback", hi: "आपकी प्रतिक्रिया" },
  feedbackPlaceholder: { en: "Tell us what you think or suggest new features...", hi: "हमें बताएं कि आप क्या सोचते हैं या नई सुविधाओं का सुझाव दें..." },
  submitFeedbackButton: { en: "Submit Feedback", hi: "प्रतिक्रिया जमा करें" },
  toastFeedbackSubmittedTitle: { en: "Feedback Submitted", hi: "प्रतिक्रिया जमा की गई" },
  toastFeedbackThanks: { en: "Thank you for your feedback!", hi: "आपकी प्रतिक्रिया के लिए धन्यवाद!" },
  toastEnterFeedback: { en: "Please enter your feedback before submitting.", hi: "कृपया जमा करने से पहले अपनी प्रतिक्रिया दर्ज करें।" },
  fetchingSettings: { en: "Fetching settings...", hi: "सेटिंग्स लाई जा रही हैं..."},
  errorFetchingProfileSettings: { en: "Error fetching profile settings. Using default values.", hi: "प्रोफ़ाइल सेटिंग्स लाने में त्रुटि। डिफ़ॉल्ट मानों का उपयोग किया जा रहा है।" },
  errorSavingProfileSettings: { en: "Error saving profile settings. Please try again.", hi: "प्रोफ़ाइल सेटिंग्स सहेजने में त्रुटि। कृपया पुनः प्रयास करें।" },
  errorFetchingDataPreferences: { en: "Error fetching data preferences. Using default values.", hi: "डेटा प्राथमिकताएँ लाने में त्रुटि। डिफ़ॉल्ट मानों का उपयोग किया जा रहा है।" },
  errorSavingDataPreferences: { en: "Error saving data preferences. Please try again.", hi: "डेटा प्राथमिकताएँ सहेजने में त्रुटि। कृपया पुनः प्रयास करें।" },
  fetchingProfile: { en: "Fetching profile...", hi: "प्रोफ़ाइल लाई जा रही है..." },
  errorFetchingProfileMessage: { en: "Could not fetch profile settings. Please try again later.", hi: "प्रोफ़ाइल सेटिंग्स नहीं लाई जा सकीं। कृपया बाद में पुनः प्रयास करें।" },
  errorSavingProfileMessage: { en: "Could not save profile settings. Please try again.", hi: "प्रोफ़ाइल सेटिंग्स सहेजी नहीं जा सकीं। कृपया पुनः प्रयास करें।" },
  fetchingPreferences: { en: "Fetching preferences...", hi: "प्राथमिकताएँ लाई जा रही हैं..." },
  errorFetchingPreferencesMessage: { en: "Could not fetch data preferences. Please try again later.", hi: "डेटा प्राथमिकताएँ नहीं लाई जा सकीं। कृपया बाद में पुनः प्रयास करें।" },
  errorSavingPreferencesMessage: { en: "Could not save data preferences. Please try again.", hi: "डेटा प्राथमिकताएँ सहेजी नहीं जा सकीं। कृपया पुनः प्रयास करें।" },


  // Education & Resources Page
  educationTitle: { en: "Education & Resources", hi: "शिक्षा और संसाधन" },
  guidesTitle: { en: "Guides & Tutorials", hi: "गाइड और ट्यूटोरियल" },
  guidesDesc: { en: "Learn how to interpret price trends, use the app effectively, and understand market dynamics.", hi: "मूल्य के रुझानों की व्याख्या करना सीखें, ऐप का प्रभावी ढंग से उपयोग करें और बाजार की गतिशीलता को समझें।" },
  sampleGuideTitle1: { en: "Understanding Price Fluctuations", hi: "मूल्य में उतार-चढ़ाव को समझना" },
  sampleGuideDesc1: { en: "Learn what factors influence crop prices and how to read market trends.", hi: "फसल की कीमतों को प्रभावित करने वाले कारकों और बाजार के रुझानों को कैसे पढ़ें, इसके बारे में जानें।" },
  sampleGuideTitle2: { en: "Maximizing Your Kisan Mitra App", hi: "किसान मित्र ऐप का अधिकतम लाभ उठाना" },
  sampleGuideDesc2: { en: "Tips and tricks to get the most out of the app's features.", hi: "ऐप की सुविधाओं का अधिकतम लाभ उठाने के लिए टिप्स और ट्रिक्स।" },
  viewGuideButton: { en: "View Guide", hi: "गाइड देखें" },
  schemesTitle: { en: "Government Schemes Spotlight", hi: "सरकारी योजनाएं स्पॉटलाइट" },
  schemesDesc: { en: "Discover relevant agricultural schemes and their benefits. Explore all schemes for detailed filtering.", hi: "प्रासंगिक कृषि योजनाओं और उनके लाभों की खोज करें। विस्तृत फ़िल्टरिंग के लिए सभी योजनाएँ देखें।" },
  exploreAllSchemesButton: { en: "Explore All Schemes", hi: "सभी योजनाएँ देखें"},
  sampleSchemeTitle1: { en: "PM-KISAN Samman Nidhi", hi: "पीएम-किसान सम्मान निधि" },
  sampleSchemeDesc1: { en: "Direct income support for small and marginal farmers across India.", hi: "पूरे भारत में छोटे और सीमांत किसानों के लिए प्रत्यक्ष आय सहायता।" },
  sampleSchemeTitle2: { en: "e-NAM (National Agriculture Market)", hi: "ई-नाम (राष्ट्रीय कृषि बाजार)" },
  sampleSchemeDesc2: { en: "Online trading platform for agricultural commodities aiming for better price discovery.", hi: "बेहतर मूल्य खोज के लक्ष्य के साथ कृषि वस्तुओं के लिए ऑनलाइन ट्रेडिंग प्लेटफॉर्म।" },
  faqTitle: { en: "Frequently Asked Questions", hi: "अक्सर पूछे जाने वाले प्रश्न" },
  faqDesc: { en: "Find answers to common questions about the app and agricultural markets.", hi: "ऐप और कृषि बाजारों के बारे में सामान्य प्रश्नों के उत्तर पाएं।" },
  faqQ1: { en: "How are mandi prices determined?", hi: "मंडी की कीमतें कैसे निर्धारित होती हैं?" },
  faqA1: { en: "Mandi prices are influenced by various factors including supply and demand, weather conditions, government policies, transportation costs, and quality of the produce. Local market dynamics also play a significant role.", hi: "मंडी की कीमतें आपूर्ति और मांग, मौसम की स्थिति, सरकारी नीतियों, परिवहन लागत और उपज की गुणवत्ता सहित विभिन्न कारकों से प्रभावित होती हैं। स्थानीय बाजार की गतिशीलता भी एक महत्वपूर्ण भूमिका निभाती है।" },
  faqQ2: { en: "How accurate are the AI recommendations?", hi: "एआई सिफारिशें कितनी सटीक हैं?" },
  faqA2: { en: "Our AI recommendations are based on historical data, market trends, and provided inputs. While they aim to be insightful, they should be used as a guide and not as definitive financial advice. Always consider multiple factors before making selling decisions.", hi: "हमारी एआई सिफारिशें ऐतिहासिक डेटा, बाजार के रुझान और प्रदान किए गए इनपुट पर आधारित हैं। जबकि वे अंतर्दृष्टिपूर्ण होने का लक्ष्य रखती हैं, उन्हें एक गाइड के रूप में इस्तेमाल किया जाना चाहिए, न कि निश्चित वित्तीय सलाह के रूप में। बेचने का निर्णय लेने से पहले हमेशा कई कारकों पर विचार करें।" },
  faqQ3: { en: "How often is price data updated?", hi: "मूल्य डेटा कितनी बार अपडेट किया जाता है?" },
  faqA3: { en: "Real-time price data is updated frequently throughout the day from various sources. Price trend data is typically based on daily or weekly averages.", hi: "वास्तविक समय मूल्य डेटा विभिन्न स्रोतों से दिन भर में अक्सर अपडेट किया जाता है। मूल्य प्रवृत्ति डेटा आमतौर पर दैनिक या साप्ताहिक औसत पर आधारित होता है।" },
  forumTitle: { en: "Community Forum", hi: "सामुदायिक मंच" },
  forumDesc: { en: "Connect with other farmers, share tips, ask questions, and stay updated with the latest discussions.", hi: "अन्य किसानों से जुड़ें, सुझाव साझा करें, प्रश्न पूछें और नवीनतम चर्चाओं से अपडेट रहें।" },
  forumPlaceholderText: { en: "Engage with the community on our X (formerly Twitter) page or other social channels. (Integration coming soon)", hi: "हमारे एक्स (पूर्व में ट्विटर) पेज या अन्य सोशल चैनलों पर समुदाय के साथ जुड़ें। (एकीकरण जल्द ही आ रहा है)" },
  visitForumButton: { en: "Visit our X Page", hi: "हमारे एक्स पेज पर जाएं" },

  agriMachineryTitle: { en: "Agricultural Machinery & Technology", hi: "कृषि मशीनरी और प्रौद्योगिकी" },
  agriMachineryDesc: { en: "Learn about modern farming equipment, subsidies, maintenance, and emerging technologies like drones and precision farming.", hi: "आधुनिक कृषि उपकरण, सब्सिडी, रखरखाव, और ड्रोन और सटीक खेती जैसी उभरती प्रौद्योगिकियों के बारे में जानें।" },
  agriMachinerySubTopic1: { en: "Choosing the right tractor and implements.", hi: "सही ट्रैक्टर और उपकरणों का चयन।" },
  agriMachinerySubTopic2: { en: "Government subsidies for machinery.", hi: "मशीनरी के लिए सरकारी सब्सिडी।" },
  agriMachinerySubTopic3: { en: "Basic maintenance of farm equipment.", hi: "कृषि उपकरणों का बुनियादी रखरखाव।" },
  agriMachinerySubTopic4: { en: "Introduction to precision agriculture.", hi: "सटीक खेती का परिचय।" },

  storageSolutionsTitle: { en: "Storage & Warehousing Solutions", hi: "भंडारण और वेयरहाउसिंग समाधान" },
  storageSolutionsDesc: { en: "Information on proper storage techniques to minimize post-harvest losses and access to warehousing facilities.", hi: "कटाई के बाद के नुकसान को कम करने और वेयरहाउसिंग सुविधाओं तक पहुंचने के लिए उचित भंडारण तकनीकों पर जानकारी।" },
  storageSolutionsSubTopic1: { en: "Best practices for grain & perishable storage.", hi: "अनाज और खराब होने वाली वस्तुओं के भंडारण के लिए सर्वोत्तम अभ्यास।" },
  storageSolutionsSubTopic2: { en: "Understanding warehouse receipt systems.", hi: "वेयरहाउस रसीद प्रणालियों को समझना।" },
  storageSolutionsSubTopic3: { en: "Schemes for cold storage and rural godowns.", hi: "कोल्ड स्टोरेज और ग्रामीण गोदामों के लिए योजनाएं।" },
  storageSolutionsSubTopic4: { en: "Preventing pest infestation in stored produce.", hi: "संग्रहीत उपज में कीट संक्रमण की रोकथाम।" },

  soilWaterConservationTitle: { en: "Soil & Water Conservation", hi: "मृदा और जल संरक्षण" },
  soilWaterConservationDesc: { en: "Discover methods to maintain soil health, improve water use efficiency, and promote sustainable farming practices.", hi: "मिट्टी के स्वास्थ्य को बनाए रखने, जल उपयोग दक्षता में सुधार करने और टिकाऊ कृषि पद्धतियों को बढ़ावा देने के तरीकों की खोज करें।" },
  soilWaterConservationSubTopic1: { en: "Soil testing and nutrient management.", hi: "मृदा परीक्षण और पोषक तत्व प्रबंधन।" },
  soilWaterConservationSubTopic2: { en: "Rainwater harvesting & micro-irrigation techniques.", hi: "वर्षा जल संचयन और सूक्ष्म सिंचाई तकनीकें।" },
  soilWaterConservationSubTopic3: { en: "Basics of organic farming.", hi: "जैविक खेती की मूल बातें।" },
  soilWaterConservationSubTopic4: { en: "Preventing soil erosion and land degradation.", hi: "मिट्टी के कटाव और भूमि क्षरण की रोकथाम।" },

  agriFinanceTitle: { en: "Agricultural Finance & Credit", hi: "कृषि वित्त और ऋण" },
  agriFinanceDesc: { en: "Information on accessing farm loans, Kisan Credit Cards (KCC), crop insurance, and managing farm finances.", hi: "कृषि ऋण, किसान क्रेडिट कार्ड (केसीसी), फसल बीमा, और कृषि वित्त के प्रबंधन पर जानकारी।" },
  agriFinanceSubTopic1: { en: "Understanding Kisan Credit Card (KCC).", hi: "किसान क्रेडिट कार्ड (केसीसी) को समझना।" },
  agriFinanceSubTopic2: { en: "How to apply for agricultural loans.", hi: "कृषि ऋण के लिए आवेदन कैसे करें।" },
  agriFinanceSubTopic3: { en: "Importance of crop insurance (PMFBY).", hi: "फसल बीमा का महत्व (पीएमएफबीवाई)।" },
  agriFinanceSubTopic4: { en: "Managing farm budgets and financial planning.", hi: "कृषि बजट और वित्तीय योजना का प्रबंधन।" },
  exploreFinancialSchemesButton: { en: "Explore Financial Schemes", hi: "वित्तीय योजनाएँ देखें" },

  // Transport Estimator Page
  transportEstimatorTitle: { en: "Transport Cost Estimator", hi: "परिवहन लागत अनुमानक" },
  estimatorFormTitle: { en: "Estimate Your Transport Costs", hi: "अपनी परिवहन लागत का अनुमान लगाएं" },
  estimatorFormDescription: { en: "Calculate potential transport costs and net profit for selling your crop.", hi: "अपनी फसल बेचने के लिए संभावित परिवहन लागत और शुद्ध लाभ की गणना करें।" },
  targetMandiLabel: { en: "Target Mandi", hi: "लक्ष्य मंडी" },
  selectMandiPlaceholder: { en: "Select target mandi", hi: "लक्ष्य मंडी चुनें" },
  vehicleTypeLabel: { en: "Vehicle Type", hi: "वाहन का प्रकार" },
  selectVehiclePlaceholder: { en: "Select vehicle type", hi: "वाहन का प्रकार चुनें" },
  calculateCostButton: { en: "Calculate Costs", hi: "लागत की गणना करें" },
  calculatingButton: { en: "Calculating...", hi: "गणना हो रही है..." },
  estimationResultsTitle: { en: "Estimation Results", hi: "अनुमान परिणाम" },
  estimatedDistanceLabel: { en: "Estimated Round Trip Distance", hi: "अनुमानित गोल यात्रा दूरी" },
  selectedVehicleLabel: { en: "Vehicle Selected", hi: "चयनित वाहन" },
  estimatedFuelCostLabel: { en: "Estimated Fuel Cost", hi: "अनुमानित ईंधन लागत" },
  estimatedOtherCostsLabel: { en: "Estimated Other Costs (Driver, Tolls etc.)", hi: "अनुमानित अन्य लागतें (ड्राइवर, टोल आदि)" },
  totalTransportCostLabel: { en: "Total Estimated Transport Cost", hi: "कुल अनुमानित परिवहन लागत" },
  estimatedMarketPriceLabel: { en: "Estimated Market Price for {cropName} (per Quintal)", hi: "{cropName} के लिए अनुमानित बाजार मूल्य (प्रति क्विंटल)" },
  totalEstimatedSaleValueLabel: { en: "Total Estimated Sale Value for {quantity} Quintals", hi: "{quantity} क्विंटल के लिए कुल अनुमानित बिक्री मूल्य" },
  estimatedNetProfitLabel: { en: "Estimated Net Profit", hi: "अनुमानित शुद्ध लाभ" },
  disclaimerLabel: { en: "Disclaimer:", hi: "अस्वीकरण:" },
  disclaimerText: { en: "This is a simplified estimation. Actual costs and prices may vary. Always verify with multiple sources.", hi: "यह एक सरलीकृत अनुमान है। वास्तविक लागत और कीमतें भिन्न हो सकती हैं। हमेशा कई स्रोतों से सत्यापित करें।" },
  noMarketPriceFound: { en: "Could not fetch a market price for the selected crop. Net profit cannot be calculated.", hi: "चयनित फसल के लिए बाजार मूल्य प्राप्त नहीं किया जा सका। शुद्ध लाभ की गणना नहीं की जा सकती।" },
  vehicleTractor: { en: "Tractor", hi: "ट्रैक्टर" },
  vehicleSmallTruck: { en: "Small Truck", hi: "छोटा ट्रक" },
  vehicleLargeTruck: { en: "Large Truck", hi: "बड़ा ट्रक" },
  mandiNotSelectedError: { en: "Please select a target mandi.", hi: "कृपया एक लक्ष्य मंडी चुनें।" },
  cropNotSelectedError: { en: "Please select a crop.", hi: "कृपया एक फसल चुनें।" },
  quantityNotEnteredError: { en: "Please enter crop quantity.", hi: "कृपया फसल की मात्रा दर्ज करें।" },
  locationNotSelectedError: { en: "Please select your location.", hi: "कृपया अपना स्थान चुनें।" },
  vehicleNotSelectedError: { en: "Please select a vehicle type.", hi: "कृपया एक वाहन प्रकार चुनें।" },

  // Schemes Page
  schemesPageTitle: { en: "Government Schemes for Farmers", hi: "किसानों के लिए सरकारी योजनाएँ" },
  filterSchemesTitle: { en: "Filter Schemes", hi: "योजनाओं को फ़िल्टर करें" },
  filterSchemesDesc: { en: "Refine the list of schemes based on your criteria.", hi: "अपनी मानदंडों के आधार पर योजनाओं की सूची को परिष्कृत करें।" },
  filterByStateLabel: { en: "Filter by State", hi: "राज्य द्वारा फ़िल्टर करें" },
  filterByCropLabel: { en: "Filter by Relevant Crop", hi: "संबंधित फसल द्वारा फ़िल्टर करें" },
  filterByKeywordsLabel: { en: "Filter by Keywords", hi: "कीवर्ड द्वारा फ़िल्टर करें" },
  keywordsPlaceholder: { en: "e.g., subsidy, loan, insurance", hi: "उदा., सब्सिडी, ऋण, बीमा" },
  noSchemesFoundTitle: { en: "No Schemes Found", hi: "कोई योजना नहीं मिली" },
  noSchemesFoundDesc: { en: "No schemes match your current filter criteria. Try adjusting your filters.", hi: "कोई भी योजना आपके वर्तमान फ़िल्टर मानदंडों से मेल नहीं खाती। अपने फ़िल्टर समायोजित करने का प्रयास करें।" },
  schemeCardEligibilityTitle: { en: "Eligibility Criteria", hi: "पात्रता मापदंड" },
  schemeCardBenefitsTitle: { en: "Benefits", hi: "लाभ" },
  schemeCardHowToApplyTitle: { en: "How to Apply", hi: "आवेदन कैसे करें" },
  visitSchemeWebsiteButton: { en: "Visit Official Website", hi: "आधिकारिक वेबसाइट पर जाएं" },
  detailedDescriptionKey: { en: "Detailed Description", hi: "विस्तृत विवरण"},

  schemePMKisanTitleFull: { en: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)", hi: "प्रधानमंत्री किसान सम्मान निधि (पीएम-किसान)" },
  schemePMKisanShortDesc: { en: "Provides income support to all landholding farmer families.", hi: "सभी भूमिधारक किसान परिवारों को आय सहायता प्रदान करता है।" },
  schemePMKisanDetailedDesc: { en: "An initiative by the Government of India in which all eligible landholding farmer families get income support of ₹6,000 per year in three equal installments. The scheme aims to supplement the financial needs of the farmers in procuring various inputs related to agriculture and allied activities as well as domestic needs.", hi: "भारत सरकार की एक पहल जिसमें सभी पात्र भूमिधारक किसान परिवारों को तीन समान किस्तों में प्रति वर्ष ₹6,000 की आय सहायता मिलती है। इस योजना का उद्देश्य कृषि और संबद्ध गतिविधियों के साथ-साथ घरेलू जरूरतों से संबंधित विभिन्न आदानों की खरीद में किसानों की वित्तीय जरूरतों को पूरा करना है।" },
  pmKisanEligibility1: { en: "Small and marginal farmer families with combined landholding/ownership of up to 2 hectares.", hi: "संयुक्त भूमि धारण/स्वामित्व 2 हेक्टेयर तक वाले छोटे और सीमांत किसान परिवार।" },
  pmKisanEligibility2: { en: "Excludes institutional landholders, farmer families holding constitutional posts, present or retired government employees (certain categories), income tax payers, and professionals like doctors, engineers, lawyers (subject to criteria).", hi: "संस्थागत भूमिधारकों, संवैधानिक पदों पर आसीन किसान परिवारों, वर्तमान या सेवानिवृत्त सरकारी कर्मचारियों (कुछ श्रेणियां), आयकर दाताओं, और डॉक्टरों, इंजीनियरों, वकीलों जैसे पेशेवरों (मानदंडों के अधीन) को शामिल नहीं करता है।" },
  pmKisanEligibility3: { en: "Aadhaar linked bank account is mandatory for Direct Benefit Transfer (DBT).", hi: "प्रत्यक्ष लाभ हस्तांतरण (डीबीटी) के लिए आधार से जुड़ा बैंक खाता अनिवार्य है।" },
  pmKisanBenefit1: { en: "Financial assistance of ₹6,000 per year per eligible family.", hi: "प्रति पात्र परिवार प्रति वर्ष ₹6,000 की वित्तीय सहायता।" },
  pmKisanBenefit2: { en: "Paid in three equal installments of ₹2,000 directly into the bank accounts.", hi: "₹2,000 की तीन समान किस्तों में सीधे बैंक खातों में भुगतान किया जाता है।" },
  pmKisanHowToApply: { en: "Farmers can register through the official PM-KISAN portal (pmkisan.gov.in), through Common Service Centres (CSCs), or through the state-designated local revenue officer/village patwari. Requires Aadhaar card, landholding papers, and bank account details.", hi: "किसान आधिकारिक पीएम-किसान पोर्टल (pmkisan.gov.in) के माध्यम से, कॉमन सर्विस सेंटर (सीएससी) के माध्यम से, या राज्य-नामित स्थानीय राजस्व अधिकारी/ग्राम पटवारी के माध्यम से पंजीकरण कर सकते हैं। आधार कार्ड, भूमि धारण पत्र और बैंक खाते का विवरण आवश्यक है।" },

  schemeENAMTitleFull: { en: "National Agriculture Market (e-NAM)", hi: "राष्ट्रीय कृषि बाजार (ई-नाम)" },
  schemeENAMShortDesc: { en: "Online trading platform for agricultural commodities connecting APMC mandis.", hi: "एपीएमसी मंडियों को जोड़ने वाला कृषि जिंसों के लिए ऑनलाइन ट्रेडिंग प्लेटफॉर्म।" },
  schemeENAMDetailedDesc: { en: "e-NAM is a pan-India electronic trading portal which networks the existing APMC mandis to create a unified national market for agricultural commodities. It aims to provide better price discovery through transparent auction processes and access to a wider market.", hi: "ई-नाम एक अखिल भारतीय इलेक्ट्रॉनिक ट्रेडिंग पोर्टल है जो कृषि जिंसों के लिए एक एकीकृत राष्ट्रीय बाजार बनाने के लिए मौजूदा एपीएमसी मंडियों को नेटवर्क करता है। इसका उद्देश्य पारदर्शी नीलामी प्रक्रियाओं और व्यापक बाजार तक पहुंच के माध्यम से बेहतर मूल्य खोज प्रदान करना है।" },
  eNAMEligibility1: { en: "Farmers, traders, Farmer Producer Organizations (FPOs), and buyers registered with e-NAM enabled mandis.", hi: "ई-नाम सक्षम मंडियों के साथ पंजीकृत किसान, व्यापारी, किसान उत्पादक संगठन (एफपीओ), और खरीदार।" },
  eNAMEligibility2: { en: "Requires KYC compliance for registration on the portal or at the mandi.", hi: "पोर्टल पर या मंडी में पंजीकरण के लिए केवाईसी अनुपालन की आवश्यकता है।" },
  eNAMBenefit1: { en: "Transparent online bidding for better price discovery.", hi: "बेहतर मूल्य खोज के लिए पारदर्शी ऑनलाइन बोली।" },
  eNAMBenefit2: { en: "Access to a larger number of buyers, potentially increasing competition and prices.", hi: "बड़ी संख्या में खरीदारों तक पहुंच, संभावित रूप से प्रतिस्पर्धा और कीमतों में वृद्धि।" },
  eNAMBenefit3: { en: "Real-time price information and reduced information asymmetry. Facilitates direct payment.", hi: "वास्तविक समय मूल्य जानकारी और कम सूचना विषमता। प्रत्यक्ष भुगतान की सुविधा देता है।" },
  eNAMHowToApply: { en: "Farmers can register on the e-NAM portal (enam.gov.in) or directly at e-NAM integrated mandis. Registration requires details like bank account, Aadhaar, and mobile number. Traders require an APMC license.", hi: "किसान ई-नाम पोर्टल (enam.gov.in) पर या सीधे ई-नाम एकीकृत मंडियों में पंजीकरण कर सकते हैं। पंजीकरण के लिए बैंक खाता, आधार और मोबाइल नंबर जैसे विवरण आवश्यक हैं। व्यापारियों को एपीएमसी लाइसेंस की आवश्यकता होती है।" },

  schemePMFBYTitleFull: { en: "Pradhan Mantri Fasal Bima Yojana (PMFBY)", hi: "प्रधानमंत्री फसल बीमा योजना (पीएमएफबीवाई)" },
  schemePMFBYShortDesc: { en: "Crop insurance scheme providing financial support against yield losses due to unforeseen events.", hi: "अप्रत्याशित घटनाओं के कारण उपज हानि के खिलाफ वित्तीय सहायता प्रदान करने वाली फसल बीमा योजना।" },
  schemePMFBYDetailedDesc: { en: "PMFBY provides a comprehensive insurance cover against failure of the crop thus helping in stabilising the income of the farmers and encouraging them to adopt innovative and modern agricultural practices. It covers risks like drought, flood, inundation, pests and diseases, hailstorm, landslide, fire, etc.", hi: "पीएमएफबीवाई फसल की विफलता के खिलाफ एक व्यापक बीमा कवर प्रदान करता है जिससे किसानों की आय को स्थिर करने में मदद मिलती है और उन्हें नवीन और आधुनिक कृषि पद्धतियों को अपनाने के लिए प्रोत्साहित किया जाता है। यह सूखा, बाढ़, जलभराव, कीट और रोग, ओलावृष्टि, भूस्खलन, आग आदि जैसे जोखिमों को कवर करता है।" },
  pmfbyEligibility1: { en: "All farmers including sharecroppers and tenant farmers growing notified crops in notified areas are eligible.", hi: "अधिसूचित क्षेत्रों में अधिसूचित फसलें उगाने वाले बटाईदार और काश्तकार किसानों सहित सभी किसान पात्र हैं।" },
  pmfbyEligibility2: { en: "Enrollment is compulsory for loanee farmers availing seasonal agricultural operation loans (crop loans/KCC) for notified crops.", hi: "अधिसूचित फसलों के लिए मौसमी कृषि संचालन ऋण (फसल ऋण/केसीसी) प्राप्त करने वाले ऋणी किसानों के लिए नामांकन अनिवार्य है।" },
  pmfbyEligibility3: { en: "Voluntary for non-loanee farmers. They can enroll through banks, insurance companies, or the National Crop Insurance Portal.", hi: "गैर-ऋणी किसानों के लिए स्वैच्छिक। वे बैंकों, बीमा कंपनियों या राष्ट्रीय फसल बीमा पोर्टल के माध्यम से नामांकन कर सकते हैं।" },
  pmfbyBenefit1: { en: "Provides financial support to farmers suffering crop loss/damage arising out of unforeseen events.", hi: "अप्रत्याशित घटनाओं से उत्पन्न फसल हानि/क्षति से पीड़ित किसानों को वित्तीय सहायता प्रदान करता है।" },
  pmfbyBenefit2: { en: "Uniform premium rates for farmers: 2% for Kharif crops, 1.5% for Rabi crops, and 5% for annual commercial/horticultural crops.", hi: "किसानों के लिए समान प्रीमियम दरें: खरीफ फसलों के लिए 2%, रबी फसलों के लिए 1.5%, और वार्षिक वाणिज्यिक/बागवानी फसलों के लिए 5%।" },
  pmfbyHowToApply: { en: "Contact nearest bank branch, Primary Agricultural Credit Society (PACS), Common Service Centre (CSC), or an authorized insurance company. Applications can also be submitted online via the National Crop Insurance Portal (NCIP - pmfby.gov.in). Required documents typically include land records, sowing declaration, and bank details.", hi: "निकटतम बैंक शाखा, प्राथमिक कृषि ऋण समिति (PACS), कॉमन सर्विस सेंटर (CSC), या एक अधिकृत बीमा कंपनी से संपर्क करें। राष्ट्रीय फसल बीमा पोर्टल (NCIP - pmfby.gov.in) के माध्यम से भी ऑनलाइन आवेदन जमा किए जा सकते हैं। आवश्यक दस्तावेजों में आमतौर पर भूमि रिकॉर्ड, बुवाई घोषणा और बैंक विवरण शामिल होते हैं।" },

  schemeSoilHealthCardTitleFull: { en: "Soil Health Card Scheme", hi: "मृदा स्वास्थ्य कार्ड योजना" },
  schemeSoilHealthCardShortDesc: { en: "Provides farmers with soil nutrient status and recommendations for balanced fertilizer use.", hi: "किसानों को मिट्टी के पोषक तत्वों की स्थिति और संतुलित उर्वरक उपयोग के लिए सिफारिशें प्रदान करता है।" },
  schemeSoilHealthCardDetailedDesc: { en: "This scheme aims to issue Soil Health Cards to farmers every 2 years. These cards provide information on the nutrient status of their soil along with recommendations on the appropriate dosage of nutrients to be applied for improving soil health and fertility, thereby enhancing crop productivity.", hi: "इस योजना का उद्देश्य हर 2 साल में किसानों को मृदा स्वास्थ्य कार्ड जारी करना है। ये कार्ड उनकी मिट्टी की पोषक तत्वों की स्थिति के बारे में जानकारी प्रदान करते हैं और साथ ही मिट्टी के स्वास्थ्य और उर्वरता में सुधार के लिए लागू किए जाने वाले पोषक तत्वों की उचित खुराक पर सिफारिशें भी देते हैं, जिससे फसल उत्पादकता बढ़ती है।" },
  soilHealthCardEligibility1: { en: "All farmers across India are eligible to receive a Soil Health Card for their landholdings.", hi: "पूरे भारत में सभी किसान अपनी भूमि के लिए मृदा स्वास्थ्य कार्ड प्राप्त करने के पात्र हैं।" },
  soilHealthCardEligibility2: { en: "Soil samples are collected by state agriculture departments or designated agencies from a grid of 2.5 ha in irrigated areas and 10 ha in rain-fed areas.", hi: "राज्य कृषि विभागों या नामित एजेंसियों द्वारा सिंचित क्षेत्रों में 2.5 हेक्टेयर और वर्षा आधारित क्षेत्रों में 10 हेक्टेयर के ग्रिड से मिट्टी के नमूने एकत्र किए जाते हैं।" },
  soilHealthCardBenefit1: { en: "Provides a report on 12 soil parameters (N, P, K, S, Zn, Fe, Cu, Mn, B) and recommendations for fertilizer and micronutrient application.", hi: "12 मिट्टी मापदंडों (एन, पी, के, एस, जेडएन, एफई, सीयू, एमएन, बी) पर एक रिपोर्ट और उर्वरक और सूक्ष्म पोषक तत्वों के आवेदन के लिए सिफारिशें प्रदान करता है।" },
  soilHealthCardBenefit2: { en: "Promotes balanced and judicious use of fertilizers, reducing input costs and environmental impact.", hi: "उर्वरकों के संतुलित और विवेकपूर्ण उपयोग को बढ़ावा देता है, इनपुट लागत और पर्यावरणीय प्रभाव को कम करता है।" },
  soilHealthCardBenefit3: { en: "Aids in improving soil health over time, leading to increased crop yields and better farm income.", hi: "समय के साथ मिट्टी के स्वास्थ्य में सुधार करने में सहायता करता है, जिससे फसल की पैदावार बढ़ती है और खेत की आय बेहतर होती है।" },
  soilHealthCardHowToApply: { en: "Farmers generally do not need to apply directly. State Governments collect soil samples through their agriculture department staff or outsourced agencies. The samples are tested in soil testing labs, and the Soil Health Card is then generated and distributed to the farmers.", hi: "किसानों को आमतौर पर सीधे आवेदन करने की आवश्यकता नहीं होती है। राज्य सरकारें अपने कृषि विभाग के कर्मचारियों या आउटसोर्स एजेंसियों के माध्यम से मिट्टी के नमूने एकत्र करती हैं। नमूनों का मिट्टी परीक्षण प्रयोगशालाओं में परीक्षण किया जाता है, और फिर मृदा स्वास्थ्य कार्ड तैयार कर किसानों को वितरित किया जाता है।" },

  schemeComingSoonDesc: { en: "Detailed information about this scheme will be available soon. Please check the official government portals for the most up-to-date information.", hi: "इस योजना के बारे में विस्तृत जानकारी जल्द ही उपलब्ध होगी। नवीनतम जानकारी के लिए कृपया आधिकारिक सरकारी पोर्टल देखें।" },
  schemeGenericEligibility: { en: "Refer to official scheme documents for specific eligibility criteria.", hi: "विशिष्ट पात्रता मानदंडों के लिए आधिकारिक योजना दस्तावेजों का संदर्भ लें।" },
  schemeGenericBenefit: { en: "Benefits vary based on the scheme's objectives. Refer to official guidelines.", hi: "योजना के उद्देश्यों के आधार पर लाभ भिन्न होते हैं। आधिकारिक दिशानिर्देशों का संदर्भ लें।" },
  schemeGenericHowToApply: { en: "Application process details are available on the respective scheme's official website.", hi: "आवेदन प्रक्रिया का विवरण संबंधित योजना की आधिकारिक वेबसाइट पर उपलब्ध है।" },

  schemeKCCTitle: { en: "Kisan Credit Card (KCC)", hi: "किसान क्रेडिट कार्ड (केसीसी)" },
  schemeKCCShortDesc: { en: "Provides short-term formal credit to farmers for cultivation and other needs.", hi: "किसानों को खेती और अन्य जरूरतों के लिए अल्पकालिक औपचारिक ऋण प्रदान करता है।" },
  schemePMKSYTitle: { en: "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)", hi: "प्रधानमंत्री कृषि सिंचाई योजना (पीएमकेएसवाई)" },
  schemePMKSYShortDesc: { en: "Aims to enhance water use efficiency through micro-irrigation and other measures.", hi: "सूक्ष्म सिंचाई और अन्य उपायों के माध्यम से जल उपयोग दक्षता बढ़ाने का लक्ष्य है।" },
  schemeMGNREGAAgriTitle: { en: "MGNREGA for Agriculture", hi: "कृषि के लिए मनरेगा" },
  schemeMGNREGAAgriShortDesc: { en: "Utilizes MGNREGA for creating agriculture-related rural assets and providing wage employment.", hi: "कृषि से संबंधित ग्रामीण संपत्ति बनाने और मजदूरी रोजगार प्रदान करने के लिए मनरेगा का उपयोग करता है।" },
  schemeNFSMLTitle: { en: "National Food Security Mission (NFSM)", hi: "राष्ट्रीय खाद्य सुरक्षा मिशन (एनएफएसएम)" },
  schemeNFSMLShortDesc: { en: "Aims to increase production of rice, wheat, pulses, and coarse cereals through area expansion and productivity enhancement.", hi: "क्षेत्र विस्तार और उत्पादकता वृद्धि के माध्यम से चावल, गेहूं, दालों और मोटे अनाज का उत्पादन बढ़ाने का लक्ष्य है।" },

  filterByAgeLabel: { en: "Age", hi: "आयु" },
  agePlaceholderFilters: { en: "Enter your age", hi: "अपनी आयु दर्ज करें"},
  filterBySocialCategoryLabel: { en: "Filter by Social Category", hi: "सामाजिक श्रेणी द्वारा फ़िल्टर करें" },
  selectSocialCategoryPlaceholder: { en: "Select social category", hi: "सामाजिक श्रेणी चुनें" },
  filterByGenderLabel: { en: "Gender", hi: "लिंग" },
  selectGenderPlaceholder: { en: "Select gender", hi: "लिंग चुनें" },
  anyOption: { en: "Any", hi: "कोई भी" },
  generalOption: { en: "General", hi: "सामान्य" },
  scOption: { en: "SC (Scheduled Caste)", hi: "एससी (अनुसूचित जाति)" },
  stOption: { en: "ST (Scheduled Tribe)", hi: "एसटी (अनुसूचित जनजाति)" },
  obcOption: { en: "OBC (Other Backward Class)", hi: "ओबीसी (अन्य पिछड़ा वर्ग)" },
  ewsOption: { en: "EWS (Economically Weaker Section)", hi: "ईडब्ल्यूएस (आर्थिक रूप से कमजोर वर्ग)" },
  maleOption: { en: "Male", hi: "पुरुष" },
  femaleOption: { en: "Female", hi: "महिला" },
  transgenderOption: { en: "Transgender", hi: "ट्रांसजेंडर" },

  // Marketplace
  marketplaceTitle: { en: "Farmer's Marketplace", hi: "किसान बाज़ार" },
  marketplaceDescription: { en: "Buy and sell agricultural products directly.", hi: "सीधे कृषि उत्पादों की खरीद और बिक्री करें।" },
  createNewPostButton: { en: "Create New Post", hi: "नई पोस्ट बनाएं" },
  noPostsAvailable: { en: "No products currently listed. Be the first to post!", hi: "वर्तमान में कोई उत्पाद सूचीबद्ध नहीं है। पोस्ट करने वाले पहले व्यक्ति बनें!" },
  createPostDialogTitle: { en: "Create New Marketplace Post", hi: "नई बाज़ार पोस्ट बनाएं" },
  createPostDialogDescription: { en: "Fill in the details of the product you want to sell.", hi: "आप जिस उत्पाद को बेचना चाहते हैं उसका विवरण भरें।" },
  productNameLabel: { en: "Product Name", hi: "उत्पाद का नाम" },
  selectProductPlaceholder: { en: "Select product/crop", hi: "उत्पाद/फसल चुनें" },
  quantityMarketplaceLabel: { en: "Quantity (Quintals)", hi: "मात्रा (क्विंटल)" },
  pricePerQuintalLabel: { en: "Price per Quintal (₹)", hi: "मूल्य प्रति क्विंटल (₹)" },
  priceMarketplacePlaceholder: { en: "Enter your price", hi: "अपनी कीमत दर्ज करें" },
  suggestedPriceLabel: { en: "Suggested Price: ₹{price}/Quintal", hi: "सुझाई गई कीमत: ₹{price}/क्विंटल" },
  descriptionLabel: { en: "Description", hi: "विवरण" },
  descriptionMarketplacePlaceholder: { en: "Provide details like variety, quality, harvest date, etc.", hi: "विविधता, गुणवत्ता, कटाई की तारीख आदि जैसे विवरण प्रदान करें।" },
  uploadImageLabel: { en: "Product Image", hi: "उत्पाद की छवि" },
  selectImageHint: { en: "Select an image for your product (optional, max {size}MB).", hi: "अपने उत्पाद के लिए एक छवि चुनें (वैकल्पिक, अधिकतम {size}MB)।" },
  changeImageHint: { en: "Image selected. Click to change (max {size}MB).", hi: "छवि चयनित। बदलने के लिए क्लिक करें (अधिकतम {size}MB)।" },
  imageTooLargeError: { en: "Image is too large. Maximum size is {size}MB.", hi: "छवि बहुत बड़ी है। अधिकतम आकार {size}MB है।" },
  submittingPostButton: { en: "Submitting...", hi: "जमा हो रहा है..."},
  submitPostButton: { en: "Submit Post", hi: "पोस्ट जमा करें" },
  cancelButton: { en: "Cancel", hi: "रद्द करें" },
  postSubmittedToastTitle: { en: "Post Submitted!", hi: "पोस्ट जमा हो गई!" },
  postSubmittedToastDesc: { en: "Your product is now listed in the marketplace.", hi: "आपका उत्पाद अब बाज़ार में सूचीबद्ध है।" },
  errorFetchingPriceToast: { en: "Could not fetch suggested price.", hi: "सुझाई गई कीमत प्राप्त नहीं हो सकी।" },
  postedOnLabel: { en: "Posted on", hi: "पोस्ट किया गया" },
  sellerLabel: { en: "Seller", hi: "विक्रेता" },
  sellerNameLabel: { en: "Seller Name", hi: "विक्रेता का नाम" },
  sellerNamePlaceholder: { en: "Enter your name or farm name", hi: "अपना नाम या खेत का नाम दर्ज करें" },
  locationMarketplaceLabel: { en: "Location (State)", hi: "स्थान (राज्य)" },
  selectLocationPlaceholder: { en: "Select your state", hi: "अपना राज्य चुनें" },
  productDetailsTitle: { en: "Product Details", hi: "उत्पाद विवरण" },
  contactSellerButton: { en: "Contact Seller", hi: "विक्रेता से संपर्क करें" },
  contactSellerToast: { en: "Contact functionality coming soon! For now, imagine you've connected.", hi: "संपर्क कार्यक्षमता जल्द ही आ रही है! अभी के लिए, कल्पना करें कि आप जुड़ गए हैं।" },
  fetchingPrice: { en: "Fetching price...", hi: "कीमत प्राप्त हो रही है..."},

  // Disease Detection
  diseaseDetectionTitle: { en: "Plant Disease Detection", hi: "पौध रोग पहचान" },
  identifyPlantDiseasesTitle: { en: "Identify Plant Diseases", hi: "पौधों के रोगों की पहचान करें" },
  identifyPlantDiseasesDesc: { en: "Upload an image of an affected plant to get an AI-powered diagnosis and treatment suggestions.", hi: "एआई-संचालित निदान और उपचार सुझाव प्राप्त करने के लिए प्रभावित पौधे की एक छवि अपलोड करें।" },
  detectDiseaseButton: { en: "Detect Disease", hi: "रोग का पता लगाएं" },
  removeImageAriaLabel: { en: "Remove image", hi: "छवि हटाएं" },

  uploadPlantImageLabel: { en: "Upload Plant Image", hi: "पौधे की छवि अपलोड करें" },
  submitForDiagnosisButton: { en: "Get Diagnosis", hi: "निदान प्राप्त करें" },
  diagnosingButton: { en: "Diagnosing...", hi: "निदान किया जा रहा है..." },
  diagnosisResultsTitle: { en: "Diagnosis Results", hi: "निदान परिणाम" },
  plantIdentificationSectionTitle: { en: "Plant Identification", hi: "पौधे की पहचान" },
  isItAPlantLabel: { en: "Is it a plant?", hi: "क्या यह एक पौधा है?" },
  commonNameLabel: { en: "Common Name:", hi: "सामान्य नाम:" },
  latinNameLabel: { en: "Latin Name:", hi: "लैटिन नाम:" },
  healthStatusSectionTitle: { en: "Health Status", hi: "स्वास्थ्य स्थिति" },
  isPlantHealthyLabel: { en: "Is the plant healthy?", hi: "क्या पौधा स्वस्थ है?" },
  diagnosisLabel: { en: "Diagnosis:", hi: "निदान:" },
  suggestedSolutionsLabel: { en: "Suggested Solution:", hi: "सुझाया गया समाधान:" },
  noPlantDetected: { en: "No plant detected in the image or identification unclear.", hi: "छवि में कोई पौधा नहीं मिला या पहचान अस्पष्ट है।" },
  plantHealthy: { en: "Healthy", hi: "स्वस्थ" },
  plantUnhealthy: { en: "Unhealthy", hi: "अस्वस्थ" },
  errorDiagnosing: { en: "An error occurred while diagnosing. Please try again.", hi: "निदान करते समय एक त्रुटि हुई। कृपया पुनः प्रयास करें।" },
  toastDiagnosisCompleteTitle: { en: "Diagnosis Complete", hi: "निदान पूरा हुआ" },
  toastDiagnosisCompleteDesc: { en: "AI has provided a plant diagnosis.", hi: "एआई ने पौधे का निदान प्रदान किया है।" },
  yes: { en: "Yes", hi: "हाँ" },
  no: { en: "No", hi: "नहीं" },
  notAvailable: { en: "N/A", hi: "लागू नहीं" },
  imagePreviewAlt: { en: "Plant image preview", hi: "पौधे की छवि का पूर्वावलोकन"},
  imageNotSelectedError: { en: "Please select an image to upload.", hi: "कृपया अपलोड करने के लिए एक छवि चुनें।" },
  descriptionTooShortError: { en: "Description must be at least 10 characters.", hi: "विवरण कम से कम 10 वर्णों का होना चाहिए।" },
  descriptionTooLongError: { en: "Description cannot exceed 500 characters.", hi: "विवरण 500 वर्णों से अधिक नहीं हो सकता।" },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageInternal] = useState<Language>('en');

  useEffect(() => {
    const storedLang = localStorage.getItem('userLanguage') as Language | null;
    if (storedLang && VALID_LANGUAGES.includes(storedLang)) {
      setLanguageInternal(storedLang);
    }
  }, []);

  const setLanguage = useCallback((newLanguage: Language) => {
    if (VALID_LANGUAGES.includes(newLanguage)) {
      setLanguageInternal(newLanguage);
      localStorage.setItem('userLanguage', newLanguage);
    }
  }, []);

  const translate = useCallback((keyToTranslate: string, params?: Record<string, string | number>, fallback?: string): string => {
    const yearPlaceholder = "{year}";
    let text = translations[keyToTranslate]?.[language] || translations[keyToTranslate]?.['en'] || fallback || keyToTranslate;

    if (text && text.includes(yearPlaceholder)) {
      // Ensure yearPlaceholder regex is specific to avoid issues if other placeholders contain "year"
      const yearRegex = new RegExp(`\\{year\\}`, 'g');
      text = text.replace(yearRegex, new Date().getFullYear().toString());
    }
    text = interpolate(text, params); // interpolate handles other params
    return text;
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, translate }), [language, setLanguage, translate]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

    
