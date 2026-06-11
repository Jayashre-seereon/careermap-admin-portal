import { State, City } from "country-state-city";

export const getIndianStates = () =>
  State.getStatesOfCountry("IN");

export const getDistrictsByState = (stateCode) =>
  City.getCitiesOfState("IN", stateCode);