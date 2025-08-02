import { z } from 'zod';

export const createFaqValidationSchema = z.object({
  question: z
    .string({
      required_error: "question is required",
    })
    .min(1, "Question is required")
    .trim()
    .regex(/^.*\?$/, {
      message:
        "Question must end with a question mark (?)",
    }),
  answer: z.string({
    required_error: "answer is required !"
  })
  .trim()
  .min(1, "answer is required !"),
  category: z.string().optional(),
});

export const updateFaqValidationSchema = z.object({
  question: z
    .string({
      required_error: "question is required",
    })
    .min(1, "Question is required")
    .trim()
    .regex(/^.*\?$/, {
      message:
        "Question must end with a question mark (?)",
    }).optional(),
  answer: z.string({
    required_error: "answer is required !"
  }).optional(),
  category: z.string().optional(),
  isActive: z.boolean().optional()
});
