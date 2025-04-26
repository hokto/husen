export type PostRequest = {
  content: string;
  positionX: number;
  positionY: number;
};

export type PutRequest = {
  content: string;
  positionX: number;
  positionY: number;
};

export type GetResponse = {
  id: number;
  content: string;
  positionX: number;
  positionY: number;
  createAt: string;
};
