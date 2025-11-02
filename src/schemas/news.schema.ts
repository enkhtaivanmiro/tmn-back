import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class News {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true})
  description: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const NewsSchema = SchemaFactory.createForClass(News);