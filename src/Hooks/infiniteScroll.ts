import { useState } from "react";

export const useInfiniteScroll = (list: any[]) => {
  const [limit, setLimit] = useState(19);
  const fetchData = () => {
    setTimeout(() => {
      setLimit(limit + 20);
    }, 1000);
  };

  const slicedList = list.slice(0, limit + 1);
  const dataLength = slicedList.length;

  const hasMore = limit < slicedList.length;
  return {
    limit,
    fetchData,
    slicedList,
    dataLength,
    hasMore,
  };
};
