import mongoose from 'mongoose'

const { connect } = mongoose;

export const startConnection = async () => {
    await connect('mongodb://localhost/banners-boleita');
    console.log('Database is connected');
    
}