import React from 'react';
import { useQuoteModal } from '../../contexts/QuoteModalContext';
import { useLanguage } from '../../contexts/LanguageContext';

const QuoteModal: React.FC = () => {
  const { isOpen, closeModal } = useQuoteModal();
  const { t } = useLanguage();
  const [isDark, setIsDark] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [formData, setFormData] = React.useState({
    name: '',
    whatsapp: '',
    email: '',
    company: '',
    role: '',
    revenue: '',
    challenge: '',
    timeline: ''
  });

  React.useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  // Prevenir scroll do body quando modal está aberto
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar solicitação');
      }

      setSubmitStatus('success');
      
      // Limpar formulário
      setFormData({
        name: '',
        whatsapp: '',
        email: '',
        company: '',
        role: '',
        revenue: '',
        challenge: '',
        timeline: ''
      });

      // Fechar modal após 2 segundos
      setTimeout(() => {
        closeModal();
        setSubmitStatus('idle');
      }, 2000);

    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao processar sua solicitação');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={closeModal}
    >
      {/* Backdrop com blur */}
      <div 
        className="absolute inset-0 transition-all"
        style={{
          backgroundColor: isDark ? 'rgba(1, 1, 1, 0.8)' : 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}
      />

      {/* Modal Container */}
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: isDark ? '#010101' : '#f7f7f7',
          borderRadius: '12px',
          border: `1px solid ${isDark ? '#141414' : '#D1D5DB'}`
        }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 border-b"
          style={{
            backgroundColor: isDark ? '#010101' : '#f7f7f7',
            borderBottomColor: isDark ? '#141414' : '#D1D5DB'
          }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {t.quoteModal.title}
            </h2>
            <button
              onClick={closeModal}
              className="w-8 h-8 flex items-center justify-center rounded-md transition-all hover:scale-110"
              style={{
                backgroundColor: isDark ? '#1f1f1f' : '#e5e7eb'
              }}
              aria-label="Fechar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-800 dark:text-gray-200">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Nome completo */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              {t.quoteModal.form.name} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t.quoteModal.form.name}
              required
              className="w-full px-4 py-3 rounded-md text-gray-900 dark:text-white transition-colors"
              style={{
                backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
                border: `1px solid ${isDark ? '#141414' : '#D1D5DB'}`,
                outline: 'none'
              }}
            />
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              {t.quoteModal.form.whatsapp} *
            </label>
            <input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="(99) 9 9999-9999"
              required
              className="w-full px-4 py-3 rounded-md text-gray-900 dark:text-white transition-colors"
              style={{
                backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
                border: `1px solid ${isDark ? '#141414' : '#D1D5DB'}`,
                outline: 'none'
              }}
            />
          </div>

          {/* Email corporativo */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              {t.quoteModal.form.email} *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t.quoteModal.form.email}
              required
              className="w-full px-4 py-3 rounded-md text-gray-900 dark:text-white transition-colors"
              style={{
                backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
                border: `1px solid ${isDark ? '#141414' : '#D1D5DB'}`,
                outline: 'none'
              }}
            />
          </div>

          {/* Empresa */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              {t.quoteModal.form.company} *
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder={t.quoteModal.form.company}
              required
              className="w-full px-4 py-3 rounded-md text-gray-900 dark:text-white transition-colors"
              style={{
                backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
                border: `1px solid ${isDark ? '#141414' : '#D1D5DB'}`,
                outline: 'none'
              }}
            />
          </div>

          {/* Cargo */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              {t.quoteModal.form.role} *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-md text-gray-900 dark:text-white transition-colors"
              style={{
                backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
                border: `1px solid ${isDark ? '#141414' : '#D1D5DB'}`,
                outline: 'none'
              }}
            >
              <option value="">{t.quoteModal.form.roleOptions.select}</option>
              <option value="ceo">{t.quoteModal.form.roleOptions.ceo}</option>
              <option value="cto">{t.quoteModal.form.roleOptions.cto}</option>
              <option value="manager">{t.quoteModal.form.roleOptions.manager}</option>
              <option value="developer">{t.quoteModal.form.roleOptions.developer}</option>
              <option value="other">{t.quoteModal.form.roleOptions.other}</option>
            </select>
          </div>

          {/* Receita Mensal */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              {t.quoteModal.form.revenue} *
            </label>
            <select
              name="revenue"
              value={formData.revenue}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-md text-gray-900 dark:text-white transition-colors"
              style={{
                backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
                border: `1px solid ${isDark ? '#141414' : '#D1D5DB'}`,
                outline: 'none'
              }}
            >
              <option value="">{t.quoteModal.form.revenueOptions.select}</option>
              <option value="0-10k">{t.quoteModal.form.revenueOptions['0-10k']}</option>
              <option value="10k-50k">{t.quoteModal.form.revenueOptions['10k-50k']}</option>
              <option value="50k-100k">{t.quoteModal.form.revenueOptions['50k-100k']}</option>
              <option value="100k+">{t.quoteModal.form.revenueOptions['500k+']}</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t.quoteModal.form.revenueHint}
            </p>
          </div>

          {/* Desafio */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              {t.quoteModal.form.challenge} *
            </label>
            <textarea
              name="challenge"
              value={formData.challenge}
              onChange={handleChange}
              placeholder={t.quoteModal.form.challenge}
              required
              rows={4}
              className="w-full px-4 py-3 rounded-md text-gray-900 dark:text-white transition-colors resize-none"
              style={{
                backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
                border: `1px solid ${isDark ? '#141414' : '#D1D5DB'}`,
                outline: 'none'
              }}
            />
          </div>

          {/* Timeline */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              {t.quoteModal.form.timeline}
            </label>
            <select
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md text-gray-900 dark:text-white transition-colors"
              style={{
                backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
                border: `1px solid ${isDark ? '#141414' : '#D1D5DB'}`,
                outline: 'none'
              }}
            >
              <option value="">{t.quoteModal.form.timelineOptions.select}</option>
              <option value="immediate">{t.quoteModal.form.timelineOptions.immediate}</option>
              <option value="short">{t.quoteModal.form.timelineOptions.short}</option>
              <option value="medium">{t.quoteModal.form.timelineOptions.medium}</option>
              <option value="long">{t.quoteModal.form.timelineOptions.long}</option>
            </select>
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="p-4 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                {t.quoteModal.form.successMessage}
              </p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="p-4 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                ❌ {errorMessage || t.quoteModal.form.errorMessage}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-8 py-4 text-base font-semibold text-white rounded-md transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#3B82F6'
            }}
          >
            {isSubmitting ? t.quoteModal.form.submitting : t.quoteModal.form.submit}
          </button>

        </form>
      </div>
    </div>
  );
};

export default QuoteModal;
