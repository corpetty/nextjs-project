import { buildConfig } from 'payload/config';
import { CollectionConfig, Field } from 'payload/types';
import path from 'path';

interface PayloadUser {
  id: string;
  role: string;
}

// Define collection types
const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: ['admin', 'user'],
      defaultValue: 'user',
      required: true,
    } as Field,
  ],
};

const Addresses: CollectionConfig = {
  slug: 'addresses',
  admin: {
    useAsTitle: 'address',
  },
  access: {
    create: ({ req }) => !!req.user, // Allow creation only for logged-in users
    read: ({ req }) => {
      if (!req.user) return false;
      if (req.user.role === 'admin') return true;
      return {
        owner: {
          equals: req.user.id,
        },
      };
    },
    update: ({ req }) => {
      if (!req.user) return false;
      if (req.user.role === 'admin') return true;
      return {
        owner: {
          equals: req.user.id,
        },
      };
    },
    delete: ({ req }) => {
      if (!req.user) return false;
      if (req.user.role === 'admin') return true;
      return {
        owner: {
          equals: req.user.id,
        },
      };
    },
  },
  fields: [
    {
      name: 'address',
      type: 'text',
      required: true,
    } as Field,
    {
      name: 'chain',
      type: 'text',
      required: true,
    } as Field,
    {
      name: 'storageType',
      type: 'select',
      options: ['seed_phrase', 'keystore', 'private_key'],
      required: true,
    } as Field,
    {
      name: 'accessType',
      type: 'select',
      options: ['hardware_wallet', 'mobile_wallet', 'desktop_browser_wallet', 'multisig'],
      required: true,
    } as Field,
    {
      name: 'notes',
      type: 'textarea',
    } as Field,
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        } as Field,
      ],
    } as Field,
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hooks: {
        beforeChange: [
          ({ req, value }) => {
            // Always set the owner to the current user during creation
            if (req.user) {
              return req.user.id;
            }
            return value;
          },
        ],
      },
    } as Field,
  ],
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        // Ensure owner is set to current user during creation
        if (req.user) {
          return {
            ...data,
            owner: req.user.id,
          };
        }
        return data;
      },
    ],
  },
};

const Tokens: CollectionConfig = {
  slug: 'tokens',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    } as Field,
    {
      name: 'ticker',
      type: 'text',
      required: true,
    } as Field,
    {
      name: 'amount',
      type: 'number',
      required: true,
    } as Field,
    {
      name: 'address',
      type: 'relationship',
      relationTo: 'addresses',
      required: true,
    } as Field,
    {
      name: 'historicalValues',
      type: 'array',
      fields: [
        {
          name: 'value',
          type: 'number',
          required: true,
        } as Field,
        {
          name: 'timestamp',
          type: 'date',
          required: true,
        } as Field,
      ],
    } as Field,
  ],
};

export default buildConfig({
  serverURL: 'http://localhost:3000',
  admin: {
    user: 'users',
  },
  collections: [
    Users,
    Addresses,
    Tokens,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
});
