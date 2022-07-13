import React from "react";

type Props = {
  dataLength: number;
};

export const EndMessage = (props: Props) => {
  return (
    <p style={{ textAlign: "center" }}>
      {props.dataLength > 20 ? <b>Yay! You have seen it all</b> : null}
    </p>
  );
};
