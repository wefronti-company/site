import { tr } from "zod/v4/locales";

export const colors = {

 primary:{
    black: '#010101',
    white: '#d4d4d4ff',
 },

 background:{
    dark: '#101019ff',
    light:'#000000',
    transparent: 'rgba(0, 0, 0, 0)',
 },

 text:{
   
    dark: '#4c4c4cff',
    light: '#f2f2f2',
 },

 icons:{
    dark: '#525252ff',
    light: '#b3b3b3ff',
 },

 neutral:{
    gray: '#29292966',
    grayHover: '#6a6a6ae3',
    cardDark: '#1a1a1aff',
    cardLight: '#f5f5f5ff',
    borderLight: '#8b8b8b4c',
 },

 purple:{
   primary: '#eeeceeff',
   secondary: '#101019ff',
   tertiary:'#736fb0ff',
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