import React from 'react';

interface FormInputProps {
 label: string;
 name: string;
 type?: 'text' | 'email' | 'tel';
 value: string;
 onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
 placeholder?: string;
 required?: boolean;
 error?: string;
 isDark?: boolean;
 minLength?: number;
 maxLength?: number;
 autoComplete?: string;
}

const FormInput: React.FC<FormInputProps> = ({
 label,
 name,
 type = 'text',
 value,
 onChange,
 placeholder,
 required = false,
 error,
 isDark = false,
 minLength,
 maxLength,
 autoComplete,
}) => {
 const [isFocused, setIsFocused] = React.useState(false);
 const [showError, setShowError] = React.useState(false);

 React.useEffect(() => {
 if (error && !isFocused) {
 setShowError(true);
 const timer = setTimeout(() => setShowError(false), 5000);
 return () => clearTimeout(timer);
 }
 }, [error, isFocused]);

 const hasError = showError && error;

 return (
 <div className="relative">
 <label className="block text-sm font-medium text-gray-900 mb-2">
 {label} {required && <span className="text-red-500">*</span>}
 </label>
 
 <div className="relative">
 <input
 type={type}
 name={name}
 value={value}
 onChange={onChange}
 onFocus={() => setIsFocused(true)}
 onBlur={() => setIsFocused(false)}
 placeholder={placeholder}
 required={required}
 minLength={minLength}
 maxLength={maxLength}
 autoComplete={autoComplete}
 className={`
 w-full px-4 py-3 rounded-lg text-gray-900 
 transition-all duration-300 outline-none
 ${hasError 
 ? 'border-2 border-red-500 shake' 
 : isFocused 
 ? 'border-2 border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.1)]' 
 : 'border border-gray-300'
 }
 `}
 style={{
 backgroundColor: '#ffffff',
 }}
 />
 
 {/* Ícone de erro animado */}
 {hasError && (
 <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-bounce-in">
 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-red-500">
 <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
 <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
 </svg>
 </div>
 )}
 </div>

 {/* Mensagem de erro moderna */}
 {hasError && (
 <div 
 className="mt-2 flex items-start gap-2 p-3 rounded-lg animate-slide-down"
 style={{
 backgroundColor: 'rgba(254, 226, 226, 1)',
 border: `1px solid 'rgba(239, 68, 68, 0.3)'`,
 }}
 >
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-red-500 flex-shrink-0 mt-0.5">
 <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
 </svg>
 <p className="text-sm text-red-600 font-medium">
 {error}
 </p>
 </div>
 )}
 </div>
 );
};

export default FormInput;
