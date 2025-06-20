const restify = require('restify');
const Joi = require('joi');
import * as _ from 'lodash';
import { bookshelf } from './db/db-main';

const server = restify.createServer({
  name: 'auction-service',
});

const Auction = bookshelf.model('Auction', {
  tableName: 'auctions',
});

const auctionSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().max(1000).optional(),
  currentBid: Joi.number().positive().default(0),
  endTime: Joi.date().iso().greater('now').required(),
  status: Joi.string().valid('active', 'closed').default('active'),
});

server.use(restify.plugins.bodyParser());

server.use(restify.plugins.queryParser());

server.get('/api/auctions', async (req, res) => {
  try {
    const auctions = await Auction.fetchAll();
    res.send(200, auctions.toJSON());
  } catch (err) {
    res.send(500, { error: 'Failed to fetch auctions' });
  }
});

server.post('/api/auctions', async (req, res) => {
  const { error, value } = auctionSchema.validate(req.body);
  if (error) {
    res.send(400, { error: error.details[0].message });
  }

  try {
    const auction = await Auction.forge({
      id: _.uniqueId('auction_'),
      title: value.title,
      description: value.description,
      current_bid: value.currentBid,
      end_time: value.endTime,
      status: value.status,
    }).save();
    res.send(201, auction);
  } catch (err) {
    res.send(500, { error: 'Failed to create auction' });
  }
});

/*

server.get('/api/auctions/:id', async (req, res, next) => {
  try {
    const auction = await Auction.where({ id: req.params.id }).fetch({
      require: true,
    });
    res.send(200, auction.toJSON());
  } catch (err) {
    res.send(404, { error: 'Auction not found' });
  }
  return next();
});

server.put('/api/auctions/:id', async (req, res, next) => {
  const { error, value } = auctionSchema.validate(req.body);
  if (error) {
    res.send(400, { error: error.details[0].message });
    return next();
  }

  try {
    const auction = await Auction.where({ id: req.params.id }).fetch({
      require: true,
    });
    await auction.save(
      _.pick(value, ['title', 'description', 'currentBid', 'endTime', 'status'])
    );
    res.send(200, auction.toJSON());
  } catch (err) {
    res.send(404, { error: 'Auction not found' });
  }
  return next();
});
 */
server.listen(3000, () => console.log('Auction service running on port 3000'));
