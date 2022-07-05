import {
  Box,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Chip,
} from "@mui/material";
import { Container } from "@mui/system";
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
import { syncBuiltinESMExports } from "module";
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
  ResponsiveContainer,
} from "recharts";
import { RootState } from "../Store/store";
import { Leisure } from "./LeisurePage";
import { Sleep } from "./SleepPage";
import { formatSeconds } from "./StatsFeeding";
import { getBarData } from "./StatsTab";

export const getLineChartData = (
  events: { start: string; finish: string; type: string }[]
) => {
  // const thisWeekEvents = events.filter((event) => {
  //   const thisWeek = isWithinInterval(new Date(event.finish), {
  //     start: subDays(new Date(), 7),
  //     end: new Date(),
  //   });

  //   if (thisWeek) {
  //     return true;
  //   }
  // });
  let extraChartData: any = [];
  const chartData = events.map((event, i) => {
    const startDate = new Date(event.start);
    const finishDate = new Date(event.finish);
    const daysDiff = differenceInDays(
      endOfDay(startDate),
      endOfDay(finishDate)
    );

    if (daysDiff === 0) {
      return {
        name: `${i}`,
        type: event.type,
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
        type: event.type,
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
        type: event.type,
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

export const avgEvent = (events: Sleep[] | Leisure[]) => {
  let numEvents = 0;
  let sumEvents = 0;
  events.forEach((event) => {
    // const thisWeek = isWithinInterval(new Date(event.finish), {
    //   start: subDays(new Date(), 9),
    //   end: new Date(),
    // });

    const diff = differenceInSeconds(
      new Date(event.finish),
      new Date(event.start)
    );
    sumEvents = sumEvents + diff;
    numEvents = numEvents + 1;
  });
  const avgEventInSec = sumEvents / 7;
  const avgEvents = formatSeconds(avgEventInSec);
  const avgEventsTimes = (numEvents / 7).toFixed(1);
  return { avgEvents, avgEventsTimes };
};

export const StatsSleep = () => {
  // From Redux//
  const weeklySleeps = useSelector((state: RootState) => {
    return state.sleep.sleeps.filter((sleep) => {
      const thisWeek = isWithinInterval(new Date(sleep.finish), {
        start: subDays(new Date(), 7),
        end: new Date(),
      });

      if (thisWeek) {
        return true;
      }
    });
  });

  //Statistics functions//

  return (
    <Container>
      <Paper style={{ marginTop: "16px", marginBottom: "16px" }}>
        <List
          subheader={
            <ListSubheader
              disableSticky={true}
              style={{
                background: "transparent",
              }}
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
              {avgEvent(weeklySleeps).avgEvents}
            </Typography>
          </ListItem>
          <ListItem>
            <ListItemText primary="Avg times per day" />
            <Typography
              variant="body1"
              component="div"
              sx={{ flexGrow: 1, textAlign: "center" }}
            >
              {avgEvent(weeklySleeps).avgEventsTimes}
            </Typography>
          </ListItem>
        </List>
      </Paper>
      <Paper>
        <ListSubheader
          disableSticky={true}
          style={{ background: "transparent" }}
        >
          Sleep duration by days
        </ListSubheader>
        <Box style={{ marginBottom: "16px", padding: "16px" }}>
          <ResponsiveContainer width="100%" minHeight={300}>
            <BarChart
              data={getBarData(weeklySleeps)}
              margin={{
                top: 10,
                right: 10,
                left: 10,
              }}
            >
              <XAxis
                style={{ fontSize: "12px" }}
                dataKey="date"
                tickFormatter={(value) => {
                  return format(value, "EEE");
                }}
              />
              <Tooltip
                cursor={{ fill: "#1b2641" }}
                contentStyle={{
                  backgroundColor: "#081228",
                  border: "none",
                  borderRadius: "10px",
                }}
                labelFormatter={(value: any) => {
                  return format(value, "LLL d yyyy");
                }}
                formatter={(value: any) => {
                  return formatSeconds(value);
                }}
              />
              <Bar dataKey="time" stackId="a" fill="#82ca9d">
                <LabelList
                  style={{ fill: "#82ca9d", fontSize: "12px" }}
                  position={"top"}
                  formatter={(value: any) => {
                    return formatSeconds(value);
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
      <Paper>
        <ListSubheader
          disableSticky={true}
          style={{ background: "transparent" }}
        >
          Sleep duration by days
        </ListSubheader>
        <Box style={{ marginBottom: "16px", padding: "16px" }}>
          <ResponsiveContainer width="100%" minHeight={500}>
            <LineChart margin={{ left: -15, right: 5 }}>
              <XAxis
                style={{ fontSize: "12px" }}
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
                style={{ fontSize: "12px" }}
                tickFormatter={(value) => {
                  const date = addSeconds(startOfToday(), value);
                  return format(date, "h a");
                }}
                tickCount={13}
                interval="preserveStartEnd"
                allowDataOverflow={false}
                domain={[0, 86400]}
              />
              {getLineChartData(weeklySleeps).map((s: any) => {
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
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Container>
  );
};
