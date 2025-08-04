import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { MODEL } from '@/app/config/constants';
import { InputValidator, ServerRateLimiter } from '@/app/lib/utils/api-helpers';

export async function POST(request: NextRequest) {
  try {
    // Get client IP
    const ip =
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Server-side rate limiting
    if (!ServerRateLimiter.checkLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const { input } = await request.json();

    // Validate input structure for image caption generation
    if (!input || !Array.isArray(input) || input.length === 0) {
      return NextResponse.json({ error: 'Invalid input format' }, { status: 400 });
    }

    // Validate that this is an image-based request
    const hasImage = input.some(
      (item: any) =>
        item.content &&
        Array.isArray(item.content) &&
        item.content.some((content: any) => content.type === 'input_image')
    );

    if (!hasImage) {
      return NextResponse.json({ error: 'Image input is required' }, { status: 400 });
    }

    // Extract and validate text content (the prompt)
    const textContent = input
      .flatMap((item: any) => item.content || [])
      .filter((content: any) => content.type === 'input_text')
      .map((content: any) => content.text)
      .join(' ');

    const textValidation = InputValidator.validateText(textContent, 2000);
    if (!textValidation.isValid) {
      return NextResponse.json({ error: textValidation.error }, { status: 400 });
    }

    // Environment validation
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OpenAI API key not configured');
      return NextResponse.json(
        { error: 'Image caption service temporarily unavailable' },
        { status: 500 }
      );
    }

    const client = new OpenAI({
      apiKey,
    });

    // Content moderation for images
    const imageUrls = input
      .flatMap((item: any) => item.content || [])
      .filter((content: any) => content.type === 'input_image')
      .map((content: any) => content.image_url)
      .filter(Boolean);

    if (imageUrls.length > 0) {
      const moderatedImage = await client.moderations.create({
        model: 'omni-moderation-latest',
        input: imageUrls,
      });

      const { flagged, categories } = moderatedImage.results[0];

      if (flagged) {
        const keys: string[] = Object.keys(categories);
        const flaggedCategories = keys.filter(
          (key: string) => categories[key as keyof typeof categories]
        );
        return NextResponse.json(
          {
            error: `Content flagged as inappropriate: ${flaggedCategories.join(', ')}`,
          },
          { status: 400 }
        );
      }
    }

    // Generate image caption using OpenAI responses API
    const instructions: string =
      'You are an expert writer who generates image captions. Keep your responses concise and engaging. You will be given a maximum word count. When generating responses, generate captions that are closer to the word count than not.';

    const response = await client.responses.create({
      model: MODEL,
      instructions,
      input,
    });

    if (response.status !== 'completed') {
      throw new Error(`Responses API error: ${response.status}`);
    }

    return NextResponse.json({
      response: response.output_text || 'Caption generated successfully',
      originalInput: input,
      remainingRequests: ServerRateLimiter.getRemaining(ip),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'OpenAI failed';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
