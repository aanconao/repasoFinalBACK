import { GraphQLError } from "graphql";
import { ContactModel } from "../db/Contact.ts";

export const Query = {
  getContacts: async () => {
    try {
      const contacts = await ContactModel.find();
      return contacts;
    } catch (error) {
      console.log(error);
      throw new GraphQLError(error);
    }
  },

  getContact: async (_: unknown, args: { id: string }) => {
    try {
      const contact = await ContactModel.findById(args.id);
      return contact;
    } catch (error) {
      console.log(error);
      throw new GraphQLError(error);
    }
  },
};
