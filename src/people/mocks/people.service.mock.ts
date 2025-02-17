import { CHUNK_SIZE } from '../constants';
import { TPeople } from '../types';

export const fileWithPerson = {
  buffer: Buffer.from('id,name,phone,state\n1,John Doe,1234567890,CA'),
} as Express.Multer.File;

export const fileWithNoPeople = {
  buffer: Buffer.from('id,name,phone,state\n'),
} as Express.Multer.File;

export const mockedPerson = {
  content: 'id,name,phone,state\n1,John Doe,1234567890,CA',
  json: [{ id: 1, name: 'John Doe', phone: '1234567890', state: 'CA' }],
};

export const noPeopleContent = 'id,name,phone,state\n';

export const duplicatePeople: TPeople = [
  { id: 1, name: 'John Doe', phone: '1234567890', state: 'CA' },
  { id: 1, name: 'John Doe 2', phone: '1234567891', state: 'PA' },
];

export const peopleMultipleChunks: TPeople = Array.from(
  { length: CHUNK_SIZE + 1 },
  (_, i) => ({
    id: i + 1,
    name: `Person`,
    phone: `123456789`,
    state: 'CA',
  }),
);
