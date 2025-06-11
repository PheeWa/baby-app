import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { format } from "date-fns";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import { EndMessage } from "../Components/EndMessage";
import { getLabel, getUnit } from "../Components/GrowthDialog";
import { Header } from "../Components/Header";
import { IconType } from "../Components/IconType";
import { ScrollLoader } from "../Components/ScrollLoader";
import { useInfiniteScroll } from "../Hooks/infiniteScroll";
import { useFeedings } from "../Hooks/useFeedings";
import { useSleeps } from "../Hooks/useSleeps";
import { useDiapers } from "../Hooks/useDiapers";
import { RootState } from "../Store/store";
import { Diaper } from "./DiapersPage";
import { formatDuration } from "./FeedPage";
import { Feeding } from "../Types/feeding";
import { Growth } from "./GrowthPage";
import { Health } from "./HealthPage";

export const AllLogsPage = () => {
  const userId = useSelector((state: RootState) => state.auth.user);
  const { data: feedings = [] } = useFeedings(userId?.userId || "");
  const { data: sleeps = [] } = useSleeps(userId?.userId || "");
  const { data: diapers = [] } = useDiapers(userId?.userId || "");
  const leisures = useSelector((state: RootState) => state.leisure.leisures);
  const healths = useSelector((state: RootState) => state.health.healths);
  const growths = useSelector((state: RootState) => state.growth.growths);

  const allLogs = [
    ...feedings,
    ...sleeps,
    ...leisures,
    ...diapers,
    ...healths,
    ...growths,
  ];

  allLogs.sort((a, b) => {
    const aStart = +new Date(a.start);
    const bStart = +new Date(b.start);

    if (aStart < bStart) {
      return 1;
    } else {
      return -1;
    }
  });
  const { fetchData, slicedList, dataLength, hasMore } =
    useInfiniteScroll(allLogs);

  return (
    <Box>
      <Header title="All logs" />
      <List>
        <InfiniteScroll
          dataLength={dataLength}
          next={fetchData}
          hasMore={hasMore}
          loader={<ScrollLoader />}
          endMessage={<EndMessage dataLength={dataLength} />}
        >
          {slicedList.map((log) => {
            if (
              log.type === "meal" ||
              log.type === "left breast" ||
              log.type === "right breast" ||
              log.type === "bottle" ||
              log.type === "tummy time" ||
              log.type === "play time" ||
              log.type === "outdoors" ||
              log.type === "bath time" ||
              log.type === "Sleep"
            ) {
              const logx = log as Feeding;
              const textFSL = `${format(
                new Date(log.start),
                "p"
              )}, ${formatDuration(logx.start, logx.finish)}, ${logx.type}`;

              return (
                <ListItem>
                  <ListItemAvatar>
                    <Avatar style={{ backgroundColor: "#151e33" }}>
                      <IconType type={log.type} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={textFSL} />
                </ListItem>
              );
            } else if (
              log.type === "pee" ||
              log.type === "poo" ||
              log.type === "pee & poo"
            ) {
              const logy = log as Diaper;
              const textDiaper = `${format(new Date(logy.start), "p")},${logy.type
                }`;
              return (
                <ListItem>
                  <ListItemAvatar>
                    <Avatar style={{ backgroundColor: "#151e33" }}>
                      <IconType type={log.type} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={textDiaper} />
                </ListItem>
              );
            }
            if (
              log.type === "weight" ||
              log.type === "height" ||
              log.type === "head"
            ) {
              const logG = log as Growth;
              const textGrowth = `${format(
                new Date(logG.start),
                "p"
              )},${getLabel(logG.type)},${logG.value}${getUnit(logG.type)}`;
              return (
                <ListItem>
                  <ListItemAvatar>
                    <Avatar style={{ backgroundColor: "#151e33" }}>
                      <IconType type={log.type} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={textGrowth} />
                </ListItem>
              );
            } else if (
              log.type === "medication" ||
              log.type === "temperature" ||
              log.type === "vaccination"
            ) {
              const logH = log as Health;
              const textHealth = `${format(new Date(logH.start), "p")}`;
              const showValue = () => {
                if (logH.value) {
                  return `${logH.value} °C`;
                } else {
                  return "";
                }
              };

              return (
                <ListItem>
                  <ListItemAvatar>
                    <Avatar style={{ backgroundColor: "#151e33" }}>
                      <IconType type={log.type} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${textHealth}, ${logH.type} ${showValue()}`}
                  />
                </ListItem>
              );
            }
          })}
        </InfiniteScroll>
      </List>
    </Box>
  );
  //
};
