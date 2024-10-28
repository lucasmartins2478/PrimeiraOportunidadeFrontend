export interface IMessage {
  id?: number;
  sender_id: number | undefined;
  content: string;
  sent_at?: string;
  sender_name:string | undefined
}
