import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema({ timestamps: true })
export class News {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, unique: true, sparse: true }) 
  slug: string;

  @Prop({ type: Object, required: true })
  description: Record<string, string>;

  @Prop({ type: String })
  coverImage?: string;

  @Prop({ type: Boolean, default: false })
  published: boolean;

  @Prop({ type: String })
  author?: string;

  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Prop({ type: Date })
  publishedAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export type NewsDocument = HydratedDocument<News>;

export const NewsSchema = SchemaFactory.createForClass(News);

NewsSchema.index({ slug: 1 });
NewsSchema.index({ published: 1, createdAt: -1 });
NewsSchema.index({ title: 'text' });
NewsSchema.index({ tags: 1 });

async function generateUniqueSlug(
  title: string,
  model: Model<NewsDocument>,
  excludeId?: any,
): Promise<string> {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!baseSlug) {
    return `news-${Date.now()}`;
  }

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query: any = { slug };
    
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existing = await model.findOne(query).lean();

    if (!existing) break;

    slug = `${baseSlug}-${counter}`;
    counter++;

    if (counter > 1000) {
      slug = `${baseSlug}-${Date.now()}`;
      break;
    }
  }

  return slug;
}

NewsSchema.pre('save', async function (next) {
  try {
    if (!this.slug || this.isModified('title')) {
      const NewsModel = this.model(News.name) as Model<NewsDocument>;
      this.slug = await generateUniqueSlug(this.title, NewsModel, this._id);
    }

    if (this.isModified('published') && this.published && !this.publishedAt) {
      this.publishedAt = new Date();
    }

    if (this.isModified('published') && !this.published) {
      this.publishedAt = undefined;
    }

    next();
  } catch (error) {
    next(error);
  }
});

NewsSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const update = this.getUpdate() as any;
    
    if (update.title || update.$set?.title) {
      const title = update.title || update.$set.title;
      const docToUpdate = await this.model.findOne(this.getQuery());
      
      if (docToUpdate) {
        const NewsModel = this.model as Model<NewsDocument>;
        const newSlug = await generateUniqueSlug(title, NewsModel, docToUpdate._id);
        
        if (update.$set) {
          update.$set.slug = newSlug;
        } else {
          update.slug = newSlug;
        }
      }
    }

    if (update.published === true || update.$set?.published === true) {
      if (update.$set) {
        update.$set.publishedAt = new Date();
      } else {
        update.publishedAt = new Date();
      }
    }

    if (update.published === false || update.$set?.published === false) {
      if (update.$set) {
        update.$set.publishedAt = null;
      } else {
        update.publishedAt = null;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});