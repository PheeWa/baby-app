import React from "react";
import L from "../Assets/L letter.png";
import R from "../Assets/R letter.png";
import meals from "../Assets/meals.png";
import milkBottle from "../Assets/milkBottle.png";
import sleep from "../Assets/sleep.png";
import peeIcon from "../Assets/peeIcon.png";
import pooIcon from "../Assets/pooIcon.png";
import nappy from "../Assets/nappy.png";
import tummytimeIcon from "../Assets/tummytimeIcon.png";
import outdoorIcon from "../Assets/outdoorIcon.png";
import bathtimeIcon from "../Assets/bathtimeIcon.png";
import leisureIcon from "../Assets/leisureIcon.png";
import weightIcon from "../Assets/weightIcon.png";
import heightIcon from "../Assets/heightIcon.png";
import headIcon from "../Assets/headIcon.png";
import vaccination from "../Assets/vaccination.png";
import temperature from "../Assets/temperature.png";
import medication from "../Assets/medication.png";

type Props = {
  type: string;
};

export const IconType = ({ type }: Props) => {
  const getImgeSrc = () => {
    if (type === "left breast") {
      return L;
    } else if (type === "right breast") {
      return R;
    } else if (type === "bottle") {
      return milkBottle;
    } else if (type === "meal") {
      return meals;
    } else if (type === "Sleep") {
      return sleep;
    } else if (type === "pee") {
      return peeIcon;
    } else if (type === "poo") {
      return pooIcon;
    } else if (type === "pee & poo") {
      return nappy;
    } else if (type === "tummy time") {
      return tummytimeIcon;
    } else if (type === "play time") {
      return leisureIcon;
    } else if (type === "outdoors") {
      return outdoorIcon;
    } else if (type === "bath time") {
      return bathtimeIcon;
    } else if (type === "weight") {
      return weightIcon;
    } else if (type === "height") {
      return heightIcon;
    } else if (type === "head") {
      return headIcon;
    } else if (type === "medication") {
      return medication;
    } else if (type === "temperature") {
      return temperature;
    } else if (type === "vaccination") {
      return vaccination;
    }
  };

  return <img width="35px" src={getImgeSrc()}></img>;
};
