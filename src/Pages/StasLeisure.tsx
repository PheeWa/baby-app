import {
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Paper,
  Typography,
} from "@mui/material";
import {
  addSeconds,
  differenceInSeconds,
  format,
  isWithinInterval,
  startOfToday,
  subDays,
} from "date-fns";
import React from "react";
import { useSelector } from "react-redux";
import {
  LineChart,
  XAxis,
  YAxis,
  Line,
  Legend,
  Bar,
  BarChart,
  LabelList,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RootState } from "../Store/store";
import { LeisureType } from "./LeisurePage";
import { formatSeconds } from "./StatsFeeding";
import { avgEvent, getLineChartData } from "./StatsSleep";
import { getBarData } from "./StatsTab";

export const StasLeisure = () => {
  const weeklyLeisures = useSelector((state: RootState) => {
    return state.leisure.leisures.filter((leisure) => {
      const thisWeek = isWithinInterval(new Date(leisure.finish), {
        start: subDays(new Date(), 7),
        end: new Date(),
      });
      if (thisWeek) {
        return true;
      }
    });
  });
  //for statistics//

  const weeklyTummyTime = weeklyLeisures.filter((leisure) => {
    if (leisure.type === "tummy time") {
      return true;
    }
  });

  const weeklyPlayTime = weeklyLeisures.filter((leisure) => {
    if (leisure.type === "play time") {
      return true;
    }
  });

  const weeklyOutdoors = weeklyLeisures.filter((leisure) => {
    if (leisure.type === "outdoors") {
      return true;
    }
  });
  const weeklyBathTime = weeklyLeisures.filter((leisure) => {
    if (leisure.type === "bath time") {
      return true;
    }
  });

  const getColor = (type: LeisureType) => {
    if (type === "tummy time") {
      return "#82ca9d";
    } else if (type === "outdoors") {
      return "#f27a0d";
    }
    if (type === "bath time") {
      return "#8884d8";
    } else {
      return "#0280f5";
    }
  };

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
            >
              Statistics
            </ListSubheader>
          }
        >
          <ListItem>
            <ListItemText primary="Avg tummy time per day" />
            <Typography
              variant="body1"
              component="div"
              sx={{ flexGrow: 1, textAlign: "center" }}
            >
              {/* {avgSleep().avgSleeps} */}
              {avgEvent(weeklyTummyTime).avgEvents}
            </Typography>
          </ListItem>
          <ListItem>
            <ListItemText primary="Avg play time per day" />
            <Typography
              variant="body1"
              component="div"
              sx={{ flexGrow: 1, textAlign: "center" }}
            >
              {/* {avgSleep().avgSleepTimes} */}
              {avgEvent(weeklyPlayTime).avgEvents}
            </Typography>
          </ListItem>
          <ListItem>
            <ListItemText primary="Avg time outdoors per day" />
            <Typography
              variant="body1"
              component="div"
              sx={{ flexGrow: 1, textAlign: "center" }}
            >
              {/* {avgSleep().avgSleepTimes} */}
              {avgEvent(weeklyOutdoors).avgEvents}
            </Typography>
          </ListItem>
        </List>
      </Paper>
      <Paper>
        <ListSubheader
          disableSticky={true}
          style={{
            background: "transparent",
          }}
        >
          Leisure schedule
        </ListSubheader>
        <Box style={{ marginBottom: "16px", padding: "16px" }}>
          <ResponsiveContainer width="100%" minHeight={600}>
            <LineChart margin={{ left: -15, right: 5 }}>
              <XAxis
                fontSize="12px"
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
                fontSize="12px"
                tickFormatter={(value) => {
                  const date = addSeconds(startOfToday(), value);
                  return format(date, "h a");
                }}
                tickCount={13}
                interval="preserveStartEnd"
                allowDataOverflow={false}
                domain={[0, 86400]}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px" }}
                payload={[
                  {
                    value: "Tummy time",
                    type: "rect",
                    id: "ID01",
                    color: "#82ca9d",
                  },
                  {
                    value: "Outdoors",
                    type: "rect",
                    id: "ID02",
                    color: "#f27a0d",
                  },
                  {
                    value: "Bath time",
                    type: "rect",
                    id: "ID03",
                    color: "#8884d8",
                  },
                  {
                    value: "Play time",
                    type: "rect",
                    id: "ID04",
                    color: "#0280f5",
                  },
                ]}
              />
              {getLineChartData(weeklyLeisures).map((s: any) => {
                return (
                  <Line
                    dataKey="time"
                    data={s.data}
                    name={s.name}
                    key={s.name}
                    dot={false}
                    strokeWidth={7}
                    stroke={getColor(s.type)}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
      <Paper>
        <ListSubheader
          disableSticky={true}
          style={{
            background: "transparent",
          }}
        >
          Tummy time duration
        </ListSubheader>
        <Box style={{ marginBottom: "16px", padding: "16px" }}>
          <ResponsiveContainer width="100%" minHeight={300}>
            <BarChart data={getBarData(weeklyTummyTime)}>
              <XAxis
                fontSize="12px"
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
                    // return "hahahha";
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
          style={{
            background: "transparent",
          }}
        >
          Time spent outdoors
        </ListSubheader>
        <Box style={{ marginBottom: "16px", padding: "16px" }}>
          <ResponsiveContainer width="100%" minHeight={300}>
            <BarChart
              data={getBarData(weeklyOutdoors)}
              margin={{
                top: 15,
              }}
            >
              <XAxis
                fontSize="12px"
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
              <Bar dataKey="time" stackId="a" fill="#f27a0d">
                <LabelList
                  style={{ fill: "#f27a0d", fontSize: "12px" }}
                  position={"top"}
                  formatter={(value: any) => {
                    return formatSeconds(value);
                    // return "hahahha";
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
          style={{
            background: "transparent",
          }}
        >
          Bathing duration
        </ListSubheader>
        <Box style={{ marginBottom: "16px", padding: "16px" }}>
          <ResponsiveContainer width="100%" minHeight={300}>
            <BarChart
              data={getBarData(weeklyBathTime)}
              margin={{
                top: 15,
              }}
            >
              <XAxis
                fontSize="12px"
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
              <Bar dataKey="time" stackId="a" fill="#8884d8">
                <LabelList
                  style={{ fill: "#8884d8", fontSize: "12px" }}
                  position={"top"}
                  formatter={(value: any) => {
                    return formatSeconds(value);
                    // return "hahahha";
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
          style={{
            background: "transparent",
          }}
        >
          Playing duration
        </ListSubheader>
        <Box style={{ marginBottom: "16px", padding: "16px" }}>
          <ResponsiveContainer width="100%" minHeight={300}>
            <BarChart
              data={getBarData(weeklyPlayTime)}
              margin={{
                top: 15,
              }}
            >
              <XAxis
                fontSize="12px"
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
              <Bar dataKey="time" stackId="a" fill="#0280f5">
                <LabelList
                  style={{ fill: "#0280f5", fontSize: "12px" }}
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
    </Container>
  );
};
