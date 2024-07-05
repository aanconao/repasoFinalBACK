import mongoose from "npm:mongoose@7.6.3";
import { Contact } from "../types.ts";

const Schema = mongoose.Schema;

const ContactSchema = new Schema({
  nombreCompleto: { type: String, required: true },
  numeroTelefono: { type: Number, unique: true, required: true },
  country: { type: String, required: true },
  capital: { type: String, required: true },
});

export type ContactModelType = mongoose.Document &
  Omit<Contact, "id" | "time"> & { capital: string };

export const ContactModel = mongoose.model<ContactModelType>(
  "Contact",
  ContactSchema
);
