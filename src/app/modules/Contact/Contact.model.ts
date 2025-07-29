import { Schema, model } from 'mongoose';
import { IContact } from './Contact.interface';
      
const contactSchema = new Schema<IContact>({
  name: { 
    type: String,
    required: true
  },
  description: { 
    type: String
  }
}, {
    timestamps: true,
    versionKey: false
})
      
const ContactModel = model<IContact>('Contact', contactSchema);
export default ContactModel;
      