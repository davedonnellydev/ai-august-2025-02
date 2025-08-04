'use client';

import { useEffect, useRef, useState } from 'react';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import {
  Box,
  Button,
  Center,
  Chip,
  Divider,
  FileInput,
  Group,
  Image,
  Paper,
  Slider,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { ClientRateLimiter } from '@/app/lib/utils/api-helpers';
import classes from './ImageCaptionGenerator.module.css';

type Tone = 'Professional' | 'Fun' | 'Poetic' | 'Casual';

export function ImageCaptionGenerator() {
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [maxWords, setMaxWords] = useState(20);
  const [selectedTone, setSelectedTone] = useState<Tone[]>([]);
  const [caption, setCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [remainingRequests, setRemainingRequests] = useState(0);
  const fileInputRef = useRef<HTMLButtonElement>(null);

  // Update remaining requests on component mount
  useEffect(() => {
    setRemainingRequests(ClientRateLimiter.getRemainingRequests());
  }, []);

  // Handle image file selection
  const handleFileChange = (file: File | null) => {
    if (file) {
      setImageFile(file);
      setImageUrl(''); // Clear URL when file is selected

      // Create preview URL for the file
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview('');
    }
  };

  // Handle image URL input
  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    if (url) {
      setImageFile(null); // Clear file when URL is entered
      setImagePreview(url);
    } else {
      setImagePreview('');
    }
  };

  // Handle tone selection
  const handleToneChange = (value: string[]) => {
    setSelectedTone(value as Tone[]);
  };

  // Generate caption using OpenAI API
  const handleGenerateCaption = async () => {
    if (!imageUrl && !imageFile) {
      setError('Please provide an image URL or upload an image file');
      return;
    }

    // Check rate limit before proceeding
    if (ClientRateLimiter.getRemainingRequests() <= 0) {
      setError('Rate limit exceeded. Please try again later.');
      setRemainingRequests(ClientRateLimiter.getRemainingRequests());
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Create tone string for API
      const toneSet = selectedTone.length > 0 ? selectedTone.join(', ') : 'neutral';

      // Create the prompt based on user settings
      const prompt = `Describe this image in ${maxWords} words or less. Use a ${toneSet} tone.`;

      // Determine the image source
      let imageSource: string;
      if (imageUrl) {
        imageSource = imageUrl;
      } else if (imageFile) {
        // Convert file to data URL for API
        const reader = new FileReader();
        imageSource = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      } else {
        throw new Error('No image source available');
      }

      // Make API call to our backend endpoint
      const response = await fetch('/api/openai/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: [
            {
              role: 'user',
              content: [
                { type: 'input_text', text: prompt },
                {
                  type: 'input_image',
                  image_url: imageSource,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      // Set the generated caption
      setCaption(result.response);

      // Increment request count and update remaining requests after successful generation
      ClientRateLimiter.incrementRequest();
      setRemainingRequests(ClientRateLimiter.getRemainingRequests());
    } catch (err) {
      console.error('API error:', err);
      setError(err instanceof Error ? err.message : 'API failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset all inputs
  const handleReset = () => {
    setImageUrl('');
    setImageFile(null);
    setImagePreview('');
    setMaxWords(20);
    setSelectedTone([]);
    setCaption('');
    setError('');
  };

  // Clear image (either URL or file)
  const handleClearImage = () => {
    setImageUrl('');
    setImageFile(null);
    setImagePreview('');
  };

  return (
    <>
      <Title className={classes.title}>Image Caption Generator</Title>

      <Box className={classes.container}>
        {/* Settings Section */}
        <Paper className={classes.settingsCard} p="lg">
          <Title order={3} mb="md" c="white">
            Caption Settings
          </Title>

          <Stack gap="lg">
            {/* Word Count Slider */}
            <Box>
              <Text size="sm" fw={600} mb="xs" c="white">
                Maximum Words: {maxWords}
              </Text>
              <Slider
                value={maxWords}
                onChange={setMaxWords}
                min={1}
                max={50}
                step={1}
                marks={[
                  { value: 1, label: '1' },
                  { value: 25, label: '25' },
                  { value: 50, label: '50' },
                ]}
                size="md"
                color="white"
                styles={{
                  mark: {
                    backgroundColor: 'white',
                  },
                  markLabel: {
                    color: 'white',
                    fontWeight: 600,
                  },
                }}
              />
            </Box>

            {/* Tone Selection */}
            <Box>
              <Text size="sm" fw={600} mb="xs" c="white">
                Caption Tone
              </Text>
              <Chip.Group multiple value={selectedTone} onChange={handleToneChange}>
                <Group gap="xs" className={classes.toneChips}>
                  <Chip value="Professional" variant="filled" color="blue" c="white">
                    Professional
                  </Chip>
                  <Chip value="Fun" variant="filled" color="blue" c="white">
                    Fun
                  </Chip>
                  <Chip value="Poetic" variant="filled" color="blue" c="white">
                    Poetic
                  </Chip>
                  <Chip value="Casual" variant="filled" color="blue" c="white">
                    Casual
                  </Chip>
                  <Chip value="Cheeky" variant="filled" color="blue" c="white">
                    Cheeky
                  </Chip>
                  <Chip value="Wholesome" variant="filled" color="blue" c="white">
                    Wholesome
                  </Chip>
                  <Chip value="Over-the-top" variant="filled" color="blue" c="white">
                    Over the top
                  </Chip>
                  <Chip value="Meme-y" variant="filled" color="blue" c="white">
                    Meme-y
                  </Chip>
                  <Chip value="Concise" variant="filled" color="blue" c="white">
                    Concise
                  </Chip>
                </Group>
              </Chip.Group>
            </Box>
          </Stack>
        </Paper>

        <Stack gap="lg">
          {/* Image Input Section */}
          <Paper className={classes.inputCard} p="lg">
            <Title order={3} mb="md">
              Image Input
            </Title>

            <Stack gap="md">
              {/* URL Input */}
              <TextInput
                label="Image URL"
                placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                value={imageUrl}
                onChange={(event) => handleUrlChange(event.currentTarget.value)}
                disabled={!!imageFile}
                size="md"
              />

              {/* File Upload */}
              <FileInput
                label="Or Upload Image File"
                placeholder="Click to upload or drag and drop"
                accept="image/*"
                value={imageFile}
                onChange={handleFileChange}
                disabled={!!imageUrl}
                leftSection={<IconUpload size={18} />}
                ref={fileInputRef}
                size="md"
              />

              {/* Clear Image Button */}
              {(imageUrl || imageFile) && (
                <Button
                  variant="light"
                  color="red"
                  leftSection={<IconX size={16} />}
                  onClick={handleClearImage}
                  size="sm"
                  radius="md"
                >
                  Clear Image
                </Button>
              )}
            </Stack>
          </Paper>

          {/* Image Preview Section */}
          <Paper className={classes.previewCard} p="lg">
            <Title order={3} mb="md">
              Image Preview
            </Title>

            <Center>
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  className={classes.imagePreview}
                  fallbackSrc="data:image/svg+xml,%3csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg'%3e%3ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='14' fill='%23ccc'%3eImage preview%3c/text%3e%3c/svg%3e"
                />
              ) : (
                <Box className={classes.uploadArea}>
                  <Stack align="center" gap="xs">
                    <IconPhoto size={64} color="#667eea" />
                    <Text c="dimmed" size="lg" fw={600}>
                      No image selected
                    </Text>
                    <Text c="dimmed" size="sm" ta="center">
                      Enter an image URL or upload a file above
                    </Text>
                  </Stack>
                </Box>
              )}
            </Center>
          </Paper>

          {/* Action Buttons */}
          <Group className={classes.actionButtons}>
            <Button
              className={classes.generateButton}
              onClick={handleGenerateCaption}
              loading={isLoading}
              disabled={!imageUrl && !imageFile}
              size="lg"
            >
              Generate Caption
            </Button>
            <Button className={classes.resetButton} onClick={handleReset} size="lg">
              Reset All
            </Button>
          </Group>

          {/* Error Display */}
          {error && (
            <Paper className={classes.errorCard} p="md">
              <Text c="red" ta="center" size="sm" fw={600}>
                Error: {error}
              </Text>
            </Paper>
          )}

          {/* Caption Display */}
          {caption && (
            <Paper className={classes.captionCard} p="lg">
              <Title order={3} mb="md">
                Generated Caption
              </Title>
              <Text size="lg" style={{ lineHeight: 1.6 }} fw={500}>
                {caption}
              </Text>
            </Paper>
          )}

          <Divider />

          {/* Remaining Requests */}
          <Text className={classes.remainingRequests}>
            You have {remainingRequests} image caption generations remaining.
          </Text>
        </Stack>
      </Box>
    </>
  );
}
