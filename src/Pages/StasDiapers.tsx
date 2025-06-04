import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Paper,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import {
  addSeconds,
  differenceInDays,
  differenceInSeconds,
  endOfToday,
  format,
  startOfToday,
  subDays,
} from "date-fns";
import { endOfDay, startOfDay } from "date-fns/esm";
import { capitalize } from "lodash";
import { useSelector } from "react-redux";
import {
  ComposedChart,
  XAxis,
  YAxis,
  Legend,
  Bar,
  Line,
  LabelList,
  Scatter,
  ScatterChart,
  ResponsiveContainer,
} from "recharts";
import { RootState } from "../Store/store";

export const StasDiapers = () => {
  const weeklyDiapers = useSelector((state: RootState) => {
    return state.diaper.diapers.filter((diaper) => {
      return differenceInDays(endOfToday(), new Date(diaper.start)) < 7;
    });
  });

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
    const placeholders = [...Array(7)].map((_, i) => {
      return {
        pee: 0,
        poo: 0,
        date: +startOfDay(subDays(new Date(), i)),
      };
    });
    let x: any[] = placeholders;
    weeklyDiapers.forEach((diaper) => {
      let current = x.find((item) => {
        return (
          +endOfDay(new Date(diaper.start)) === +endOfDay(new Date(item.date))
        );
      });

      if (!current) {
        return;
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
  };

  const getScatterChartDate = () => {
    let pee = [...Array(7)].map((_, i) => {
      return {
        date: +startOfDay(subDays(new Date(), i)),
      } as any;
    });
    let poo = [...Array(7)].map((_, i) => {
      return {
        date: +startOfDay(subDays(new Date(), i)),
      } as any;
    });
    weeklyDiapers.forEach((diaper) => {
      const time = differenceInSeconds(
        new Date(diaper.start),
        startOfDay(new Date(diaper.start))
      );
      const date = +startOfDay(new Date(diaper.start));

      if (diaper.type === "pee") {
        pee = [{ time: time, date: date }, ...pee];
      } else if (diaper.type === "poo") {
        poo = [{ time: time, date: date }, ...poo];
      } else {
        pee = [{ time: time + 1000, date: date }, ...pee];
        poo = [{ time: time, date: date }, ...poo];
      }
    });
    return {
      pee: pee.sort((a, b) => (a.date < b.date ? 1 : -1)),
      poo: poo.sort((a, b) => (a.date < b.date ? 1 : -1)),
    };
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
              sx={{ flexGrow: 1, textAlign: "end" }}
            >
              {avgDiapers().avgPee}
            </Typography>
          </ListItem>
          <ListItem>
            <ListItemText primary="Avg poo per day" />
            <Typography
              variant="body1"
              component="div"
              sx={{ flexGrow: 1, textAlign: "end" }}
            >
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
              }}
            >
              <XAxis
                reversed
                fontSize="12px"
                dataKey="date"
                tickFormatter={(value) => {
                  return format(new Date(value), "EEE");
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px" }}
                formatter={(value) => {
                  return capitalize(value);
                }}
              />
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
      <Paper>
        <ListSubheader
          disableSticky={true}
          style={{
            background: "transparent",
          }}
        >
          Diapering pattern by hours
        </ListSubheader>
        <Box style={{ marginBottom: "16px", padding: "16px" }}>
          <ResponsiveContainer width="100%" minHeight={600}>
            <ScatterChart
              margin={{
                top: 15,
                left: -15,
              }}
            >
              <XAxis
                interval={0}
                reversed
                fontSize="12px"
                type="category"
                dataKey="date"
                allowDuplicatedCategory={false}
                tickFormatter={(value) => {
                  if (value) {
                    return format(new Date(value), "EEE");
                  }
                  return "";
                }}
              />
              <YAxis
                reversed
                fontSize="12px"
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
              <Legend
                wrapperStyle={{ fontSize: "12px" }}
                formatter={(value) => {
                  return capitalize(value);
                }}
              />

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
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Container>
  );
};
