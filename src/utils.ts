import { differenceInDays, addDays } from "date-fns";


const defaultDate = new Date("21-Jul-2022 11:05 AM");
const diff = differenceInDays(new Date(Date()), defaultDate);
export const checkDate = (arr: any) => {
  const updatedDates = arr.map((item: any) => {
    const startDate = new Date(item.start);
    const finishDate = new Date(item.finish);

    return {
      ...item,
      start: addDays(startDate, diff).toString(),
      finish: item.finish ? addDays(finishDate, diff).toString() : undefined,
    };
  });
  return updatedDates;
};


