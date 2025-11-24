import React from 'react';
import { colors } from '../../styles/colors';
import { useRouter } from 'next/router';
import { useLanguage } from '../../contexts/LanguageContext';

interface ButtonAppbarProps {
 label?: string;
}

const ButtonAppbar: React.FC<ButtonAppbarProps> = ({ label }) => {
 const router = useRouter();
 const { t } = useLanguage();
 
 return (
 <button
 type="button"
 onClick={() => router.push('/form')}
 className="px-6 py-2 h-11 text-base font-medium text-white hover:opacity-90 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center min-w-[100px]"
 style={{ borderRadius: '7px', backgroundColor: colors.blueColor }}
 >
 {label || t.appBar.cta}
 </button>
 );
};

export default ButtonAppbar;
