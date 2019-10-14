const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;
// Define the Ticket model schema
const TicketSchema = new mongoose.Schema({
  startBy: {  
      type: Schema.ObjectId,
      default: null,
      ref: 'StartBy' 
  },
  company: {
    type: Schema.ObjectId,
    default: null,
    ref: 'Company' 
  },
  name: {
    type: String,
    required: true
  },
  messages: {
    type: Object,
    required:true
  }
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

TicketSchema.plugin(mongoosePaginate);
TicketSchema.plugin(timestamps);

/**
 * Override default toJSON, remove password field and __v version
 */
TicketSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.__v;
  obj.id = obj._id;
  delete obj._id;
  return obj;
};

module.exports = mongoose.model('Ticket', TicketSchema);
