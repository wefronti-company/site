import React, { useState } from 'react';
import { colors } from '../../styles/colors';
import Logo from './Logo';

interface CalendarProps {
  onSelectTime: (datetime: string) => void;
  availableSlots?: string[];
}

const Calendar: React.FC<CalendarProps> = ({ onSelectTime, availableSlots }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthNames = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];

  const dayNames = ['DOM.', 'SEG.', 'TER.', 'QUA.', 'QUI.', 'SEX.', 'SÁB.'];

  // Gerar horários disponíveis (8h às 18h, intervalos de 30min)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 17) slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedDate(null);
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (newDate >= today) {
      setSelectedDate(newDate);
    }
  };

  const handleTimeClick = (time: string) => {
    if (!selectedDate) return;
    
    const [hours, minutes] = time.split(':');
    const datetime = new Date(selectedDate);
    datetime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    onSelectTime(datetime.toISOString());
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    return selectedDate.getDate() === day && 
           selectedDate.getMonth() === currentDate.getMonth() &&
           selectedDate.getFullYear() === currentDate.getFullYear();
  };

  const isDatePast = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-0 rounded-lg overflow-hidden" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Coluna esquerda - Info */}
      <div 
        className="w-full lg:w-80 p-8 border-r"
        style={{ 
          backgroundColor: colors.whiteColor,
          borderColor: '#e5e5e5',
        }}
      >
        <div className="mb-6">
          <Logo isDark={true} />
        </div>
        
        <h2 className="text-2xl font-semibold mb-6" style={{ color: colors.blackColor }}>
          Reunião de 30 min
        </h2>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.blackColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span style={{ color: colors.blackColor }}>30m</span>
          </div>

          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.blackColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
              <line x1="7" y1="2" x2="7" y2="22"/>
              <line x1="17" y1="2" x2="17" y2="22"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <line x1="2" y1="7" x2="7" y2="7"/>
              <line x1="2" y1="17" x2="7" y2="17"/>
              <line x1="17" y1="17" x2="22" y2="17"/>
              <line x1="17" y1="7" x2="22" y2="7"/>
            </svg>
            <span style={{ color: colors.blackColor }}>Cal Video</span>
          </div>

          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.blackColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <span style={{ color: colors.blackColor }}>America/Sao Paulo</span>
          </div>
        </div>
      </div>

      {/* Calendário */}
      <div 
        className="flex-1 p-8"
        style={{ 
          backgroundColor: colors.whiteColor,
        }}
      >
        {/* Header do calendário */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrevMonth}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
            style={{ color: colors.blackColor }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          
          <h3 className="text-lg font-medium" style={{ color: colors.blackColor }}>
            {monthNames[currentDate.getMonth()]} <span style={{ opacity: 0.5 }}>{currentDate.getFullYear()}</span>
          </h3>
          
          <button
            onClick={handleNextMonth}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
            style={{ color: colors.blackColor }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>

        {/* Dias da semana */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium py-2"
              style={{ color: colors.blackColor, opacity: 0.5 }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Dias do mês */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: startingDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const isPast = isDatePast(day);
            const isSelected = isDateSelected(day);

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                disabled={isPast}
                className="aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: isSelected 
                    ? colors.blackColor 
                    : isPast 
                    ? 'transparent'
                    : '#f5f5f5',
                  color: isSelected 
                    ? colors.whiteColor 
                    : isPast 
                    ? 'rgba(0, 0, 0, 0.3)' 
                    : colors.blackColor,
                  cursor: isPast ? 'not-allowed' : 'pointer',
                }}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Horários disponíveis */}
      <div 
        className="w-full lg:w-80 p-8 border-l"
        style={{ 
          backgroundColor: colors.whiteColor,
          borderColor: '#e5e5e5',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium" style={{ color: colors.blackColor }}>
            {selectedDate 
              ? `${dayNames[selectedDate.getDay()].toLowerCase().replace('.', '')}, ${selectedDate.getDate()}`
              : 'Selecione uma data'
            }
          </h3>
          <div className="flex gap-1">
            <button className="text-xs px-2 py-1 rounded" style={{ color: colors.blackColor, opacity: 0.5 }}>
              12h
            </button>
            <button className="text-xs px-2 py-1 rounded font-medium" style={{ color: colors.blackColor }}>
              24h
            </button>
          </div>
        </div>

        {!selectedDate ? (
          <div className="flex items-center justify-center h-64" style={{ color: colors.blackColor, opacity: 0.5 }}>
            <p className="text-sm text-center">
              Selecione uma data<br />no calendário
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => handleTimeClick(time)}
                className="w-full px-4 py-3 rounded-lg text-sm font-medium transition-all hover:border-gray-400 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: colors.whiteColor,
                  border: '1px solid #e5e5e5',
                  color: colors.blackColor,
                }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10b981' }} />
                {time}
              </button>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f5f5f5;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d5d5d5;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #c0c0c0;
        }
      `}</style>
    </div>
  );
};

export default Calendar;
