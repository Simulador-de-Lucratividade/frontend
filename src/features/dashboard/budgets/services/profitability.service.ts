import { AxiosResponse } from "axios";
import {
  IProfitabilityRequest,
  IProfitabilityResponse,
} from "../interfaces/IProfitabilityCalculator";
import api from "@/shared/services/api.service";

const calculateProfitability = async ({
  items,
  services,
  total_value,
  other_costs,
}: IProfitabilityRequest): Promise<AxiosResponse<IProfitabilityResponse>> =>
  await api.post("/budget/calculate-profitability", {
    items,
    services,
    total_value,
    other_costs,
  });

export const profitabilityService = { calculateProfitability };
