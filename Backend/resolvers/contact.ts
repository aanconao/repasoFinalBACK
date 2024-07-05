import { GraphQLError } from "graphql";
import { ContactModelType } from "../db/Contact.ts";
import { getCapitalInfo } from "../APIs/ConnectionAPIs.ts";

export const Contact = {
  time: async (informationTime: ContactModelType): Promise<string> => {
    try {
      const CapitalInfo = await getCapitalInfo(informationTime.capital);
      return CapitalInfo.datetime;
    } catch (error) {
      console.log(error);
      throw new GraphQLError(error);
    }
  },
};
