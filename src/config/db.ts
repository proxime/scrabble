import { connect } from 'mongoose';
import { MONGO_URI } from './envs';

console.log(MONGO_URI);

const connectDB = async () => {
    try {
        await connect(MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err);

        // Exit process with failure
        process.exit(1);
    }
};

export { connectDB };
