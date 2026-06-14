import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Order } from '../../entities/order.entity';

@WebSocketGateway({ cors: { origin: '*' } })
export class OrderGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join-admin')
  handleJoinAdmin(@ConnectedSocket() client: Socket) {
    client.join('admin');
  }

  notifyNewOrder(order: Order) {
    this.server.to('admin').emit('new-order', order);
  }
}
