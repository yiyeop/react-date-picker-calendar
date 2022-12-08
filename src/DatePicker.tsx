import { useCallback, useMemo, useState } from "react";

const chunk = (arr: any[], size: number) => {
  const result: any[] = [];

  arr.forEach((item, index) => {
    index % size === 0 && result.push([]);
    result[result.length - 1].push(item);
  });

  return result;
};

const days = ["일", "월", "화", "수", "목", "금", "토"];

class MonthCalendar {
  year: number;
  month: number;

  constructor(year: number, month: number) {
    this.year = year;
    this.month = month;
  }

  getDates() {
    let lastDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // 윤년에따라 2월 변경
    const isLeapYear =
      (this.year % 4 === 0 && this.year % 100 !== 0) || this.year % 400 === 0;
    lastDay[1] = isLeapYear ? 29 : 28;

    const thisDates = Array(lastDay[this.month - 1])
      .fill(null)
      .map((_, index) => index + 1);
    const startDay = new Date(this.year, this.month - 1, 1).getDay();

    return Array(startDay).fill("").concat(thisDates);
  }
}

const CalendarTable = ({
  year,
  month,
  onDateClick
}: {
  year: number;
  month: number;
  onDateClick: (date: Date) => void;
}) => {
  const monthCalendar = new MonthCalendar(year, month);

  const handleClick = useCallback(
    (date) => {
      const selectedDate = new Date(year, month - 1, date);
      onDateClick(selectedDate);
    },
    [year, month, onDateClick]
  );

  return (
    <div>
      <div>
        {year}.{month}
      </div>
      <table style={{ textAlign: "center" }}>
        <thead>
          <tr>
            {days.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {chunk(monthCalendar.getDates(), 7).map(
            (week: number[], index: number) => (
              <tr key={index}>
                {week.map((date: any, idx: number) => (
                  <td key={`date_${idx}`} onClick={() => handleClick(date)}>
                    {date}
                  </td>
                ))}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default function DatePicker() {
  const [date, setDate] = useState(new Date());

  const nextDate = useMemo(() => {
    let nextDate = new Date(date);
    nextDate.setMonth(date.getMonth() + 1);
    return nextDate;
  }, [date]);

  const handleClickMonth = (add: number) => {
    let nextDate = new Date(date);
    nextDate.setMonth(date.getMonth() + add);
    setDate(nextDate);
  };

  return (
    <div>
      <button onClick={() => handleClickMonth(-1)}>이전</button>
      <button onClick={() => handleClickMonth(1)}>다음</button>

      <div style={{ display: "flex" }}>
        <CalendarTable
          year={date.getFullYear()}
          month={date.getMonth() + 1}
          onDateClick={(date) => console.log(date)}
        />
        <div style={{ margin: "20px" }} />
        <CalendarTable
          year={nextDate.getFullYear()}
          month={nextDate.getMonth() + 1}
          onDateClick={(date) => console.log(date)}
        />
      </div>
    </div>
  );
}
