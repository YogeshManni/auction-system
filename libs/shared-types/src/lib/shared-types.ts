export function sharedTypes(): string {
  return 'shared-types';
}

export interface Auction {
  id: string;
  title: string;
  description: string;
  currentBid: number;
  endTime: Date;
  status: 'active' | 'closed';
}

export interface Bid {
  id: string;
  auctionId: string;
  userId: string;
  amount: number;
  createdAt: Date;
}

export interface Payment {
  id: string;
  auctionId: string;
  userId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
}
