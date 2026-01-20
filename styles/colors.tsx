import { tr } from "zod/v4/locales";

export const colors = {

 primary:{
    black: '#010101',
    white: '#ffffffff',
 },

 background:{
    dark: '#040404ff',
    light:'#d9d9d9ff',
    transparent: 'rgba(0, 0, 0, 0)',
 },

 text:{
   
    dark: '#6e6e6eff',
    light: '#ffffffff',
    primary: '#101019ff',
    secondary: '#1f1f1fe3',
 },

 icons:{
    dark: '#525252ff',
    light: '#b3b3b3ff',
 },

 neutral:{
    gray: '#29292966',
    grayHover: '#6a6a6ae3',
    cardDark: '#1a1a1aff',
    cardLight: '#d1d1d1ff',
    borderLight: '#8b8b8b2b',
 },

 purple:{
   primary: '#eeeceeff',
   secondary: '#101019ff',
   tertiary:'#329cf2ff',
 },

 apoio:{
   green: '#3c9968ff',
 },



    blackColor: '#010101',
 whiteColor: '#f7f7f7',
 textSecondary: '#5c5c5cff', // Cor secundária do texto para backgrounds escuros
 iconDark: '#434343ff', //Cor de ícones para backgrounds escuros
 borderLight: '#dfdfdfff',
 borderDark: '#1d1d1dd8',
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