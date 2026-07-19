import { Router } from 'express';

const advRouter = Router();

advRouter.get('/test', (req, res) => {
  const { accessToken, userId, oldToken } = req;

  res.json({
    success: true,
    message: 'ok next',
    accessToken,
    userId,
    oldToken,
  });
});

export default advRouter;
