import { body, validationResult } from 'express-validator';

export const feedbackRules = [
  body('type').isIn(['bug', 'suggestion', 'general']),
  body('message').trim().notEmpty().isLength({ max: 2000 }),
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('email').optional().isEmail().normalizeEmail(),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};