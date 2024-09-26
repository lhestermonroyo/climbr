import express from 'express';

import userRoute from './app/routes/user.route';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/user', userRoute);

app.listen(3000, () => {
  try {
    console.log('🚀 Server started at port:', 3000);
  } catch (error) {
    console.error('❌ Error starting server:', error);
  }
});
