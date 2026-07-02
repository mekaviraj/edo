import mongoose, { Schema, model, models } from 'mongoose';

export interface IStudent {
  roll: string;
  name: string;
  cluster: number;
}

export interface ITeam {
  mentor?: string;
  members: IStudent[];
  createdAt: Date;
}

const StudentSchema = new Schema<IStudent>({
  roll: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  cluster: { type: Number, required: true, enum: [1, 2, 3] },
});

const TeamSchema = new Schema<ITeam>({
  mentor: { type: String, default: '' },
  members: [
    {
      roll: { type: String, required: true },
      name: { type: String, required: true },
      cluster: { type: Number, required: true, enum: [1, 2, 3] },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

// Use existing models if defined to prevent mongoose OverwriteModelError during hot reload
export const Student = models.Student || model<IStudent>('Student', StudentSchema);
export const Team = models.Team || model<ITeam>('Team', TeamSchema);
