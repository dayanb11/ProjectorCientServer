import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Metrics endpoint - implement Prometheus metrics here'
  });
});

export default router;