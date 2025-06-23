const restify = require('restify');
const Joi = require('joi');
const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');
const { bookshelf, knex } = require('./db/db-main');
const corsMiddleware = require('restify-cors-middleware2');

const server = restify.createServer({
  name: 'auction-service',
});

async function initializeDatabase() {
  try {
    const hasTable = await knex.schema.hasTable('auctions');
    if (!hasTable) {
      console.log('Creating auctions table...');
      await knex.schema.createTable('auctions', (table) => {
        table.string('id', 36).primary();
        table.string('title', 255).notNullable();
        table.text('description').nullable();
        table.decimal('current_bid', 10, 2).defaultTo(0);
        table.dateTime('end_time').notNullable();
        table.enum('status', ['active', 'closed']).defaultTo('active');
      });
      console.log('Auctions table created successfully');
    } else {
      console.log('Auctions table already exists');
    }
  } catch (error) {
    console.error('Failed to initialize auctions table:', error.message);
    throw error;
  }
}

initializeDatabase()
  .then(() => {
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

    const cors = corsMiddleware({
      preflightMaxAge: 5, //Optional
      origins: ['*'],
      allowHeaders: ['Content-Type, X-Requested-With, Authorization'],
    });

    server.pre(cors.preflight);
    server.use(cors.actual);
    /*  server.use(function crossOrigin(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, PUT, PATCH, POST, DELETE, X-App-Version,Accept,Accept-Version,Content-Type,Api-Version,Origin,X-Requested-With,Authorization'
      );
      res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, X-Requested-With, Authorization'
      );
      res.header('Access-Control-Allow-Credentials', 'true');

      return next();
    });
 */
    server.get('/api/auctions', async (req, res) => {
      try {
        const auctions = await Auction.fetchAll();
        res.send(200, auctions.toJSON());
      } catch (err) {
        console.error('GET /api/auctions error:', err.message, err.stack);
        res.send(500, { error: 'Failed to fetch auctions' });
      }
    });

    server.post('/api/auctions', async (req, res) => {
      const { error, value } = auctionSchema.validate(req.body);
      if (error) {
        res.send(400, { error: error.details[0].message });
        return;
      }

      try {
        console.log('Creating auction with data:', value);
        const auction = await Auction.forge({
          id: uuidv4(),
          title: value.title,
          description: value.description,
          current_bid: value.currentBid,
          end_time: new Date(value.endTime),
          status: value.status,
        }).save(null, { method: 'insert' });
        console.log('Auction created:', auction.toJSON());
        res.send(201, auction.toJSON());
      } catch (err) {
        console.error('POST /api/auctions error:', err.message, err.stack);
        res.send(500, { error: `Failed to create auction - ${err.message}` });
      }
    });

    server.get('/api/auctions/:id', async (req, res) => {
      try {
        const auction = await Auction.where({ id: req.params.id }).fetch({
          require: true,
        });
        res.send(200, auction.toJSON());
      } catch (err) {
        console.error('GET /api/auctions/:id error:', err.message, err.stack);
        res.send(404, { error: 'Auction not found' });
      }
    });

    server.put('/api/auctions/:id', async (req, res) => {
      const { error, value } = auctionSchema.validate(req.body);
      if (error) {
        res.send(400, { error: error.details[0].message });
        return;
      }

      try {
        const auction = await Auction.where({ id: req.params.id }).fetch({
          require: true,
        });
        await auction.save(
          _.pick(value, [
            'title',
            'description',
            'currentBid',
            'endTime',
            'status',
          ])
        );
        res.send(200, auction.toJSON());
      } catch (err) {
        console.error('PUT /api/auctions/:id error:', err.message, err.stack);
        res.send(404, { error: 'Auction not found' });
      }
    });

    server.listen(3000, () =>
      console.log('Auction service running on port 3000')
    );
  })
  .catch((error) => {
    console.error('Failed to start auction service:', error.message);
    process.exit(1);
  });
