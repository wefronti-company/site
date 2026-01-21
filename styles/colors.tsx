import { tr } from "zod/v4/locales";

export const colors = {

 background:{
    dark: '#040404ff', //Cor de fundo de todas as seções
    light:'#ffffffff', //Cor de fundo clara para seções específicas (div de formuláio)
 },

 text:{
   
    dark: '#6e6e6eff', //Cor do texto para backgrounds escuros
    light: '#ffffffff', //Cor do texto para backgrounds claros
 },

 icons:{
    dark: '#010101ff', //Icones para backgrounds claros
    light: '#6a6a6ae3', //Icones para backgrounds escuros
 },

 neutral:{
    gray: '#7f7f7fff', //botões e container de destaque
    borderLight: '#cacacaff', //Cor padrão das bordas claras
    borderDark: '#8b8b8b2b', //Cor padrão das bordas escuras
 },


    blackColor: '#010101',
 whiteColor: '#f7f7f7',
 textSecondary: '#5c5c5cff', // Cor secundária do texto para backgrounds escuros
 iconDark: '#434343ff', //Cor de ícones para backgrounds escuros
 borderDark: '#dfdfdfff',
 borderCta: '#95a0ffff',
 colorGray: '#29292966',
 colorGrayhover: '#b0b0b0e3',
 gradientOne: '#4551BA',
 gradientTwo:'#7E88E3',
 cardsColor: '#1a1a1aff',
 accordeonColor: '#121212ff',
 starsColor: '#ffcc00ff',
 pinkColor: '#F288DB',
 
} as const;