export const fileWithPerson = {
  buffer: Buffer.from('id,name,phone,state\n1,John Doe,1234567890,CA'),
} as Express.Multer.File;

export const fileWithNoPeople = {
  buffer: Buffer.from('id,name,phone,state\n'),
} as Express.Multer.File;
