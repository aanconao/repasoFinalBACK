import { ContactModel, ContactModelType } from "../db/Contact.ts";
import { GraphQLError } from "graphql";
import { getInformationFromNumberPhone } from "../APIs/ConnectionAPIs.ts";
import { getInformationFromCountry } from "../APIs/ConnectionAPIs.ts";

export const Mutation = {
  addContact: async (
    _: unknown,
    args: { nombreCompleto: string; numeroTelefono: string }
  ): Promise<ContactModelType> => {
    try {
      const phoneInformation = await getInformationFromNumberPhone(
        args.numeroTelefono
      );
      if (!phoneInformation.is_valid) {
        throw new GraphQLError("invalid phone number");
      }

      const countryInformation = await getInformationFromCountry(
        phoneInformation.country
      );

      if (countryInformation.length === 0) {
        throw new GraphQLError("COuntry invalido");
      }

      const contact = new ContactModel({
        nombreCompleto: args.nombreCompleto,
        numeroTelefono: args.numeroTelefono,
        country: phoneInformation.country,
        capital: countryInformation[0].capital,
      });
      await contact.save();
      return contact;
    } catch (error) {
      console.log(error);
      throw new GraphQLError(error);
    }
  },

  deleteContact: async (_: unknown, args: { id: string }): Promise<boolean> => {
    try {
      const deleteContact = await ContactModel.deleteOne({ _id: args.id });
      return deleteContact.deletedCount === 1;
    } catch (error) {
      console.log(error);
      throw new GraphQLError(error);
    }
  },

  updateContact: async (
    _: unknown,
    args: { id: string; name: string; phone: string }
  ): Promise<ContactModelType> => {
    try {
      const searchContact = await ContactModel.findById(args.id);
      if (!searchContact) {
        throw new GraphQLError("No se ha encontrado el contacto por ese id");
      }
      if (args.phone !== searchContact.phone) {
        const phoneInformation = await getInformationFromNumberPhone(
          args.phone
        );
        if (!phoneInformation.is_valid) {
          throw new GraphQLError("Numero de telefono invalido");
        }
        const countryInformation = await getInformationFromCountry(
          phoneInformation.country
        );
        searchContact.phone = args.phone;
        searchContact.country = phoneInformation.country;
        searchContact.capital = countryInformation[0].capital;
      }

      if (args.name) {
        searchContact.name = args.name;
      }
      await searchContact.save();
      return searchContact;
    } catch (error) {
      console.log(error);
      throw new GraphQLError(error);
    }
  },
};
