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
      className="relative w-full h-full flex items-center justify-center"
      style={{ 
        backgroundColor: isDark ? '#010101' : '#f7f7f7',
        padding: '16px',
      }}
    >
      {/* Container do Checkout */}
      <div 
        className="w-full"
        style={{
          backgroundColor: isDark ? '#010101' : '#f7f7f7',
          padding: '12px',
        
        }}
      >
   

        {/* Cartão de Crédito Animado */}
        <div 
          className="relative mb-3"
          style={{
            perspective: '1000px',
          }}
        >
          <div
            className="relative"
            style={{
              width: '100%',
              height: '140px',
              background: `linear-gradient(135deg, ${orangeColor} 0%, ${orangeDark} 100%)`,
              borderRadius: '10px',
              padding: '14px',
              boxShadow: '0 6px 20px rgba(255, 107, 53, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Chip do Cartão */}
            <div className="flex items-start justify-between">
              <div
                style={{
                  width: '35px',
                  height: '28px',
                  background: 'linear-gradient(135deg, #f4d03f 0%, #e8b923 100%)',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              />
              <div className="text-white text-[9px] font-bold opacity-80">
                VISA
              </div>
            </div>

            {/* Número do Cartão */}
            <div>
              <div 
                className="text-white font-mono text-sm tracking-wider mb-2"
                style={{
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                }}
              >
                {cardNumber || '•••• •••• •••• ••••'}
                {cardNumber && cardNumber.length < 19 && animationStep <= 50 && (
                  <span className="animate-pulse ml-1">|</span>
                )}
              </div>

              {/* Nome e Validade */}
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-white text-[7px] opacity-70 mb-0.5">
                    TITULAR
                  </div>
                  <div className="text-white text-[10px] font-medium">
                    {cardName || 'NOME DO TITULAR'}
                    {cardName && cardName.length < 11 && animationStep > 50 && animationStep <= 70 && (
                      <span className="animate-pulse ml-1">|</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-white text-[7px] opacity-70 mb-0.5 text-right">
                    VALIDADE
                  </div>
                  <div className="text-white text-[10px] font-medium font-mono">
                    {expiry || 'MM/AA'}
                    {expiry && expiry.length < 5 && animationStep > 70 && animationStep <= 85 && (
                      <span className="animate-pulse ml-1">|</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Efeito de brilho */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
                borderRadius: '10px',
                animation: 'shimmer 3s infinite',
              }}
            />
          </div>
        </div>

        {/* Botão Finalizar Compra */}
        <button
          disabled={isProcessing}
          className="w-full py-2 font-semibold text-white text-xs transition-all duration-300"
          style={{
            backgroundColor: isSuccess ? '#10b981' : (isProcessing ? '#9ca3af' : orangeColor),
            transform: isProcessing ? 'scale(0.98)' : 'scale(1)',
            boxShadow: isProcessing ? 'none' : `0 2px 8px ${isSuccess ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 107, 53, 0.4)'}`,
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            borderRadius: '7px',
          }}
        >
          {isSuccess ? (
            <div className="flex items-center justify-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Compra Aprovada!</span>
            </div>
          ) : isProcessing ? (
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
      </div>
    </div>
  );
};

export default CheckoutAnimation;
