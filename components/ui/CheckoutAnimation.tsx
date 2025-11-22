import React from 'react';

const CheckoutAnimation: React.FC = () => {
  const [isDark, setIsDark] = React.useState(false);
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardName, setCardName] = React.useState('');
  const [expiry, setExpiry] = React.useState('');
  const [cvv, setCvv] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [animationStep, setAnimationStep] = React.useState(0);

  React.useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  // Animação automática de preenchimento
  React.useEffect(() => {
    const fullCardNumber = '4532 1234 5678 9010';
    const fullName = 'MARIA SILVA';
    const fullExpiry = '12/28';
    const fullCvv = '123';

    const interval = setInterval(() => {
      setAnimationStep((prev) => {
        const next = (prev + 1) % 200;
        
        // Digitar número do cartão (0-50)
        if (next <= 50) {
          const chars = Math.floor((next / 50) * fullCardNumber.length);
          setCardNumber(fullCardNumber.substring(0, chars));
          setCardName('');
          setExpiry('');
          setCvv('');
          setIsSuccess(false);
          setIsProcessing(false);
        }
        // Digitar nome (51-70)
        else if (next <= 70) {
          setCardNumber(fullCardNumber);
          const chars = Math.floor(((next - 50) / 20) * fullName.length);
          setCardName(fullName.substring(0, chars));
        }
        // Digitar validade (71-85)
        else if (next <= 85) {
          setCardName(fullName);
          const chars = Math.floor(((next - 70) / 15) * fullExpiry.length);
          setExpiry(fullExpiry.substring(0, chars));
        }
        // Digitar CVV (86-95)
        else if (next <= 95) {
          setExpiry(fullExpiry);
          const chars = Math.floor(((next - 85) / 10) * fullCvv.length);
          setCvv(fullCvv.substring(0, chars));
        }
        // Processar (96-110)
        else if (next <= 110) {
          setCvv(fullCvv);
          setIsProcessing(true);
        }
        // Sucesso (111-150)
        else if (next <= 150) {
          setIsProcessing(false);
          setIsSuccess(true);
        }
        // Reset (151-200)
        else {
          setCardNumber('');
          setCardName('');
          setExpiry('');
          setCvv('');
          setIsSuccess(false);
          setIsProcessing(false);
        }
        
        return next;
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  const orangeColor = '#ff6b35';
  const orangeLight = '#ff8c5a';
  const orangeDark = '#e55a2b';

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center p-3"
      style={{ 
        backgroundColor: isDark ? '#0a0a0a' : '#fff5f0',
      }}
    >
      {/* Container do Checkout */}
      <div 
        className="w-full"
        style={{
          backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
          border: `1px solid ${isDark ? '#2a2a2a' : '#ffe5d9'}`,
          borderRadius: '7px',
          padding: '16px',
          boxShadow: isDark 
            ? '0 2px 10px rgba(0, 0, 0, 0.5)' 
            : '0 2px 10px rgba(255, 107, 53, 0.1)',
        }}
      >
        {/* Título */}
        <div className="mb-3">
          <h3 
            className="text-sm font-bold mb-0.5"
            style={{ color: orangeColor }}
          >
            Finalizar Compra
          </h3>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">
            Preencha os dados do cartão
          </p>
        </div>

        {isSuccess ? (
          /* Mensagem de Sucesso */
          <div 
            className="flex flex-col items-center justify-center py-8"
            style={{
              backgroundColor: isDark ? '#0f2e1a' : '#f0fdf4',
              borderRadius: '7px',
              border: `1px solid ${isDark ? '#166534' : '#86efac'}`,
            }}
          >
            <div 
              className="mb-3 rounded-full flex items-center justify-center"
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#10b981',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h4 
              className="text-lg font-bold mb-1"
              style={{ color: '#10b981' }}
            >
              Compra Aprovada
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Pagamento processado com sucesso!
            </p>
          </div>
        ) : (
          <>
            {/* Campos do Formulário */}
            <div className="space-y-2 mb-3">
              {/* Número do Cartão */}
              <div>
                <label className="block text-[9px] font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                  Número do Cartão
                </label>
                <div 
                  className="w-full px-2 py-1.5 text-[11px] font-mono flex items-center"
                  style={{
                    backgroundColor: isDark ? '#0a0a0a' : '#fff',
                    border: `1px solid ${isDark ? '#2a2a2a' : '#e5e7eb'}`,
                    color: isDark ? '#fff' : '#000',
                    borderRadius: '7px',
                    minHeight: '30px',
                  }}
                >
                  {cardNumber || <span className="text-gray-400 dark:text-gray-600">0000 0000 0000 0000</span>}
                  {cardNumber && <span className="animate-pulse">|</span>}
                </div>
              </div>

              {/* Nome */}
              <div>
                <label className="block text-[9px] font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                  Nome do Titular
                </label>
                <div 
                  className="w-full px-2 py-1.5 text-[11px] flex items-center"
                  style={{
                    backgroundColor: isDark ? '#0a0a0a' : '#fff',
                    border: `1px solid ${isDark ? '#2a2a2a' : '#e5e7eb'}`,
                    color: isDark ? '#fff' : '#000',
                    borderRadius: '7px',
                    minHeight: '30px',
                  }}
                >
                  {cardName || <span className="text-gray-400 dark:text-gray-600">Nome Completo</span>}
                  {cardName && <span className="animate-pulse">|</span>}
                </div>
              </div>

              {/* Validade e CVV */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-[9px] font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                    Validade
                  </label>
                  <div 
                    className="w-full px-2 py-1.5 text-[11px] font-mono flex items-center"
                    style={{
                      backgroundColor: isDark ? '#0a0a0a' : '#fff',
                      border: `1px solid ${isDark ? '#2a2a2a' : '#e5e7eb'}`,
                      color: isDark ? '#fff' : '#000',
                      borderRadius: '7px',
                      minHeight: '30px',
                    }}
                  >
                    {expiry || <span className="text-gray-400 dark:text-gray-600">MM/AA</span>}
                    {expiry && <span className="animate-pulse">|</span>}
                  </div>
                </div>
                <div className="w-16">
                  <label className="block text-[9px] font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                    CVV
                  </label>
                  <div 
                    className="w-full px-2 py-1.5 text-[11px] font-mono flex items-center"
                    style={{
                      backgroundColor: isDark ? '#0a0a0a' : '#fff',
                      border: `1px solid ${isDark ? '#2a2a2a' : '#e5e7eb'}`,
                      color: isDark ? '#fff' : '#000',
                      borderRadius: '7px',
                      minHeight: '30px',
                    }}
                  >
                    {cvv || <span className="text-gray-400 dark:text-gray-600">000</span>}
                    {cvv && <span className="animate-pulse">|</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Botão Finalizar Compra */}
            <button
              disabled={isProcessing}
              className="w-full py-2 font-semibold text-white text-xs transition-all duration-300"
              style={{
                backgroundColor: isProcessing ? '#9ca3af' : orangeColor,
                transform: isProcessing ? 'scale(0.98)' : 'scale(1)',
                boxShadow: isProcessing ? 'none' : '0 2px 8px rgba(255, 107, 53, 0.4)',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                borderRadius: '7px',
              }}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-1.5">
                  <svg 
                    className="animate-spin" 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" opacity="0.25" />
                    <path d="M12 2 A10 10 0 0 1 22 12" strokeLinecap="round" />
                  </svg>
                  <span>Processando...</span>
                </div>
              ) : (
                <span>Finalizar Compra</span>
              )}
            </button>

            {/* Badge de Segurança */}
            <div className="mt-2 flex items-center justify-center gap-1.5 text-[9px] text-gray-500 dark:text-gray-400">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Pagamento 100% seguro</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutAnimation;
