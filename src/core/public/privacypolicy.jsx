import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/sidebar.jsx';
import Footer from '../../components/footer.jsx';
import { useTheme } from '../../components/ThemeContext';
import { 
  Shield, 
  Eye, 
  Lock, 
  Users, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  Mail,
  Calendar,
  Globe,
  Database,
  UserCheck,
  Settings,
  Download,
  Trash2,
  Bell
} from 'lucide-react';

export default function PrivacyPolicy() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:3000/api/auth/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const sections = [
    { id: 'overview', label: t('Overview'), icon: <Eye className="w-4 h-4" /> },
    { id: 'collection', label: t('Data Collection'), icon: <Database className="w-4 h-4" /> },
    { id: 'usage', label: t('How We Use Data'), icon: <Settings className="w-4 h-4" /> },
    { id: 'sharing', label: t('Data Sharing'), icon: <Users className="w-4 h-4" /> },
    { id: 'security', label: t('Security'), icon: <Lock className="w-4 h-4" /> },
    { id: 'rights', label: t('Your Rights'), icon: <UserCheck className="w-4 h-4" /> },
    { id: 'cookies', label: t('Cookies'), icon: <Globe className="w-4 h-4" /> },
    
  ];

  const dataTypes = [
    {
      category: t('Personal Information'),
      icon: <UserCheck className="w-6 h-6 text-blue-500" />,
      items: [
        t('Name and email address'),
        t('Profile picture'),
        t('Account preferences'),
        t('Login credentials (encrypted)')
      ]
    },
    {
      category: t('Learning Data'),
      icon: <FileText className="w-6 h-6 text-green-500" />,
      items: [
        t('Lesson progress and completion'),
        t('Quiz answers and scores'),
        t('Practice session history'),
        t('Learning preferences')
      ]
    },
    {
      category: t('Technical Data'),
      icon: <Settings className="w-6 h-6 text-purple-500" />,
      items: [
        t('Device and browser information'),
        t('IP address and location data'),
        t('Usage analytics'),
        t('Performance metrics')
      ]
    },
    {
      category: t('Communication Data'),
      icon: <Mail className="w-6 h-6 text-orange-500" />,
      items: [
        t('Support messages'),
        t('Feedback and surveys'),
        t('Newsletter subscriptions'),
        t('Notification preferences')
      ]
    }
  ];

  const userRights = [
    {
      right: t('Access Your Data'),
      description: t('Request a copy of all personal data we hold about you'),
      icon: <Download className="w-6 h-6 text-blue-500" />
    },
    {
      right: t('Correct Your Data'),
      description: t('Update or correct any inaccurate personal information'),
      icon: <Settings className="w-6 h-6 text-green-500" />
    },
    {
      right: t('Delete Your Data'),
      description: t('Request deletion of your personal data (right to be forgotten)'),
      icon: <Trash2 className="w-6 h-6 text-red-500" />
    },
    {
      right: t('Data Portability'),
      description: t('Receive your data in a structured, machine-readable format'),
      icon: <Database className="w-6 h-6 text-purple-500" />
    },
    {
      right: t('Opt-Out'),
      description: t('Withdraw consent for data processing at any time'),
      icon: <Bell className="w-6 h-6 text-orange-500" />
    },
    {
      right: t('Object to Processing'),
      description: t('Object to certain types of data processing'),
      icon: <Shield className="w-6 h-6 text-indigo-500" />
    }
  ];

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div
      className={`flex flex-col min-h-screen ${
        theme === 'light'
          ? 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'
          : 'bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900'
      } ${i18n.language === 'ne' ? 'font-noto-sans' : ''}`}
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-200 dark:bg-purple-800 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-200 dark:bg-blue-800 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-pink-200 dark:bg-pink-800 rounded-full opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="flex flex-1 relative z-10">
        <Sidebar />
        <main className="flex-1 p-6 flex justify-center items-start mt-6">
          <div className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/80 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 w-full max-w-7xl h-[85vh] overflow-y-auto">
            
            {/* Header */}
            <header className="mb-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-green-500 mb-6">
                <Shield className="text-white text-2xl" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent mb-4">
                {t('Privacy Policy')}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-4">
                {t('Your privacy is important to us. This policy explains how Anna Music Learning Platform collects, uses, and protects your personal information.')}
              </p>
              <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4 mr-2" />
                {t('Last updated')}: {getCurrentDate()}
              </div>
            </header>

            {/* Navigation */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center px-4 py-2 rounded-xl transition-all duration-300 text-sm ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {section.icon}
                  <span className="ml-2 font-medium">{section.label}</span>
                </button>
              ))}
            </div>

            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-8 rounded-3xl border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center mb-6">
                    <Eye className="w-8 h-8 text-blue-500 mr-4" />
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                      {t('Privacy Overview')}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        {t('What We Collect')}
                      </h3>
                      <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {t('Personal information you provide')}
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {t('Learning progress and preferences')}
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {t('Technical and usage data')}
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {t('Communication preferences')}
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        {t('How We Protect It')}
                      </h3>
                      <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                        <li className="flex items-center">
                          <Lock className="w-4 h-4 text-blue-500 mr-2" />
                          {t('Industry-standard encryption')}
                        </li>
                        <li className="flex items-center">
                          <Lock className="w-4 h-4 text-blue-500 mr-2" />
                          {t('Secure data storage')}
                        </li>
                        <li className="flex items-center">
                          <Lock className="w-4 h-4 text-blue-500 mr-2" />
                          {t('Regular security audits')}
                        </li>
                        <li className="flex items-center">
                          <Lock className="w-4 h-4 text-blue-500 mr-2" />
                          {t('Limited access controls')}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-2xl border border-yellow-200 dark:border-yellow-700">
                  <div className="flex items-start">
                    <AlertTriangle className="w-6 h-6 text-yellow-500 mr-4 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        {t('Important Notice')}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {t('By using Anna Music Learning Platform, you agree to the collection and use of information in accordance with this Privacy Policy. We recommend reading this policy in full to understand how your data is handled.')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Data Collection Section */}
            {activeSection === 'collection' && (
              <div className="space-y-8 animate-fadeIn">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 text-center mb-8">
                  {t('Information We Collect')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {dataTypes.map((dataType, index) => (
                    <div
                      key={index}
                      className="bg-white/60 dark:bg-gray-700/60 p-6 rounded-2xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center mb-4">
                        {dataType.icon}
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 ml-3">
                          {dataType.category}
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {dataType.items.map((item, idx) => (
                          <li key={idx} className="flex items-center text-gray-600 dark:text-gray-400">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-700">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    {t('How We Collect Information')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="bg-blue-500 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                        <UserCheck className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">{t('Directly from you')}</p>
                      <p className="text-gray-600 dark:text-gray-400">{t('When you register or use our services')}</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-blue-500 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                        <Settings className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">{t('Automatically')}</p>
                      <p className="text-gray-600 dark:text-gray-400">{t('Through your use of our platform')}</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-blue-500 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">{t('Third parties')}</p>
                      <p className="text-gray-600 dark:text-gray-400">{t('From trusted service providers')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Usage Section */}
            {activeSection === 'usage' && (
              <div className="space-y-8 animate-fadeIn">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 text-center mb-8">
                  {t('How We Use Your Information')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: t('Provide Services'),
                      description: t('Deliver and personalize your learning experience'),
                      icon: <FileText className="w-8 h-8 text-blue-500" />
                    },
                    {
                      title: t('Improve Platform'),
                      description: t('Analyze usage patterns to enhance our services'),
                      icon: <Settings className="w-8 h-8 text-green-500" />
                    },
                    {
                      title: t('Communication'),
                      description: t('Send important updates and support messages'),
                      icon: <Mail className="w-8 h-8 text-purple-500" />
                    },
                    {
                      title: t('Security'),
                      description: t('Protect against fraud and unauthorized access'),
                      icon: <Shield className="w-8 h-8 text-red-500" />
                    },
                    {
                      title: t('Legal Compliance'),
                      description: t('Meet legal obligations and protect rights'),
                      icon: <FileText className="w-8 h-8 text-orange-500" />
                    },
                    {
                      title: t('Research & Analytics'),
                      description: t('Understand user behavior and improve learning outcomes'),
                      icon: <Database className="w-8 h-8 text-indigo-500" />
                    }
                  ].map((usage, index) => (
                    <div
                      key={index}
                      className="bg-white/60 dark:bg-gray-700/60 p-6 rounded-2xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 text-center"
                    >
                      <div className="mb-4 flex justify-center">
                        {usage.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                        {usage.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {usage.description}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-200 dark:border-green-700">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    {t('Legal Basis for Processing')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {t('We process your personal data based on the following legal grounds:')}
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      {t('Consent for marketing communications')}
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      {t('Contract performance for service delivery')}
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      {t('Legitimate interest for platform improvement')}
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      {t('Legal obligation for compliance')}
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Sharing Section */}
            {activeSection === 'sharing' && (
              <div className="space-y-8 animate-fadeIn">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 text-center mb-8">
                  {t('How We Share Your Information')}
                </h2>
                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border border-red-200 dark:border-red-700 mb-8">
                  <div className="flex items-center mb-4">
                    <Shield className="w-6 h-6 text-red-500 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      {t('We Do NOT Sell Your Data')}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('Anna Music Learning Platform does not sell, rent, or trade your personal information to third parties for marketing purposes.')}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                      {t('When We May Share Data')}
                    </h3>
                    {[
                      {
                        title: t('Service Providers'),
                        description: t('Trusted third parties who help us operate our platform (hosting, analytics, support)')
                      },
                      {
                        title: t('Legal Requirements'),
                        description: t('When required by law, court order, or to protect our legal rights')
                      },
                      {
                        title: t('Business Transfers'),
                        description: t('In case of merger, acquisition, or sale of our business assets')
                      },
                      {
                        title: t('Safety & Security'),
                        description: t('To protect the safety of our users and prevent fraud or abuse')
                      }
                    ].map((item, index) => (
                      <div key={index} className="bg-white/60 dark:bg-gray-700/60 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{item.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                      {t('Our Commitments')}
                    </h3>
                    {[
                      t('All service providers sign strict data protection agreements'),
                      t('We require the same level of protection as we provide'),
                      t('Data is only shared for specific, legitimate purposes'),
                      t('You will be notified of any significant changes to sharing practices'),
                      t('International transfers comply with applicable data protection laws')
                    ].map((commitment, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                        <p className="text-gray-600 dark:text-gray-400">{commitment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <div className="space-y-8 animate-fadeIn">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 text-center mb-8">
                  {t('How We Protect Your Data')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: t('Encryption'),
                      description: t('All data is encrypted in transit and at rest using industry-standard protocols'),
                      icon: <Lock className="w-8 h-8 text-blue-500" />
                    },
                    {
                      title: t('Access Controls'),
                      description: t('Strict access controls ensure only authorized personnel can access your data'),
                      icon: <UserCheck className="w-8 h-8 text-green-500" />
                    },
                    {
                      title: t('Regular Audits'),
                      description: t('We conduct regular security audits and vulnerability assessments'),
                      icon: <Shield className="w-8 h-8 text-purple-500" />
                    },
                    {
                      title: t('Secure Infrastructure'),
                      description: t('Our platform is hosted on secure, certified cloud infrastructure'),
                      icon: <Database className="w-8 h-8 text-orange-500" />
                    },
                    {
                      title: t('Monitoring'),
                      description: t('24/7 monitoring for suspicious activities and security threats'),
                      icon: <Eye className="w-8 h-8 text-red-500" />
                    },
                    {
                      title: t('Data Backup'),
                      description: t('Regular backups ensure data recovery in case of emergencies'),
                      icon: <Download className="w-8 h-8 text-indigo-500" />
                    }
                  ].map((security, index) => (
                    <div
                      key={index}
                      className="bg-white/60 dark:bg-gray-700/60 p-6 rounded-2xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 text-center"
                    >
                      <div className="mb-4 flex justify-center">
                        {security.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                        {security.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {security.description}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-2xl border border-yellow-200 dark:border-yellow-700">
                  <div className="flex items-start">
                    <AlertTriangle className="w-6 h-6 text-yellow-500 mr-4 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        {t('Your Role in Security')}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {t('While we implement robust security measures, you also play a crucial role in protecting your account:')}
                      </p>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {t('Use a strong, unique password')}
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {t('Keep your login credentials secure')}
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {t('Log out from shared devices')}
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {t('Report suspicious activities immediately')}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rights Section */}
            {activeSection === 'rights' && (
              <div className="space-y-8 animate-fadeIn">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 text-center mb-8">
                  {t('Your Privacy Rights')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userRights.map((right, index) => (
                    <div
                      key={index}
                      className="bg-white/60 dark:bg-gray-700/60 p-6 rounded-2xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start">
                        <div className="mr-4 mt-1">
                          {right.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            {right.right}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {right.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-700">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    {t('How to Exercise Your Rights')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {t('To exercise any of these rights, please contact us using the information provided in the Contact section. We will respond to your request within 30 days.')}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => navigate('/help?tab=contact')}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      {t('Contact Support')}
                    </button>
                    <button
                      onClick={() => navigate('/profile')}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      {t('Account Settings')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Cookies Section */}
            {activeSection === 'cookies' && (
              <div className="space-y-8 animate-fadeIn">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 text-center mb-8">
                  {t('Cookies and Tracking')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-white/60 dark:bg-gray-700/60 p-6 rounded-2xl border border-gray-200 dark:border-gray-600">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        {t('What Are Cookies?')}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {t('Cookies are small text files stored on your device that help us provide and improve our services.')}
                      </p>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        {t('Types of Cookies We Use:')}
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {t('Essential cookies for platform functionality')}
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                          {t('Analytics cookies to understand usage')}
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-purple-500 mr-2" />
                          {t('Preference cookies to remember your settings')}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-white/60 dark:bg-gray-700/60 p-6 rounded-2xl border border-gray-200 dark:border-gray-600">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        {t('Managing Cookies')}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {t('You can control cookies through your browser settings:')}
                      </p>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
                          {t('Block all cookies (may affect functionality)')}
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
                          {t('Allow only essential cookies')}
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
                          {t('Delete existing cookies from your device')}
                        </li>
                        <li className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
                          {t('Set preferences for future cookie usage')}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            

            {/* Footer Notice */}
            <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-600 text-center">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-2xl border border-purple-200 dark:border-purple-700">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {t('This Privacy Policy was last updated on')} <strong>{getCurrentDate()}</strong>. {t('We may update this policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes.')}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {t('Anna Music Learning Platform - Committed to protecting your privacy')}
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Profile Picture */}
        <div className="absolute top-4 right-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-full p-1">
              {userProfile && userProfile.profilePicture ? (
                <img
                  src={`http://localhost:3000/${userProfile.profilePicture}`}
                  alt="Profile"
                  className="w-16 h-16 rounded-full border-2 border-white dark:border-gray-600 cursor-pointer hover:scale-110 transition-transform duration-300"
                  onClick={() => navigate('/profile')}
                />
              ) : (
                <img
                  src="src/assets/images/profile.png"
                  alt="Profile"
                  className="w-16 h-16 rounded-full border-2 border-white dark:border-gray-600 cursor-pointer hover:scale-110 transition-transform duration-300"
                  onClick={() => navigate('/profile')}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}