import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

const schema = new mongoose.Schema({
    name: String,
    dateEvent: String,
    hourEvent: String,
    urlTickets: String,
    bannerDesktop: String,
    bannerTablet: String,
    bannerMobile: String
});

schema.plugin(mongoosePaginate);

export default mongoose.model("Banner", schema);