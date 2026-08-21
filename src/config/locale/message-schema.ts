import fs from 'fs';
import path from 'path';
import { z } from 'zod';

export const commonMessageSchema = z
  .object({
    metadata: z
      .object({
        title: z.string().trim().min(1),
        description: z.string().trim().min(1),
        keywords: z.string().trim().min(1),
      })
      .strict(),
  })
  .passthrough();

export type CommonMessages = z.infer<typeof commonMessageSchema>;

export function readCommonMessages(filePath: string): CommonMessages {
  let json: unknown;
  try {
    json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(
      `[i18n] Could not parse ${path.relative(process.cwd(), filePath)}: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  const parsed = commonMessageSchema.safeParse(json);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.') || 'root'}: ${issue.message}`)
      .join('\n');
    throw new Error(
      `[i18n] Invalid messages in ${path.relative(process.cwd(), filePath)}:\n${details}`
    );
  }
  return parsed.data;
}
