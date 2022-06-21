import {
  Box,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  format,
  addSeconds,
  addHours,
  differenceInDays,
  differenceInSeconds,
  endOfToday,
  isWithinInterval,
  startOfToday,
  subDays,
  startOfDay,
  endOfDay,
} from "date-fns";
import React from "react";
import { useSelector } from "react-redux";
import {
  BarChart,
  XAxis,
  Tooltip,
  Bar,
  LabelList,
  Legend,
  Line,
  LineChart,
  YAxis,
} from "recharts";
import { RootState } from "../Store/store";
import { Feeding, formatDuration } from "./FeedPage";
import { Leisure } from "./LeisurePage";
import { Sleep } from "./SleepPage";
import { formatSeconds } from "./StatsFeeding";
import { getBarData } from "./StatsTab";

export const StatsSleep = () => {
  // From Redux//
  const sleeps = useSelector((state: RootState) => state.sleep.sleeps);

  //Statistics functions//

  const avgSleep = () => {
    let numSleep = 0;
    let sumSleep = 0;
    sleeps.forEach((sleep) => {
      const thisWeek = isWithinInterval(new Date(sleep.finish), {
        start: subDays(new Date(), 6),
        end: new Date(),
      });

      if (thisWeek) {
        const diff = differenceInSeconds(
          new Date(sleep.finish),
          new Date(sleep.start)
        );
        sumSleep = sumSleep + diff;
        numSleep = numSleep + 1;
      }
    });
    const avgSleepInSec = sumSleep / 7;
    const date = addSeconds(new Date(0), avgSleepInSec);
    const x = addHours(date, 12);
    const avgSleeps = format(x, "H'h'mm'm'");
    const avgSleepTimes = (numSleep / 7).toFixed(1);
    return { avgSleeps, avgSleepTimes };
  };

  const getDataInSec = () => {
    const thisWeekSleeps = sleeps.filter((sleep) => {
      const thisWeek = isWithinInterval(new Date(sleep.finish), {
        start: subDays(new Date(), 6),
        end: new Date(),
      });

      if (thisWeek) {
        return true;
      }
    });
    let extraChartData: any = [];
    const chartData = thisWeekSleeps.map((sleep, i) => {
      const startDate = new Date(sleep.start);
      const finishDate = new Date(sleep.finish);
      const daysDiff = differenceInDays(
        endOfDay(startDate),
        endOfDay(finishDate)
      );

      if (daysDiff === 0) {
        return {
          name: `${i}`,
          // type: "red",
          data: [
            {
              time: differenceInSeconds(startDate, startOfDay(startDate)),
              date: +startOfDay(startDate),
            },

            {
              time: differenceInSeconds(finishDate, startOfDay(finishDate)),
              date: +startOfDay(finishDate),
            },
          ],
        };
      } else {
        const extraChartItem = {
          name: `${i}-extra`,
          data: [
            {
              time: 0,
              date: +startOfDay(finishDate),
            },

            {
              time: differenceInSeconds(finishDate, startOfDay(finishDate)),
              date: +startOfDay(finishDate),
            },
          ],
        };
        extraChartData = [...extraChartData, extraChartItem];

        return {
          name: `${i}`,
          data: [
            {
              time: differenceInSeconds(startDate, startOfDay(startDate)),
              date: +startOfDay(startDate),
            },

            {
              time: differenceInSeconds(
                endOfDay(startDate),
                startOfDay(startDate)
              ),
              date: +startOfDay(startDate),
            },
          ],
        };
      }
    });
    return [
      {
        name: `}`,
        data: [
          {
            time: 0,
            date: 0,
          },

          {
            time: 1,
            date: 0,
          },
        ],
      },
      ...chartData,
      ...extraChartData,
    ];
  };
  console.log("hahahah", getDataInSec());

  return (
    <Box>
      <List
        subheader={
          <ListSubheader
          // component="div" id="nested-list-subheader"
          >
            Statistics
          </ListSubheader>
        }
      >
        <ListItem>
          <ListItemText primary="Avg sleep per day" />
          <Typography
            variant="body1"
            component="div"
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            {avgSleep().avgSleeps}
          </Typography>
        </ListItem>
        <ListItem>
          <ListItemText primary="Avg times per day" />
          <Typography
            variant="body1"
            component="div"
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            {avgSleep().avgSleepTimes}
          </Typography>
        </ListItem>
      </List>
      <Box>
        <Typography>Sleep duration by days</Typography>

        {/* <ResponsiveContainer width="100%" height="100%"> */}
        <BarChart
          width={400}
          height={300}
          data={getBarData(sleeps)}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis
            dataKey="date"
            tickFormatter={(value) => {
              return format(value, "EEE");
            }}
          />
          {/* <YAxis /> */}
          {/* <Legend /> */}
          <Tooltip
            labelFormatter={(value: any) => {
              return format(value, "LLL d yyyy");
            }}
            formatter={(value: any) => {
              return formatSeconds(value);
            }}
          />
          <Bar dataKey="time" stackId="a" fill="#82ca9d">
            <LabelList
              position={"top"}
              formatter={(value: any) => {
                return formatSeconds(value);
              }}
            />
          </Bar>
        </BarChart>
        {/* </ResponsiveContainer> */}

        <LineChart width={350} height={600}>
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis
            dataKey="date"
            type="category"
            allowDuplicatedCategory={false}
            tickFormatter={(value) => {
              console.log(value);
              if (value === 0) {
                return "";
              }
              return format(new Date(value), "EEE");
            }}
          />
          <YAxis
            // ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
            tickFormatter={(value) => {
              const date = addSeconds(startOfToday(), value);
              return format(date, "h a");
            }}
            tickCount={13}
            interval="preserveStartEnd"
            allowDataOverflow={false}
            // domain={[
            //   0,
            //   differenceInSeconds(startOfToday(), endOfToday()) + 9999,
            // ]}
            // domain={[0, "dataMax + 3600"]}
            domain={[0, 86400]}
            // dataKey="hahah"
          />
          {/* <Tooltip /> */}
          {/* <Legend /> */}
          {getDataInSec().map((s: any) => {
            return (
              <Line
                dataKey="time"
                data={s.data}
                name={s.name}
                key={s.name}
                dot={false}
                strokeWidth={7}
              />
            );
          })}
        </LineChart>
      </Box>
    </Box>
  );
};
