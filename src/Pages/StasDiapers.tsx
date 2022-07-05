import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import {
  addSeconds,
  differenceInSeconds,
  endOfToday,
  format,
  isWithinInterval,
  startOfToday,
  subDays,
} from "date-fns";
import { endOfDay, startOfDay } from "date-fns/esm";
import React from "react";
import { useSelector } from "react-redux";
import {
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Bar,
  Line,
  LabelList,
  Scatter,
  ScatterChart,
  ZAxis,
  ResponsiveContainer,
} from "recharts";
import { RootState } from "../Store/store";
import { formatSeconds } from "./StatsFeeding";
import { avgEvent, getLineChartData } from "./StatsSleep";

export const StasDiapers = () => {
  const weeklyDiapers = useSelector((state: RootState) => {
    return state.diaper.diapers.filter((diaper) => {
      const thisWeek = isWithinInterval(new Date(diaper.start), {
        start: subDays(new Date(), 7),
        end: new Date(),
      });

      if (thisWeek) {
        return true;
      }
    });
  });
  //   console.log("hahahahah", weeklyDiapers);

  const avgDiapers = () => {
    let sumPee = 0;
    let sumPoo = 0;
    weeklyDiapers.forEach((diaper) => {
      if (diaper.type === "pee") {
        sumPee = sumPee + 1;
      } else if (diaper.type === "poo") {
        sumPoo = sumPoo + 1;
      } else {
        sumPee = sumPee + 1;
        sumPoo = sumPoo + 1;
      }
    });
    const avgPee = (sumPee / 7).toFixed(1);
    const avgPoo = (sumPoo / 7).toFixed(1);
    return { avgPee, avgPoo };
  };

  const getComposedChartData = () => {
    let x: any[] = [];
    weeklyDiapers.forEach((diaper) => {
      let current = x.find((item) => {
        return (
          +endOfDay(new Date(diaper.start)) === +endOfDay(new Date(item.date))
        );
      });

      if (!current) {
        x = [{ date: diaper.start, pee: 0, poo: 0 }, ...x];
        current = x[0];
      }

      if (diaper.type === "pee") {
        current.pee = current.pee + 1;
      } else if (diaper.type === "poo") {
        current.poo = current.poo + 1;
      } else {
        current.pee = current.pee + 1;
        current.poo = current.poo + 1;
      }
    });
    return x;
    // return x.map((item, i) => {
    //   return {
    //     date: subDays(endOfToday(), i),
    //     pee: item.pee,
    //     poo: item.poo,
    //   };
    // });
  };

  const data01 = [
    { x: 100, y: 200, z: 200 },
    { x: 120, y: 100, z: 260 },
    { x: 170, y: 300, z: 400 },
    { x: 140, y: 250, z: 280 },
    { x: 150, y: 400, z: 500 },
    { x: 110, y: 280, z: 200 },
  ];
  const data02 = [
    { x: 200, y: 260, z: 240 },
    { x: 240, y: 290, z: 220 },
    { x: 190, y: 290, z: 250 },
    { x: 198, y: 250, z: 210 },
    { x: 180, y: 280, z: 260 },
    { x: 210, y: 220, z: 230 },
  ];

  const getScatterChartDate = () => {
    let pee: any[] = [];
    let poo: any[] = [];
    weeklyDiapers.forEach((diaper) => {
      const time = differenceInSeconds(
        new Date(diaper.start),
        startOfDay(new Date(diaper.start))
      );
      const date = startOfDay(new Date(diaper.start)).toString();

      if (diaper.type === "pee") {
        pee = [{ time: time, date: date }, ...pee];
      } else if (diaper.type === "poo") {
        poo = [{ time: time, date: date }, ...poo];
      } else {
        pee = [{ time: time + 600, date: date }, ...pee];
        poo = [{ time: time, date: date }, ...poo];
      }
    });
    return { pee, poo };
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
            <ListItemText primary="Avg pee per day" />
            <Typography
              variant="body1"
              component="div"
              sx={{ flexGrow: 1, textAlign: "center" }}
            >
              {/* {avgSleep().avgSleeps} */}
              {/* {avgEvent(xxx).avgEvents} */}
              {avgDiapers().avgPee}
            </Typography>
          </ListItem>
          <ListItem>
            <ListItemText primary="Avg poo per day" />
            <Typography
              variant="body1"
              component="div"
              sx={{ flexGrow: 1, textAlign: "center" }}
            >
              {/* {avgSleep().avgSleeps} */}
              {/* {avgEvent(xxx).avgEvents} */}
              {avgDiapers().avgPoo}
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
          Diapering by days
        </ListSubheader>
        <Box style={{ marginBottom: "16px", padding: "16px" }}>
          <ResponsiveContainer width="100%" minHeight={400}>
            <ComposedChart
              data={getComposedChartData()}
              margin={{
                top: 15,
                // right: 10,
                // left: 10,
              }}
            >
              {/* <CartesianGrid stroke="#f5f5f5" /> */}
              <XAxis
                fontSize="12px"
                dataKey="date"
                // scale="band"
                tickFormatter={(value) => {
                  return format(new Date(value), "EEE");
                }}
              />
              {/* <YAxis /> */}
              {/* <Tooltip /> */}
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="pee" barSize={20} fill="#8884d8">
                <LabelList
                  style={{ fill: "#8884d8", fontSize: "12px" }}
                  position={"top"}
                  formatter={(value: any) => {
                    return value;
                  }}
                />
              </Bar>
              <Line
                type="monotone"
                dataKey="poo"
                stroke="#82ca9d"
                // dot={{ stroke: "#ff7300", strokeWidth: 10 }}
                activeDot={{ r: 8 }}
              >
                <LabelList
                  style={{ fill: "#82ca9d", fontSize: "12px" }}
                  position={"top"}
                  formatter={(value: any) => {
                    return value;
                  }}
                />
              </Line>
            </ComposedChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
      <Box>
        <Typography>Diapering pattern by hours</Typography>
        <ScatterChart
          width={400}
          height={600}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          {/* <CartesianGrid /> */}
          <XAxis
            type="category"
            dataKey="date"
            allowDuplicatedCategory={false}
            tickFormatter={(value) => {
              console.log("bbbb " + value);
              // return "x";
              if (value) {
                return format(new Date(value), "EEE");
              }
              return "x";
            }}
          />
          <YAxis
            type="number"
            dataKey="time"
            tickFormatter={(value) => {
              const date = addSeconds(startOfToday(), value);
              return format(date, "h a");
            }}
            tickCount={13}
            interval="preserveStartEnd"
            allowDataOverflow={false}
            domain={[0, 86400]}
          />
          {/* <ZAxis type="number" dataKey="z" range={[60, 400]} name="score" unit="km" /> */}
          {/* <Tooltip cursor={{ strokeDasharray: '3 3' }} /> */}
          <Legend />

          <Scatter
            name="pee"
            data={getScatterChartDate().pee}
            fill="#8884d8"
            shape="triangle"
          />
          <Scatter
            name="poo"
            data={getScatterChartDate().poo}
            fill="#82ca9d"
            shape="circle"
          />
        </ScatterChart>
      </Box>
    </Container>
  );
};
