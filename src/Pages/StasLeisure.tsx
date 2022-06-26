import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
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
      <Typography>Leisure schedule</Typography>
      <LineChart width={350} height={600}>
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
          payload={[
            { value: "Tummy time", type: "rect", id: "ID01", color: "#82ca9d" },
            { value: "Outdoors", type: "rect", id: "ID02", color: "#f27a0d" },
            { value: "Bath time", type: "rect", id: "ID03", color: "#8884d8" },
            { value: "Play time", type: "rect", id: "ID04", color: "#0280f5" },
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
      <Box>
        <Typography>Tummy time duration</Typography>
        <BarChart
          width={400}
          height={300}
          data={getBarData(weeklyTummyTime)}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis
            dataKey="date"
            tickFormatter={(value) => {
              return format(value, "EEE");
            }}
          />
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
                // return "hahahha";
              }}
            />
          </Bar>
        </BarChart>
      </Box>
      <Box>
        <Typography>Time spent outdoors</Typography>
        <BarChart
          width={400}
          height={300}
          data={getBarData(weeklyOutdoors)}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis
            dataKey="date"
            tickFormatter={(value) => {
              return format(value, "EEE");
            }}
          />
          <Tooltip
            labelFormatter={(value: any) => {
              return format(value, "LLL d yyyy");
            }}
            formatter={(value: any) => {
              return formatSeconds(value);
            }}
          />
          <Bar dataKey="time" stackId="a" fill="#f27a0d">
            <LabelList
              position={"top"}
              formatter={(value: any) => {
                return formatSeconds(value);
                // return "hahahha";
              }}
            />
          </Bar>
        </BarChart>
      </Box>
      <Box>
        <Typography>Bathing duration</Typography>
        <BarChart
          width={400}
          height={300}
          data={getBarData(weeklyBathTime)}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis
            dataKey="date"
            tickFormatter={(value) => {
              return format(value, "EEE");
            }}
          />
          <Tooltip
            labelFormatter={(value: any) => {
              return format(value, "LLL d yyyy");
            }}
            formatter={(value: any) => {
              return formatSeconds(value);
            }}
          />
          <Bar dataKey="time" stackId="a" fill="#8884d8">
            <LabelList
              position={"top"}
              formatter={(value: any) => {
                return formatSeconds(value);
                // return "hahahha";
              }}
            />
          </Bar>
        </BarChart>
      </Box>
      <Box>
        <Typography>Playing duration</Typography>
        <BarChart
          width={400}
          height={300}
          data={getBarData(weeklyPlayTime)}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis
            dataKey="date"
            tickFormatter={(value) => {
              return format(value, "EEE");
            }}
          />
          <Tooltip
            labelFormatter={(value: any) => {
              return format(value, "LLL d yyyy");
            }}
            formatter={(value: any) => {
              return formatSeconds(value);
            }}
          />
          <Bar dataKey="time" stackId="a" fill="#0280f5">
            <LabelList
              position={"top"}
              formatter={(value: any) => {
                return formatSeconds(value);
                // return "hahahha";
              }}
            />
          </Bar>
        </BarChart>
      </Box>
    </Box>
  );
};
