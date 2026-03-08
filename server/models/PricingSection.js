import mongoose from 'mongoose';

const pricingSectionSchema = new mongoose.Schema(
  {
    // Single document for global pricing section (using a constant ID)
    isGlobal: {
      type: Boolean,
      default: true,
      unique: true,
    },
    // Section header content
    header: {
      badge: {
        type: String,
        default: 'Services',
      },
      title: {
        type: String,
        default: 'Transform Your Career',
      },
      subtitle: {
        type: String,
        default: 'Explore our curated services designed for your success',
      },
    },
    // Services array - fully customizable
    services: [
      {
        id: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        duration: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          default: '',
        },
        points: [
          {
            type: String,
          },
        ],
        level: {
          type: String,
          default: 'Standard',
        },
        support: {
          type: String,
          default: 'Business',
        },
        access: {
          type: String,
          default: 'Multiple',
        },
        // Discount fields
        discount: {
          type: {
            type: String,
            enum: ['percentage', 'fixed', 'none'],
            default: 'none',
          },
          value: {
            type: Number,
            default: 0,
          },
          isActive: {
            type: Boolean,
            default: false,
          },
        },
      },
    ],
    // Bottom stats section
    stats: [
      {
        stat: {
          type: String,
          default: '3000+',
        },
        desc: {
          type: String,
          default: 'Careers Transformed',
        },
      },
    ],
    // CTA button text
    ctaButtonText: {
      type: String,
      default: 'Book Now',
    },
    // Auto-play interval (in seconds)
    autoPlayInterval: {
      type: Number,
      default: 4,
    },
    // Show grid view toggle
    showGridView: {
      type: Boolean,
      default: true,
    },
    // Show stats section toggle
    showStats: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('PricingSection', pricingSectionSchema);
