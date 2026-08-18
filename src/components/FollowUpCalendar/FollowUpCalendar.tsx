import { useMemo, useState } from 'react';

import { Application } from '../../types/application';
import { formatDate } from '../../utils/applications';

type FollowUpCalendarProps = {
  applications: Application[];
  onEdit: (application: Application) => void;
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function FollowUpCalendar({ applications, onEdit }: FollowUpCalendarProps) {
  const [month, setMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const applicationsByDate = useMemo(() => {
    return applications.reduce<Record<string, Application[]>>(
      (groupedApplications, application) => {
        const currentApplications = groupedApplications[application.followUpDate] ?? [];
        groupedApplications[application.followUpDate] = [...currentApplications, application];
        return groupedApplications;
      },
      {},
    );
  }, [applications]);

  const days = useMemo(() => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const calendarStart = new Date(firstDay);
    calendarStart.setDate(firstDay.getDate() - firstDay.getDay());
    const calendarEnd = new Date(lastDay);
    calendarEnd.setDate(lastDay.getDate() + (6 - lastDay.getDay()));

    const calendarDays: Date[] = [];
    for (
      const currentDay = new Date(calendarStart);
      currentDay <= calendarEnd;
      currentDay.setDate(currentDay.getDate() + 1)
    ) {
      calendarDays.push(new Date(currentDay));
    }

    return calendarDays;
  }, [month]);

  const todayKey = formatDateKey(new Date());
  const monthLabel = month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  function changeMonth(offset: number) {
    setMonth(
      (currentMonth) => new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1),
    );
  }

  return (
    <div className="follow-up-calendar">
      <div className="calendar-controls">
        <button aria-label="Previous month" onClick={() => changeMonth(-1)} type="button">
          ←
        </button>
        <strong>{monthLabel}</strong>
        <button aria-label="Next month" onClick={() => changeMonth(1)} type="button">
          →
        </button>
      </div>
      <div className="calendar-grid" role="grid" aria-label={`${monthLabel} follow-up calendar`}>
        {WEEKDAYS.map((weekday) => (
          <span className="calendar-weekday" key={weekday} role="columnheader">
            {weekday}
          </span>
        ))}
        {days.map((day) => {
          const dateKey = formatDateKey(day);
          const scheduledApplications = applicationsByDate[dateKey] ?? [];
          const outsideMonth = day.getMonth() !== month.getMonth();

          return (
            <div
              className={`calendar-day${outsideMonth ? ' calendar-day_outside-month' : ''}${
                dateKey === todayKey ? ' calendar-day_today' : ''
              }`}
              key={dateKey}
              role="gridcell"
            >
              <span className="calendar-date">{day.getDate()}</span>
              {scheduledApplications.map((application) => (
                <button
                  className="calendar-event"
                  key={application.id}
                  onClick={() => onEdit(application)}
                  title={`${application.company} · ${application.role} · ${formatDate(
                    application.followUpDate,
                  )}`}
                  type="button"
                >
                  {application.company}
                </button>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
