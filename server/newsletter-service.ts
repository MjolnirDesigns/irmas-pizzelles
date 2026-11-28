// Newsletter Service using Resend for email delivery and OpenAI for AI content generation
import { Resend } from 'resend';
import OpenAI from 'openai';
import { storage } from './storage';
import { isDatabaseConfigured } from './db';
import type { NewsletterSubscriber } from '@shared/schema';

let connectionSettings: any;

// Resend client initialization using Replit connector
async function getResendClient() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  
  return {
    client: new Resend(connectionSettings.settings.api_key),
    fromEmail: connectionSettings.settings.from_email || 'newsletter@irmaspizzelles.com'
  };
}

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
function getOpenAI(): OpenAI | null {
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({
    apiKey,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined,
  });
}

interface NewsletterContent {
  subject: string;
  previewText: string;
  htmlBody: string;
  textBody: string;
}

// Generate newsletter content using AI
export async function generateNewsletterContent(): Promise<NewsletterContent> {
  const prompt = `You are the marketing copywriter for Irma's Pizzelles, a premium Italian dessert cookie company with roots in Calabria, Italy. The brand is warm, family-oriented, and emphasizes heritage and quality.

Generate a weekly newsletter email with the following sections:
1. A warm, engaging subject line (max 60 characters)
2. A preview text snippet (max 100 characters)
3. A greeting that feels like it's from family
4. A featured section about pizzelles (could be: a flavor highlight, baking tip, Italian tradition, family story, or seasonal content)
5. A special offer or call-to-action
6. A warm sign-off

The tone should be:
- Warm and inviting, like a letter from an Italian grandmother
- Premium but approachable
- Emphasize tradition, quality ingredients, and family recipes
- Include sensory descriptions (aromas, textures, flavors)

Return the response as JSON with this exact structure:
{
  "subject": "the email subject line",
  "previewText": "preview text for email clients",
  "greeting": "the warm greeting",
  "featuredContent": "the main content section with HTML formatting",
  "callToAction": "special offer or CTA text",
  "signOff": "warm sign-off"
}`;

  const openai = getOpenAI();
  if (!openai) {
    throw new Error(
      "OpenAI is not configured. Set AI_INTEGRATIONS_OPENAI_API_KEY or OPENAI_API_KEY to generate newsletter copy.",
    );
  }

  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    max_completion_tokens: 2000,
  });

  const content = JSON.parse(response.choices[0]?.message?.content || '{}');

  const htmlBody = generateEmailHtml(content);
  const textBody = generateEmailText(content);

  return {
    subject: content.subject || "This Week from Irma's Kitchen",
    previewText: content.previewText || "Discover what's baking in our family kitchen",
    htmlBody,
    textBody,
  };
}

function generateEmailHtml(content: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Irma's Pizzelles Newsletter</title>
</head>
<body style="margin: 0; padding: 0; background-color: #faf8f5; font-family: Georgia, 'Times New Roman', serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #faf8f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #d4a574 0%, #c49a6c 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: normal; letter-spacing: 2px;">Irma's Pizzelles</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px; font-style: italic;">Premium Italian Dessert Cookies</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #5a4a3a; font-size: 18px; line-height: 1.8; margin: 0 0 24px;">
                ${content.greeting || 'Ciao, dear friend!'}
              </p>
              
              <div style="color: #5a4a3a; font-size: 16px; line-height: 1.8; margin-bottom: 32px;">
                ${content.featuredContent || 'We hope this message finds you well and ready for something sweet.'}
              </div>
              
              <!-- CTA Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color: #faf8f5; border-radius: 8px; padding: 24px; text-align: center;">
                    <p style="color: #5a4a3a; font-size: 16px; margin: 0 0 16px;">
                      ${content.callToAction || 'Visit our shop for fresh-baked pizzelles!'}
                    </p>
                    <a href="https://irmaspizzelles.com/shop" style="display: inline-block; background-color: #d4a574; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: bold;">Shop Now</a>
                  </td>
                </tr>
              </table>
              
              <!-- Sign Off -->
              <p style="color: #5a4a3a; font-size: 16px; line-height: 1.8; margin: 32px 0 0; font-style: italic;">
                ${content.signOff || 'With love from our famiglia to yours,<br>The Irma\'s Team'}
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f5f0eb; padding: 24px 30px; text-align: center; border-top: 1px solid #e8e0d8;">
              <p style="color: #8a7a6a; font-size: 12px; margin: 0 0 8px;">
                From Italy to America - A Family Tradition Since 1920
              </p>
              <p style="color: #8a7a6a; font-size: 12px; margin: 0;">
                <a href="{{unsubscribe_url}}" style="color: #8a7a6a;">Unsubscribe</a> | 
                <a href="https://irmaspizzelles.com" style="color: #8a7a6a;">Visit Website</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

function generateEmailText(content: any): string {
  return `
IRMA'S PIZZELLES
Premium Italian Dessert Cookies
---

${content.greeting || 'Ciao, dear friend!'}

${(content.featuredContent || '').replace(/<[^>]*>/g, '')}

${content.callToAction || 'Visit our shop for fresh-baked pizzelles!'}

Shop now: https://irmaspizzelles.com/shop

${(content.signOff || 'With love from our famiglia to yours, The Irma\'s Team').replace(/<br\s*\/?>/g, '\n')}

---
From Italy to America - A Family Tradition Since 1920

To unsubscribe: {{unsubscribe_url}}
`;
}

// Send newsletter to all active subscribers
export async function sendWeeklyNewsletter(): Promise<{ success: boolean; sentCount: number; issueId: string }> {
  try {
    // Generate AI content
    const content = await generateNewsletterContent();
    
    // Create issue record
    const issue = await storage.createNewsletterIssue({
      subject: content.subject,
      previewText: content.previewText,
      htmlBody: content.htmlBody,
      textBody: content.textBody,
      status: 'sending',
    });

    // Get all active subscribers
    const subscribers = await storage.getActiveNewsletterSubscribers();
    
    if (subscribers.length === 0) {
      await storage.updateNewsletterIssue(issue.id, { status: 'sent' });
      return { success: true, sentCount: 0, issueId: issue.id };
    }

    // Get Resend client
    const { client, fromEmail } = await getResendClient();

    let sentCount = 0;
    const errors: string[] = [];

    // Send to each subscriber (in batches for large lists)
    for (const subscriber of subscribers) {
      try {
        const unsubscribeUrl = `https://irmaspizzelles.com/unsubscribe?token=${subscriber.unsubscribeToken}`;
        const personalizedHtml = content.htmlBody.replace(/{{unsubscribe_url}}/g, unsubscribeUrl);
        const personalizedText = content.textBody.replace(/{{unsubscribe_url}}/g, unsubscribeUrl);

        await client.emails.send({
          from: fromEmail,
          to: subscriber.email,
          subject: content.subject,
          html: personalizedHtml,
          text: personalizedText,
          headers: {
            'List-Unsubscribe': `<${unsubscribeUrl}>`,
          },
        });

        sentCount++;
      } catch (error) {
        console.error(`Failed to send to ${subscriber.email}:`, error);
        errors.push(subscriber.email);
      }
    }

    // Update issue status
    await storage.updateNewsletterIssue(issue.id, {
      status: errors.length === 0 ? 'sent' : 'sent',
    });

    // Update recipient count using raw SQL since it's not in the insert schema
    if (isDatabaseConfigured) {
      const { db } = await import('./db');
      const { newsletterIssues } = await import('@shared/schema');
      const { eq } = await import('drizzle-orm');
      if (db) {
        await db.update(newsletterIssues).set({
          recipientCount: sentCount,
          sentAt: new Date()
        }).where(eq(newsletterIssues.id, issue.id));
      }
    }

    return { success: true, sentCount, issueId: issue.id };
  } catch (error) {
    console.error('Newsletter send failed:', error);
    throw error;
  }
}

// Generate unique unsubscribe token
export function generateUnsubscribeToken(): string {
  return crypto.randomUUID();
}
