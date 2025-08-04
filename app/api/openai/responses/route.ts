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

    // Validate input structure
    if (!input || !Array.isArray(input) || input.length === 0) {
      return NextResponse.json({ error: 'Invalid input format' }, { status: 400 });
    }

    // Check if this is an image-based request
    const hasImage = input.some(
      (item: any) =>
        item.content &&
        Array.isArray(item.content) &&
        item.content.some((content: any) => content.type === 'input_image')
    );

    if (hasImage) {
      // For image requests, we'll use the responses API directly
      // Extract text content for validation
      const textContent = input
        .flatMap((item: any) => item.content || [])
        .filter((content: any) => content.type === 'input_text')
        .map((content: any) => content.text)
        .join(' ');

      const textValidation = InputValidator.validateText(textContent, 2000);
      if (!textValidation.isValid) {
        return NextResponse.json({ error: textValidation.error }, { status: 400 });
      }
    } else {
      // For text-only requests, validate the input
      // Convert array input to string for validation
      const textInput = Array.isArray(input) ? input.join(' ') : input;
      const textValidation = InputValidator.validateText(textInput, 2000);
      if (!textValidation.isValid) {
        return NextResponse.json({ error: textValidation.error }, { status: 400 });
      }
    }

    // Environment validation
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OpenAI API key not configured');
      return NextResponse.json(
        { error: 'Translation service temporarily unavailable' },
        { status: 500 }
      );
    }

    const client = new OpenAI({
      apiKey,
    });

    // Enhanced content moderation for image requests
    if (hasImage) {
      // Extract image URLs for moderation
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
    }

    let response;

    if (hasImage) {
      // For image requests, use the responses API with the structured input
      const instructions: string =
        'You are a helpful assistant who generates image captions. Keep your responses concise and engaging.';

      response = await client.responses.create({
        model: MODEL,
        instructions,
        input,
      });
    } else {
      // For text-only requests, use the existing format
      const instructions: string =
        'You are a helpful assistant who knows general knowledge about the world. Keep your responses to one or two sentences, maximum.';

      response = await client.responses.create({
        model: MODEL,
        instructions,
        input,
      });
    }

    if (response.status !== 'completed') {
      throw new Error(`Responses API error: ${response.status}`);
    }

    return NextResponse.json({
      response: response.output_text || 'Response recieved',
      originalInput: input,
      remainingRequests: ServerRateLimiter.getRemaining(ip),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'OpenAI failed';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
